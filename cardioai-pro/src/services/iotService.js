// Service de simulation des capteurs IoT
class IoTService {
  constructor() {
    this.isConnected = false;
    this.sensors = {
      heartRate: { value: 72, status: 'normal', unit: 'bpm', enabled: true },
      temperature: { value: 36.8, status: 'normal', unit: '°C', enabled: true },
      bloodPressure: { value: '120/80', status: 'normal', unit: 'mmHg', enabled: true },
      oxygenSaturation: { value: 98, status: 'normal', unit: '%', enabled: true }
    };
    this.listeners = [];
    this.interval = null;
    this.history = [];
  }

  // Démarrer la simulation des capteurs
  startMonitoring() {
    if (this.interval) return;
    
    this.isConnected = true;
    this.interval = setInterval(() => {
      this.updateSensorData();
      this.notifyListeners();
    }, 2000);
    
    console.log('IoT Monitoring started');
  }

  // Arrêter la surveillance
  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isConnected = false;
    console.log('IoT Monitoring stopped');
  }

  // Simulation des nouvelles données
  updateSensorData() {
    const timestamp = new Date();
    
    // Simulation du rythme cardiaque (60-100 normal)
    const baseHeartRate = 72;
    const heartRateVariation = (Math.random() - 0.5) * 20;
    const newHeartRate = Math.max(50, Math.min(120, baseHeartRate + heartRateVariation));
    
    this.sensors.heartRate = {
      value: Math.round(newHeartRate),
      status: newHeartRate > 100 || newHeartRate < 60 ? 'warning' : 'normal',
      unit: 'bpm',
      enabled: this.sensors.heartRate.enabled
    };

    // Simulation de la température (36.0-37.5 normal)
    const baseTemp = 36.8;
    const tempVariation = (Math.random() - 0.5) * 1.0;
    const newTemp = Math.max(35.5, Math.min(39.0, baseTemp + tempVariation));
    
    this.sensors.temperature = {
      value: Math.round(newTemp * 10) / 10,
      status: newTemp > 37.5 || newTemp < 36.0 ? 'warning' : 'normal',
      unit: '°C',
      enabled: this.sensors.temperature.enabled
    };

    // Simulation de la saturation en oxygène (95-100 normal)
    const baseOxygen = 98;
    const oxygenVariation = (Math.random() - 0.5) * 4;
    const newOxygen = Math.max(90, Math.min(100, baseOxygen + oxygenVariation));
    
    this.sensors.oxygenSaturation = {
      value: Math.round(newOxygen),
      status: newOxygen < 95 ? 'warning' : 'normal',
      unit: '%',
      enabled: this.sensors.oxygenSaturation.enabled
    };

    // Simulation de la tension artérielle
    const systolicBase = 120;
    const diastolicBase = 80;
    const systolicVar = (Math.random() - 0.5) * 20;
    const diastolicVar = (Math.random() - 0.5) * 10;
    
    const newSystolic = Math.max(90, Math.min(160, systolicBase + systolicVar));
    const newDiastolic = Math.max(60, Math.min(100, diastolicBase + diastolicVar));
    
    this.sensors.bloodPressure = {
      value: `${Math.round(newSystolic)}/${Math.round(newDiastolic)}`,
      status: newSystolic > 140 || newDiastolic > 90 ? 'warning' : 'normal',
      unit: 'mmHg',
      enabled: this.sensors.bloodPressure.enabled
    };

    // Ajouter à l'historique
    this.history.push({
      timestamp,
      heartRate: this.sensors.heartRate.value,
      temperature: this.sensors.temperature.value,
      oxygenSaturation: this.sensors.oxygenSaturation.value,
      bloodPressure: this.sensors.bloodPressure.value
    });

    // Garder seulement les 100 dernières mesures
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }
  }

  // Ajouter un listener pour les mises à jour
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Supprimer un listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notifier tous les listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        sensors: { ...this.sensors },
        isConnected: this.isConnected,
        lastUpdate: new Date(),
        history: [...this.history]
      });
    });
  }

  // Obtenir les données actuelles
  getCurrentData() {
    return {
      sensors: { ...this.sensors },
      isConnected: this.isConnected,
      lastUpdate: new Date(),
      history: [...this.history]
    };
  }

  // Activer/désactiver un capteur
  toggleSensor(sensorId, enabled) {
    if (this.sensors[sensorId]) {
      this.sensors[sensorId].enabled = enabled;
      this.notifyListeners();
    }
  }

  // Simuler une déconnexion
  simulateDisconnection() {
    this.isConnected = false;
    this.notifyListeners();
    
    // Reconnexion automatique après 5 secondes
    setTimeout(() => {
      this.isConnected = true;
      this.notifyListeners();
    }, 5000);
  }

  // Obtenir les statistiques du jour
  getDailyStats() {
    if (this.history.length === 0) return null;

    const heartRates = this.history.map(h => h.heartRate);
    const temperatures = this.history.map(h => h.temperature);
    
    return {
      heartRate: {
        avg: Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length),
        min: Math.min(...heartRates),
        max: Math.max(...heartRates)
      },
      temperature: {
        avg: Math.round((temperatures.reduce((a, b) => a + b, 0) / temperatures.length) * 10) / 10,
        min: Math.min(...temperatures),
        max: Math.max(...temperatures)
      }
    };
  }
}

// Instance singleton
const iotService = new IoTService();
export default iotService;
