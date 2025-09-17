import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Favorite as HeartIcon,
  Sensors as SensorsIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: SensorsIcon,
      title: 'Monitoring IoT',
      description: 'Surveillance en temps réel de vos paramètres cardiaques avec des capteurs connectés.',
      color: '#00bcd4'
    },
    {
      icon: PsychologyIcon,
      title: 'IA Avancée',
      description: 'Diagnostic précis grâce à notre modèle XResNet entraîné sur des milliers de cas.',
      color: '#3f51b5'
    },
    {
      icon: SpeedIcon,
      title: 'Temps Réel',
      description: 'Analyse instantanée et alertes automatiques pour une réaction rapide.',
      color: '#ff6b35'
    },
    {
      icon: SecurityIcon,
      title: 'Sécurisé',
      description: 'Vos données médicales sont protégées avec un chiffrement de niveau médical.',
      color: '#4caf50'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip
                  label="🚀 Nouvelle Version 2.0"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    mb: 3,
                    fontWeight: 600
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >
                  CardioAI
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 400,
                    opacity: 0.9,
                    mb: 4
                  }}
                >
                  Intelligence Artificielle pour le Diagnostic Cardiaque
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.8,
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: 500
                  }}
                >
                  Révolutionnez votre suivi cardiaque avec notre plateforme de monitoring IoT 
                  et d'analyse prédictive basée sur l'intelligence artificielle.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    component={RouterLink}
                    to="/mode-selection"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  >
                    Commencer le Diagnostic
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/iot-monitoring"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Monitoring IoT
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <HeartIcon
                  sx={{
                    fontSize: { xs: 200, md: 300 },
                    color: '#ff4757',
                    opacity: 0.9,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                    animation: 'heartbeat 2s ease-in-out infinite'
                  }}
                />
                <style>
                  {`
                    @keyframes heartbeat {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.1); }
                    }
                  `}
                </style>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Fonctionnalités Avancées
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Une suite complète d'outils pour le monitoring et le diagnostic cardiaque
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: `${feature.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <feature.icon sx={{ fontSize: 40, color: feature.color }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)',
              color: 'white',
              borderRadius: 4
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 60, mb: 3, opacity: 0.9 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Prêt à commencer ?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
              Rejoignez des milliers d'utilisateurs qui font confiance à CardioAI 
              pour leur suivi cardiaque quotidien.
            </Typography>
            <Button
              component={RouterLink}
              to="/mode-selection"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Démarrer maintenant
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
