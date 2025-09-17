// Service de notifications avancé
class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.settings = {
      soundEnabled: true,
      visualAlerts: true,
      browserNotifications: true,
      vibrationEnabled: true,
      criticalOnly: false,
      toastNotifications: true
    };
    this.sounds = {
      info: this.createBeep(800, 200),
      warning: this.createBeep(600, 300),
      critical: this.createBeep(400, 500),
      success: this.createBeep(1000, 150)
    };
    this.requestPermissions();
  }

  // Demander les permissions pour les notifications navigateur
  async requestPermissions() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Permission notifications:', permission);
    }
    
    if ('vibrate' in navigator) {
      console.log('Vibration supportée');
    }
  }

  // Créer un son de notification
  createBeep(frequency, duration) {
    return () => {
      if (!this.settings.soundEnabled) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (error) {
        console.warn('Erreur audio:', error);
      }
    };
  }

  // Ajouter une notification
  addNotification(notification) {
    const id = Date.now() + Math.random();
    const fullNotification = {
      id,
      timestamp: new Date(),
      read: false,
      dismissed: false,
      ...notification
    };

    // Vérifier si on doit afficher selon les paramètres
    if (this.settings.criticalOnly && notification.severity !== 'critical') {
      return id;
    }

    this.notifications.unshift(fullNotification);
    
    // Limiter à 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Déclencher les alertes
    this.triggerAlerts(fullNotification);
    
    // Notifier les listeners avec la nouvelle notification
    this.notifyListeners(fullNotification);
    
    return id;
  }

  // Déclencher les différents types d'alertes
  triggerAlerts(notification) {
    // Son
    if (this.settings.soundEnabled && this.sounds[notification.severity]) {
      this.sounds[notification.severity]();
    }

    // Vibration
    if (this.settings.vibrationEnabled && 'vibrate' in navigator) {
      const patterns = {
        info: [100],
        warning: [200, 100, 200],
        critical: [300, 100, 300, 100, 300],
        success: [100, 50, 100]
      };
      navigator.vibrate(patterns[notification.severity] || [100]);
    }

    // Notification navigateur
    if (this.settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: this.getNotificationIcon(notification.severity),
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.severity === 'critical',
        silent: !this.settings.soundEnabled
      });

      browserNotification.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        browserNotification.close();
      };

      // Auto-fermeture sauf pour les critiques
      if (notification.severity !== 'critical') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }

    // Alerte visuelle (flash de l'écran)
    if (this.settings.visualAlerts && notification.severity === 'critical') {
      this.flashScreen(notification.severity);
    }
  }

  // Flash visuel de l'écran
  flashScreen(severity) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${severity === 'critical' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 152, 0, 0.3)'};
      z-index: 9999;
      pointer-events: none;
      animation: flash 0.5s ease-in-out 3;
    `;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    setTimeout(() => {
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    }, 1500);
  }

  // Obtenir l'icône selon la sévérité
  getNotificationIcon(severity) {
    const icons = {
      info: '🔵',
      warning: '🟡',
      critical: '🔴',
      success: '🟢'
    };
    return icons[severity] || '🔵';
  }

  // Marquer comme lu
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Marquer comme ignoré
  dismiss(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.dismissed = true;
      this.notifyListeners();
    }
  }

  // Supprimer une notification
  remove(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  // Marquer toutes comme lues
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Effacer toutes les notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Effacer les notifications lues
  clearRead() {
    this.notifications = this.notifications.filter(n => !n.read);
    this.notifyListeners();
  }

  // Obtenir les notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read && !n.dismissed);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Mettre à jour les paramètres
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('cardioai-notification-settings', JSON.stringify(this.settings));
  }

  // Charger les paramètres
  loadSettings() {
    try {
      const saved = localStorage.getItem('cardioai-notification-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Erreur chargement paramètres notifications:', error);
    }
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
  notifyListeners(newNotification = null) {
    this.listeners.forEach(callback => {
      callback({
        notifications: this.getNotifications(),
        unreadCount: this.getUnreadCount(),
        newNotification: newNotification
      });
    });
  }

  // Notifications prédéfinies pour les capteurs
  createSensorAlert(sensorType, value, threshold, severity = 'warning') {
    const sensorNames = {
      heartRate: 'Rythme cardiaque',
      temperature: 'Température',
      bloodPressure: 'Tension artérielle',
      oxygenSaturation: 'Saturation en oxygène'
    };

    const messages = {
      heartRate: value > threshold.max ? 
        `Rythme cardiaque élevé: ${value} bpm (normal: ${threshold.min}-${threshold.max})` :
        `Rythme cardiaque bas: ${value} bpm (normal: ${threshold.min}-${threshold.max})`,
      temperature: value > threshold.max ?
        `Température élevée: ${value}°C (normal: ${threshold.min}-${threshold.max})` :
        `Température basse: ${value}°C (normal: ${threshold.min}-${threshold.max})`,
      oxygenSaturation: `Saturation en oxygène faible: ${value}% (normal: >${threshold.min})`
    };

    return this.addNotification({
      type: 'sensor',
      severity,
      title: `⚠️ Alerte ${sensorNames[sensorType]}`,
      message: messages[sensorType] || `Valeur anormale détectée: ${value}`,
      sensorType,
      value,
      threshold,
      actions: [
        { label: 'Voir détails', action: 'view-details' },
        { label: 'Ignorer', action: 'dismiss' }
      ]
    });
  }

  // Notification de connexion IoT
  createConnectionAlert(isConnected) {
    return this.addNotification({
      type: 'connection',
      severity: isConnected ? 'success' : 'warning',
      title: isConnected ? '✅ Connexion rétablie' : '⚠️ Connexion perdue',
      message: isConnected ? 
        'Les capteurs IoT sont de nouveau connectés' : 
        'Connexion aux capteurs IoT interrompue',
      actions: isConnected ? [] : [
        { label: 'Reconnecter', action: 'reconnect' },
        { label: 'Diagnostiquer', action: 'diagnose' }
      ]
    });
  }

  // Notification de diagnostic IA
  createDiagnosticAlert(result) {
    return this.addNotification({
      type: 'diagnostic',
      severity: result.prediction === 1 ? 'critical' : 'info',
      title: result.prediction === 1 ? '🚨 Risque détecté' : '✅ Diagnostic normal',
      message: result.prediction === 1 ?
        `Risque cardiaque détecté avec ${Math.round(result.confidence * 100)}% de confiance` :
        `Aucun risque majeur détecté (confiance: ${Math.round(result.confidence * 100)}%)`,
      actions: [
        { label: 'Voir rapport', action: 'view-report' },
        { label: 'Exporter', action: 'export' }
      ]
    });
  }
}

// Instance singleton
const notificationService = new NotificationService();
export default notificationService;
