/**
 * Ce fichier est un exemple de serveur backend qui pourrait être utilisé
 * pour traiter les requêtes de l'application frontend et interagir avec le modèle de Deep Learning.
 * 
 * Pour l'utiliser, vous devriez installer les dépendances suivantes:
 * npm install express cors multer
 * 
 * Puis exécuter:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de l'application Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware pour permettre les requêtes CORS
app.use(cors());
app.use(express.json());

// Configuration de multer pour le stockage des fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * Endpoint pour analyser les données (image ECG + données cliniques)
 * Dans une implémentation réelle, ce code appellerait le modèle de Deep Learning
 */
app.post('/api/analyze', upload.single('ecgImage'), (req, res) => {
  try {
    // Récupération de l'image uploadée
    const ecgImagePath = req.file.path;
    
    // Récupération des données cliniques
    const patientData = JSON.parse(req.body.patientData);
    
    console.log('Image ECG reçue:', ecgImagePath);
    console.log('Données patient reçues:', patientData);
    
    // Ici, vous appelleriez votre modèle de Deep Learning
    // Par exemple: const prediction = deepLearningModel.predict(ecgImagePath, patientData);
    
    // Pour cet exemple, nous simulons un résultat
    const simulatedResult = simulatePrediction(patientData);
    
    // Envoi du résultat
    setTimeout(() => {
      res.json(simulatedResult);
    }, 2000); // Délai simulé pour le traitement
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'analyse' });
  }
});

/**
 * Fonction qui simule une prédiction du modèle de Deep Learning
 * @param {Object} patientData - Données cliniques du patient
 * @returns {Object} - Résultat simulé de la prédiction
 */
function simulatePrediction(patientData) {
  // Détermination d'un diagnostic simulé basé sur les données du patient
  let diagnosis = 'Normal';
  let confidence = 0.75 + Math.random() * 0.2; // Entre 0.75 et 0.95
  let details = 'Aucune anomalie significative détectée.';
  
  // Simulation de diagnostic basée sur certains facteurs de risque
  const age = parseInt(patientData.age) || 0;
  const systolicBP = parseInt(patientData.systolicBP) || 0;
  const cholesterol = parseInt(patientData.cholesterol) || 0;
  
  if (age > 60 && systolicBP > 140 && cholesterol > 240) {
    diagnosis = 'Infarctus du myocarde';
    confidence = 0.85 + Math.random() * 0.1;
    details = 'Signes d\'élévation du segment ST dans les dérivations V1-V4, suggérant un infarctus antérieur.';
  } else if (age > 50 && systolicBP > 160) {
    diagnosis = 'Hypertrophie ventriculaire gauche';
    confidence = 0.80 + Math.random() * 0.15;
    details = 'Critères de Sokolow-Lyon positifs, suggérant une hypertrophie ventriculaire gauche.';
  } else if (age > 65 && patientData.gender === 'female') {
    diagnosis = 'Fibrillation auriculaire';
    confidence = 0.82 + Math.random() * 0.12;
    details = 'Absence d\'ondes P et rythme irrégulier, caractéristiques d\'une fibrillation auriculaire.';
  }
  
  return {
    diagnosis,
    confidence,
    details,
    timestamp: new Date().toISOString()
  };
}

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
