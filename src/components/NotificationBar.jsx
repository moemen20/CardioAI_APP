import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Chip,
  Button,
  Divider,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Alert,
  Collapse,
  Tab,
  Tabs
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  History as HistoryIcon,
  MonitorHeart as MonitorIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DoneAll as MarkAllReadIcon,
  Clear as ClearAllIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';
import globalNotificationService from '../services/globalNotificationService';
import globalMonitoringService from '../services/globalMonitoringService';
import sessionService from '../services/sessionService';

function NotificationBar({ onSessionSelect }) {
  const theme = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Notifications, 1: Sessions
  const [drawerOpen, setDrawerOpen] = useState(false); // État local du drawer

  // État des notifications globales
  const [notificationState, setNotificationState] = useState({
    notifications: [],
    unreadCount: 0
  });

  // Charger les sessions et s'abonner aux notifications
  useEffect(() => {
    loadSessions();

    // S'abonner aux notifications globales
    const unsubscribe = globalNotificationService.addListener((newState) => {
      setNotificationState({
        notifications: newState.notifications,
        unreadCount: newState.unreadCount
      });
    });

    // Charger l'état initial
    setNotificationState({
      notifications: globalNotificationService.getNotifications(),
      unreadCount: globalNotificationService.getUnreadCount()
    });

    return unsubscribe;
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionService.getSessionHistory(20);
      if (response.status === 'success') {
        setSessions(response.sessions || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session) => {
    if (onSessionSelect) {
      onSessionSelect(session);
    }
    setDrawerOpen(false);
  };

  // Gestion du drawer
  const handleDrawerToggle = () => {
    const newDrawerState = !drawerOpen;
    setDrawerOpen(newDrawerState);

    // Si on ouvre le drawer et qu'il y a peu de notifications, générer des notifications de test
    const currentIoTAlerts = notificationState.notifications.filter(n => n.type === 'iot_alert').length;
    if (newDrawerState && currentIoTAlerts < 2) {
      globalMonitoringService.generateTestNotifications();
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNotificationAction = async (notification, action) => {
    try {
      switch (action.action) {
        case 'mark_read':
          globalNotificationService.markAsRead(notification.id);
          break;
        case 'view_details':
          console.log('Voir détails:', action.data);
          break;
        case 'view_session':
          if (onSessionSelect) {
            onSessionSelect(action.data);
          }
          globalNotificationService.markAsRead(notification.id);
          break;
        case 'export_session':
          await handleExportSessionData(action.data);
          break;
        default:
          console.log('Action non reconnue:', action);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action sur la notification:', error);
    }
  };



  const handleMenuOpen = (event, session) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedSession(session);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSession(null);
  };

  const handleExportSession = async () => {
    if (selectedSession) {
      await handleExportSessionData(selectedSession);
    }
    handleMenuClose();
  };

  const handleExportSessionData = async (session) => {
    try {
      const response = await sessionService.exportSessionToCSV(session.id);
      if (response.status === 'success') {
        // Créer et télécharger le fichier CSV
        const blob = new Blob([response.csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const handleDeleteSession = async () => {
    if (selectedSession) {
      try {
        await sessionService.deleteSession(selectedSession.id);
        setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
    handleMenuClose();
  };

  const formatDuration = (duration) => {
    if (typeof duration === 'string') return duration;
    if (duration < 60) return `${duration}min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const getSessionIcon = (session) => {
    if (session.status === 'active') return <MonitorIcon color="success" />;
    if (session.criticalAlerts > 0) return <ErrorIcon color="error" />;
    if (session.warningAlerts > 0) return <WarningIcon color="warning" />;
    return <HistoryIcon color="primary" />;
  };

  const getSessionSummary = (session) => {
    const parts = [];
    if (session.duration) parts.push(`${formatDuration(session.duration)}`);
    if (session.criticalAlerts > 0) parts.push(`${session.criticalAlerts} critique${session.criticalAlerts > 1 ? 's' : ''}`);
    if (session.warningAlerts > 0) parts.push(`${session.warningAlerts} alerte${session.warningAlerts > 1 ? 's' : ''}`);
    return parts.join(' • ');
  };

  const sessionUnreadCount = sessions.filter(s => !s.read).length;
  const iotAlertsCount = notificationState.notifications.filter(n => n.type === 'iot_alert').length;
  const totalUnreadCount = iotAlertsCount + sessionUnreadCount;

  return (
    <>
      {/* Bouton de notification */}
      <Tooltip title="Notifications et historique">
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={totalUnreadCount} color="error">
            {totalUnreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Drawer des notifications */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: '90vw'
          }
        }}
      >
        {/* En-tête avec onglets */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
            <Typography variant="h6" fontWeight="600">
              Centre de notifications
            </Typography>
            <IconButton onClick={handleDrawerClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab
              label={
                <Badge badgeContent={iotAlertsCount} color="error" sx={{ '& .MuiBadge-badge': { right: -10, top: 2 } }}>
                  Alertes
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={sessionUnreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: -10, top: 2 } }}>
                  Sessions
                </Badge>
              }
            />
          </Tabs>

          {/* Actions globales */}
          <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 1, flexWrap: 'wrap' }}>
            {activeTab === 0 && (
              <>
                {iotAlertsCount > 0 && (
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={() => {
                      // Supprimer toutes les alertes IoT
                      notificationState.notifications
                        .filter(n => n.type === 'iot_alert')
                        .forEach(n => globalNotificationService.removeNotification(n.id));
                    }}
                  >
                    Effacer toutes
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => globalMonitoringService.generateTestNotifications()}
                  sx={{ fontSize: '0.7rem' }}
                >
                  Générer alertes test
                </Button>
              </>
            )}
            {activeTab === 1 && (
              <Typography variant="body2" color="text.secondary">
                {sessions.length} session{sessions.length > 1 ? 's' : ''} enregistrée{sessions.length > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Contenu de l'onglet Alertes */}
          {activeTab === 0 && (
            <>
              {notificationState.notifications.filter(n => n.type === 'iot_alert').length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    Aucune notification
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Les alertes IoT apparaîtront ici
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {notificationState.notifications
                    .filter(notification => notification.type === 'iot_alert')
                    .map((notification) => (
                    <ListItem
                      key={notification.id}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: notification.read ? 'transparent' : `${notification.color}10`,
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: notification.color,
                            width: 32,
                            height: 32,
                            fontSize: '1rem'
                          }}
                        >
                          {notification.icon}
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight="600">
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip label="Nouveau" size="small" color="primary" sx={{ fontSize: '0.7rem' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.timestamp).toLocaleString('fr-FR')}
                            </Typography>
                            {notification.actions && (
                              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleNotificationAction(notification, action)}
                                    sx={{ fontSize: '0.7rem' }}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Pour les alertes IoT, supprimer complètement
                            if (notification.type === 'iot_alert') {
                              globalNotificationService.removeNotification(notification.id);
                            } else {
                              // Pour les autres types, marquer comme lu
                              globalNotificationService.markAsRead(notification.id);
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}

          {/* Contenu de l'onglet Sessions */}
          {activeTab === 1 && (
            <>
              {loading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">Chargement...</Typography>
                </Box>
          ) : sessions.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">
                Aucune session enregistrée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Démarrez un monitoring pour voir l'historique
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {sessions.map((session, index) => (
                <Box key={session.id}>
                  <ListItem
                    button
                    onClick={() => handleSessionClick(session)}
                    sx={{
                      py: 2,
                      backgroundColor: !session.read ? 'action.hover' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getSessionIcon(session)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            Session {session.id.slice(-8)}
                          </Typography>
                          {!session.read && (
                            <Chip
                              label="Nouveau"
                              size="small"
                              color="primary"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                          {session.status === 'active' && (
                            <Chip
                              label="Actif"
                              size="small"
                              color="success"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {getSessionSummary(session)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(session.startTime)}
                            </Typography>
                          </Box>
                          
                          {/* Moyennes des capteurs */}
                          {session.averages && Object.keys(session.averages).length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Object.entries(session.averages).slice(0, 3).map(([sensor, data]) => (
                                <Chip
                                  key={sensor}
                                  label={`${data.avg} ${data.unit}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, session)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < sessions.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
            </>
          )}
        </Box>

        {/* Actions en bas */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={loadSessions}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
      </Drawer>

      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExportSession}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteSession}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default NotificationBar;
