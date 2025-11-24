/**
 * Service global pour gérer les notifications persistantes
 * qui s'affichent sur toutes les pages de l'application
 */
class GlobalNotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = new Set();
    this.isDrawerOpen = false;
    
    // Restaurer les notifications depuis localStorage
    this.restoreNotifications();
  }

  /**
   * Ajoute un listener pour les changements de notifications
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
          notifications: this.notifications,
          unreadCount: this.getUnreadCount(),
          isDrawerOpen: this.isDrawerOpen
        });
      } catch (error) {
        console.error('Erreur dans le listener de notifications:', error);
      }
    });
  }

  /**
   * Ajoute une nouvelle notification
   */
  addNotification(notification) {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    
    // Limiter à 50 notifications maximum
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
    this.notifyListeners();
    
    return newNotification.id;
  }

  /**
   * Ajoute une notification d'alerte IoT
   */
  addIoTAlert(alert) {
    const notification = {
      type: 'iot_alert',
      title: this.getAlertTitle(alert),
      message: alert.message,
      severity: alert.severity,
      sensor: alert.sensor,
      value: alert.value,
      unit: alert.unit,
      icon: this.getAlertIcon(alert.sensor),
      color: this.getSeverityColor(alert.severity),
      data: alert, // Stocker l'alerte complète
      actions: [
        {
          label: 'Voir détails',
          action: 'view_details',
          data: alert
        },
        {
          label: 'Marquer comme lu',
          action: 'mark_read',
          data: alert
        }
      ]
    };

    return this.addNotification(notification);
  }

  /**
   * Ajoute une notification de session
   */
  addSessionNotification(session) {
    const notification = {
      type: 'session',
      title: 'Session de monitoring terminée',
      message: `Session ${session.id} sauvegardée avec succès`,
      severity: 'info',
      icon: '📊',
      color: '#2196f3',
      data: session,
      actions: [
        {
          label: 'Voir session',
          action: 'view_session',
          data: session
        },
        {
          label: 'Exporter CSV',
          action: 'export_session',
          data: session
        }
      ]
    };

    return this.addNotification(notification);
  }

  /**
   * Marque une notification comme lue
   */
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Supprime une notification
   */
  removeNotification(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);

    // Si c'est une alerte IoT, la supprimer aussi du service de monitoring
    if (notification && notification.type === 'iot_alert') {
      // Importer dynamiquement pour éviter les dépendances circulaires
      import('./globalMonitoringService.js').then(module => {
        const globalMonitoringService = module.default;
        globalMonitoringService.markAlertAsRead(notification.data?.id);
      }).catch(console.error);
    }

    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Supprime toutes les notifications lues
   */
  clearReadNotifications() {
    this.notifications = this.notifications.filter(n => !n.read);
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Supprime toutes les notifications
   */
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Obtient le nombre de notifications non lues
   */
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Obtient toutes les notifications
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Obtient les notifications non lues
   */
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Obtient l'état du drawer
   */
  getDrawerState() {
    return this.isDrawerOpen;
  }

  /**
   * Ouvre/ferme le drawer de notifications
   */
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.notifyListeners();
  }

  /**
   * Ferme le drawer de notifications
   */
  closeDrawer() {
    this.isDrawerOpen = false;
    this.notifyListeners();
  }

  /**
   * Sauvegarde les notifications dans localStorage
   */
  saveNotifications() {
    try {
      const data = {
        notifications: this.notifications,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cardioai_notifications', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  /**
   * Restaure les notifications depuis localStorage
   */
  restoreNotifications() {
    try {
      const saved = localStorage.getItem('cardioai_notifications');
      if (saved) {
        const data = JSON.parse(saved);
        
        // Vérifier que les données ne sont pas trop anciennes (7 jours max)
        const dataAge = new Date() - new Date(data.timestamp);
        if (dataAge < 7 * 24 * 60 * 60 * 1000) { // 7 jours
          this.notifications = data.notifications || [];
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des notifications:', error);
      this.notifications = [];
    }
  }

  /**
   * Utilitaires pour les alertes IoT
   */
  getAlertTitle(alert) {
    const sensorNames = {
      heartRate: 'Rythme Cardiaque',
      bloodPressure: 'Tension Artérielle',
      temperature: 'Température',
      oxygenSaturation: 'Saturation O₂',
      respiratoryRate: 'Fréquence Respiratoire'
    };
    
    const severityLabels = {
      error: 'Critique',
      warning: 'Attention',
      info: 'Information'
    };

    return `${severityLabels[alert.severity]} - ${sensorNames[alert.sensor] || alert.sensor}`;
  }

  getAlertIcon(sensor) {
    const icons = {
      heartRate: '💓',
      bloodPressure: '🩸',
      temperature: '🌡️',
      oxygenSaturation: '🫁',
      respiratoryRate: '💨'
    };
    return icons[sensor] || '⚠️';
  }

  getSeverityColor(severity) {
    const colors = {
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3'
    };
    return colors[severity] || '#757575';
  }

  /**
   * Nettoie les ressources
   */
  cleanup() {
    this.listeners.clear();
    this.saveNotifications();
  }
}

// Instance singleton
const globalNotificationService = new GlobalNotificationService();

// Sauvegarder lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
  globalNotificationService.saveNotifications();
});

export default globalNotificationService;
