import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import globalMonitoringService from '../services/globalMonitoringService';
import sessionService from '../services/sessionService';
import RealTimeChart from '../components/RealTimeChart';
import SimpleChart from '../components/SimpleChart';
import IoTAlerts from '../components/IoTAlerts';
import NotificationBar from '../components/NotificationBar';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  MonitorHeart as MonitorHeartIcon,
  Bloodtype as BloodtypeIcon,
  Thermostat as ThermostatIcon,
  FitnessCenter as FitnessCenterIcon,
  Air as RespiratoryIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';


function IoTMonitoring() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [systemStats, setSystemStats] = useState({
    connectedSensors: 0,
    totalSensors: 4,
    signalQuality: 'Inconnue',
    uptime: '00:00:00',
    batteryLevel: 0,
    lastUpdate: null
  });

  // État synchronisé avec le service global
  const [globalState, setGlobalState] = useState(globalMonitoringService.getState());

  // S'abonner aux changements du service global
  useEffect(() => {
    const unsubscribe = globalMonitoringService.addListener((newState) => {
      setGlobalState(newState);
    });

    // Charger les préférences
    loadUserPreferences();

    return unsubscribe;
  }, []);

  // Recharger les préférences quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      loadUserPreferences();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadUserPreferences = async () => {
    try {
      const response = await sessionService.getUserPreferences();
      if (response.status === 'success') {
        setPreferences(response.preferences);
        // Mettre à jour les préférences dans le service global
        await globalMonitoringService.loadPreferences();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  // Fonction pour calculer les statistiques du système
  const updateSystemStats = () => {
    const currentTime = new Date();
    const startTime = globalState.startTime ? new Date(globalState.startTime) : currentTime;
    const uptimeMs = currentTime - startTime;

    // Calculer l'uptime
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
    const uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Calculer le nombre de capteurs connectés
    const sensorData = globalState.sensorData || {};
    const connectedSensors = Object.keys(sensorData).filter(key => {
      const sensor = sensorData[key];
      return sensor && sensor.lastUpdate &&
             (currentTime - new Date(sensor.lastUpdate)) < 10000; // Connecté si mis à jour dans les 10 dernières secondes
    }).length;

    // Calculer la qualité du signal basée sur la fréquence des mises à jour
    let signalQuality = 'Inconnue';
    if (globalState.isMonitoring) {
      if (connectedSensors >= 3) {
        signalQuality = 'Excellente';
      } else if (connectedSensors >= 2) {
        signalQuality = 'Bonne';
      } else if (connectedSensors >= 1) {
        signalQuality = 'Faible';
      } else {
        signalQuality = 'Aucune';
      }
    }

    // Simuler le niveau de batterie (décroît lentement)
    const batteryLevel = Math.max(20, 100 - Math.floor(uptimeMs / (1000 * 60 * 2))); // -1% toutes les 2 minutes

    setSystemStats({
      connectedSensors,
      totalSensors: 4,
      signalQuality,
      uptime: globalState.isMonitoring ? uptime : '00:00:00',
      batteryLevel,
      lastUpdate: currentTime.toLocaleTimeString()
    });
  };

  // Mettre à jour les statistiques du système toutes les secondes
  useEffect(() => {
    updateSystemStats(); // Mise à jour initiale

    const interval = setInterval(() => {
      updateSystemStats();
    }, 1000);

    return () => clearInterval(interval);
  }, [globalState.isMonitoring, globalState.startTime, globalState.sensorData]);

  // Gestion du monitoring via le service global
  const handleMonitoringToggle = async () => {
    try {
      if (globalState.isMonitoring) {
        await globalMonitoringService.stopMonitoring();
      } else {
        await globalMonitoringService.startMonitoring();
      }
    } catch (error) {
      console.error('Erreur lors du toggle du monitoring:', error);
      setError(error);
    }
  };



  // Fonctions de détermination du statut
  const getHeartRateStatus = (value) => {
    if (value < 60) return 'low';
    if (value > 100) return 'high';
    return 'normal';
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic > 140 || diastolic > 90) return 'high';
    if (systolic < 90 || diastolic < 60) return 'low';
    return 'normal';
  };

  const getTemperatureStatus = (value) => {
    if (value > 37.5) return 'high';
    if (value < 36) return 'low';
    return 'normal';
  };

  const getOxygenStatus = (value) => {
    if (value < 95) return 'low';
    return 'normal';
  };

  // Configuration des couleurs selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return theme.palette.success.main;
      case 'high': return theme.palette.error.main;
      case 'low': return theme.palette.warning.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'high': return 'Élevé';
      case 'low': return 'Bas';
      default: return 'Inconnu';
    }
  };



  // Configuration complète des capteurs
  const allSensorConfigs = {
    heartRate: {
      id: 'heartRate',
      title: 'Rythme Cardiaque',
      icon: MonitorHeartIcon,
      hasChart: true,
      color: theme.palette.error.main,
      getValue: (data) => Math.round(data.heartRate?.value || 0),
      getUnit: (data) => data.heartRate?.unit || 'bpm',
      getStatus: (data) => data.heartRate?.status || 'normal',
      getChartData: (data) => data.heartRate?.history || []
    },
    bloodPressure: {
      id: 'bloodPressure',
      title: 'Tension Artérielle',
      icon: BloodtypeIcon,
      hasChart: false,
      color: theme.palette.primary.main,
      getValue: (data) => `${Math.round(data.bloodPressure?.systolic || 0)}/${Math.round(data.bloodPressure?.diastolic || 0)}`,
      getUnit: (data) => data.bloodPressure?.unit || 'mmHg',
      getStatus: (data) => data.bloodPressure?.status || 'normal',
      getChartData: (data) => []
    },
    temperature: {
      id: 'temperature',
      title: 'Température',
      icon: ThermostatIcon,
      hasChart: true,
      color: theme.palette.warning.main,
      getValue: (data) => (data.temperature?.value || 0).toFixed(1),
      getUnit: (data) => data.temperature?.unit || '°C',
      getStatus: (data) => data.temperature?.status || 'normal',
      getChartData: (data) => data.temperature?.history || []
    },
    oxygenSaturation: {
      id: 'oxygenSaturation',
      title: 'Saturation O₂',
      icon: FitnessCenterIcon,
      hasChart: false,
      color: theme.palette.secondary.main,
      getValue: (data) => Math.round(data.oxygenSaturation?.value || 0),
      getUnit: (data) => data.oxygenSaturation?.unit || '%',
      getStatus: (data) => data.oxygenSaturation?.status || 'normal',
      getChartData: (data) => []
    },
    respiratoryRate: {
      id: 'respiratoryRate',
      title: 'Fréquence Respiratoire',
      icon: RespiratoryIcon,
      hasChart: true,
      color: theme.palette.info.main,
      getValue: (data) => Math.round(data.respiratoryRate?.value || 0),
      getUnit: (data) => data.respiratoryRate?.unit || 'rpm',
      getStatus: (data) => data.respiratoryRate?.status || 'normal',
      getChartData: (data) => data.respiratoryRate?.history || []
    }
  };

  // Générer les cartes des capteurs selon les préférences
  const sensorCards = Object.keys(allSensorConfigs)
    .filter(sensorId => {
      // Afficher le capteur s'il est activé dans les préférences ou si les préférences ne sont pas encore chargées
      return !preferences?.enabledSensors || preferences.enabledSensors[sensorId];
    })
    .map(sensorId => {
      const config = allSensorConfigs[sensorId];
      return {
        ...config,
        value: config.getValue(globalState.sensorData),
        unit: config.getUnit(globalState.sensorData),
        status: config.getStatus(globalState.sensorData),
        chartData: config.getChartData(globalState.sensorData)
      };
    });

  // Gestion d'erreur globale
  if (error) {
    return (
      <Box sx={{
        width: '100vw',
        minHeight: '100vh',
        px: 2,
        py: 4,
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Erreur de l'application
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error.message || 'Une erreur inattendue s\'est produite'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            Recharger la page
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 1, sm: 2 },
      backgroundColor: 'background.default',
      overflow: 'hidden'
    }}>
      {/* En-tête */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography
          variant={{ xs: "h4", md: "h3" }}
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2
          }}
        >
          <MonitorHeartIcon
            className="heartbeat"
            sx={{ fontSize: { xs: 36, md: 48 }, color: theme.palette.primary.main }}
          />
          Monitoring IoT
        </Typography>
        <Typography
          variant={{ xs: "body1", md: "h6" }}
          color="text.secondary"
          gutterBottom
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          Surveillance en temps réel de vos paramètres vitaux
        </Typography>
        
        {/* Contrôles */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          mt: 2,
          flexWrap: 'wrap'
        }}>
          <Button
            variant="contained"
            size="large"
            startIcon={globalState.isMonitoring ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleMonitoringToggle}
            sx={{
              background: globalState.isMonitoring ?
                'linear-gradient(45deg, #f44336 30%, #ff5722 90%)' :
                'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
              px: 3
            }}
          >
            {globalState.isMonitoring ? 'Arrêter' : 'Démarrer'} le monitoring
          </Button>
          
          <Tooltip title="Actualiser les préférences">
            <IconButton
              color="primary"
              size="large"
              onClick={loadUserPreferences}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Paramètres">
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/settings')}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <NotificationBar />

          <Chip
            label={globalState.isMonitoring ? 'En ligne' : 'Hors ligne'}
            color={globalState.isMonitoring ? 'success' : 'default'}
            variant="outlined"
            sx={{ ml: 'auto' }}
          />
        </Box>

        {/* Barre de progression si monitoring actif */}
        {globalState.isMonitoring && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Dernière mise à jour: {globalState.lastUpdate.toLocaleTimeString()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Alertes IoT */}
      <IoTAlerts
        alerts={globalState.alerts}
        onAlertRead={async (alertId) => {
          try {
            await globalMonitoringService.markAlertAsRead(alertId);
          } catch (error) {
            console.error('Erreur lors du marquage de l\'alerte:', error);
          }
        }}
        showNotifications={globalState.isMonitoring}
      />

      {/* Cartes des capteurs */}
      {sensorCards.length === 0 ? (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          width: '100%'
        }}>
          <SettingsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucun capteur activé
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Activez des capteurs dans les paramètres pour commencer le monitoring
          </Typography>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/settings')}
            sx={{
              background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
              px: 4
            }}
          >
            Configurer les capteurs
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sensorCards.map((sensor) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={sensor.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* En-tête de la carte */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${sensor.color}15`,
                      mr: 2
                    }}
                  >
                    <sensor.icon sx={{ fontSize: 24, color: sensor.color }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {sensor.title}
                    </Typography>
                    <Chip
                      label={getStatusText(sensor.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(sensor.status)}15`,
                        color: getStatusColor(sensor.status),
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>

                {/* Valeur principale */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: sensor.color,
                    mb: 1
                  }}
                >
                  {sensor.value}
                  <Typography
                    component="span"
                    variant="h6"
                    sx={{ ml: 1, color: 'text.secondary' }}
                  >
                    {sensor.unit}
                  </Typography>
                </Typography>

                {/* Graphique si disponible */}
                {sensor.hasChart && (
                  <Box sx={{ mt: 2 }}>
                    <RealTimeChart
                      data={sensor.chartData || []}
                      title={sensor.title}
                      color={sensor.color}
                      unit={sensor.unit}
                      height={100}
                      showGrid={false}
                      animated={globalState.isMonitoring}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}

      {/* Section d'informations */}
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)'
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom>
          État du système IoT
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>🔌</span>
              Capteurs connectés
            </Typography>
            <Typography
              variant="h6"
              color={systemStats.connectedSensors === systemStats.totalSensors ? "success.main" :
                     systemStats.connectedSensors > 0 ? "warning.main" : "error.main"}
            >
              {systemStats.connectedSensors}/{systemStats.totalSensors}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>📶</span>
              Qualité du signal
            </Typography>
            <Typography
              variant="h6"
              color={systemStats.signalQuality === 'Excellente' ? "success.main" :
                     systemStats.signalQuality === 'Bonne' ? "warning.main" :
                     systemStats.signalQuality === 'Faible' ? "orange" : "error.main"}
            >
              {systemStats.signalQuality}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>⏱️</span>
              Temps de fonctionnement
            </Typography>
            <Typography variant="h6">
              {systemStats.uptime}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Typography variant="body2" color="text.secondary">
              Niveau de batterie
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                color={systemStats.batteryLevel > 50 ? "success.main" :
                       systemStats.batteryLevel > 20 ? "warning.main" : "error.main"}
              >
                {systemStats.batteryLevel}%
              </Typography>
              <span style={{ fontSize: '1.2rem' }}>
                {systemStats.batteryLevel > 75 ? '🔋' :
                 systemStats.batteryLevel > 50 ? '🔋' :
                 systemStats.batteryLevel > 25 ? '🪫' : '🪫'}
              </span>
            </Box>
            <LinearProgress
              variant="determinate"
              value={systemStats.batteryLevel}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: systemStats.batteryLevel > 50 ? 'success.main' :
                                   systemStats.batteryLevel > 20 ? 'warning.main' : 'error.main'
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Indicateur de dernière mise à jour */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: 'block', textAlign: 'center' }}
        >
          Dernière mise à jour: {systemStats.lastUpdate}
        </Typography>
      </Paper>
    </Box>
  );
}

export default IoTMonitoring;
