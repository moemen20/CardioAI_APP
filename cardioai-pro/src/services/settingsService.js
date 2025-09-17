// Service de gestion des paramètres
class SettingsService {
  constructor() {
    this.defaultSettings = {
      alertSettings: {
        soundEnabled: true,
        visualAlerts: true,
        criticalOnly: false,
        emergencyCall: false,
        contactType: 'emergency',
        emergencyNumber: '15',
        contactName: 'SAMU',
        emergencyAddress: ''
      },
      sensors: {
        heartRate: { enabled: true },
        bloodPressure: { enabled: true },
        temperature: { enabled: true },
        oxygenSaturation: { enabled: true }
      },
      displaySettings: {
        darkMode: false,
        animations: true,
        compactMode: false,
        updateInterval: 1,
        chartDuration: 10,
        showGrid: true,
        smoothCurves: true
      },
      thresholds: {
        heartRate: { min: 60, max: 100 },
        temperature: { min: 36.0, max: 38.0 },
        bloodPressure: { min: 90, max: 140 },
        oxygenSaturation: { min: 95, max: 100 }
      },
      advanced: {
        debugMode: false,
        autoSave: true,
        telemetry: false,
        dataRetention: 30 // jours
      }
    };
    
    this.currentSettings = { ...this.defaultSettings };
    this.listeners = [];
    this.loadSettings();
  }

  // Charger les paramètres depuis localStorage
  loadSettings() {
    try {
      const saved = localStorage.getItem('cardioai-settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        this.currentSettings = this.mergeSettings(this.defaultSettings, savedSettings);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      this.currentSettings = { ...this.defaultSettings };
    }
  }

  // Fusionner les paramètres par défaut avec les paramètres sauvegardés
  mergeSettings(defaults, saved) {
    const merged = { ...defaults };
    
    for (const [category, settings] of Object.entries(saved)) {
      if (merged[category]) {
        merged[category] = { ...merged[category], ...settings };
      }
    }
    
    return merged;
  }

  // Sauvegarder les paramètres
  async saveSettings(settings = null) {
    try {
      const settingsToSave = settings || this.currentSettings;
      localStorage.setItem('cardioai-settings', JSON.stringify(settingsToSave));
      
      if (settings) {
        this.currentSettings = { ...settingsToSave };
        this.notifyListeners();
      }
      
      return { success: true, message: 'Paramètres sauvegardés avec succès' };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return { success: false, message: 'Erreur lors de la sauvegarde' };
    }
  }

  // Obtenir tous les paramètres
  getSettings() {
    return { ...this.currentSettings };
  }

  // Obtenir une catégorie de paramètres
  getCategory(category) {
    return this.currentSettings[category] ? { ...this.currentSettings[category] } : null;
  }

  // Mettre à jour un paramètre spécifique
  updateSetting(category, key, value) {
    if (!this.currentSettings[category]) {
      this.currentSettings[category] = {};
    }
    
    this.currentSettings[category][key] = value;
    
    if (this.currentSettings.advanced.autoSave) {
      this.saveSettings();
    }
    
    this.notifyListeners();
  }

  // Mettre à jour une catégorie entière
  updateCategory(category, settings) {
    this.currentSettings[category] = { ...this.currentSettings[category], ...settings };
    
    if (this.currentSettings.advanced.autoSave) {
      this.saveSettings();
    }
    
    this.notifyListeners();
  }

  // Réinitialiser aux paramètres par défaut
  resetToDefaults() {
    this.currentSettings = { ...this.defaultSettings };
    localStorage.removeItem('cardioai-settings');
    this.notifyListeners();
    return { success: true, message: 'Paramètres réinitialisés' };
  }

  // Exporter les paramètres
  exportSettings() {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings: this.currentSettings
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Importer les paramètres
  importSettings(jsonData) {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.settings) {
        throw new Error('Format de fichier invalide');
      }
      
      // Valider les paramètres importés
      const validatedSettings = this.validateSettings(importData.settings);
      
      this.currentSettings = validatedSettings;
      this.saveSettings();
      
      return { success: true, message: 'Paramètres importés avec succès' };
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return { success: false, message: 'Erreur lors de l\'importation: ' + error.message };
    }
  }

