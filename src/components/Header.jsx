import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import NotificationBar from './NotificationBar';

// Effet de masquage du header lors du défilement
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { text: 'Accueil', path: '/' },
    { text: 'Diagnostic IA', path: '/diagnostic' },
    { text: 'Monitoring IoT', path: '/iot-monitoring' },
    { text: 'Paramètres', path: '/settings' },
    { text: 'À propos', path: '/about' }
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" component="div" color="primary" fontWeight="bold">
          CardioAI
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 188, 212, 0.08)',
              }
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '1rem'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        className="header"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease-in-out',
          color: theme.palette.text.primary,
          borderBottom: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo et titre */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <HealthAndSafetyIcon
                color="primary"
                sx={{
                  mr: 1,
                  fontSize: 32,
                  animation: 'pulse 1.5s infinite ease-in-out alternate',
                  '@keyframes pulse': {
                    from: { opacity: 0.8, transform: 'scale(1)' },
                    to: { opacity: 1, transform: 'scale(1.05)' }
                  }
                }}
              />
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Cardio<Box component="span" sx={{ color: theme.palette.secondary.main }}>AI</Box>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    ml: 0.5,
                    fontSize: '0.9rem',
                    color: theme.palette.text.secondary,
                    fontWeight: 400
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 14, mx: 0.5, color: '#f44336' }} />
                  Diagnostic
                </Box>
              </Typography>
            </Box>

            {/* Menu pour mobile */}
            {isMobile ? (
              <>
                <NotificationBar />
                <IconButton
                  edge="end"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                >
                  {drawer}
                </Drawer>
              </>
            ) : (
              /* Menu pour desktop */
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="primary"
                    sx={{
                      fontWeight: 500,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: theme.palette.primary.main,
                        transition: 'width 0.3s ease-in-out'
                      },
                      '&:hover::after': {
                        width: '80%'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <NotificationBar />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;
