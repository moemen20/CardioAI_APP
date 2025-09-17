import React, { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import globalNotificationService from '../services/globalNotificationService';

function SimpleNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // S'abonner aux notifications
    const unsubscribe = globalNotificationService.addListener((data) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    });

    // Charger les notifications initiales
    setNotifications(globalNotificationService.getNotifications());
    setUnreadCount(globalNotificationService.getUnreadCount());

    // Ajouter quelques notifications de test au démarrage
    if (globalNotificationService.getNotifications().length === 0) {
      globalNotificationService.addNotification({
        type: 'info',
        title: 'Bienvenue sur CardioAI',
        message: 'Application démarrée avec succès',
        severity: 'info'
      });

      globalNotificationService.addNotification({
        type: 'success',
        title: 'Système prêt',
        message: 'Tous les services sont opérationnels',
        severity: 'success'
      });
    }

    return unsubscribe;
  }, []);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (!isDrawerOpen) {
      // Marquer toutes les notifications comme lues quand on ouvre le drawer
      globalNotificationService.markAllAsRead();
    }
  };

  const handleClearAll = () => {
    globalNotificationService.clearAll();
    setIsDrawerOpen(false);
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <SuccessIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour tester les notifications
  const addTestNotification = () => {
    const testNotifications = [
      {
        type: 'warning',
        title: 'Fréquence cardiaque élevée',
        message: 'BPM: 95 - Seuil dépassé',
        severity: 'warning'
      },
      {
        type: 'error',
        title: 'Alerte critique',
        message: 'Perte de signal du capteur',
        severity: 'error'
      },
      {
        type: 'info',
        title: 'Nouvelle mesure',
        message: 'Données ECG enregistrées',
        severity: 'info'
      },
      {
        type: 'success',
        title: 'Diagnostic terminé',
        message: 'Résultats disponibles',
        severity: 'success'
      }
    ];

    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    globalNotificationService.addNotification(randomNotification);
  };

  return (
    <>
      {/* Icône de notification dans le header */}
      <IconButton
        color="inherit"
        onClick={handleToggleDrawer}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Drawer des notifications */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: 400, maxWidth: '90vw' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Notifications ({notifications.length})
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Boutons d'action */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={addTestNotification}
            >
              Test Notification
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Tout effacer
            </Button>
          </Box>

          <Divider />

          {/* Liste des notifications */}
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Aucune notification
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getIcon(notification.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2">
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Chip
                            label={notification.severity}
                            size="small"
                            color={getSeverityColor(notification.severity)}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default SimpleNotifications;
