import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Grid,
  Alert,
  Slider,
  TextField,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Emergency as EmergencyIcon,
  Sensors as SensorsIcon
} from '@mui/icons-material';

function SimpleSettings() {
  const [notifications, setNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [threshold, setThreshold] = useState(80);

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
          <SettingsIcon sx={{ mr: 2, fontSize: 40 }} />
          Paramètres
        </Typography>

        <Grid container spacing={3}>
          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<NotificationIcon color="primary" />}
                title="Notifications"
                subheader="Gérer les alertes et notifications"
              />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                      />
                    }
                    label="Notifications activées"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emergencyAlerts}
                        onChange={(e) => setEmergencyAlerts(e.target.checked)}
                      />
                    }
                    label="Alertes d'urgence"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          {/* Capteurs */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<SensorsIcon color="secondary" />}
                title="Capteurs IoT"
                subheader="Configuration des capteurs"
              />
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                      />
                    }
                    label="Sauvegarde automatique"
                  />
                </FormGroup>
                
                <Box sx={{ mt: 3 }}>
                  <Typography gutterBottom>
                    Seuil d'alerte: {threshold}%
                  </Typography>
                  <Slider
                    value={threshold}
                    onChange={(e, newValue) => setThreshold(newValue)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Urgence */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={<EmergencyIcon color="error" />}
                title="Paramètres d'urgence"
                subheader="Configuration des alertes critiques"
              />
              <CardContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Les paramètres d'urgence permettent de configurer les seuils critiques
                  pour déclencher des alertes automatiques.
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact d'urgence"
                      defaultValue="+33 1 23 45 67 89"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email d'urgence"
                      defaultValue="urgence@cardioai.com"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => alert('Paramètres sauvegardés !')}
              >
                Sauvegarder
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => alert('Paramètres réinitialisés !')}
              >
                Réinitialiser
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SimpleSettings;
