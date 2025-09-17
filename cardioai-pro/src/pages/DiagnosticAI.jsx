import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  FileUpload as FileUploadIcon
} from '@mui/icons-material';

function DiagnosticAI() {
  const [ecgImage, setEcgImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [patientData, setPatientData] = useState({
    age: '',
    trestbps: '',
    chol: '',
    thalach: '',
    oldpeak: '',
    ca: '',
    slope: '1',
    restecg: '0',
    cp: '0',
    thal: '3'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEcgImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulation de l'analyse IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Résultats simulés
      const confidence = 0.85 + Math.random() * 0.1;
      const prediction = Math.random() > 0.7 ? 1 : 0;
      
      setResults({
        prediction: prediction,
        confidence: confidence,
        risk_level: prediction === 1 ? 'Élevé' : 'Faible',
        recommendations: prediction === 1 ? [
          'Consulter un cardiologue dans les plus brefs délais',
          'Éviter les efforts physiques intenses',
          'Surveiller régulièrement la tension artérielle',
          'Adopter un régime alimentaire pauvre en sel'
        ] : [
          'Maintenir un mode de vie sain',
          'Exercice physique régulier modéré',
          'Contrôles médicaux de routine',
          'Alimentation équilibrée'
        ]
      });
    } catch (err) {
      setError('Erreur lors de l\'analyse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca'];
    return requiredFields.every(field => patientData[field] !== '') && ecgImage;
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PsychologyIcon sx={{ fontSize: 48, opacity: 0.9 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              Diagnostic IA
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Analyse cardiaque avancée par intelligence artificielle
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Formulaire de saisie */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 4 }}>
              <CardHeader
                avatar={<FileUploadIcon color="primary" />}
                title="Upload ECG"
                subheader="Téléchargez votre image ECG"
              />
              <CardContent>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease',
                    '&:hover': { borderColor: '#3f51b5' }
                  }}
                  onClick={() => document.getElementById('ecg-upload').click()}
                >
                  <input
                    id="ecg-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  {imagePreview ? (
                    <Box>
                      <img
                        src={imagePreview}
                        alt="ECG Preview"
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Image ECG chargée avec succès
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Cliquez pour télécharger votre ECG
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Formats acceptés: JPG, PNG, GIF
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Données Cliniques"
                subheader="Renseignez les paramètres du patient"
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Âge"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Ex: 45"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tension artérielle au repos (mmHg)"
                      type="number"
                      value={patientData.trestbps}
                      onChange={(e) => handleInputChange('trestbps', e.target.value)}
                      placeholder="Ex: 120"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cholestérol (mg/dl)"
                      type="number"
                      value={patientData.chol}
                      onChange={(e) => handleInputChange('chol', e.target.value)}
                      placeholder="Ex: 200"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fréquence cardiaque maximale"
                      type="number"
                      value={patientData.thalach}
                      onChange={(e) => handleInputChange('thalach', e.target.value)}
                      placeholder="Ex: 150"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dépression du segment ST"
                      type="number"
                      step="0.1"
                      value={patientData.oldpeak}
                      onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                      placeholder="Ex: 1.0"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre de vaisseaux principaux"
                      type="number"
                      value={patientData.ca}
                      onChange={(e) => handleInputChange('ca', e.target.value)}
                      placeholder="Ex: 0"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type de douleur thoracique</InputLabel>
                      <Select
                        value={patientData.cp}
                        onChange={(e) => handleInputChange('cp', e.target.value)}
                      >
                        <MenuItem value="0">Angine typique</MenuItem>
                        <MenuItem value="1">Angine atypique</MenuItem>
                        <MenuItem value="2">Douleur non-angineuse</MenuItem>
                        <MenuItem value="3">Asymptomatique</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Pente du segment ST</InputLabel>
                      <Select
                        value={patientData.slope}
                        onChange={(e) => handleInputChange('slope', e.target.value)}
                      >
                        <MenuItem value="0">Descendante</MenuItem>
                        <MenuItem value="1">Plate</MenuItem>
                        <MenuItem value="2">Ascendante</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={!isFormValid() || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #303f9f 90%)',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Résultats */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader
                title="Résultats de l'Analyse"
                subheader="Diagnostic par IA"
              />
              <CardContent>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {loading && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={60} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Analyse en cours...
                    </Typography>
                    <LinearProgress sx={{ mt: 2 }} />
                  </Box>
                )}

                {results && (
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Chip
                        icon={results.prediction === 1 ? <WarningIcon /> : <CheckIcon />}
                        label={results.prediction === 1 ? 'Risque Détecté' : 'Pas de Risque'}
                        color={results.prediction === 1 ? 'error' : 'success'}
                        sx={{ fontSize: '1rem', py: 2, px: 1 }}
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      Niveau de confiance
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={results.confidence * 100}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {(results.confidence * 100).toFixed(1)}%
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                      Recommandations
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {results.recommendations.map((rec, idx) => (
                        <Typography component="li" variant="body2" key={idx} sx={{ mb: 1 }}>
                          {rec}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {!loading && !results && !error && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <PsychologyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Remplissez le formulaire et téléchargez votre ECG pour commencer l'analyse
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DiagnosticAI;
