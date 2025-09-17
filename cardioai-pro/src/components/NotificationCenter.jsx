import React, { useState, useEffect } from 'react';

const NotificationCenter = ({ notificationService, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, critical

  useEffect(() => {
    const handleNotificationUpdate = (data) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    };

    notificationService.addListener(handleNotificationUpdate);
    
    // Charger les notifications initiales
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    return () => {
      notificationService.removeListener(handleNotificationUpdate);
    };
  }, [notificationService]);

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read && !n.dismissed);
      case 'critical':
        return notifications.filter(n => n.severity === 'critical');
      default:
        return notifications.filter(n => !n.dismissed);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: '#2196f3',
      warning: '#ff9800',
      critical: '#f44336',
      success: '#4caf50'
    };
    return colors[severity] || '#2196f3';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      critical: '🚨',
      success: '✅'
    };
    return icons[severity] || 'ℹ️';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }
  };

  const handleAction = (notification, action) => {
    switch (action.action) {
      case 'dismiss':
        notificationService.dismiss(notification.id);
        break;
      case 'remove':
        notificationService.remove(notification.id);
        break;
      case 'view-details':
        // Logique pour voir les détails
        console.log('Voir détails:', notification);
        break;
      case 'reconnect':
        // Logique de reconnexion
        console.log('Reconnexion...');
        break;
      default:
        console.log('Action:', action.action, notification);
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease'
    }}>
      {/* En-tête */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>🔔 Notifications</h2>
          <p style={{ margin: '0', fontSize: '12px', opacity: '0.7' }}>
            {unreadCount} non lues • {filteredNotifications.length} total
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ✕
        </button>
      </div>

      {/* Filtres */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '10px'
      }}>
        {[
          { key: 'all', label: 'Toutes', count: notifications.filter(n => !n.dismissed).length },
          { key: 'unread', label: 'Non lues', count: unreadCount },
          { key: 'critical', label: 'Critiques', count: notifications.filter(n => n.severity === 'critical').length }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            style={{
              backgroundColor: filter === filterOption.key ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {filterOption.label}
            {filterOption.count > 0 && (
              <span style={{
                backgroundColor: 'rgba(244, 67, 54, 0.8)',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {filterOption.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Actions rapides */}
      <div style={{
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => notificationService.markAllAsRead()}
          disabled={unreadCount === 0}
          style={{
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            border: '1px solid rgba(76, 175, 80, 0.5)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '11px',
            opacity: unreadCount > 0 ? 1 : 0.5
          }}
        >
          ✓ Tout marquer lu
        </button>
        <button
          onClick={() => notificationService.clearRead()}
          style={{
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            border: '1px solid rgba(255, 152, 0, 0.5)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          🗑️ Effacer lues
        </button>
      </div>

      {/* Liste des notifications */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 0'
      }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            opacity: '0.6'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔕</div>
            <p style={{ margin: '0', fontSize: '14px' }}>
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                backgroundColor: notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                borderLeft: `4px solid ${getSeverityColor(notification.severity)}`,
                transition: 'background-color 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)'}
            >
              {/* Badge non lu */}
              {!notification.read && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ff4757',
                  borderRadius: '50%'
                }} />
              )}

              {/* Contenu */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>
                  {getSeverityIcon(notification.severity)}
                </span>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 5px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: notification.read ? 0.7 : 1
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    opacity: notification.read ? 0.6 : 0.9
                  }}>
                    {notification.message}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      opacity: '0.5'
                    }}>
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    {notification.actions && notification.actions.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {notification.actions.slice(0, 2).map((action, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification, action);
                            }}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '10px'
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