  // Valider les paramètres
  validateSettings(settings) {
    const validated = { ...this.defaultSettings };
    
    // Valider chaque catégorie
    for (const [category, categorySettings] of Object.entries(settings)) {
      if (validated[category]) {
        for (const [key, value] of Object.entries(categorySettings)) {
          if (this.isValidSetting(category, key, value)) {
            validated[category][key] = value;
          }
        }
      }
    }
    
    return validated;
  }

  // Vérifier si un paramètre est valide
  isValidSetting(category, key, value) {
    const validations = {
      alertSettings: {
        soundEnabled: v => typeof v === 'boolean',
        visualAlerts: v => typeof v === 'boolean',
        criticalOnly: v => typeof v === 'boolean',
        emergencyCall: v => typeof v === 'boolean',
        contactType: v => ['emergency', 'personal'].includes(v),
        emergencyNumber: v => typeof v === 'string' && v.length > 0,
        contactName: v => typeof v === 'string'
      },
      displaySettings: {
        darkMode: v => typeof v === 'boolean',
        animations: v => typeof v === 'boolean',
        compactMode: v => typeof v === 'boolean',
        updateInterval: v => typeof v === 'number' && v >= 0.5 && v <= 10,
        chartDuration: v => typeof v === 'number' && v >= 1 && v <= 60
      },
      thresholds: {
        heartRate: v => v && typeof v.min === 'number' && typeof v.max === 'number',
        temperature: v => v && typeof v.min === 'number' && typeof v.max === 'number',
        bloodPressure: v => v && typeof v.min === 'number' && typeof v.max === 'number',
        oxygenSaturation: v => v && typeof v.min === 'number' && typeof v.max === 'number'
      }
    };
    
    const categoryValidations = validations[category];
    if (!categoryValidations || !categoryValidations[key]) {
      return true; // Pas de validation spécifique
    }
    
    return categoryValidations[key](value);
  }

  // Ajouter un listener pour les changements
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
      callback({ ...this.currentSettings });
    });
  }

  // Vérifier si les seuils sont dépassés
  checkThresholds(sensorData) {
    const alerts = [];
    const thresholds = this.currentSettings.thresholds;
    
    // Vérifier le rythme cardiaque
    if (sensorData.heartRate && this.currentSettings.sensors.heartRate.enabled) {
      const hr = sensorData.heartRate.value;
      if (hr < thresholds.heartRate.min || hr > thresholds.heartRate.max) {
        alerts.push({
          type: 'heartRate',
          message: `Rythme cardiaque anormal: ${hr} bpm`,
          severity: hr < 50 || hr > 120 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      }
    }
    
    // Vérifier la température
    if (sensorData.temperature && this.currentSettings.sensors.temperature.enabled) {
      const temp = sensorData.temperature.value;
      if (temp < thresholds.temperature.min || temp > thresholds.temperature.max) {
        alerts.push({
          type: 'temperature',
          message: `Température anormale: ${temp}°C`,
          severity: temp < 35 || temp > 39 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      }
    }
    
    // Vérifier la saturation en oxygène
    if (sensorData.oxygenSaturation && this.currentSettings.sensors.oxygenSaturation.enabled) {
      const oxygen = sensorData.oxygenSaturation.value;
      if (oxygen < thresholds.oxygenSaturation.min) {
        alerts.push({
          type: 'oxygenSaturation',
          message: `Saturation en oxygène faible: ${oxygen}%`,
          severity: oxygen < 90 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      }
    }
    
    return alerts;
  }

  // Déclencher une alerte d'urgence
  triggerEmergencyAlert(alertData) {
    if (!this.currentSettings.alertSettings.emergencyCall) {
      return false;
    }
    
    console.log('🚨 ALERTE D\'URGENCE DÉCLENCHÉE');
    console.log('Contact:', this.currentSettings.alertSettings.contactName);
    console.log('Numéro:', this.currentSettings.alertSettings.emergencyNumber);
    console.log('Données:', alertData);
    
    // Ici, on pourrait intégrer avec un vrai service d'appel d'urgence
    return true;
  }
}

// Instance singleton
const settingsService = new SettingsService();
export default settingsService;
