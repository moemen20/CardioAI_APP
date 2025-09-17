import axios from 'axios';

// URL de base de l'API
const API_URL = 'http://localhost:5000/api';

/**
 * Service pour gérer les sessions de monitoring et les préférences utilisateur
 */
const sessionService = {
  /**
   * Sauvegarde une session de monitoring
   * @param {Object} sessionData - Données de la session
   * @returns {Promise} - Promesse contenant la confirmation de sauvegarde
   */
  saveMonitoringSession: async (sessionData) => {
    try {
      const response = await axios.post(`${API_URL}/sessions/save`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
      // Sauvegarde locale en cas d'erreur
      return sessionService.saveSessionLocally(sessionData);
    }
  },

  /**
   * Récupère l'historique des sessions
   * @param {number} limit - Nombre de sessions à récupérer
   * @returns {Promise} - Promesse contenant la liste des sessions
   */
  getSessionHistory: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/sessions/history`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      // Récupération locale en cas d'erreur
      return sessionService.getLocalSessions(limit);
    }
  },

  /**
   * Récupère une session spécifique
   * @param {string} sessionId - ID de la session
   * @returns {Promise} - Promesse contenant les données de la session
   */
  getSession: async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return sessionService.getLocalSession(sessionId);
    }
  },

  /**
   * Supprime une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise} - Promesse contenant la confirmation
   */
  deleteSession: async (sessionId) => {
    try {
      const response = await axios.delete(`${API_URL}/sessions/${sessionId}`);
      sessionService.deleteLocalSession(sessionId);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      return sessionService.deleteLocalSession(sessionId);
    }
  },

  /**
   * Sauvegarde les préférences utilisateur
   * @param {Object} preferences - Préférences utilisateur
   * @returns {Promise} - Promesse contenant la confirmation
   */
  saveUserPreferences: async (preferences) => {
    try {
      const response = await axios.post(`${API_URL}/preferences/save`, preferences);
      // Sauvegarde locale également
      localStorage.setItem('cardioai_preferences', JSON.stringify(preferences));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      // Sauvegarde locale uniquement
      localStorage.setItem('cardioai_preferences', JSON.stringify(preferences));
      return { status: 'success', message: 'Préférences sauvegardées localement' };
    }
  },

  /**
   * Récupère les préférences utilisateur
   * @returns {Promise} - Promesse contenant les préférences
   */
  getUserPreferences: async () => {
    try {
      const response = await axios.get(`${API_URL}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      // Récupération locale en cas d'erreur
      return sessionService.getLocalPreferences();
    }
  },

  // ============================================================================
  // MÉTHODES DE SAUVEGARDE LOCALE (FALLBACK)
  // ============================================================================

  /**
   * Sauvegarde une session localement
   * @param {Object} sessionData - Données de la session
   * @returns {Object} - Confirmation de sauvegarde
   */
  saveSessionLocally: (sessionData) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('cardioai_sessions') || '[]');
      const sessionWithId = {
        ...sessionData,
        id: sessionData.id || `session_${Date.now()}`,
        savedAt: new Date().toISOString()
      };
      
      sessions.unshift(sessionWithId);
      
      // Garder seulement les 50 dernières sessions
      if (sessions.length > 50) {
        sessions.splice(50);
      }
      
      localStorage.setItem('cardioai_sessions', JSON.stringify(sessions));
      
      return {
        status: 'success',
        message: 'Session sauvegardée localement',
        sessionId: sessionWithId.id
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
      return { status: 'error', message: 'Erreur de sauvegarde locale' };
    }
  },

  /**
   * Récupère les sessions locales
   * @param {number} limit - Nombre de sessions à récupérer
   * @returns {Object} - Liste des sessions
   */
  getLocalSessions: (limit = 10) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('cardioai_sessions') || '[]');
      return {
        status: 'success',
        sessions: sessions.slice(0, limit),
        total: sessions.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération locale:', error);
      return { status: 'error', sessions: [], total: 0 };
    }
  },

  /**
   * Récupère une session locale spécifique
   * @param {string} sessionId - ID de la session
   * @returns {Object} - Données de la session
   */
  getLocalSession: (sessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('cardioai_sessions') || '[]');
      const session = sessions.find(s => s.id === sessionId);
      
      if (session) {
        return { status: 'success', session };
      } else {
        return { status: 'error', message: 'Session non trouvée' };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la session locale:', error);
      return { status: 'error', message: 'Erreur de récupération locale' };
    }
  },

  /**
   * Supprime une session locale
   * @param {string} sessionId - ID de la session
   * @returns {Object} - Confirmation de suppression
   */
  deleteLocalSession: (sessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('cardioai_sessions') || '[]');
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem('cardioai_sessions', JSON.stringify(filteredSessions));
      
      return {
        status: 'success',
        message: 'Session supprimée localement'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression locale:', error);
      return { status: 'error', message: 'Erreur de suppression locale' };
    }
  },

  /**
   * Récupère les préférences locales
   * @returns {Object} - Préférences par défaut ou sauvegardées
   */
  getLocalPreferences: () => {
    try {
      const preferences = localStorage.getItem('cardioai_preferences');
      if (preferences) {
        return {
          status: 'success',
          preferences: JSON.parse(preferences)
        };
      } else {
        // Préférences par défaut
        const defaultPreferences = {
          enabledSensors: {
            heartRate: true,
            bloodPressure: true,
            temperature: true,
            oxygenSaturation: true,
            respiratoryRate: false
          },
          alertSettings: {
            soundEnabled: true,
            visualAlerts: true,
            criticalOnly: false,
            emergencyCall: false,
            contactType: 'emergency',
            emergencyType: 'samu',
            emergencyNumber: '15',
            emergencyMessage: 'Alerte médicale automatique - Patient en détresse cardiaque',
            callMethod: 'phone',
            contactName: '',
            emergencyAddress: ''
          },
          displaySettings: {
            showCharts: true,
            chartDuration: 20, // minutes
            updateInterval: 2000, // ms
            theme: 'light'
          },
          thresholds: {
            heartRate: { min: 60, max: 100 },
            temperature: { min: 36.0, max: 37.5 },
            oxygenSaturation: { min: 95, max: 100 },
            systolicBP: { min: 90, max: 140 },
            diastolicBP: { min: 60, max: 90 }
          }
        };
        
        return {
          status: 'success',
          preferences: defaultPreferences
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences locales:', error);
      return { status: 'error', preferences: {} };
    }
  },

  /**
   * Génère un résumé de session pour les notifications
   * @param {Object} sessionData - Données de la session
   * @returns {Object} - Résumé de la session
   */
  generateSessionSummary: (sessionData) => {
    const { startTime, endTime, sensorData, alerts } = sessionData;
    const duration = endTime ? 
      Math.round((new Date(endTime) - new Date(startTime)) / 1000 / 60) : 
      'En cours';
    
    const criticalAlerts = alerts ? alerts.filter(a => a.severity === 'error').length : 0;
    const warningAlerts = alerts ? alerts.filter(a => a.severity === 'warning').length : 0;
    
    // Calcul des moyennes
    const averages = {};
    if (sensorData) {
      Object.keys(sensorData).forEach(sensor => {
        if (sensorData[sensor].history && sensorData[sensor].history.length > 0) {
          const values = sensorData[sensor].history.map(h => 
            typeof h.value === 'number' ? h.value : parseFloat(h.value)
          ).filter(v => !isNaN(v));
          
          if (values.length > 0) {
            averages[sensor] = {
              avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10,
              min: Math.min(...values),
              max: Math.max(...values),
              unit: sensorData[sensor].unit
            };
          }
        }
      });
    }
    
    return {
      id: sessionData.id,
      startTime,
      endTime,
      duration,
      criticalAlerts,
      warningAlerts,
      averages,
      status: sessionData.status || 'completed'
    };
  },

  /**
   * Exporte les données de session au format CSV
   * @param {string} sessionId - ID de la session
   * @returns {Promise} - Promesse contenant les données CSV
   */
  exportSessionToCSV: async (sessionId) => {
    try {
      const sessionResponse = await sessionService.getSession(sessionId);
      if (sessionResponse.status !== 'success') {
        throw new Error('Session non trouvée');
      }
      
      const session = sessionResponse.session;
      const csvData = sessionService.convertSessionToCSV(session);
      
      return {
        status: 'success',
        csvData,
        filename: `cardioai_session_${sessionId}_${new Date().toISOString().split('T')[0]}.csv`
      };
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      return { status: 'error', message: error.message };
    }
  },

  /**
   * Convertit les données de session en format CSV
   * @param {Object} session - Données de la session
   * @returns {string} - Données au format CSV
   */
  convertSessionToCSV: (session) => {
    let csv = 'Timestamp,Sensor,Value,Unit,Status\n';
    
    if (session.sensorData) {
      Object.keys(session.sensorData).forEach(sensorType => {
        const sensor = session.sensorData[sensorType];
        if (sensor.history) {
          sensor.history.forEach(entry => {
            csv += `${entry.timestamp},${sensorType},${entry.value},${sensor.unit},${sensor.status}\n`;
          });
        }
      });
    }
    
    return csv;
  }
};

export default sessionService;
