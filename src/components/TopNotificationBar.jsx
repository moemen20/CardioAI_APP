import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import globalNotificationService from '../services/globalNotificationService';

function TopNotificationBar() {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // S'abonner aux nouvelles notifications
    const unsubscribe = globalNotificationService.addListener((data) => {
      const latestNotification = data.notifications[0]; // La plus récente
      
      if (latestNotification && !latestNotification.read) {
        setCurrentNotification(latestNotification);
        setShow(true);
        
        // Auto-masquer après 5 secondes pour les notifications info/success
        if (latestNotification.severity === 'info' || latestNotification.severity === 'success') {
          setTimeout(() => {
            setShow(false);
          }, 5000);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleClose = () => {
    setShow(false);
    if (currentNotification) {
      globalNotificationService.markAsRead(currentNotification.id);
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'success':
        return <SuccessIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverity = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  if (!currentNotification || !show) {
    return null;
  }

  return (
    <Slide direction="down" in={show} mountOnEnter unmountOnExit timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 70, // Sous la barre de navigation
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '600px',
          zIndex: 1200, // Sous la barre de navigation mais au-dessus du contenu
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Alert
          severity={getSeverity(currentNotification.severity)}
          icon={getIcon(currentNotification.severity)}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Transparence
            backdropFilter: 'blur(10px)', // Effet de flou
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            },
            '&.MuiAlert-standardSuccess': {
              backgroundColor: 'rgba(76, 175, 80, 0.95)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            },
            '&.MuiAlert-standardError': {
              backgroundColor: 'rgba(244, 67, 54, 0.95)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            },
            '&.MuiAlert-standardWarning': {
              backgroundColor: 'rgba(255, 152, 0, 0.95)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            },
            '&.MuiAlert-standardInfo': {
              backgroundColor: 'rgba(33, 150, 243, 0.95)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" component="div">
                {currentNotification.title}
              </Typography>
              <Typography variant="body2">
                {currentNotification.message}
              </Typography>
            </Box>
            <Chip
              label={currentNotification.severity.toUpperCase()}
              size="small"
              color={getSeverity(currentNotification.severity)}
              variant="outlined"
            />
          </Box>
        </Alert>
      </Box>
    </Slide>
  );
}

export default TopNotificationBar;
