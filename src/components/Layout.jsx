import { Box } from '@mui/material';
// import FloatingNotifications from './FloatingNotifications'; // Temporairement désactivé

/**
 * Composant Layout qui enveloppe toutes les pages
 * et affiche les notifications flottantes
 */
function Layout({ children }) {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Notifications flottantes globales - temporairement désactivées */}
      {/* <FloatingNotifications /> */}

      {/* Contenu de la page */}
      {children}
    </Box>
  );
}

export default Layout;
