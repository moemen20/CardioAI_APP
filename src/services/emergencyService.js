/**
 * Service de gestion des appels d'urgence automatiques
 * Gère les appels d'urgence en cas d'alertes critiques
 */
class EmergencyService {
  constructor() {
    this.isEmergencyActive = false;
    this.lastEmergencyCall = null;
    this.emergencyTimeout = 5 * 60 * 1000; // 5 minutes entre les appels
    this.preferences = null;
  }

  /**
   * Initialise le service avec les préférences utilisateur
   */
  setPreferences(preferences) {
    this.preferences = preferences;
  }

  /**
   * Vérifie si un appel d'urgence doit être déclenché
   */
  shouldTriggerEmergency(alert) {
    // Vérifier si la fonction d'urgence est activée
    if (!this.preferences?.alertSettings?.emergencyCall) {
      return false;
    }

    // Vérifier si c'est une alerte critique
    if (alert.severity !== 'error') {
      return false;
    }

    // Vérifier si un appel n'a pas déjà été fait récemment
    if (this.lastEmergencyCall) {
      const timeSinceLastCall = new Date() - new Date(this.lastEmergencyCall);
      if (timeSinceLastCall < this.emergencyTimeout) {
        console.log('Appel d\'urgence ignoré - trop récent');
        return false;
      }
    }

    // Vérifier les critères spécifiques selon le type de capteur
    return this.isCriticalAlert(alert);
  }

  /**
   * Détermine si une alerte est vraiment critique
   */
  isCriticalAlert(alert) {
    switch (alert.sensor) {
      case 'heartRate':
        // Rythme cardiaque dangereux
        const heartRate = parseFloat(alert.value);
        return heartRate < 40 || heartRate > 150;

      case 'bloodPressure':
        // Tension artérielle critique
        const [systolic, diastolic] = alert.value.split('/').map(v => parseFloat(v));
        return systolic > 180 || systolic < 80 || diastolic > 110 || diastolic < 50;

      case 'oxygenSaturation':
        // Saturation en oxygène dangereuse
        const oxygen = parseFloat(alert.value);
        return oxygen < 85;

      case 'temperature':
        // Température critique
        const temp = parseFloat(alert.value);
        return temp > 40 || temp < 35;

      default:
        return false;
    }
  }

