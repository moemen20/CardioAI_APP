import { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Button,
  Slide,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  Minimize as MinimizeIcon
} from '@mui/icons-material';
import globalNotificationService from '../services/globalNotificationService';
import globalMonitoringService from '../services/globalMonitoringService';

function FloatingNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // S'abonner aux notifications globales
    const unsubscribeNotifications = globalNotificationService.addListener((state) => {
      // Afficher seulement les alertes IoT récentes (dernières 5 minutes)
      const recentNotifications = state.notifications.filter(notification => {
        const notificationAge = new Date() - new Date(notification.timestamp);
        const fiveMinutes = 5 * 60 * 1000;
        return notification.type === 'iot_alert' &&
               notificationAge < fiveMinutes;
      });
      setNotifications(recentNotifications);
    });

    // S'abonner au monitoring global
    const unsubscribeMonitoring = globalMonitoringService.addListener((state) => {
      setIsMonitoring(state.isMonitoring);
    });

    // Charger l'état initial
    setIsMonitoring(globalMonitoringService.getState().isMonitoring);

    return () => {
      unsubscribeNotifications();
      unsubscribeMonitoring();
    };
  }, []);

  const handleDismiss = (notificationId) => {
    // Supprimer complètement la notification du service global
    globalNotificationService.removeNotification(notificationId);
  };



  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'success';
    }
  };

  // N'afficher les notifications flottantes que si le monitoring est actif
  if (!isMonitoring || notifications.length === 0) {
    return null;
  }

  // Si minimisé, afficher seulement un indicateur compact
  if (isMinimized) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 20,
          zIndex: 1200
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          onClick={() => setIsMinimized(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon fontSize="small" />
            <Typography variant="caption" fontWeight="600">
              {notifications.length}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // Plus bas pour laisser place à la navigation
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200, // Légèrement moins élevé
        maxWidth: 500, // Plus compact
        width: '85%',
        maxHeight: '40vh', // Moins de hauteur
        overflow: 'auto'
      }}
    >
      {/* Bouton de minimisation */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton
          size="small"
          onClick={() => setIsMinimized(true)}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.2)'
            }
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
      </Box>
      {notifications.slice(0, 2).map((notification, index) => (
        <Slide
          key={notification.id}
          direction="down"
          in={true}
          timeout={300 + index * 100}
        >
          <Paper
            elevation={8}
            sx={{
              mb: 1.5, // Moins d'espace entre notifications
              borderRadius: 2,
              overflow: 'hidden',
              border: `2px solid ${notification.color}`,
              background: `linear-gradient(135deg, ${notification.color}08 0%, ${notification.color}03 100%)`,
              backdropFilter: 'blur(8px)',
              animation: notification.severity === 'error' ? 'pulse 2s infinite' : 'slideIn 0.4s ease-out',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${notification.color}30`,
                  transform: 'scale(1)'
                },
                '70%': {
                  boxShadow: `0 0 0 10px ${notification.color}00`,
                  transform: 'scale(1.01)'
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${notification.color}00`,
                  transform: 'scale(1)'
                }
              },
              '@keyframes slideIn': {
                '0%': {
                  transform: 'translateY(-50px) scale(0.9)',
                  opacity: 0
                },
                '100%': {
                  transform: 'translateY(0) scale(1)',
                  opacity: 1
                }
              }
            }}
          >
            <Alert
              severity={getSeverityColor(notification.severity)}
              icon={getSeverityIcon(notification.severity)}
              action={
                <IconButton
                  size="small"
                  onClick={() => handleDismiss(notification.id)}
                  sx={{
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                '& .MuiAlert-message': { width: '100%' },
                '& .MuiAlert-action': { alignItems: 'flex-start', pt: 0.5 }
              }}
            >
              <AlertTitle sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {notification.icon && (
                    <span style={{ fontSize: '1.2rem' }}>
                      {notification.icon}
                    </span>
                  )}
                  <span style={{ flex: 1 }}>
                    {notification.title}
                  </span>
                  <Chip
                    label="NOUVEAU"
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: '0.65rem',
                      height: 20,
                      fontWeight: 500
                    }}
                  />
                </Box>
              </AlertTitle>
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 400, fontSize: '0.9rem' }}>
                {notification.message}
              </Typography>

              {notification.sensor && notification.value && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                  p: 0.5,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 1
                }}>
                  <Typography variant="caption" fontWeight="500" sx={{ fontSize: '0.75rem' }}>
                    {notification.sensor}
                  </Typography>
                  <Typography variant="body2" fontWeight="600" color={notification.color}>
                    {notification.value} {notification.unit}
                  </Typography>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary" sx={{
                fontSize: '0.7rem',
                opacity: 0.7
              }}>
                {new Date(notification.timestamp).toLocaleTimeString('fr-FR')}
              </Typography>
              
              {notification.actions && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {notification.actions.slice(0, 1).map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      size="small"
                      variant="text"
                      onClick={() => {
                        // Gérer l'action
                        console.log('Action:', action);
                        handleDismiss(notification.id);
                      }}
                      sx={{
                        fontSize: '0.65rem',
                        minWidth: 'auto',
                        px: 1,
                        py: 0.25,
                        color: 'inherit',
                        opacity: 0.8,
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              )}
            </Alert>
          </Paper>
        </Slide>
      ))}
      
      {notifications.length > 2 && (
        <Paper
          elevation={4}
          sx={{
            p: 0.75,
            textAlign: 'center',
            borderRadius: 1.5,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            mt: 0.5
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            +{notifications.length - 2} autres notifications
          </Typography>
          <Button
            size="small"
            variant="text"
            sx={{
              color: 'inherit',
              ml: 1,
              fontSize: '0.65rem',
              minWidth: 'auto',
              px: 1,
              py: 0.25
            }}
            onClick={() => globalNotificationService.toggleDrawer()}
          >
            Voir tout
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default FloatingNotifications;
