import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ 
      p: 4, 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card sx={{ maxWidth: 600, width: '100%', p: 4 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h2" color="primary" gutterBottom>
            🎯 Settings
          </Typography>
          
          <Typography variant="h4" color="success.main" gutterBottom>
            ✅ Page fonctionnelle !
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            La page Settings se charge correctement.
            <br />
            Timestamp: {new Date().toLocaleString()}
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            onClick={() => alert('Bouton cliqué !')}
            sx={{ mt: 2 }}
          >
            Test Bouton
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;