  /**
   * Déclenche un appel d'urgence
   */
  async triggerEmergency(alert) {
    if (!this.shouldTriggerEmergency(alert)) {
      return false;
    }

    console.log('🚨 DÉCLENCHEMENT APPEL D\'URGENCE', alert);
    
    try {
      this.isEmergencyActive = true;
      this.lastEmergencyCall = new Date().toISOString();

      // Préparer les informations d'urgence
      const emergencyInfo = this.prepareEmergencyInfo(alert);

      // Afficher une notification d'urgence
      this.showEmergencyNotification(emergencyInfo);

      // Tenter l'appel automatique
      await this.makeEmergencyCall(emergencyInfo);

      // Enregistrer l'événement
      this.logEmergencyEvent(alert, emergencyInfo);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'appel d\'urgence:', error);
      this.showEmergencyError(error);
      return false;
    } finally {
      this.isEmergencyActive = false;
    }
  }

  /**
   * Prépare les informations pour l'appel d'urgence
   */
  prepareEmergencyInfo(alert) {
    const emergencyNumber = this.preferences?.alertSettings?.emergencyNumber || '15';
    const emergencyType = this.preferences?.alertSettings?.emergencyType || 'samu';
    const customMessage = this.preferences?.alertSettings?.emergencyMessage ||
      'Alerte médicale automatique - Patient en détresse cardiaque';

    const serviceName = this.getEmergencyServiceName(emergencyType, emergencyNumber);
    const alertDetails = this.formatAlertDetails(alert);
    const timestamp = new Date().toLocaleString('fr-FR');

    return {
      number: emergencyNumber,
      serviceName,
      message: `${customMessage}\n\n${alertDetails}\n\nHeure: ${timestamp}`,
      alert,
      timestamp
    };
  }

  /**
   * Obtient le nom du service d'urgence
   */
  getEmergencyServiceName(type, number) {
    const contactType = this.preferences?.alertSettings?.contactType;

    if (contactType === 'person') {
      const contactName = this.preferences?.alertSettings?.contactName;
      return contactName ? `${contactName} (Contact personnel)` : 'Contact personnel';
    }

    const services = {
      'samu': 'SAMU (Service d\'Aide Médicale Urgente)',
      'pompiers': 'Sapeurs-Pompiers',
      'police': 'Police Secours',
      'european': 'Urgences Européennes',
      'usa': 'Emergency Services (USA)',
      'uk': 'Emergency Services (UK)',
      'custom': `Service d'urgence (${number})`
    };

    return services[type] || `Service d'urgence (${number})`;
  }

  /**
   * Formate les détails de l'alerte pour l'urgence
   */
  formatAlertDetails(alert) {
    const sensorNames = {
      heartRate: 'Rythme cardiaque',
      bloodPressure: 'Tension artérielle',
      temperature: 'Température corporelle',
      oxygenSaturation: 'Saturation en oxygène',
      respiratoryRate: 'Fréquence respiratoire'
    };

    return `ALERTE CRITIQUE: ${sensorNames[alert.sensor] || alert.sensor}
Valeur mesurée: ${alert.value} ${alert.unit}
Message: ${alert.message}`;
  }

  /**
   * Effectue l'appel d'urgence selon la méthode choisie
   */
  async makeEmergencyCall(emergencyInfo) {
    const callMethod = this.preferences?.alertSettings?.callMethod || 'phone';

    try {
      switch (callMethod) {
        case 'phone':
          await this.makePhoneCall(emergencyInfo);
          break;
        case 'whatsapp':
          await this.makeWhatsAppCall(emergencyInfo);
          break;
        case 'both':
          await this.makePhoneCall(emergencyInfo);
          // Attendre 2 secondes puis tenter WhatsApp
          setTimeout(() => this.makeWhatsAppCall(emergencyInfo), 2000);
          break;
        case 'aggressive':
          await this.makeAggressiveEmergencyCall(emergencyInfo);
          break;
        default:
          await this.makePhoneCall(emergencyInfo);
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel d\'urgence:', error);
      this.showManualCallInstructions(emergencyInfo);
    }
  }

  /**
   * Effectue un appel téléphonique classique
   */
  async makePhoneCall(emergencyInfo) {
    try {
      if ('navigator' in window && 'permissions' in navigator) {
        // Vérifier les permissions
        const permission = await navigator.permissions.query({ name: 'microphone' });
        console.log('Permission microphone:', permission.state);
      }

      // Créer un lien tel: pour déclencher l'appel
      const telLink = `tel:${emergencyInfo.number}`;

      // Méthode 1: Essayer window.location (plus direct sur mobile)
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // Sur mobile, utiliser window.location pour un appel plus direct
        window.location.href = telLink;
      } else {
        // Sur desktop, créer un lien temporaire
        const link = document.createElement('a');
        link.href = telLink;
        link.style.display = 'none';
        document.body.appendChild(link);

        // Déclencher l'appel
        link.click();

        // Nettoyer
        document.body.removeChild(link);
      }

      console.log(`Appel téléphonique initié vers ${emergencyInfo.number}`);

      // Afficher des instructions pour l'appel
      this.showPhoneCallInstructions(emergencyInfo);

    } catch (error) {
      console.error('Erreur lors de l\'appel téléphonique:', error);
      throw error;
    }
  }

  /**
   * Affiche des instructions pour l'appel téléphonique
   */
  showPhoneCallInstructions(emergencyInfo) {
    setTimeout(() => {
      // Notification système
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📞 Appel en cours', {
          body: `Appel vers ${emergencyInfo.number}. Expliquez votre urgence médicale.`,
          requireInteraction: true,
          tag: 'phone-instructions'
        });
      }

      // Instructions visuelles
      const instructionOverlay = document.createElement('div');
      instructionOverlay.id = 'phone-instructions';
      instructionOverlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2196F3;
        color: white;
        padding: 20px;
        border-radius: 15px;
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
      `;

      instructionOverlay.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
          <span style="font-size: 1.5rem;">📞</span>
          <strong>Appel en cours</strong>
          <button onclick="document.getElementById('phone-instructions').remove()"
                  style="margin-left: auto; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">×</button>
        </div>
        <div style="font-size: 0.9rem; line-height: 1.4;">
          <p style="margin: 0 0 10px 0;"><strong>À dire au téléphone :</strong></p>
          <p style="margin: 0 0 8px 0;">🚨 "Urgence médicale cardiaque"</p>
          <p style="margin: 0 0 8px 0;">📍 "Donnez votre adresse"</p>
          <p style="margin: 0 0 8px 0;">💓 "Problème cardiaque détecté"</p>
          <p style="margin: 0; font-size: 0.8rem; opacity: 0.8;">Restez en ligne jusqu'à l'arrivée des secours</p>
        </div>
      `;

      document.body.appendChild(instructionOverlay);

      // Supprimer automatiquement après 20 secondes
      setTimeout(() => {
        if (document.getElementById('phone-instructions')) {
          instructionOverlay.remove();
        }
      }, 20000);

    }, 500); // Attendre que l'appel se lance
  }

  /**
   * Effectue un appel via WhatsApp
   */
  async makeWhatsAppCall(emergencyInfo) {
    try {
      // Nettoyer le numéro pour WhatsApp (supprimer espaces, tirets, etc.)
      let cleanNumber = emergencyInfo.number.replace(/[\s\-\(\)]/g, '');

      // Supprimer le + initial et le 0 si c'est un numéro français
      if (cleanNumber.startsWith('+33')) {
        cleanNumber = '33' + cleanNumber.substring(3);
      } else if (cleanNumber.startsWith('0')) {
        cleanNumber = '33' + cleanNumber.substring(1);
      } else if (cleanNumber.startsWith('+')) {
        cleanNumber = cleanNumber.substring(1);
      }

      // Créer le message d'urgence pour WhatsApp
      const contactName = this.preferences?.alertSettings?.contactName || 'Contact';
      const emergencyAddress = this.preferences?.alertSettings?.emergencyAddress || '[Adresse non configurée]';
      const alertDetails = this.formatAlertDetails(emergencyInfo.alert);

      const whatsappMessage = encodeURIComponent(
        `🚨 URGENCE MÉDICALE 🚨\n\n` +
        `Bonjour ${contactName},\n\n` +
        `J'ai une URGENCE MÉDICALE !\n\n` +
        `${alertDetails}\n\n` +
        `⚠️ MERCI DE M'APPELER IMMÉDIATEMENT !\n\n` +
        `📍 Mon adresse : ${emergencyAddress}\n\n` +
        `🤖 Message automatique - Système CardioAI\n` +
        `🕒 ${new Date().toLocaleString('fr-FR')}`
      );

      // Essayer différentes méthodes selon le navigateur/appareil
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // Sur mobile, essayer d'abord l'app native
        const whatsappAppLink = `whatsapp://send?phone=${cleanNumber}&text=${whatsappMessage}`;

        try {
          // Tenter d'ouvrir l'app native
          window.location.href = whatsappAppLink;

          // Fallback vers WhatsApp Web après 2 secondes si l'app ne s'ouvre pas
          setTimeout(() => {
            const whatsappWebLink = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;
            window.open(whatsappWebLink, '_blank');
          }, 2000);

        } catch (error) {
          // Si l'app native échoue, utiliser WhatsApp Web
          const whatsappWebLink = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;
          window.open(whatsappWebLink, '_blank');
        }
      } else {
        // Sur desktop, utiliser WhatsApp Web
        const whatsappWebLink = `https://wa.me/${cleanNumber}?text=${whatsappMessage}`;
        window.open(whatsappWebLink, '_blank');
      }

      console.log(`WhatsApp ouvert vers ${cleanNumber}`);

      // Copier le message dans le presse-papiers comme backup
      this.copyMessageToClipboard(whatsappMessage);

      // Afficher des instructions supplémentaires
      this.showWhatsAppInstructions(emergencyInfo, cleanNumber);

    } catch (error) {
      console.error('Erreur lors de l\'ouverture WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Affiche des instructions pour WhatsApp
   */
  showWhatsAppInstructions(emergencyInfo, cleanNumber) {
    // Créer une notification avec instructions
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📱 WhatsApp ouvert - ACTION REQUISE', {
          body: `URGENT: Appuyez sur ENVOYER puis APPELER dans WhatsApp !`,
          requireInteraction: true,
          tag: 'whatsapp-instructions'
        });
      }

      // Afficher une alerte plus visible et urgente
      const instructionOverlay = document.createElement('div');
      instructionOverlay.id = 'whatsapp-instructions';
      instructionOverlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        color: white;
        padding: 30px;
        border-radius: 20px;
        z-index: 10001;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        font-family: Arial, sans-serif;
        border: 3px solid #fff;
        animation: urgentPulse 2s infinite;
      `;

      // Ajouter l'animation CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes urgentPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
      `;
      document.head.appendChild(style);

      instructionOverlay.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 3rem; margin-bottom: 10px;">🚨</div>
          <h2 style="margin: 0; font-size: 1.4rem; color: #FFD700;">ACTION URGENTE REQUISE</h2>
          <p style="margin: 5px 0 0 0; font-size: 1rem;">WhatsApp est ouvert avec votre message d'urgence</p>
        </div>

        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; font-size: 1.1rem; text-align: center;">📱 ÉTAPES À SUIVRE MAINTENANT :</h3>

          <div style="display: flex; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <span style="font-size: 2rem; margin-right: 15px;">1️⃣</span>
            <div>
              <strong style="font-size: 1rem;">APPUYEZ SUR "ENVOYER"</strong>
              <div style="font-size: 0.9rem; opacity: 0.9;">Le message d'urgence est déjà écrit</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <span style="font-size: 2rem; margin-right: 15px;">2️⃣</span>
            <div>
              <strong style="font-size: 1rem;">CLIQUEZ SUR L'ICÔNE D'APPEL 📞</strong>
              <div style="font-size: 0.9rem; opacity: 0.9;">En haut à droite dans WhatsApp</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <span style="font-size: 2rem; margin-right: 15px;">3️⃣</span>
            <div>
              <strong style="font-size: 1rem;">EXPLIQUEZ VOTRE URGENCE</strong>
              <div style="font-size: 0.9rem; opacity: 0.9;">Problème cardiaque détecté automatiquement</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="background: rgba(255,0,0,0.2); padding: 10px; border-radius: 10px; border: 1px solid rgba(255,0,0,0.5);">
            <strong style="color: #FFD700;">⚠️ TEMPS CRITIQUE - AGISSEZ MAINTENANT !</strong>
          </div>
        </div>

        <div style="text-align: center;">
          <button onclick="document.getElementById('whatsapp-instructions').remove()"
                  style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 1rem; font-weight: bold;">
            ✅ J'ai envoyé le message et appelé
          </button>
        </div>

        <div style="text-align: center; margin-top: 15px; font-size: 0.8rem; opacity: 0.8;">
          Contact: ${cleanNumber} | Auto-fermeture dans 30s
        </div>
      `;

      document.body.appendChild(instructionOverlay);

      // Créer un overlay de fond pour attirer l'attention
      const backdrop = document.createElement('div');
      backdrop.id = 'whatsapp-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
      `;
      document.body.appendChild(backdrop);

      // Supprimer automatiquement après 30 secondes
      setTimeout(() => {
        if (document.getElementById('whatsapp-instructions')) {
          instructionOverlay.remove();
          backdrop.remove();
          style.remove();
        }
      }, 30000);

      // Permettre de fermer en cliquant sur le backdrop
      backdrop.onclick = () => {
        instructionOverlay.remove();
        backdrop.remove();
        style.remove();
      };

    }, 1500); // Attendre 1.5 secondes que WhatsApp s'ouvre
  }

  /**
   * Copie le message d'urgence dans le presse-papiers
   */
  async copyMessageToClipboard(encodedMessage) {
    try {
      // Décoder le message pour le presse-papiers
      const decodedMessage = decodeURIComponent(encodedMessage);

      if (navigator.clipboard && window.isSecureContext) {
        // Méthode moderne
        await navigator.clipboard.writeText(decodedMessage);
        console.log('Message d\'urgence copié dans le presse-papiers');
      } else {
        // Méthode de fallback
        const textArea = document.createElement('textarea');
        textArea.value = decodedMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        console.log('Message d\'urgence copié dans le presse-papiers (fallback)');
      }
    } catch (error) {
      console.error('Erreur lors de la copie dans le presse-papiers:', error);
    }
  }

  /**
   * Mode Urgence Maximale - Toutes les méthodes simultanément
   */
  async makeAggressiveEmergencyCall(emergencyInfo) {
    console.log('🚨 MODE URGENCE MAXIMALE ACTIVÉ');

    try {
      // 1. Appel téléphonique immédiat
      await this.makePhoneCall(emergencyInfo);

      // 2. WhatsApp après 1 seconde (plus rapide qu'en mode normal)
      setTimeout(() => this.makeWhatsAppCall(emergencyInfo), 1000);

      // 3. Notification système urgente
      this.showMaximumUrgencyAlert(emergencyInfo);

      // 4. Tentative de vibration (si supportée)
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
      }

      // 5. Son d'alerte (si possible)
      this.playEmergencySound();

      // 6. Répéter WhatsApp après 10 secondes si pas de réponse
      setTimeout(() => {
        this.makeWhatsAppCall(emergencyInfo);
        console.log('🔄 Tentative WhatsApp répétée (mode agressif)');
      }, 10000);

    } catch (error) {
      console.error('Erreur en mode urgence maximale:', error);
      this.showManualCallInstructions(emergencyInfo);
    }
  }

  /**
   * Affiche une alerte d'urgence maximale
   */
  showMaximumUrgencyAlert(emergencyInfo) {
    // Notification système critique
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 URGENCE MÉDICALE CRITIQUE 🚨', {
        body: `TOUTES LES MÉTHODES ACTIVÉES - AGISSEZ IMMÉDIATEMENT !`,
        requireInteraction: true,
        tag: 'maximum-urgency',
        icon: '/emergency-icon.png'
      });
    }

    // Overlay d'urgence maximale
    const urgencyOverlay = document.createElement('div');
    urgencyOverlay.id = 'maximum-urgency-overlay';
    urgencyOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #ff0000, #ff4444, #ff0000, #ff4444);
      background-size: 400% 400%;
      animation: urgentGradient 1s ease infinite;
      z-index: 10002;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes urgentGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes urgentShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);

    urgencyOverlay.innerHTML = `
      <div style="text-align: center; animation: urgentShake 0.5s infinite;">
        <div style="font-size: 5rem; margin-bottom: 20px;">🚨</div>
        <h1 style="font-size: 3rem; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          URGENCE MAXIMALE
        </h1>
        <h2 style="font-size: 1.5rem; margin: 0 0 30px 0;">
          TOUTES LES MÉTHODES D'URGENCE ACTIVÉES
        </h2>

        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin: 20px auto; max-width: 500px;">
          <p style="font-size: 1.2rem; margin: 0 0 15px 0;">📞 APPEL TÉLÉPHONIQUE LANCÉ</p>
          <p style="font-size: 1.2rem; margin: 0 0 15px 0;">💬 WHATSAPP EN COURS D'OUVERTURE</p>
          <p style="font-size: 1.2rem; margin: 0 0 15px 0;">🔄 TENTATIVES RÉPÉTÉES ACTIVÉES</p>
          <p style="font-size: 1.2rem; margin: 0;">📋 MESSAGE COPIÉ DANS PRESSE-PAPIERS</p>
        </div>

        <div style="font-size: 1.1rem; margin: 20px 0;">
          <strong>SUIVEZ LES INSTRUCTIONS DANS WHATSAPP</strong><br/>
          <strong>RÉPONDEZ AU TÉLÉPHONE SI IL SONNE</strong>
        </div>

        <button onclick="document.getElementById('maximum-urgency-overlay').remove()"
                style="background: rgba(255,255,255,0.2); border: 3px solid white; color: white; padding: 15px 30px; border-radius: 30px; cursor: pointer; font-size: 1.1rem; font-weight: bold; margin-top: 20px;">
          ✅ J'AI PRIS LES MESURES NÉCESSAIRES
        </button>
      </div>
    `;

    document.body.appendChild(urgencyOverlay);

    // Supprimer automatiquement après 45 secondes
    setTimeout(() => {
      if (document.getElementById('maximum-urgency-overlay')) {
        urgencyOverlay.remove();
        style.remove();
      }
    }, 45000);
  }

  /**
   * Tente de jouer un son d'alerte
   */
  playEmergencySound() {
    try {
      // Créer un son d'urgence avec Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.5);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + 1.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);

      console.log('Son d\'urgence joué');
    } catch (error) {
      console.log('Impossible de jouer le son d\'urgence:', error);
    }
  }

  /**
   * Affiche une notification d'urgence
   */
  showEmergencyNotification(emergencyInfo) {
    // Créer une notification système si possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 URGENCE MÉDICALE', {
        body: `Appel automatique vers ${emergencyInfo.serviceName} (${emergencyInfo.number})\n${emergencyInfo.alert.message}`,
        icon: '/emergency-icon.png',
        requireInteraction: true,
        tag: 'emergency'
      });
    }

    // Afficher aussi une alerte dans l'interface
    this.showEmergencyAlert(emergencyInfo);
  }

  /**
   * Affiche une alerte d'urgence dans l'interface
   */
  showEmergencyAlert(emergencyInfo) {
    // Créer un overlay d'urgence
    const overlay = document.createElement('div');
    overlay.id = 'emergency-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
    `;

    const contactType = this.preferences?.alertSettings?.contactType;
    const callMethod = this.preferences?.alertSettings?.callMethod || 'phone';

    const isPersonalContact = contactType === 'person';
    const contactIcon = isPersonalContact ? '👤' : '🚨';
    const urgencyTitle = isPersonalContact ? 'APPEL D\'URGENCE' : 'URGENCE MÉDICALE';

    const callMethodText = {
      'phone': 'Appel téléphonique en cours...',
      'whatsapp': 'Ouverture de WhatsApp...',
      'both': 'Appel téléphonique + WhatsApp...'
    };

    const callText = isPersonalContact
      ? `Appel vers votre contact de confiance...`
      : callMethodText[callMethod] || 'Appel automatique en cours...';

    overlay.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(0,0,0,0.8); border-radius: 20px; max-width: 600px;">
        <h1 style="font-size: 3rem; margin: 0 0 20px 0;">🚨 ${urgencyTitle}</h1>
        <h2 style="margin: 0 0 20px 0; color: #ffeb3b;">${callText}</h2>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 1.4rem; margin: 0 0 10px 0; font-weight: bold;">${contactIcon} ${emergencyInfo.number}</p>
          <p style="font-size: 1rem; margin: 0; color: #e0e0e0;">${emergencyInfo.serviceName}</p>
        </div>
        <div style="background: rgba(255,0,0,0.2); padding: 15px; border-radius: 10px; margin: 20px 0;">
          <p style="margin: 0; font-size: 1.1rem;"><strong>Alerte:</strong> ${emergencyInfo.alert.message}</p>
          <p style="margin: 10px 0 0 0; font-size: 1rem;"><strong>Valeur:</strong> ${emergencyInfo.alert.value} ${emergencyInfo.alert.unit}</p>
        </div>
        ${isPersonalContact ? `
        <div style="background: rgba(0,255,0,0.1); padding: 10px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(0,255,0,0.3);">
          <p style="margin: 0; font-size: 0.9rem; color: #90ee90;">
            💡 Votre contact personnel sera informé de votre situation médicale
          </p>
        </div>
        ` : ''}

        <div style="background: rgba(0,0,255,0.1); padding: 10px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(0,0,255,0.3);">
          <p style="margin: 0; font-size: 0.9rem; color: #87ceeb;">
            ${callMethod === 'phone' ? '📞 Méthode: Appel téléphonique' :
              callMethod === 'whatsapp' ? '💬 Méthode: WhatsApp + Message copié' :
              callMethod === 'aggressive' ? '🚨 Méthode: URGENCE MAXIMALE' :
              '📞💬 Méthode: Téléphone + WhatsApp'}
          </p>
        </div>
        <button onclick="document.getElementById('emergency-overlay').remove()"
                style="padding: 15px 30px; font-size: 1.1rem; background: white; color: red; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">
          Fermer cette alerte
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Supprimer automatiquement après 30 secondes
    setTimeout(() => {
      if (document.getElementById('emergency-overlay')) {
        overlay.remove();
      }
    }, 30000);
  }

  /**
   * Affiche les instructions pour un appel manuel
   */
  showManualCallInstructions(emergencyInfo) {
    alert(`🚨 URGENCE MÉDICALE 🚨

L'appel automatique a échoué.
COMPOSEZ IMMÉDIATEMENT:

${emergencyInfo.number}

Message à transmettre:
${emergencyInfo.message}`);
  }

  /**
   * Affiche une erreur d'urgence
   */
  showEmergencyError(error) {
    console.error('Erreur système d\'urgence:', error);
    alert(`⚠️ ERREUR SYSTÈME D'URGENCE

Le système d'appel automatique a rencontré une erreur.
Contactez manuellement les services d'urgence si nécessaire.

Erreur: ${error.message}`);
  }

  /**
   * Enregistre l'événement d'urgence
   */
  logEmergencyEvent(alert, emergencyInfo) {
    const event = {
      id: `emergency_${Date.now()}`,
      timestamp: new Date().toISOString(),
      alert,
      emergencyInfo,
      type: 'emergency_call'
    };

    // Sauvegarder dans localStorage
    try {
      const emergencyLog = JSON.parse(localStorage.getItem('cardioai_emergency_log') || '[]');
      emergencyLog.push(event);
      
      // Garder seulement les 50 derniers événements
      if (emergencyLog.length > 50) {
        emergencyLog.splice(0, emergencyLog.length - 50);
      }
      
      localStorage.setItem('cardioai_emergency_log', JSON.stringify(emergencyLog));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du log d\'urgence:', error);
    }
  }

  /**
   * Obtient l'historique des appels d'urgence
   */
  getEmergencyHistory() {
    try {
      return JSON.parse(localStorage.getItem('cardioai_emergency_log') || '[]');
    } catch (error) {
      console.error('Erreur lors de la lecture du log d\'urgence:', error);
      return [];
    }
  }

  /**
   * Teste le système d'urgence
   */
  testEmergencySystem() {
    const testAlert = {
      id: 'test_emergency',
      sensor: 'heartRate',
      message: 'Test du système d\'urgence',
      severity: 'error',
      value: 200,
      unit: 'bpm',
      timestamp: new Date().toISOString()
    };

    console.log('🧪 Test du système d\'urgence...');
    return this.triggerEmergency(testAlert);
  }


}

// Instance singleton
const emergencyService = new EmergencyService();

export default emergencyService;
