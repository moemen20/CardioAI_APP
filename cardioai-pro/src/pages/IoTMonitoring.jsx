import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Chip,
  Button,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Favorite as HeartIcon,
  Thermostat as TempIcon,
  Bloodtype as BloodIcon,
  Air as AirIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

function IoTMonitoring() {
  const [sensorData, setSensorData] = useState({
    heartRate: { value: 72, status: 'normal', unit: 'bpm' },
    temperature: { value: 36.8, status: 'normal', unit: '°C' },
    bloodPressure: { value: '120/80', status: 'normal', unit: 'mmHg' },
    oxygenSaturation: { value: 98, status: 'normal', unit: '%' }
  });

  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulation des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulation de nouvelles données
      const newHeartRate = 70 + Math.random() * 10;
      const newTemp = 36.5 + Math.random() * 0.8;
      const newOxygen = 96 + Math.random() * 3;
      
      setSensorData(prev => ({
        ...prev,
        heartRate: { 
          value: Math.round(newHeartRate), 
          status: newHeartRate > 100 ? 'warning' : 'normal',
          unit: 'bpm'
        },
        temperature: { 
          value: Math.round(newTemp * 10) / 10, 
          status: newTemp > 37.5 ? 'warning' : 'normal',
          unit: '°C'
        },
        oxygenSaturation: { 
          value: Math.round(newOxygen), 
          status: newOxygen < 95 ? 'warning' : 'normal',
          unit: '%'
        }
      }));

      // Ajouter au graphique
      const now = new Date();
      setChartData(prev => {
        const newData = [...prev, {
          time: now.toLocaleTimeString(),
          heartRate: Math.round(newHeartRate),
          temperature: Math.round(newTemp * 10) / 10,
          oxygen: Math.round(newOxygen)
        }];
        return newData.slice(-20); // Garder seulement les 20 derniers points
      });

      setLastUpdate(now);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'heartRate': return HeartIcon;
      case 'temperature': return TempIcon;
      case 'bloodPressure': return BloodIcon;
      case 'oxygenSaturation': return AirIcon;
      default: return HeartIcon;
    }
  };

  const getSensorColor = (status) => {
    switch (status) {
      case 'normal': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#4caf50';
    }
  };

  const getSensorName = (type) => {
    const names = {
      heartRate: 'Rythme Cardiaque',
      temperature: 'Température',
      bloodPressure: 'Tension Artérielle',
      oxygenSaturation: 'Saturation O₂'
    };
    return names[type] || type;
  };

  const renderSensorCard = (type, data) => {
    const IconComponent = getSensorIcon(type);
    const color = getSensorColor(data.status);
    
    return (
      <Grid item xs={12} sm={6} md={3} key={type}>
        <Card
          sx={{
            height: '100%',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
            }
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <IconComponent sx={{ fontSize: 32, color }} />
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {getSensorName(type)}
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color,
                mb: 1
              }}
            >
              {data.value}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {data.unit}
            </Typography>
            
            <Chip
              label={data.status === 'normal' ? 'Normal' : 'Attention'}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: `${color}15`,
                color,
                fontWeight: 600
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* En-tête */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Monitoring IoT
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Surveillance en temps réel de vos paramètres cardiaques
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={isConnected ? <TrendingUpIcon /> : <WarningIcon />}
                label={isConnected ? 'Connecté' : 'Déconnecté'}
                sx={{
                  backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Tooltip title="Actualiser">
                <IconButton sx={{ color: 'white' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Paramètres">
                <IconButton sx={{ color: 'white' }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Statut de connexion */}
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2" fontWeight="600">
              Connexion aux capteurs interrompue
            </Typography>
            <Typography variant="body2">
              Vérifiez que vos capteurs sont allumés et à portée. Tentative de reconnexion automatique...
            </Typography>
          </Alert>
        )}

        {/* Cartes des capteurs */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(sensorData).map(([type, data]) => renderSensorCard(type, data))}
        </Grid>

        {/* Graphiques */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title="Évolution en Temps Réel"
                subheader={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`}
                action={
                  <Button variant="outlined" size="small" startIcon={<TrendingUpIcon />}>
                    Exporter
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#f44336"
                        strokeWidth={2}
                        name="Rythme cardiaque (bpm)"
                      />
                      <Line
                        type="monotone"
                        dataKey="oxygen"
                        stroke="#2196f3"
                        strokeWidth={2}
                        name="Saturation O₂ (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Alertes récentes */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Alertes Récentes" />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                        <Typography variant="body2" fontWeight="600">
                          15:30 - Rythme cardiaque normal
                        </Typography>
                        <Typography variant="caption">
                          Retour à la normale après exercice
                        </Typography>
                      </Alert>
                      <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                        <Typography variant="body2" fontWeight="600">
                          14:15 - Capteurs connectés
                        </Typography>
                        <Typography variant="caption">
                          Tous les capteurs fonctionnent correctement
                        </Typography>
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Statistiques */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Statistiques du Jour" />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Rythme cardiaque moyen
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          74 bpm
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Température moyenne
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          36.7°C
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={85}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default IoTMonitoring;
