// Service d'urgence avancé
class EmergencyService {
  constructor() {
    this.emergencyContacts = [];
    this.patientInfo = {
      name: '',
      age: '',
      bloodType: '',
      allergies: '',
      medications: '',
      medicalConditions: '',
      emergencyContact: '',
      address: ''
    };
    this.location = null;
    this.emergencySettings = {
      autoCallEnabled: false,
      autoCallDelay: 30, // secondes
      locationSharingEnabled: true,
      medicalInfoSharingEnabled: true,
      emergencyThresholds: {
        heartRateMin: 40,
        heartRateMax: 150,
        temperatureMin: 35.0,
        temperatureMax: 40.0,
        oxygenSaturationMin: 85
      }
    };
    this.activeEmergency = null;
    this.listeners = [];
    this.loadSettings();
    this.requestLocationPermission();
  }

  // Charger les paramètres depuis localStorage
  loadSettings() {
    try {
      const savedContacts = localStorage.getItem('cardioai-emergency-contacts');
      if (savedContacts) {
        this.emergencyContacts = JSON.parse(savedContacts);
      }

      const savedPatientInfo = localStorage.getItem('cardioai-patient-info');
      if (savedPatientInfo) {
        this.patientInfo = { ...this.patientInfo, ...JSON.parse(savedPatientInfo) };
      }

      const savedSettings = localStorage.getItem('cardioai-emergency-settings');
      if (savedSettings) {
        this.emergencySettings = { ...this.emergencySettings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Erreur chargement paramètres urgence:', error);
    }
  }

  // Sauvegarder les paramètres
  saveSettings() {
    try {
      localStorage.setItem('cardioai-emergency-contacts', JSON.stringify(this.emergencyContacts));
      localStorage.setItem('cardioai-patient-info', JSON.stringify(this.patientInfo));
      localStorage.setItem('cardioai-emergency-settings', JSON.stringify(this.emergencySettings));
    } catch (error) {
      console.error('Erreur sauvegarde paramètres urgence:', error);
    }
  }

  // Demander permission géolocalisation
  async requestLocationPermission() {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });
        
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        
        console.log('Géolocalisation activée:', this.location);
      } catch (error) {
        console.warn('Géolocalisation non disponible:', error);
      }
    }
  }

  // Ajouter un contact d'urgence
  addEmergencyContact(contact) {
    const newContact = {
      id: Date.now().toString(),
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary || false,
      isActive: true,
      addedDate: new Date()
    };

    // Si c'est un contact principal, désactiver les autres
    if (newContact.isPrimary) {
      this.emergencyContacts.forEach(c => c.isPrimary = false);
    }

    this.emergencyContacts.push(newContact);
    this.saveSettings();
    this.notifyListeners();
    return newContact.id;
  }

  // Modifier un contact d'urgence
  updateEmergencyContact(contactId, updates) {
    const contactIndex = this.emergencyContacts.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      this.emergencyContacts[contactIndex] = { 
        ...this.emergencyContacts[contactIndex], 
        ...updates 
      };

      // Si c'est devenu un contact principal, désactiver les autres
      if (updates.isPrimary) {
        this.emergencyContacts.forEach((c, i) => {
          if (i !== contactIndex) c.isPrimary = false;
        });
      }

      this.saveSettings();
      this.notifyListeners();
    }
  }

  // Supprimer un contact d'urgence
  removeEmergencyContact(contactId) {
    this.emergencyContacts = this.emergencyContacts.filter(c => c.id !== contactId);
    this.saveSettings();
    this.notifyListeners();
  }

  // Mettre à jour les informations patient
  updatePatientInfo(info) {
    this.patientInfo = { ...this.patientInfo, ...info };
    this.saveSettings();
    this.notifyListeners();
  }

  // Mettre à jour les paramètres d'urgence
  updateEmergencySettings(settings) {
    this.emergencySettings = { ...this.emergencySettings, ...settings };
    this.saveSettings();
    this.notifyListeners();
  }

  // Vérifier si une situation d'urgence est détectée
  checkEmergencyCondition(sensorData) {
    const thresholds = this.emergencySettings.emergencyThresholds;
    const emergencyReasons = [];

    // Vérifier rythme cardiaque
    if (sensorData.heartRate) {
      const hr = sensorData.heartRate.value;
      if (hr < thresholds.heartRateMin || hr > thresholds.heartRateMax) {
        emergencyReasons.push(`Rythme cardiaque critique: ${hr} bpm`);
      }
    }

    // Vérifier température
    if (sensorData.temperature) {
      const temp = sensorData.temperature.value;
      if (temp < thresholds.temperatureMin || temp > thresholds.temperatureMax) {
        emergencyReasons.push(`Température critique: ${temp}°C`);
      }
    }

    // Vérifier saturation oxygène
    if (sensorData.oxygenSaturation) {
      const oxygen = sensorData.oxygenSaturation.value;
      if (oxygen < thresholds.oxygenSaturationMin) {
        emergencyReasons.push(`Saturation critique: ${oxygen}%`);
      }
    }

    if (emergencyReasons.length > 0 && this.emergencySettings.autoCallEnabled) {
      this.triggerEmergency(emergencyReasons, sensorData);
    }

    return emergencyReasons;
  }

  // Déclencher une urgence
  async triggerEmergency(reasons, sensorData = null) {
    if (this.activeEmergency) {
      console.log('Urgence déjà en cours');
      return;
    }

    this.activeEmergency = {
      id: Date.now().toString(),
      startTime: new Date(),
      reasons,
      sensorData,
      location: this.location,
      status: 'initiated',
      contactsNotified: [],
      autoCallCountdown: this.emergencySettings.autoCallDelay
    };

    console.log('🚨 URGENCE DÉCLENCHÉE:', this.activeEmergency);

    // Mettre à jour la géolocalisation
    await this.requestLocationPermission();
    this.activeEmergency.location = this.location;

    // Démarrer le compte à rebours
    this.startEmergencyCountdown();

    this.notifyListeners();
  }

  // Démarrer le compte à rebours d'urgence
  startEmergencyCountdown() {
    const countdownInterval = setInterval(() => {
      if (!this.activeEmergency) {
        clearInterval(countdownInterval);
        return;
      }

      this.activeEmergency.autoCallCountdown--;
      this.notifyListeners();

      if (this.activeEmergency.autoCallCountdown <= 0) {
        clearInterval(countdownInterval);
        this.executeEmergencyCall();
      }
    }, 1000);
  }

  // Exécuter l'appel d'urgence
  async executeEmergencyCall() {
    if (!this.activeEmergency) return;

    this.activeEmergency.status = 'calling';
    this.notifyListeners();

    // Appeler les contacts d'urgence
    const primaryContact = this.emergencyContacts.find(c => c.isPrimary && c.isActive);
    const activeContacts = this.emergencyContacts.filter(c => c.isActive);

    if (primaryContact) {
      await this.callEmergencyContact(primaryContact);
    }

    // Appeler les autres contacts après 30 secondes
    setTimeout(() => {
      activeContacts.forEach(contact => {
        if (!contact.isPrimary) {
          this.callEmergencyContact(contact);
        }
      });
    }, 30000);

    // Envoyer SMS avec localisation
    this.sendEmergencySMS();

    this.activeEmergency.status = 'completed';
    this.notifyListeners();
  }

  // Simuler un appel d'urgence
  async callEmergencyContact(contact) {
    console.log(`📞 Appel d'urgence vers ${contact.name} (${contact.phone})`);
    
    // Simulation d'appel
    const callData = {
      contactId: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      timestamp: new Date(),
      status: 'attempted'
    };

    this.activeEmergency.contactsNotified.push(callData);

    // Simuler tentative d'appel
    try {
      // Dans une vraie application, ici on utiliserait une API d'appel
      await new Promise(resolve => setTimeout(resolve, 2000));
      callData.status = 'completed';
      console.log(`✅ Appel vers ${contact.name} terminé`);
    } catch (error) {
      callData.status = 'failed';
      console.error(`❌ Échec appel vers ${contact.name}:`, error);
    }

    this.notifyListeners();
  }

  // Envoyer SMS d'urgence avec localisation
  sendEmergencySMS() {
    const message = this.generateEmergencyMessage();
    console.log('📱 SMS d\'urgence envoyé:', message);

    // Dans une vraie application, ici on utiliserait une API SMS
    this.activeEmergency.smsData = {
      message,
      timestamp: new Date(),
      recipients: this.emergencyContacts.filter(c => c.isActive).map(c => c.phone)
    };
  }

  // Générer le message d'urgence
  generateEmergencyMessage() {
    const patient = this.patientInfo.name || 'Patient';
    const reasons = this.activeEmergency.reasons.join(', ');
    const location = this.location ? 
      `Localisation: https://maps.google.com/?q=${this.location.latitude},${this.location.longitude}` :
      'Localisation non disponible';

    return `🚨 URGENCE MÉDICALE - ${patient}
Raison: ${reasons}
Heure: ${new Date().toLocaleString()}
${location}
Informations médicales: ${this.patientInfo.medicalConditions || 'Non renseignées'}
Allergies: ${this.patientInfo.allergies || 'Aucune connue'}
Groupe sanguin: ${this.patientInfo.bloodType || 'Non renseigné'}
- CardioAI Pro`;
  }

  // Annuler l'urgence
  cancelEmergency() {
    if (this.activeEmergency) {
      this.activeEmergency.status = 'cancelled';
      this.activeEmergency.cancelTime = new Date();
      console.log('🚫 Urgence annulée par l\'utilisateur');
      
      setTimeout(() => {
        this.activeEmergency = null;
        this.notifyListeners();
      }, 5000);
    }
  }

  // Obtenir les contacts d'urgence
  getEmergencyContacts() {
    return [...this.emergencyContacts];
  }

  // Obtenir les informations patient
  getPatientInfo() {
    return { ...this.patientInfo };
  }

  // Obtenir les paramètres d'urgence
  getEmergencySettings() {
    return { ...this.emergencySettings };
  }

  // Obtenir l'urgence active
  getActiveEmergency() {
    return this.activeEmergency ? { ...this.activeEmergency } : null;
  }

  // Ajouter un listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Supprimer un listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  // Notifier les listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        contacts: this.getEmergencyContacts(),
        patientInfo: this.getPatientInfo(),
        settings: this.getEmergencySettings(),
        activeEmergency: this.getActiveEmergency(),
        location: this.location
      });
    });
  }
}

// Instance singleton
const emergencyService = new EmergencyService();
export default emergencyService;
