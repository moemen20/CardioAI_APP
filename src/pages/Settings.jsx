import React, { useState } from 'react';

// Ajout des styles CSS pour les animations
const styles = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Tabs,
  Tab,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Grid,
  Alert,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Snackbar
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

  // État des préférences
  const [preferences, setPreferences] = useState({
    alertSettings: {
      soundEnabled: true,
      visualAlerts: true,
      criticalOnly: false,
      emergencyCall: false,
      contactType: 'emergency',
      emergencyNumber: '15',
      contactName: 'SAMU',
      emergencyAddress: ''
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
      chartDuration: 10,
      showGrid: true,
      smoothCurves: true
    },
    thresholds: {
      heartRate: { min: 60, max: 100 },
      temperature: { min: 36.0, max: 38.0 },
      bloodPressure: { min: 90, max: 140 },
      oxygenSaturation: { min: 95, max: 100 }
    },
    advanced: {
      debugMode: false,
      autoSave: true,
      telemetry: false
    }
  });

  // Charger les préférences depuis localStorage au démarrage
  React.useEffect(() => {
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

  // Fonctions de gestion des changements
  const handleAlertSettingChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      alertSettings: {
        ...prev.alertSettings,
        [setting]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSensorChange = (sensorId, enabled) => {
    setPreferences(prev => ({
      ...prev,
      sensors: {
        ...prev.sensors,
        [sensorId]: { ...prev.sensors[sensorId], enabled }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleDisplaySettingChange = (setting, value) => {
    setPreferences(prev => ({
      ...prev,
      displaySettings: {
        ...prev.displaySettings,
        [setting]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleThresholdChange = (sensor, threshold, value) => {
    setPreferences(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [sensor]: {
          ...prev.thresholds[sensor],
          [threshold]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Sauvegarde des préférences
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
      console.error('Erreur lors de la sauvegarde:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Réinitialisation
  const resetToDefaults = () => {
    localStorage.removeItem('cardioai-preferences');
    window.location.reload();
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'background.default',
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 2, sm: 3 }
    }}>
      {/* En-tête moderne */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SettingsIcon sx={{ fontSize: { xs: 40, md: 48 }, opacity: 0.9 }} />
          <Typography
            variant={{ xs: "h4", md: "h3" }}
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            Paramètres
          </Typography>
        </Box>
        <Typography variant={{ xs: "body1", md: "h6" }} sx={{ opacity: 0.9 }}>
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
          <Tab
            icon={<NotificationIcon />}
            label="Alertes"
            sx={{ minHeight: 72, textTransform: 'none' }}
          />
          <Tab
            icon={<EmergencyIcon />}
            label="Urgences"
            sx={{ minHeight: 72, textTransform: 'none' }}
          />
          <Tab
            icon={<SensorsIcon />}
            label="Capteurs"
            sx={{ minHeight: 72, textTransform: 'none' }}
          />
          <Tab
            icon={<DisplayIcon />}
            label="Affichage"
            sx={{ minHeight: 72, textTransform: 'none' }}
          />
          <Tab
            icon={<TuneIcon />}
            label="Avancé"
            sx={{ minHeight: 72, textTransform: 'none' }}
          />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      <Box sx={{ mt: 3 }}>
        {currentTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  avatar={<NotificationIcon color="primary" />}
                  title="Configuration des Alertes"
                  subheader="Paramètres de notification et seuils"
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

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Seuils d'Alerte"
                  subheader="Configurez les valeurs limites"
                />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Rythme cardiaque (bpm)</Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={[
                          preferences.thresholds.heartRate.min,
                          preferences.thresholds.heartRate.max
                        ]}
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
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Température (°C)</Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={[
                          preferences.thresholds.temperature.min,
                          preferences.thresholds.temperature.max
                        ]}
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
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {currentTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader
                  avatar={<EmergencyIcon color="error" />}
                  title="Configuration des Urgences"
                  subheader="Paramètres d'appels d'urgence automatiques"
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
                        <Typography variant="body2" fontWeight="600" gutterBottom>
                          ⚠️ Fonction d'urgence activée
                        </Typography>
                        <Typography variant="body2">
                          En cas d'alerte critique, le système tentera automatiquement de contacter les services d'urgence.
                        </Typography>
                      </Alert>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Type de contact</InputLabel>
                            <Select
                              value={preferences.alertSettings.contactType}
                              onChange={(e) => handleAlertSettingChange('contactType', e.target.value)}
                            >
                              <MenuItem value="emergency">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>🚨</span>
                                  Services d'urgence (15, 18, 112)
                                </Box>
                              </MenuItem>
                              <MenuItem value="personal">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>👤</span>
                                  Personne de confiance
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Numéro d'urgence"
                            value={preferences.alertSettings.emergencyNumber}
                            onChange={(e) => handleAlertSettingChange('emergencyNumber', e.target.value)}
                            placeholder={preferences.alertSettings.contactType === 'emergency' ? '15' : '+33 6 12 34 56 78'}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Nom du contact"
                            value={preferences.alertSettings.contactName}
                            onChange={(e) => handleAlertSettingChange('contactName', e.target.value)}
                            placeholder={preferences.alertSettings.contactType === 'emergency' ? 'SAMU' : 'Dr. Martin'}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Adresse d'urgence"
                            value={preferences.alertSettings.emergencyAddress}
                            onChange={(e) => handleAlertSettingChange('emergencyAddress', e.target.value)}
                            placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
                            multiline
                            rows={2}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: 'Test du système d\'urgence - Fonction simulée',
                                severity: 'info'
                              });
                            }}
                            fullWidth
                          >
                            🧪 Tester le système d'urgence
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  ⚠️ Important
                </Typography>
                <Typography variant="caption">
                  Les appels d'urgence automatiques sont une aide mais ne remplacent pas votre jugement.
                  En cas d'urgence vitale, contactez immédiatement le 15 (SAMU).
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )}
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
                        heartRate: { name: 'Rythme cardiaque', icon: '❤️', unit: 'bpm', description: 'Surveillance du rythme cardiaque' },
                        bloodPressure: { name: 'Tension artérielle', icon: '🩸', unit: 'mmHg', description: 'Mesure de la pression sanguine' },
                        temperature: { name: 'Température corporelle', icon: '🌡️', unit: '°C', description: 'Température du corps' },
                        oxygenSaturation: { name: 'Saturation en oxygène', icon: '🫁', unit: '%', description: 'Niveau d\'oxygène dans le sang' }
                      };
                      const info = sensorInfo[sensorId];

                      return (
                        <Grid item xs={12} sm={6} key={sensorId}>
                          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {info.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {info.description} • {info.unit}
                                </Typography>
                              </Box>
                              <Switch
                                checked={sensor.enabled}
                                onChange={(e) => handleSensorChange(sensorId, e.target.checked)}
                                color="primary"
                              />
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Alert severity="info">
                    <Typography variant="body2" fontWeight="600" gutterBottom>
                      💡 Conseil
                    </Typography>
                    <Typography variant="body2">
                      Activez uniquement les capteurs dont vous disposez pour éviter les fausses alertes.
                      Vous pouvez connecter de vrais capteurs via Bluetooth ou utiliser les capteurs Web de votre appareil.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
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

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Fréquence de mise à jour (secondes)</Typography>
                    <Slider
                      value={preferences.displaySettings.updateInterval}
                      onChange={(e, value) => handleDisplaySettingChange('updateInterval', value)}
                      min={0.5}
                      max={5}
                      step={0.5}
                      marks={[
                        { value: 0.5, label: '0.5s' },
                        { value: 1, label: '1s' },
                        { value: 2, label: '2s' },
                        { value: 5, label: '5s' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Graphiques"
                  subheader="Configuration des graphiques"
                />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Durée d'affichage (minutes)</Typography>
                    <Slider
                      value={preferences.displaySettings.chartDuration}
                      onChange={(e, value) => handleDisplaySettingChange('chartDuration', value)}
                      min={1}
                      max={60}
                      marks={[
                        { value: 1, label: '1min' },
                        { value: 10, label: '10min' },
                        { value: 30, label: '30min' },
                        { value: 60, label: '1h' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.displaySettings.showGrid}
                          onChange={(e) => handleDisplaySettingChange('showGrid', e.target.checked)}
                        />
                      }
                      label="Afficher la grille"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.displaySettings.smoothCurves}
                          onChange={(e) => handleDisplaySettingChange('smoothCurves', e.target.checked)}
                        />
                      }
                      label="Courbes lissées"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {currentTab === 4 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  avatar={<TuneIcon color="primary" />}
                  title="Paramètres Avancés"
                  subheader="Configuration technique"
                />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Ces paramètres sont destinés aux utilisateurs avancés.
                    </Typography>
                  </Alert>

                  <FormGroup sx={{ gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.advanced.debugMode}
                          onChange={(e) => handleDisplaySettingChange('debugMode', e.target.checked)}
                        />
                      }
                      label="Mode debug"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.advanced.autoSave}
                          onChange={(e) => handleDisplaySettingChange('autoSave', e.target.checked)}
                        />
                      }
                      label="Sauvegarde automatique"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.advanced.telemetry}
                          onChange={(e) => handleDisplaySettingChange('telemetry', e.target.checked)}
                        />
                      }
                      label="Télémétrie anonyme"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Données et Sauvegarde"
                  subheader="Gestion des données"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          const data = JSON.stringify(preferences, null, 2);
                          const blob = new Blob([data], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'cardioai-settings.json';
                          a.click();
                        }}
                      >
                        📥 Exporter les paramètres
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="warning"
                        fullWidth
                        onClick={resetToDefaults}
                      >
                        🔄 Réinitialiser tout
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="body2" color="text.secondary">
                    Version de l'application: 1.0.0<br />
                    Dernière sauvegarde: {new Date().toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Boutons d'action */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasUnsavedChanges && (
              <Chip
                label="Modifications non sauvegardées"
                color="warning"
                size="small"
                sx={{ animation: 'pulse 2s infinite' }}
              />
            )}
            {!hasUnsavedChanges && (
              <Chip
                label="Tout est sauvegardé"
                color="success"
                size="small"
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={resetToDefaults}
              disabled={saving}
              size="large"
            >
              Réinitialiser
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={savePreferences}
              disabled={saving || !hasUnsavedChanges}
              size="large"
              sx={{
                background: hasUnsavedChanges
                  ? 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)'
                  : 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                px: 4,
                '&:disabled': {
                  background: 'grey.300'
                }
              }}
            >
              {saving ? 'Sauvegarde...' : hasUnsavedChanges ? 'Sauvegarder les modifications' : 'Sauvegardé'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
