import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Sensors as SensorsIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

function ModeSelection() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  const modes = [
    {
      id: 'iot-monitoring',
      title: 'Monitoring IoT',
      subtitle: 'Surveillance en Temps Réel',
      description: 'Surveillez vos paramètres cardiaques en continu grâce à nos capteurs IoT connectés et notre interface de monitoring avancée.',
      icon: SensorsIcon,
      color: '#00bcd4',
      gradient: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
      features: [
        'Mesure en temps réel des paramètres vitaux',
        'Alertes automatiques et personnalisables',
        'Historique détaillé et graphiques interactifs',
        'Connexion avec capteurs Bluetooth et Web',
        'Interface responsive et moderne'
      ],
      route: '/iot-monitoring',
      recommended: false
    },
    {
      id: 'diagnostic-ai',
      title: 'Diagnostic IA',
      subtitle: 'Intelligence Artificielle Avancée',
      description: 'Utilisez notre modèle XResNet de pointe pour analyser vos données cardiaques et obtenir un diagnostic précis et instantané.',
      icon: PsychologyIcon,
      color: '#3f51b5',
      gradient: 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
      features: [
        'Modèle XResNet entraîné sur des milliers de cas',
        'Analyse ECG automatique et précise',
        'Diagnostic instantané avec score de confiance',
        'Rapport détaillé et recommandations',
        'Interface intuitive pour upload de données'
      ],
      route: '/diagnostic-ai',
      recommended: true
    }
  ];

  const handleModeSelect = (route) => {
    navigate(route);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="🎯 Choisissez votre approche"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                mb: 3,
                fontWeight: 600
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Sélection du Mode
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, mb: 2, fontWeight: 400 }}
            >
              Deux approches complémentaires pour votre santé cardiaque
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Choisissez entre le monitoring continu en temps réel ou l'analyse ponctuelle 
              par intelligence artificielle selon vos besoins.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Modes Selection */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} justifyContent="center">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Grid item xs={12} lg={6} key={mode.id}>
                <Card
                  elevation={hoveredCard === mode.id ? 12 : 4}
                  onMouseEnter={() => setHoveredCard(mode.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === mode.id ? 'translateY(-8px)' : 'translateY(0)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleModeSelect(mode.route)}
                >
                  {/* Recommended Badge */}
                  {mode.recommended && (
                    <Chip
                      label="⭐ Recommandé"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 1
                      }}
                    />
                  )}

                  {/* Header avec gradient */}
                  <Box
                    sx={{
                      background: mode.gradient,
                      color: 'white',
                      p: 4,
                      textAlign: 'center'
                    }}
                  >
                    <IconComponent sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                      {mode.title}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      {mode.subtitle}
                    </Typography>
                  </Box>

                  {/* Contenu */}
                  <CardContent sx={{ flex: 1, p: 4 }}>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ lineHeight: 1.7, color: 'text.secondary', mb: 3 }}
                    >
                      {mode.description}
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      Fonctionnalités incluses :
                    </Typography>
                    <List dense>
                      {mode.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon sx={{ fontSize: 20, color: mode.color }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleModeSelect(mode.route)}
                      sx={{
                        background: mode.gradient,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textTransform: 'none'
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

        {/* Informations complémentaires */}
        <Box sx={{ mt: 8 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: 3
            }}
          >
            <SpeedIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              💡 Conseil d'utilisation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Vous pouvez utiliser les deux modes de manière complémentaire : 
              le monitoring IoT pour un suivi quotidien et le diagnostic IA pour des analyses ponctuelles approfondies.
              Changez de mode à tout moment depuis le menu de navigation.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default ModeSelection;
