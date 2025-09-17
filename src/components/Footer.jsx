import { Box, Container, Typography, Link, Grid, IconButton, Divider, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        backgroundColor: '#f5f7fa',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        py: 4,
        mt: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et description */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Cardio<Box component="span" sx={{ color: theme.palette.secondary.main }}>AI</Box>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Application innovante utilisant l'intelligence artificielle pour la détection automatisée
              de pathologies cardiaques à partir d'images ECG et de données cliniques.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" aria-label="facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="linkedin">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="github">
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Liens rapides
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/" color="inherit" underline="hover">
                  Accueil
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/about" color="inherit" underline="hover">
                  À propos
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Documentation
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Confidentialité
                </Link>
              </Box>
            </Box>
          </Grid>


        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} CardioAI Diagnostic - Tous droits réservés
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Fait avec
            </Typography>
            <FavoriteIcon
              className="heartbeat"
              sx={{
                color: '#f44336',
                fontSize: 16,
                mx: 0.5
              }}
            />
            <Typography variant="body2" color="text.secondary">
              pour la santé cardiaque
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
