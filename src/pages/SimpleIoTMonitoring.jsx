import React, { useState, useEffect } from 'react';
import globalNotificationService from '../services/globalNotificationService';
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
          heartRate: Math.floor(Math.random() * 20) + 65, // 65-85
          bloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 15) + 70}`,
          temperature: (Math.random() * 2 + 36).toFixed(1), // 36-38
          oxygenSaturation: Math.floor(Math.random() * 5) + 95 // 95-100
        };

        setSensorData(newData);

        // Générer des notifications basées sur les seuils
        if (newData.heartRate > 100) {
          globalNotificationService.addNotification({
            type: 'warning',
            title: 'Fréquence cardiaque élevée',
            message: `BPM: ${newData.heartRate} - Seuil dépassé`,
            severity: 'warning'
          });
        }

        if (newData.temperature > 37.5) {
          globalNotificationService.addNotification({
            type: 'error',
            title: 'Température élevée',
            message: `${newData.temperature}°C - Fièvre détectée`,
            severity: 'error'
          });
        }

        if (newData.oxygenSaturation < 95) {
          globalNotificationService.addNotification({
            type: 'error',
            title: 'Saturation faible',
            message: `SpO2: ${newData.oxygenSaturation}% - Attention requise`,
            severity: 'error'
          });
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const handleToggleMonitoring = () => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);

    // Ajouter une notification
    globalNotificationService.addNotification({
      type: newState ? 'success' : 'info',
      title: newState ? 'Monitoring démarré' : 'Monitoring arrêté',
      message: newState ? 'Surveillance en temps réel activée' : 'Surveillance interrompue',
      severity: newState ? 'success' : 'info'
    });
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
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
    </Container>
  );
}

export default SimpleIoTMonitoring;
