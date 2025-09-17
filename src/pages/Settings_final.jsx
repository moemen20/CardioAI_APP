import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormGroup,
  Grid,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Emergency as EmergencyIcon,
  Sensors as SensorsIcon,
  Display as DisplayIcon
} from '@mui/icons-material';

function Settings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    visualAlerts: true,
    emergencyCall: false,
    darkMode: false,
    heartRate: true,
    temperature: true,
    bloodPressure: true,
    oxygenSaturation: true
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('cardioai-settings', JSON.stringify(settings));
    alert('✅ Paramètres sauvegardés avec succès !');
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      p: 3
    }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon sx={{ fontSize: 48 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Paramètres
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
          Configuration de votre application CardioAI
        </Typography>
      </Paper>

      {/* Navigation */}
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<NotificationIcon />} label="Alertes" />
          <Tab icon={<EmergencyIcon />} label="Urgences" />
          <Tab icon={<SensorsIcon />} label="Capteurs" />
          <Tab icon={<DisplayIcon />} label="Affichage" />
        </Tabs>
      </Paper>

      {/* Contenu */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {currentTab === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>🔔 Configuration des Alertes</Typography>
              <FormGroup sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.soundEnabled}
                      onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                    />
                  }
                  label="Sons d'alerte"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.visualAlerts}
                      onChange={(e) => handleChange('visualAlerts', e.target.checked)}
                    />
                  }
                  label="Alertes visuelles"
                />
              </FormGroup>
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>🚨 Gestion des Urgences</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emergencyCall}
                    onChange={(e) => handleChange('emergencyCall', e.target.checked)}
                  />
                }
                label="Appels d'urgence automatiques"
                sx={{ mt: 3 }}
              />
              {settings.emergencyCall && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  ⚠️ Fonction d'urgence activée - Numéro: 15 (SAMU)
                </Alert>
              )}
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>🔌 Capteurs Médicaux</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.heartRate}
                          onChange={(e) => handleChange('heartRate', e.target.checked)}
                        />
                      }
                      label="❤️ Rythme cardiaque"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.temperature}
                          onChange={(e) => handleChange('temperature', e.target.checked)}
                        />
                      }
                      label="🌡️ Température"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.bloodPressure}
                          onChange={(e) => handleChange('bloodPressure', e.target.checked)}
                        />
                      }
                      label="🩸 Tension artérielle"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.oxygenSaturation}
                          onChange={(e) => handleChange('oxygenSaturation', e.target.checked)}
                        />
                      }
                      label="🫁 Saturation O₂"
                    />
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {currentTab === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>📊 Paramètres d'Affichage</Typography>
              <FormGroup sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleChange('darkMode', e.target.checked)}
                    />
                  }
                  label="Mode sombre"
                />
              </FormGroup>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={saveSettings}
          sx={{
            background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
            px: 4,
            py: 1.5
          }}
        >
          💾 Sauvegarder les Paramètres
        </Button>
      </Box>
    </Box>
  );
}

export default Settings;
