import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material';
import { Favorite as HeartIcon } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a202c',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HeartIcon sx={{ fontSize: 32, mr: 1.5, color: '#ff4757' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                CardioAI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#a0aec0', lineHeight: 1.6 }}>
              Intelligence Artificielle pour le diagnostic cardiaque. 
              Monitoring IoT en temps réel et analyse prédictive avancée.
            </Typography>
          </Grid>

          {/* Fonctionnalités */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Fonctionnalités
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/iot-monitoring" color="inherit" underline="hover" sx={{ color: '#a0aec0' }}>
                Monitoring IoT
              </Link>
              <Link href="/diagnostic-ai" color="inherit" underline="hover" sx={{ color: '#a0aec0' }}>
                Diagnostic IA
              </Link>
              <Link href="/settings" color="inherit" underline="hover" sx={{ color: '#a0aec0' }}>
                Paramètres
              </Link>
            </Box>
          </Grid>

          {/* Technologies */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Technologies
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                React + Vite
              </Typography>
              <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                Material-UI
              </Typography>
              <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                TensorFlow.js
              </Typography>
              <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                WebRTC
              </Typography>
            </Box>
          </Grid>

          {/* Informations */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Informations
            </Typography>
            <Typography variant="body2" sx={{ color: '#a0aec0', mb: 1 }}>
              Version: 2.0.0
            </Typography>
            <Typography variant="body2" sx={{ color: '#a0aec0', mb: 1 }}>
              Dernière mise à jour: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#a0aec0' }}>
              Développé avec ❤️ pour la santé cardiaque
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#2d3748' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#a0aec0' }}>
            © {new Date().getFullYear()} CardioAI. Application de diagnostic cardiaque par intelligence artificielle.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
