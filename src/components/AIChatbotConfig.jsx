import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  Chip,
  Link
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  SmartToy as AIIcon,
  Security as SecurityIcon,
  Info as InfoIcon
} from '@mui/icons-material';

function AIChatbotConfig({ open, onClose, onApiKeySet }) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Charger la clé API sauvegardée
    const savedApiKey = localStorage.getItem('cardioai_openai_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Sauvegarder la clé API
      localStorage.setItem('cardioai_openai_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsValid(true);
      onClose();
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('cardioai_openai_key');
    setApiKey('');
    setIsValid(false);
    onApiKeySet(null);
  };

  const handleApiKeyChange = (event) => {
    const value = event.target.value;
    setApiKey(value);
    // Validation basique de la clé API OpenAI
    setIsValid(value.startsWith('sk-') && value.length > 20);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon />
          <Typography variant="h6">Configuration IA Avancée</Typography>
        </Box>
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="primary" />
            Assistant IA Ultra-Intelligent
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Activez l'IA avancée pour des réponses encore plus intelligentes et contextuelles.
            L'assistant utilisera GPT pour comprendre et interpréter vos questions de manière sophistiquée.
          </Typography>
        </Box>

        {/* État actuel */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            État actuel :
          </Typography>
          {isValid ? (
            <Chip
              icon={<AIIcon />}
              label="IA Avancée Activée"
              color="success"
              variant="outlined"
            />
          ) : (
            <Chip
              icon={<InfoIcon />}
              label="Mode Local (Basique)"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {/* Configuration clé API */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Clé API OpenAI (Optionnel)
          </Typography>
          <TextField
            fullWidth
            type={showApiKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={apiKey}
            onChange={handleApiKeyChange}
            variant="outlined"
            helperText={
              isValid 
                ? "✅ Clé API valide - IA avancée activée"
                : "Entrez votre clé API OpenAI pour activer l'IA avancée"
            }
            error={apiKey.length > 0 && !isValid}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? 'Masquer' : 'Afficher'} la clé
            </Button>
            {isValid && (
              <Button
                size="small"
                color="error"
                onClick={handleRemove}
              >
                Supprimer la clé
              </Button>
            )}
          </Box>
        </Box>

        {/* Informations sur l'obtention de la clé */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Comment obtenir une clé API OpenAI :
          </Typography>
          <Typography variant="body2" component="div">
            1. Allez sur{' '}
            <Link href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">
              platform.openai.com/api-keys
            </Link>
            <br />
            2. Créez un compte ou connectez-vous
            <br />
            3. Cliquez sur "Create new secret key"
            <br />
            4. Copiez la clé et collez-la ici
          </Typography>
        </Alert>

        {/* Sécurité */}
        <Alert severity="warning" icon={<SecurityIcon />}>
          <Typography variant="subtitle2" gutterBottom>
            Sécurité et confidentialité :
          </Typography>
          <Typography variant="body2">
            • Votre clé API est stockée localement sur votre appareil
            <br />
            • Vos conversations sont envoyées à OpenAI pour traitement
            <br />
            • Aucune donnée médicale personnelle n'est partagée
            <br />
            • Vous pouvez supprimer la clé à tout moment
          </Typography>
        </Alert>

        {/* Comparaison des modes */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Comparaison des modes :
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Mode Local (Actuel)
              </Typography>
              <Typography variant="body2">
                • Réponses préprogrammées
                <br />
                • Base de connaissances fixe
                <br />
                • Gratuit
                <br />
                • Données locales uniquement
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Mode IA Avancée
              </Typography>
              <Typography variant="body2">
                • Compréhension contextuelle
                <br />
                • Réponses adaptatives
                <br />
                • Interprétation sophistiquée
                <br />
                • Coût API OpenAI (~$0.002/1000 mots)
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={apiKey.length > 0 && !isValid}
          startIcon={<AIIcon />}
        >
          {isValid ? 'Mettre à jour' : 'Activer IA Avancée'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AIChatbotConfig;
