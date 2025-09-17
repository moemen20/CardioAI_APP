import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Paper
} from '@mui/material';
import {
  MonitorHeart as MonitorHeartIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Sensors as SensorsIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

function ModeSelection() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const modes = [
    {
      id: 'iot-monitoring',
      title: 'Monitoring IoT',
      subtitle: 'Surveillance en temps réel',
      description: 'Surveillez vos paramètres cardiaques en temps réel grâce à nos capteurs IoT connectés.',
      icon: SensorsIcon,
      color: '#00bcd4',
      features: [
        'Mesure en temps réel',
        'Alertes automatiques',
        'Historique des données',
        'Graphiques interactifs'
      ],
      route: '/iot-monitoring'
    },
    {
      id: 'diagnostic-prediction',
      title: 'Diagnostic IA',
      subtitle: 'Prédiction intelligente',
      description: 'Utilisez notre modèle d\'IA avancé pour analyser vos données cardiaques et obtenir un diagnostic précis.',
      icon: PsychologyIcon,
      color: '#3f51b5',
      features: [
        'Analyse ECG automatique',
        'Modèle XResNet',
        'Diagnostic instantané',
        'Rapport détaillé'
      ],
      route: '/diagnostic'
    }
  ];

  const handleModeSelect = (route) => {
    navigate(route);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
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
        <HealthAndSafetyIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Sélection du Mode
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
          Choisissez votre méthode d'analyse cardiaque
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
          Deux modes d'analyse sont disponibles pour répondre à vos besoins spécifiques
        </Typography>
      </Paper>

      {/* Cartes des modes */}
      <Grid container spacing={4} justifyContent="center">
        {modes.map((mode, index) => {
          const IconComponent = mode.icon;
          return (
            <Grid item xs={12} md={6} key={mode.id}>
              <Card
                elevation={hoveredCard === mode.id ? 8 : 2}
                onMouseEnter={() => setHoveredCard(mode.id)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === mode.id ? 'translateY(-8px)' : 'translateY(0)',
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
                onClick={() => handleModeSelect(mode.route)}
              >
                {/* En-tête de la carte */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${mode.color}20 0%, ${mode.color}10 100%)`,
                    borderBottom: `2px solid ${mode.color}30`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IconComponent 
                      sx={{ 
                        fontSize: 48, 
                        color: mode.color,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }} 
                    />
                    <Box>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: mode.color }}>
                        {mode.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {mode.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Contenu de la carte */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                    {mode.description}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    Fonctionnalités :
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {mode.features.map((feature, idx) => (
                      <Typography 
                        component="li" 
                        variant="body2" 
                        key={idx}
                        sx={{ mb: 0.5, color: 'text.secondary' }}
                      >
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => handleModeSelect(mode.route)}
                    sx={{
                      background: `linear-gradient(45deg, ${mode.color} 30%, ${mode.color}90 90%)`,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Sélectionner ce mode
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Informations supplémentaires */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            💡 Conseil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vous pouvez changer de mode à tout moment depuis le menu de navigation.
            Chaque mode offre une expérience unique adaptée à vos besoins.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default ModeSelection;
