import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Container
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  Favorite as HeartIcon,
  Settings as SettingsIcon,
  Monitoring as MonitoringIcon
} from '@mui/icons-material';

function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête principal */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          mb: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 4
        }}
      >
        <HeartIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          CardioAI
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
          Intelligence Artificielle pour le Diagnostic Cardiaque
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
          Analysez vos données cardiaques en temps réel avec notre système de monitoring IoT 
          et obtenez un diagnostic précis grâce à notre modèle d'IA avancé.
        </Typography>
      </Paper>

      {/* Navigation principale */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <MonitoringIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Monitoring IoT
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Surveillez vos paramètres cardiaques en temps réel avec nos capteurs connectés.
              Interface moderne avec graphiques interactifs et alertes intelligentes.
            </Typography>
            <Button
              component={RouterLink}
              to="/iot-monitoring"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
                px: 4,
                py: 1.5
              }}
            >
              Accéder au Monitoring
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 4, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <HealthIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Diagnostic IA
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
              Analysez vos ECG et données cliniques avec notre modèle XResNet.
              Diagnostic précis et rapide basé sur l'intelligence artificielle.
            </Typography>
            <Button
              component={RouterLink}
              to="/mode-selection"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
                px: 4,
                py: 1.5
              }}
            >
              Commencer le Diagnostic
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Section Paramètres */}
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <SettingsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Personnalisez votre expérience avec nos paramètres avancés
        </Typography>
        <Button
          component={RouterLink}
          to="/settings"
          variant="outlined"
          size="large"
          startIcon={<SettingsIcon />}
        >
          Accéder aux Paramètres
        </Button>
      </Paper>

      {/* Informations supplémentaires */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          🚀 Application Fonctionnelle
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Toutes les fonctionnalités sont opérationnelles • Interface moderne et responsive
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
