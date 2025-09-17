import iotService from './iotService';
import sessionService from './sessionService';
import globalNotificationService from './globalNotificationService';
import emergencyService from './emergencyService';

/**
 * Service global pour gérer l'état du monitoring IoT
 * qui persiste entre les changements de page
 */
class GlobalMonitoringService {
  constructor() {
    this.isMonitoring = false;
    this.currentSession = null;
    this.monitoringInterval = null;
    this.alertInterval = null;
    this.sensorData = {
      heartRate: { value: 72, unit: 'bpm', status: 'normal', history: [] },
      bloodPressure: { systolic: 120, diastolic: 80, unit: 'mmHg', status: 'normal', history: [] },
      temperature: { value: 36.5, unit: '°C', status: 'normal', history: [] },
      oxygenSaturation: { value: 98, unit: '%', status: 'normal', history: [] },
      respiratoryRate: { value: 16, unit: 'rpm', status: 'normal', history: [] }
    };
    this.alerts = [];
    this.lastUpdate = new Date();
    this.preferences = null;
    this.listeners = new Set();

    // Restaurer l'état depuis localStorage au démarrage
    this.restoreState();
  }

  /**
   * Ajoute un listener pour les changements d'état
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifie tous les listeners des changements
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          isMonitoring: this.isMonitoring,
          sensorData: this.sensorData,
          alerts: this.alerts,
          lastUpdate: this.lastUpdate,
          currentSession: this.currentSession
        });
      } catch (error) {
        console.error('Erreur dans le listener:', error);
      }
    });
  }

  /**
   * Sauvegarde l'état dans localStorage
   */
  saveState() {
    const state = {
      isMonitoring: this.isMonitoring,
      currentSession: this.currentSession,
      sensorData: this.sensorData,
      alerts: this.alerts,
      lastUpdate: this.lastUpdate.toISOString(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cardioai_monitoring_state', JSON.stringify(state));
  }

  /**
   * Restaure l'état depuis localStorage
   */
  restoreState() {
    try {
      const savedState = localStorage.getItem('cardioai_monitoring_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Vérifier que l'état n'est pas trop ancien (max 1 heure)
        const stateAge = new Date() - new Date(state.timestamp);
        if (stateAge < 60 * 60 * 1000) { // 1 heure
          this.isMonitoring = state.isMonitoring || false;
          this.currentSession = state.currentSession;
          this.sensorData = state.sensorData || this.sensorData;
          this.alerts = state.alerts || [];
          this.lastUpdate = new Date(state.lastUpdate);

          // Si le monitoring était actif, le redémarrer
          if (this.isMonitoring) {
            console.log('Restauration du monitoring actif...');
            this.resumeMonitoring();
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'état:', error);
    }
  }

  /**
   * Démarre le monitoring
   */
  async startMonitoring() {
    if (this.isMonitoring) {
      console.log('Le monitoring est déjà actif');
      return;
    }

    try {
      // Charger les préférences
      await this.loadPreferences();

      // Démarrer une nouvelle session
      this.currentSession = this.createNewSession();

      // Démarrer le monitoring sur le backend
      await iotService.startMonitoring();

      // Démarrer les intervalles de collecte de données
      this.startDataCollection();

      this.isMonitoring = true;
      this.saveState();
      this.notifyListeners();

      console.log('Monitoring démarré globalement');
    } catch (error) {
      console.error('Erreur lors du démarrage du monitoring:', error);
      throw error;
    }
  }

  /**
   * Reprend le monitoring après restauration
   */
  async resumeMonitoring() {
    try {
      // Vérifier que le backend est toujours en monitoring
      await iotService.startMonitoring();
      
      // Redémarrer les intervalles
      this.startDataCollection();
      
      this.notifyListeners();
      console.log('Monitoring repris avec succès');
    } catch (error) {
      console.error('Erreur lors de la reprise du monitoring:', error);
      // Si erreur, arrêter le monitoring
      this.isMonitoring = false;
      this.saveState();
      this.notifyListeners();
    }
  }

  /**
   * Arrête le monitoring
   */
  async stopMonitoring() {
    if (!this.isMonitoring) {
      console.log('Le monitoring n\'est pas actif');
      return;
    }

    try {
      // Arrêter les intervalles
      this.stopDataCollection();

      // Arrêter le monitoring sur le backend
      await iotService.stopMonitoring();

      // Sauvegarder la session
      if (this.currentSession) {
        await this.saveCurrentSession();
      }

      this.isMonitoring = false;
      this.currentSession = null;
      this.saveState();
      this.notifyListeners();

      console.log('Monitoring arrêté globalement');
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du monitoring:', error);
      throw error;
    }
  }

  /**
   * Démarre la collecte de données
   */
  startDataCollection() {
    // Arrêter les intervalles existants
    this.stopDataCollection();

    const updateInterval = this.preferences?.displaySettings?.updateInterval || 2000;

    // Intervalle pour les données des capteurs
    this.monitoringInterval = setInterval(async () => {
      try {
        const response = await iotService.getCurrentSensorData();
        if (response.status === 'success') {
          this.sensorData = this.filterSensorDataByPreferences(response.data);
          this.lastUpdate = new Date();
          this.saveState();
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        // Fallback vers la simulation locale
        const simulatedData = iotService.simulateSensorData();
        this.sensorData = this.filterSensorDataByPreferences(simulatedData.sensors);
        this.lastUpdate = new Date();
        this.saveState();
        this.notifyListeners();
      }
    }, updateInterval);

    // Intervalle pour les alertes
    this.alertInterval = setInterval(async () => {
      try {
        const alertResponse = await iotService.getActiveAlerts();
        if (alertResponse.status === 'success') {
          const newAlerts = alertResponse.alerts;

          // Détecter les nouvelles alertes et les ajouter aux notifications
          newAlerts.forEach(alert => {
            const isNewAlert = !this.alerts.find(existingAlert => existingAlert.id === alert.id);
            if (isNewAlert) {
              globalNotificationService.addIoTAlert(alert);

              // Vérifier si un appel d'urgence doit être déclenché
              emergencyService.triggerEmergency(alert).catch(error => {
                console.error('Erreur lors du déclenchement d\'urgence:', error);
              });
            }
          });

          this.alerts = newAlerts;
          this.saveState();
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
      }
    }, 5000);
  }

  /**
   * Arrête la collecte de données
   */
  stopDataCollection() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
  }

  /**
   * Charge les préférences utilisateur
   */
  async loadPreferences() {
    try {
      const response = await sessionService.getUserPreferences();
      if (response.status === 'success') {
        this.preferences = response.preferences;
        // Mettre à jour le service d'urgence avec les nouvelles préférences
        emergencyService.setPreferences(this.preferences);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  }

  /**
   * Filtre les données selon les préférences
   */
  filterSensorDataByPreferences(data) {
    if (!this.preferences?.enabledSensors) return data;
    
    const filteredData = {};
    Object.keys(data).forEach(sensorType => {
      if (this.preferences.enabledSensors[sensorType]) {
        filteredData[sensorType] = data[sensorType];
      }
    });
    return filteredData;
  }

  /**
   * Crée une nouvelle session
   */
  createNewSession() {
    const sessionId = `session_${Date.now()}`;
    return {
      id: sessionId,
      startTime: new Date().toISOString(),
      endTime: null,
      sensorData: {},
      alerts: [],
      status: 'active'
    };
  }

  /**
   * Sauvegarde la session actuelle
   */
  async saveCurrentSession() {
    if (this.currentSession) {
      const sessionToSave = {
        ...this.currentSession,
        endTime: new Date().toISOString(),
        sensorData: this.sensorData,
        alerts: this.alerts,
        status: 'completed'
      };

      try {
        await sessionService.saveMonitoringSession(sessionToSave);
        console.log('Session sauvegardée:', sessionToSave.id);

        // Ajouter une notification de session sauvegardée
        globalNotificationService.addSessionNotification(sessionToSave);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la session:', error);
      }
    }
  }

  /**
   * Marque une alerte comme lue
   */
  async markAlertAsRead(alertId) {
    try {
      await iotService.markAlertAsRead(alertId);
      this.alerts = this.alerts.filter(alert => alert.id !== alertId);
      this.saveState();
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur lors du marquage de l\'alerte:', error);
      throw error;
    }
  }

  /**
   * Obtient l'état actuel
   */
  getState() {
    return {
      isMonitoring: this.isMonitoring,
      sensorData: this.sensorData,
      alerts: this.alerts,
      lastUpdate: this.lastUpdate,
      currentSession: this.currentSession
    };
  }

  /**
   * Génère des notifications de test pour démonstration
   */
  generateTestNotifications() {
    const testAlerts = [
      {
        id: `alert_${Date.now()}_1`,
        sensor: 'heartRate',
        message: 'Rythme cardiaque élevé détecté',
        severity: 'warning',
        value: 105,
        unit: 'bpm',
        timestamp: new Date().toISOString()
      },
      {
        id: `alert_${Date.now()}_2`,
        sensor: 'bloodPressure',
        message: 'Tension artérielle critique',
        severity: 'error',
        value: '180/110',
        unit: 'mmHg',
        timestamp: new Date().toISOString()
      },
      {
        id: `alert_${Date.now()}_3`,
        sensor: 'temperature',
        message: 'Température corporelle élevée',
        severity: 'warning',
        value: 38.2,
        unit: '°C',
        timestamp: new Date().toISOString()
      },
      {
        id: `alert_${Date.now()}_4`,
        sensor: 'oxygenSaturation',
        message: 'Saturation en oxygène faible',
        severity: 'error',
        value: 88,
        unit: '%',
        timestamp: new Date().toISOString()
      }
    ];

    // Ajouter les alertes avec un délai pour simuler l'arrivée progressive
    testAlerts.forEach((alert, index) => {
      setTimeout(() => {
        globalNotificationService.addIoTAlert(alert);
      }, index * 1000); // 1 seconde entre chaque notification
    });

    console.log('Notifications de test générées');
  }

  /**
   * Nettoie les ressources
   */
  cleanup() {
    this.stopDataCollection();
    this.listeners.clear();
  }
}

// Instance singleton
const globalMonitoringService = new GlobalMonitoringService();

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
  globalMonitoringService.saveState();
});

export default globalMonitoringService;
