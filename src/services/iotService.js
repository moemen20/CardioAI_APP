import axios from 'axios';

// URL de base de l'API IoT
const IOT_API_URL = 'http://localhost:5000/api/iot';

/**
 * Service pour gérer les communications avec les capteurs IoT
 */
const iotService = {
  /**
   * Démarre la session de monitoring IoT
   * @returns {Promise} - Promesse contenant la confirmation de démarrage
   */
  startMonitoring: async () => {
    try {
      const response = await axios.post(`${IOT_API_URL}/start-monitoring`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage du monitoring:', error);
      throw error;
    }
  },

  /**
   * Arrête la session de monitoring IoT
   * @returns {Promise} - Promesse contenant la confirmation d'arrêt
   */
  stopMonitoring: async () => {
    try {
      const response = await axios.post(`${IOT_API_URL}/stop-monitoring`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du monitoring:', error);
      throw error;
    }
  },

  /**
   * Récupère les données actuelles de tous les capteurs
   * @returns {Promise} - Promesse contenant les données des capteurs
   */
  getCurrentSensorData: async () => {
    try {
      const response = await axios.get(`${IOT_API_URL}/sensors/current`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des données d'un capteur spécifique
   * @param {string} sensorType - Type de capteur (heartRate, bloodPressure, etc.)
   * @param {number} hours - Nombre d'heures d'historique à récupérer
   * @returns {Promise} - Promesse contenant l'historique des données
   */
  getSensorHistory: async (sensorType, hours = 24) => {
    try {
      const response = await axios.get(`${IOT_API_URL}/sensors/${sensorType}/history`, {
        params: { hours }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  /**
   * Configure les seuils d'alerte pour un capteur
   * @param {string} sensorType - Type de capteur
   * @param {Object} thresholds - Seuils d'alerte (min, max)
   * @returns {Promise} - Promesse contenant la confirmation de configuration
   */
  setSensorThresholds: async (sensorType, thresholds) => {
    try {
      const response = await axios.post(`${IOT_API_URL}/sensors/${sensorType}/thresholds`, {
        thresholds
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la configuration des seuils:', error);
      throw error;
    }
  },

  /**
   * Récupère les alertes actives
   * @returns {Promise} - Promesse contenant la liste des alertes
   */
  getActiveAlerts: async () => {
    try {
      const response = await axios.get(`${IOT_API_URL}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  },

  /**
   * Marque une alerte comme lue
   * @param {string} alertId - ID de l'alerte
   * @returns {Promise} - Promesse contenant la confirmation
   */
  markAlertAsRead: async (alertId) => {
    try {
      const response = await axios.patch(`${IOT_API_URL}/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage de l\'alerte:', error);
      throw error;
    }
  },

  /**
   * Récupère le statut de connexion des capteurs
   * @returns {Promise} - Promesse contenant le statut des capteurs
   */
  getSensorStatus: async () => {
    try {
      const response = await axios.get(`${IOT_API_URL}/sensors/status`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  },

  /**
   * Calibre un capteur spécifique
   * @param {string} sensorType - Type de capteur à calibrer
   * @returns {Promise} - Promesse contenant le résultat de calibration
   */
  calibrateSensor: async (sensorType) => {
    try {
      const response = await axios.post(`${IOT_API_URL}/sensors/${sensorType}/calibrate`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la calibration:', error);
      throw error;
    }
  },

  /**
   * Exporte les données vers un fichier CSV
   * @param {string} startDate - Date de début (ISO string)
   * @param {string} endDate - Date de fin (ISO string)
   * @returns {Promise} - Promesse contenant l'URL de téléchargement
   */
  exportData: async (startDate, endDate) => {
    try {
      const response = await axios.post(`${IOT_API_URL}/export`, {
        startDate,
        endDate
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  },

  /**
   * Simulation locale des données de capteurs (pour le développement)
   * @returns {Object} - Données simulées des capteurs
   */
  simulateSensorData: () => {
    const now = new Date();
    const timestamp = now.toISOString();

    return {
      timestamp,
      sensors: {
        heartRate: {
          value: 60 + Math.random() * 40, // 60-100 bpm
          unit: 'bpm',
          status: 'normal',
          lastUpdate: timestamp
        },
        bloodPressure: {
          systolic: 110 + Math.random() * 30, // 110-140 mmHg
          diastolic: 70 + Math.random() * 20, // 70-90 mmHg
          unit: 'mmHg',
          status: 'normal',
          lastUpdate: timestamp
        },
        temperature: {
          value: 36.0 + Math.random() * 1.5, // 36.0-37.5°C
          unit: '°C',
          status: 'normal',
          lastUpdate: timestamp
        },
        oxygenSaturation: {
          value: 95 + Math.random() * 5, // 95-100%
          unit: '%',
          status: 'normal',
          lastUpdate: timestamp
        },
        respiratoryRate: {
          value: 12 + Math.random() * 8, // 12-20 rpm
          unit: 'rpm',
          status: 'normal',
          lastUpdate: timestamp
        }
      },
      deviceInfo: {
        batteryLevel: 85 + Math.random() * 15, // 85-100%
        signalStrength: 80 + Math.random() * 20, // 80-100%
        connectionStatus: 'connected',
        lastSync: timestamp
      }
    };
  },

  /**
   * Génère des données d'historique simulées
   * @param {string} sensorType - Type de capteur
   * @param {number} points - Nombre de points de données
   * @returns {Array} - Tableau de données historiques
   */
  generateSimulatedHistory: (sensorType, points = 20) => {
    const history = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2 * 60 * 1000); // Toutes les 2 minutes
      let value;

      switch (sensorType) {
        case 'heartRate':
          value = 70 + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 5;
          break;
        case 'temperature':
          value = 36.5 + Math.sin(i * 0.05) * 0.5 + (Math.random() - 0.5) * 0.2;
          break;
        case 'oxygenSaturation':
          value = 98 + Math.sin(i * 0.08) * 2 + (Math.random() - 0.5) * 1;
          break;
        default:
          value = 50 + Math.random() * 50;
      }

      history.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString(),
        value: Math.round(value * 10) / 10
      });
    }

    return history;
  },

  /**
   * Vérifie si une valeur est dans les limites normales
   * @param {string} sensorType - Type de capteur
   * @param {number} value - Valeur à vérifier
   * @returns {Object} - Statut et niveau d'alerte
   */
  checkThresholds: (sensorType, value) => {
    const thresholds = {
      heartRate: { min: 60, max: 100, critical: { min: 40, max: 120 } },
      temperature: { min: 36.0, max: 37.5, critical: { min: 35.0, max: 39.0 } },
      oxygenSaturation: { min: 95, max: 100, critical: { min: 85, max: 100 } },
      systolicBP: { min: 90, max: 140, critical: { min: 70, max: 180 } },
      diastolicBP: { min: 60, max: 90, critical: { min: 40, max: 110 } }
    };

    const threshold = thresholds[sensorType];
    if (!threshold) return { status: 'unknown', level: 'info' };

    if (value < threshold.critical.min || value > threshold.critical.max) {
      return { status: 'critical', level: 'error' };
    }
    if (value < threshold.min || value > threshold.max) {
      return { status: 'warning', level: 'warning' };
    }
    return { status: 'normal', level: 'success' };
  }
};

export default iotService;
