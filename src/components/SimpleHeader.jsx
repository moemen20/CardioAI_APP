import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SimpleNotifications from './SimpleNotifications';

function SimpleHeader() {
  return (
    <AppBar position="static" sx={{ mb: 0 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <HealthAndSafetyIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            CardioAI
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={RouterLink} to="/mode-selection">
            Diagnostic
          </Button>
          <Button color="inherit" component={RouterLink} to="/iot-monitoring">
            Monitoring IoT
          </Button>
          <Button color="inherit" component={RouterLink} to="/settings">
            Paramètres
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            À propos
          </Button>
        </Box>

        {/* Système de notifications */}
        <SimpleNotifications />
      </Toolbar>
    </AppBar>
  );
}

export default SimpleHeader;
