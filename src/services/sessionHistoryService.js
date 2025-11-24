/**
 * Service pour gérer l'historique des sessions de monitoring
 */
class SessionHistoryService {
  constructor() {
    this.sessions = [];
    this.currentSession = null;
    this.listeners = new Set();
    
    // Restaurer les sessions depuis localStorage
    this.restoreSessions();
  }

  /**
   * Ajoute un listener pour les changements
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifie tous les listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          sessions: this.sessions,
          currentSession: this.currentSession
        });
      } catch (error) {
        console.error('Erreur dans le listener de sessions:', error);
      }
    });
  }

  /**
   * Démarre une nouvelle session de monitoring
   */
  startSession() {
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      data: [],
      alerts: [],
      summary: {
        totalReadings: 0,
        avgHeartRate: 0,
        avgTemperature: 0,
        avgOxygenSaturation: 0,
        avgBloodPressure: { systolic: 0, diastolic: 0 },
        alertsCount: 0
      },
      status: 'active'
    };

    this.currentSession = session;
    this.sessions.unshift(session);
    this.saveSessions();
    this.notifyListeners();
    
    return session.id;
  }

  /**
   * Ajoute des données à la session courante
   */
  addDataPoint(data) {
    if (!this.currentSession) return;

    const dataPoint = {
      timestamp: new Date().toISOString(),
      ...data
    };

    this.currentSession.data.push(dataPoint);
    this.updateSessionSummary();
    this.saveSessions();
    this.notifyListeners();
  }

  /**
   * Ajoute une alerte à la session courante
   */
  addAlert(alert) {
    if (!this.currentSession) return;

    const alertData = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...alert
    };

    this.currentSession.alerts.push(alertData);
    this.updateSessionSummary();
    this.saveSessions();
    this.notifyListeners();
  }

  /**
   * Termine la session courante
   */
  endSession() {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.status = 'completed';
    
    // Calculer la durée
    const start = new Date(this.currentSession.startTime);
    const end = new Date(this.currentSession.endTime);
    this.currentSession.duration = Math.floor((end - start) / 1000); // en secondes

    this.updateSessionSummary();
    this.saveSessions();
    
    const completedSession = this.currentSession;
    this.currentSession = null;
    this.notifyListeners();
    
    return completedSession;
  }

  /**
   * Met à jour le résumé de la session courante
   */
  updateSessionSummary() {
    if (!this.currentSession || this.currentSession.data.length === 0) return;

    const data = this.currentSession.data;
    const summary = this.currentSession.summary;

    summary.totalReadings = data.length;
    summary.alertsCount = this.currentSession.alerts.length;

    // Calculer les moyennes
    let totalHeartRate = 0;
    let totalTemperature = 0;
    let totalOxygenSaturation = 0;
    let totalSystolic = 0;
    let totalDiastolic = 0;

    data.forEach(point => {
      totalHeartRate += point.heartRate || 0;
      totalTemperature += parseFloat(point.temperature) || 0;
      totalOxygenSaturation += point.oxygenSaturation || 0;
      
      if (point.bloodPressure && typeof point.bloodPressure === 'string') {
        const bp = point.bloodPressure.split('/');
        totalSystolic += parseInt(bp[0]) || 0;
        totalDiastolic += parseInt(bp[1]) || 0;
      }
    });

    const count = data.length;
    summary.avgHeartRate = Math.round(totalHeartRate / count);
    summary.avgTemperature = (totalTemperature / count).toFixed(1);
    summary.avgOxygenSaturation = Math.round(totalOxygenSaturation / count);
    summary.avgBloodPressure = {
      systolic: Math.round(totalSystolic / count),
      diastolic: Math.round(totalDiastolic / count)
    };
  }

  /**
   * Obtient toutes les sessions
   */
  getAllSessions() {
    return this.sessions;
  }

  /**
   * Obtient une session par ID
   */
  getSession(sessionId) {
    return this.sessions.find(session => session.id === sessionId);
  }

  /**
   * Supprime une session
   */
  deleteSession(sessionId) {
    this.sessions = this.sessions.filter(session => session.id !== sessionId);
    this.saveSessions();
    this.notifyListeners();
  }

  /**
   * Exporte une session en CSV
   */
  exportSessionToCSV(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    let csv = 'Timestamp,Heart Rate (BPM),Blood Pressure,Temperature (°C),Oxygen Saturation (%)\n';
    
    session.data.forEach(point => {
      csv += `${point.timestamp},${point.heartRate},${point.bloodPressure},${point.temperature},${point.oxygenSaturation}\n`;
    });

    return csv;
  }

  /**
   * Sauvegarde les sessions dans localStorage
   */
  saveSessions() {
    try {
      const data = {
        sessions: this.sessions,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cardioai_sessions', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sessions:', error);
    }
  }

  /**
   * Restaure les sessions depuis localStorage
   */
  restoreSessions() {
    try {
      const saved = localStorage.getItem('cardioai_sessions');
      if (saved) {
        const data = JSON.parse(saved);
        
        // Vérifier que les données ne sont pas trop anciennes (30 jours max)
        const dataAge = new Date() - new Date(data.timestamp);
        if (dataAge < 30 * 24 * 60 * 60 * 1000) { // 30 jours
          this.sessions = data.sessions || [];
          
          // S'assurer qu'aucune session n'est marquée comme active
          this.sessions.forEach(session => {
            if (session.status === 'active') {
              session.status = 'interrupted';
              session.endTime = session.startTime; // Marquer comme interrompue
            }
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des sessions:', error);
      this.sessions = [];
    }
  }

  /**
   * Obtient les statistiques globales
   */
  getGlobalStats() {
    const completedSessions = this.sessions.filter(s => s.status === 'completed');
    
    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        totalReadings: 0,
        totalAlerts: 0,
        avgSessionDuration: 0
      };
    }

    const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalReadings = completedSessions.reduce((sum, s) => sum + s.summary.totalReadings, 0);
    const totalAlerts = completedSessions.reduce((sum, s) => sum + s.summary.alertsCount, 0);

    return {
      totalSessions: completedSessions.length,
      totalDuration,
      totalReadings,
      totalAlerts,
      avgSessionDuration: Math.round(totalDuration / completedSessions.length)
    };
  }

  /**
   * Nettoie les ressources
   */
  cleanup() {
    this.listeners.clear();
    this.saveSessions();
  }
}

// Instance singleton
const sessionHistoryService = new SessionHistoryService();

// Sauvegarder lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
  sessionHistoryService.cleanup();
});

export default sessionHistoryService;
