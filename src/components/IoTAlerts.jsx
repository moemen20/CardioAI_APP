import { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';

function IoTAlerts({ alerts = [], onAlertRead, showNotifications = true }) {
  const [openAlerts, setOpenAlerts] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filtrer et grouper les alertes par sévérité (exclure les alertes lues/supprimées)
  const activeAlerts = alerts.filter(alert => !alert.read);
  const groupedAlerts = activeAlerts.reduce((acc, alert) => {
    if (!acc[alert.severity]) {
      acc[alert.severity] = [];
    }
    acc[alert.severity].push(alert);
    return acc;
  }, {});

  // Compter les alertes non lues
  const unreadCount = activeAlerts.length;

  // Jouer un son pour les nouvelles alertes critiques
  useEffect(() => {
    const criticalAlerts = alerts.filter(
      alert => alert.severity === 'error' && !alert.read
    );
    
    if (criticalAlerts.length > 0 && soundEnabled && showNotifications) {
      // Simulation d'un son d'alerte (dans une vraie app, utilisez Web Audio API)
      console.log('🚨 Alerte critique détectée!');
    }
  }, [alerts, soundEnabled, showNotifications]);

  const handleToggleAlert = (alertId) => {
    setOpenAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const handleCloseAlert = async (alert) => {
    try {
      if (onAlertRead) {
        await onAlertRead(alert.id);
      }
      // Marquer l'alerte comme fermée localement aussi
      setOpenAlerts(prev => ({
        ...prev,
        [alert.id]: false
      }));
    } catch (error) {
      console.error('Erreur lors de la fermeture de l\'alerte:', error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
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
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'error':
        return 'Critique';
      case 'warning':
        return 'Attention';
      case 'info':
        return 'Information';
      case 'success':
        return 'Succès';
      default:
        return 'Inconnu';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!showNotifications || activeAlerts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* En-tête des alertes */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon color="primary" />
          </Badge>
          <Typography variant="h6" fontWeight="600">
            Alertes système
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>
        
        <Tooltip title={soundEnabled ? "Désactiver les sons" : "Activer les sons"}>
          <IconButton
            size="small"
            onClick={() => setSoundEnabled(!soundEnabled)}
            color={soundEnabled ? "primary" : "default"}
          >
            {soundEnabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Liste des alertes */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <List disablePadding>
          {Object.entries(groupedAlerts).map(([severity, severityAlerts]) => (
            severityAlerts.map((alert, index) => (
              <Box key={alert.id}>
                <ListItem
                  sx={{
                    backgroundColor: `${getSeverityColor(severity)}.50`,
                    borderLeft: `4px solid`,
                    borderLeftColor: `${getSeverityColor(severity)}.main`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ListItemIcon>
                    {getSeverityIcon(severity)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {alert.sensor.charAt(0).toUpperCase() + alert.sensor.slice(1)}
                        </Typography>
                        <Chip
                          label={getSeverityLabel(severity)}
                          size="small"
                          color={getSeverityColor(severity)}
                          variant="outlined"
                        />
                        <Chip
                          label="Nouveau"
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(alert.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleCloseAlert(alert)}
                      sx={{ opacity: 0.7 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < severityAlerts.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                )}
              </Box>
            ))
          ))}
        </List>
      </Paper>

      {/* Alerte globale pour les cas critiques */}
      {groupedAlerts.error && groupedAlerts.error.some(alert => !alert.read) && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.7 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <AlertTitle>Attention - Alerte critique</AlertTitle>
          Des paramètres vitaux sont en dehors des limites normales. 
          Veuillez vérifier immédiatement les capteurs et consulter un professionnel de santé si nécessaire.
        </Alert>
      )}
    </Box>
  );
}

export default IoTAlerts;
