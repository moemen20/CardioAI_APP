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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Snackbar,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Emergency as EmergencyIcon,
  Sensors as SensorsIcon,
  Display as DisplayIcon,
  Tune as TuneIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';

function Settings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [preferences, setPreferences] = useState({
    alertSettings: {
      soundEnabled: true,
      visualAlerts: true,
      criticalOnly: false,
      emergencyCall: false,
      contactType: 'emergency',
      emergencyNumber: '15',
      contactName: 'SAMU'
    },
    sensors: {
      heartRate: { enabled: true },
      bloodPressure: { enabled: true },
      temperature: { enabled: true },
      oxygenSaturation: { enabled: true }
    },
    displaySettings: {
      darkMode: false,
      animations: true,
      compactMode: false,
      updateInterval: 1,
      chartDuration: 10
    },
    thresholds: {
      heartRate: { min: 60, max: 100 },
      temperature: { min: 36.0, max: 38.0 },
      bloodPressure: { min: 90, max: 140 },
      oxygenSaturation: { min: 95, max: 100 }
    }
  });

  // Charger les préférences
  useEffect(() => {
    const saved = localStorage.getItem('cardioai-preferences');
    if (saved) {
      try {
        const savedPrefs = JSON.parse(saved);
        setPreferences(prev => ({ ...prev, ...savedPrefs }));
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    }
  }, []);

  const handleAlertSettingChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      alertSettings: { ...prev.alertSettings, [setting]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSensorChange = (sensorId, enabled) => {
    setPreferences(prev => ({
      ...prev,
      sensors: { ...prev.sensors, [sensorId]: { ...prev.sensors[sensorId], enabled } }
    }));
    setHasUnsavedChanges(true);
  };

  const handleDisplaySettingChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      displaySettings: { ...prev.displaySettings, [setting]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleThresholdChange = (sensor, threshold, value) => {
    setPreferences(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [sensor]: { ...prev.thresholds[sensor], [threshold]: value }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      localStorage.setItem('cardioai-preferences', JSON.stringify(preferences));
      setHasUnsavedChanges(false);
      setSnackbar({
        open: true,
        message: 'Préférences sauvegardées avec succès',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem('cardioai-preferences');
    window.location.reload();
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SettingsIcon sx={{ fontSize: 48, opacity: 0.9 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              Paramètres
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Configurez votre expérience de monitoring médical personnalisée
          </Typography>
        </Paper>

        {/* Navigation par onglets */}
        <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<NotificationIcon />} label="Alertes" sx={{ textTransform: 'none' }} />
            <Tab icon={<EmergencyIcon />} label="Urgences" sx={{ textTransform: 'none' }} />
            <Tab icon={<SensorsIcon />} label="Capteurs" sx={{ textTransform: 'none' }} />
            <Tab icon={<DisplayIcon />} label="Affichage" sx={{ textTransform: 'none' }} />
            <Tab icon={<TuneIcon />} label="Seuils" sx={{ textTransform: 'none' }} />
          </Tabs>
        </Paper>

        {/* Contenu des onglets */}
        <Box sx={{ mt: 3 }}>
          {/* Onglet Alertes */}
          {currentTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader
                    avatar={<NotificationIcon color="primary" />}
                    title="Configuration des Alertes"
                    subheader="Paramètres de notification"
                  />
                  <CardContent>
                    <FormGroup sx={{ gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.alertSettings.soundEnabled}
                            onChange={(e) => handleAlertSettingChange('soundEnabled', e.target.checked)}
                          />
                        }
                        label="Sons d'alerte"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.alertSettings.visualAlerts}
                            onChange={(e) => handleAlertSettingChange('visualAlerts', e.target.checked)}
                          />
                        }
                        label="Alertes visuelles"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.alertSettings.criticalOnly}
                            onChange={(e) => handleAlertSettingChange('criticalOnly', e.target.checked)}
                          />
                        }
                        label="Alertes critiques uniquement"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Urgences */}
          {currentTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader
                    avatar={<EmergencyIcon color="error" />}
                    title="Configuration des Urgences"
                    subheader="Appels d'urgence automatiques"
                  />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.alertSettings.emergencyCall}
                          onChange={(e) => handleAlertSettingChange('emergencyCall', e.target.checked)}
                        />
                      }
                      label="Activer les appels d'urgence automatiques"
                      sx={{ mb: 3 }}
                    />

                    {preferences.alertSettings.emergencyCall && (
                      <Box>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                          ⚠️ Fonction d'urgence activée - Numéro: {preferences.alertSettings.emergencyNumber}
                        </Alert>

                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Numéro d'urgence"
                              value={preferences.alertSettings.emergencyNumber}
                              onChange={(e) => handleAlertSettingChange('emergencyNumber', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Nom du contact"
                              value={preferences.alertSettings.contactName}
                              onChange={(e) => handleAlertSettingChange('contactName', e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Capteurs */}
          {currentTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    avatar={<SensorsIcon color="primary" />}
                    title="Capteurs à Surveiller"
                    subheader="Activez/désactivez les capteurs médicaux"
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      {Object.entries(preferences.sensors).map(([sensorId, sensor]) => {
                        const sensorInfo = {
                          heartRate: { name: 'Rythme cardiaque', icon: '❤️' },
                          bloodPressure: { name: 'Tension artérielle', icon: '🩸' },
                          temperature: { name: 'Température corporelle', icon: '🌡️' },
                          oxygenSaturation: { name: 'Saturation en oxygène', icon: '🫁' }
                        };
                        const info = sensorInfo[sensorId];

                        return (
                          <Grid item xs={12} sm={6} key={sensorId}>
                            <Card variant="outlined" sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" fontWeight="600">
                                    {info.name}
                                  </Typography>
                                </Box>
                                <Switch
                                  checked={sensor.enabled}
                                  onChange={(e) => handleSensorChange(sensorId, e.target.checked)}
                                />
                              </Box>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Affichage */}
          {currentTab === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader
                    avatar={<DisplayIcon color="primary" />}
                    title="Paramètres d'Affichage"
                    subheader="Personnalisez l'interface"
                  />
                  <CardContent>
                    <FormGroup sx={{ gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.displaySettings.darkMode}
                            onChange={(e) => handleDisplaySettingChange('darkMode', e.target.checked)}
                          />
                        }
                        label="Mode sombre"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.displaySettings.animations}
                            onChange={(e) => handleDisplaySettingChange('animations', e.target.checked)}
                          />
                        }
                        label="Animations"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.displaySettings.compactMode}
                            onChange={(e) => handleDisplaySettingChange('compactMode', e.target.checked)}
                          />
                        }
                        label="Mode compact"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Onglet Seuils */}
          {currentTab === 4 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Seuils d'Alerte"
                    subheader="Configurez les valeurs limites pour les alertes"
                  />
                  <CardContent>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Typography gutterBottom>Rythme cardiaque (bpm)</Typography>
                        <Slider
                          value={[preferences.thresholds.heartRate.min, preferences.thresholds.heartRate.max]}
                          onChange={(e, value) => {
                            handleThresholdChange('heartRate', 'min', value[0]);
                            handleThresholdChange('heartRate', 'max', value[1]);
                          }}
                          valueLabelDisplay="auto"
                          min={40}
                          max={200}
                          marks={[
                            { value: 60, label: '60' },
                            { value: 100, label: '100' },
                            { value: 150, label: '150' }
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography gutterBottom>Température (°C)</Typography>
                        <Slider
                          value={[preferences.thresholds.temperature.min, preferences.thresholds.temperature.max]}
                          onChange={(e, value) => {
                            handleThresholdChange('temperature', 'min', value[0]);
                            handleThresholdChange('temperature', 'max', value[1]);
                          }}
                          valueLabelDisplay="auto"
                          min={35}
                          max={42}
                          step={0.1}
                          marks={[
                            { value: 36, label: '36°' },
                            { value: 37, label: '37°' },
                            { value: 38, label: '38°' }
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Boutons d'action */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              {hasUnsavedChanges ? (
                <Chip label="Modifications non sauvegardées" color="warning" />
              ) : (
                <Chip label="Tout est sauvegardé" color="success" />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={resetToDefaults}
                disabled={saving}
              >
                Réinitialiser
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={savePreferences}
                disabled={saving || !hasUnsavedChanges}
                sx={{
                  background: hasUnsavedChanges
                    ? 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)'
                    : 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)'
                }}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Settings;
