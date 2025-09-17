import axios from 'axios';

// URL de base de l'API (à remplacer par l'URL réelle de votre backend)
const API_URL = 'http://localhost:5000/api';

/**
 * Service pour interagir avec le modèle de Deep Learning via l'API
 */
const modelService = {
  /**
   * Envoie l'image ECG et les données cliniques au modèle pour analyse
   * @param {File} ecgImage - L'image ECG à analyser
   * @param {Object} patientData - Les données cliniques du patient
   * @returns {Promise} - Promesse contenant les résultats de l'analyse
   */
  analyzeData: async (ecgImage, patientData) => {
    try {
      // Création d'un FormData pour envoyer l'image et les données
      const formData = new FormData();
      formData.append('ecgImage', ecgImage);
      formData.append('patientData', JSON.stringify(patientData));

      // Envoi des données à l'API
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse des données:', error);
      throw error;
    }
  },

  /**
   * Fonction de simulation pour le développement (à utiliser en l'absence de backend)
   * @param {File} ecgImage - L'image ECG à analyser
   * @param {Object} patientData - Les données cliniques du patient
   * @returns {Promise} - Promesse contenant les résultats simulés de l'analyse
   */
  simulateAnalysis: async (ecgImage, patientData) => {
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Détermination d'un diagnostic simulé basé sur les données du patient
    let diagnosis = 'Normal';
    let confidence = 0.75 + Math.random() * 0.2; // Entre 0.75 et 0.95
    let details = 'Aucune anomalie significative détectée.';

    // Simulation de diagnostic basée sur les facteurs de risque du modèle
    // Colonnes numériques
    const age = parseInt(patientData.age) || 0;
    const trestbps = parseInt(patientData.trestbps) || 0; // Tension artérielle au repos
    const chol = parseInt(patientData.chol) || 0; // Cholestérol
    const thalach = parseInt(patientData.thalach) || 0; // Fréquence cardiaque maximale
    const oldpeak = parseFloat(patientData.oldpeak) || 0; // Dépression du segment ST
    const ca = parseInt(patientData.ca) || 0; // Nombre de vaisseaux principaux

    // Colonnes catégorielles
    const cp = parseInt(patientData.cp) || 0; // Type de douleur thoracique
    const restecg = parseInt(patientData.restecg) || 0; // ECG au repos
    const slope = parseInt(patientData.slope) || 1; // Pente du segment ST
    const thal = parseInt(patientData.thal) || 3; // Thalassémie

    // Facteurs de risque combinés pour la simulation
    const riskScore =
      (age > 60 ? 2 : 0) +
      (trestbps > 140 ? 2 : 0) +
      (chol > 240 ? 2 : 0) +
      (thalach < 120 ? 2 : 0) +
      (oldpeak > 2 ? 3 : 0) +
      (ca > 1 ? 3 : 0) +
      (cp === 0 ? 2 : 0) +
      (restecg > 0 ? 1 : 0) +
      (slope === 0 ? 2 : 0) +
      (thal !== 3 ? 2 : 0);

    if (riskScore >= 10) {
      diagnosis = 'Infarctus du myocarde';
      confidence = 0.85 + Math.random() * 0.1;
      details = 'Signes d\'élévation du segment ST dans les dérivations V1-V4, suggérant un infarctus antérieur.';
    } else if (riskScore >= 7) {
      diagnosis = 'Hypertrophie ventriculaire gauche';
      confidence = 0.80 + Math.random() * 0.15;
      details = 'Critères de Sokolow-Lyon positifs, suggérant une hypertrophie ventriculaire gauche.';
    } else if (riskScore >= 5) {
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
};

export default modelService;
