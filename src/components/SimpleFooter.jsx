import { Box, Container, Typography, Grid } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f7fa',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        py: 4,
        mt: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                CardioAI
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Application de détection de pathologies cardiaques utilisant l'intelligence artificielle.
              Diagnostic rapide et précis basé sur l'analyse d'ECG et de données cliniques.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contact@cardioai.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Téléphone: +33 1 23 45 67 89
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.05)', pt: 3, mt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} CardioAI. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default SimpleFooter;
