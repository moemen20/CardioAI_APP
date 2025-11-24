import React, { useState, useEffect } from 'react';
import globalNotificationService from '../services/globalNotificationService';
import sessionHistoryService from '../services/sessionHistoryService';
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
  Alert
} from '@mui/material';
import {
  MonitorHeart as MonitorHeartIcon,
  Bloodtype as BloodtypeIcon,
  Thermostat as ThermostatIcon,
  FitnessCenter as FitnessCenterIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

function SimpleIoTMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensorData, setSensorData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 36.5,
    oxygenSaturation: 98
  });

  // Simulation de données en temps réel
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const newData = {
          heartRate: Math.floor(Math.random() * 50) + 70, // 70-120 BPM (plus de chances de dépasser 100)
          bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 25) + 70}`,
          temperature: (Math.random() * 3 + 36).toFixed(1), // 36-39°C (plus de chances de dépasser 37.5)
          oxygenSaturation: Math.floor(Math.random() * 10) + 90 // 90-100% (plus de chances d'être < 95)
        };

        setSensorData(newData);

        // Enregistrer les données dans la session courante
        sessionHistoryService.addDataPoint(newData);

        // Générer des notifications basées sur les seuils
        if (newData.heartRate > 100) {
          const alert = {
            type: 'warning',
            title: '⚠️ Fréquence cardiaque élevée',
            message: `${newData.heartRate} BPM - Seuil normal dépassé (>100)`,
            severity: 'warning',
            sensor: 'heartRate',
            value: newData.heartRate,
            threshold: 100
          };

          globalNotificationService.addNotification(alert);
          sessionHistoryService.addAlert(alert);
        }

        if (newData.heartRate < 60) {
          const alert = {
            type: 'warning',
            title: '⚠️ Fréquence cardiaque faible',
            message: `${newData.heartRate} BPM - Bradycardie détectée (<60)`,
            severity: 'warning',
            sensor: 'heartRate',
            value: newData.heartRate,
            threshold: 60
          };

          globalNotificationService.addNotification(alert);
          sessionHistoryService.addAlert(alert);
        }

        if (newData.temperature > 37.5) {
          const alert = {
            type: 'error',
            title: '🌡️ Température élevée',
            message: `${newData.temperature}°C - Fièvre détectée (>37.5°C)`,
            severity: 'error',
            sensor: 'temperature',
            value: parseFloat(newData.temperature),
            threshold: 37.5
          };

          globalNotificationService.addNotification(alert);
          sessionHistoryService.addAlert(alert);
        }

        if (newData.oxygenSaturation < 95) {
          const alert = {
            type: 'error',
            title: '🫁 Saturation faible',
            message: `SpO2: ${newData.oxygenSaturation}% - Hypoxémie (<95%)`,
            severity: 'error',
            sensor: 'oxygenSaturation',
            value: newData.oxygenSaturation,
            threshold: 95
          };

          globalNotificationService.addNotification(alert);
          sessionHistoryService.addAlert(alert);
        }

        // Alertes pour la pression artérielle
        const bpParts = newData.bloodPressure.split('/');
        const systolic = parseInt(bpParts[0]);
        const diastolic = parseInt(bpParts[1]);

        if (systolic > 140 || diastolic > 90) {
          const alert = {
            type: 'warning',
            title: '🩸 Hypertension détectée',
            message: `${newData.bloodPressure} mmHg - Pression élevée`,
            severity: 'warning',
            sensor: 'bloodPressure',
            value: `${systolic}/${diastolic}`,
            threshold: '140/90'
          };

          globalNotificationService.addNotification(alert);
          sessionHistoryService.addAlert(alert);
        }
      }, 3000); // Toutes les 3 secondes pour plus de notifications

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const handleToggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);

    if (newState) {
      // Démarrer une nouvelle session
      const sessionId = sessionHistoryService.startSession();
      console.log('Session démarrée:', sessionId);

      // Ajouter une notification
      globalNotificationService.addNotification({
        type: 'success',
        title: '📊 Monitoring démarré',
        message: 'Surveillance en temps réel activée - Session enregistrée',
        severity: 'success'
      });
    } else {
      // Terminer la session courante
      const completedSession = sessionHistoryService.endSession();
      if (completedSession) {
        console.log('Session terminée:', completedSession.id);

        // Ajouter une notification avec résumé
        globalNotificationService.addNotification({
          type: 'info',
          title: '📊 Session sauvegardée',
          message: `Durée: ${Math.floor(completedSession.duration / 60)}min - ${completedSession.summary.totalReadings} mesures`,
          severity: 'info'
        });
      }
    }
  };

  const getSensorStatus = (value, type) => {
    switch (type) {
      case 'heartRate':
        return value > 100 ? 'error' : value > 85 ? 'warning' : 'success';
      case 'temperature':
        return value > 37.5 ? 'error' : value > 37 ? 'warning' : 'success';
      case 'oxygenSaturation':
        return value < 95 ? 'error' : value < 98 ? 'warning' : 'success';
      default:
        return 'success';
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, maxWidth: 'none' }}>
      <Box sx={{ py: 2, px: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <MonitorHeartIcon sx={{ mr: 2, fontSize: 40 }} />
          Monitoring IoT
        </Typography>

        {/* Contrôles */}
        <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color={isMonitoring ? "error" : "primary"}
            size="large"
            startIcon={isMonitoring ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleToggleMonitoring}
            sx={{ mr: 2 }}
          >
            {isMonitoring ? 'Arrêter' : 'Démarrer'} le monitoring
          </Button>
          
          <Chip
            label={isMonitoring ? 'En cours' : 'Arrêté'}
            color={isMonitoring ? 'success' : 'default'}
            variant="outlined"
          />
        </Paper>

        {/* État du système */}
        <Alert severity={isMonitoring ? "success" : "info"} sx={{ mb: 4 }}>
          {isMonitoring 
            ? "Monitoring actif - Les données sont collectées en temps réel"
            : "Monitoring inactif - Cliquez sur 'Démarrer' pour commencer la surveillance"
          }
        </Alert>

        {/* Données des capteurs */}
        <Grid container spacing={3}>
          {/* Fréquence cardiaque */}
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MonitorHeartIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: getSensorStatus(sensorData.heartRate, 'heartRate') === 'error' ? 'error.main' : 'primary.main',
                    mb: 2 
                  }} 
                />
                <Typography variant="h4" component="div" gutterBottom>
                  {sensorData.heartRate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  BPM
                </Typography>
                <Chip
                  label={getSensorStatus(sensorData.heartRate, 'heartRate') === 'success' ? 'Normal' : 'Élevé'}
                  color={getSensorStatus(sensorData.heartRate, 'heartRate')}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Pression artérielle */}
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BloodtypeIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {sensorData.bloodPressure}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  mmHg
                </Typography>
                <Chip
                  label="Normal"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Température */}
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ThermostatIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: getSensorStatus(sensorData.temperature, 'temperature') === 'error' ? 'error.main' : 'info.main',
                    mb: 2 
                  }} 
                />
                <Typography variant="h4" component="div" gutterBottom>
                  {sensorData.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Température
                </Typography>
                <Chip
                  label={getSensorStatus(sensorData.temperature, 'temperature') === 'success' ? 'Normal' : 'Élevé'}
                  color={getSensorStatus(sensorData.temperature, 'temperature')}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Saturation en oxygène */}
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <FitnessCenterIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" component="div" gutterBottom>
                  {sensorData.oxygenSaturation}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SpO2
                </Typography>
                <Chip
                  label={getSensorStatus(sensorData.oxygenSaturation, 'oxygenSaturation') === 'success' ? 'Normal' : 'Bas'}
                  color={getSensorStatus(sensorData.oxygenSaturation, 'oxygenSaturation')}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graphique simulé */}
        {isMonitoring && (
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tendance de la fréquence cardiaque
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(sensorData.heartRate / 100) * 100} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default SimpleIoTMonitoring;
