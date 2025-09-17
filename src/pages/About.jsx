import { Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';

function About() {
  return (
    <Box className="zoom-in">
      <Typography
        variant="h3"
        component="h1"
        className="page-title slide-up"
        sx={{
          fontWeight: 700,
          mb: 4,
          background: 'linear-gradient(45deg, #3f51b5, #00bcd4, #9c27b0)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          animation: 'gradient-shift 4s ease-in-out infinite',
          '@keyframes gradient-shift': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' }
          }
        }}
      >
        À propos de CardioAI Diagnostic
      </Typography>

      <Paper
        elevation={3}
        className="slide-up card-hover"
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          animationDelay: '0.2s',
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(233, 30, 99, 0.05) 100%)'
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          <Box
            className="pulse"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              mr: 2
            }}
          >
            <FavoriteIcon sx={{ fontSize: 28, color: '#f44336' }} />
          </Box>
          Notre mission
        </Typography>
        <Typography paragraph>
          CardioAI Diagnostic est une application innovante qui utilise l'intelligence artificielle pour aider à la détection précoce des pathologies cardiaques. Notre objectif est de fournir un outil d'assistance au diagnostic rapide et fiable pour les professionnels de santé, en combinant l'analyse d'images d'ECG et de données cliniques.
        </Typography>
        <Typography paragraph>
          Cette application est conçue comme un outil d'aide à la décision et ne remplace en aucun cas l'expertise médicale d'un professionnel de santé qualifié.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            color: 'secondary.main'
          }}
        >
          <PsychologyIcon sx={{ mr: 1, fontSize: 28 }} />
          Notre technologie
        </Typography>
        <Typography paragraph>
          CardioAI Diagnostic utilise un modèle de Deep Learning multimodal basé sur une architecture XResNet. Cette approche innovante permet de traiter simultanément deux types de données :
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image="/images/ecg-analysis.svg"
                alt="Analyse d'images ECG"
                sx={{
                  backgroundColor: '#f8f9fa',
                  objectFit: 'cover'
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Analyse d'images ECG
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notre réseau de neurones convolutifs (CNN) analyse les images d'électrocardiogrammes pour détecter des motifs anormaux associés à diverses pathologies cardiaques. Le modèle XResNet a été entraîné sur des milliers d'ECG annotés par des cardiologues.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image="/images/clinical-data-analysis.svg"
                alt="Analyse de données cliniques"
                sx={{
                  backgroundColor: '#f8f9fa',
                  objectFit: 'cover'
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary.main">
                  Analyse de données cliniques
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Un réseau de neurones dense traite les données cliniques du patient (âge, tension artérielle, cholestérol, fréquence cardiaque, etc.) pour enrichir l'analyse et améliorer la précision du diagnostic. Cette approche multimodale permet une évaluation plus complète du risque cardiaque.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          <HealthAndSafetyIcon sx={{ mr: 1, fontSize: 28 }} />
          Performances et limitations
        </Typography>
        <Typography paragraph>
          Notre modèle a été validé sur des ensembles de données indépendants et a démontré une précision de plus de 85% dans la détection de pathologies cardiaques courantes, notamment :
        </Typography>
        <ul>
          <li>
            <Typography>Infarctus du myocarde</Typography>
          </li>
          <li>
            <Typography>Fibrillation auriculaire</Typography>
          </li>
          <li>
            <Typography>Hypertrophie ventriculaire gauche</Typography>
          </li>
          <li>
            <Typography>Troubles de la conduction</Typography>
          </li>
        </ul>
        <Typography paragraph sx={{ mt: 2 }}>
          Cependant, il est important de noter que l'outil présente certaines limitations :
        </Typography>
        <ul>
          <li>
            <Typography>Les résultats doivent toujours être interprétés par un professionnel de santé qualifié</Typography>
          </li>
          <li>
            <Typography>La qualité de l'image ECG peut affecter la précision du diagnostic</Typography>
          </li>
          <li>
            <Typography>Certaines pathologies rares peuvent ne pas être correctement identifiées</Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
}

export default About;
