// Service de diagnostic par IA
class AIService {
  constructor() {
    this.modelLoaded = false;
    this.analysisHistory = [];
  }

  // Simuler le chargement du modèle
  async loadModel() {
    console.log('Chargement du modèle XResNet...');
    // Simulation du chargement
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.modelLoaded = true;
    console.log('Modèle XResNet chargé avec succès');
    return true;
  }

  // Analyser une image ECG et des données cliniques
  async analyzeECG(ecgImage, clinicalData) {
    if (!this.modelLoaded) {
      await this.loadModel();
    }

    console.log('Début de l\'analyse IA...');
    
    // Validation des données
    const validationResult = this.validateInput(ecgImage, clinicalData);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error);
    }

    // Simulation de l'analyse (3-5 secondes)
    const analysisTime = 3000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, analysisTime));

    // Génération des résultats basée sur les données cliniques
    const result = this.generateDiagnosticResult(clinicalData);
    
    // Sauvegarder dans l'historique
    const analysis = {
      id: Date.now().toString(),
      timestamp: new Date(),
      clinicalData: { ...clinicalData },
      result,
      processingTime: Math.round(analysisTime)
    };
    
    this.analysisHistory.push(analysis);
    
    // Garder seulement les 50 dernières analyses
    if (this.analysisHistory.length > 50) {
      this.analysisHistory = this.analysisHistory.slice(-50);
    }

    console.log('Analyse IA terminée');
    return result;
  }

  // Validation des données d'entrée
  validateInput(ecgImage, clinicalData) {
    if (!ecgImage) {
      return { isValid: false, error: 'Image ECG requise' };
    }

    const requiredFields = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca'];
    for (const field of requiredFields) {
      if (!clinicalData[field] || clinicalData[field] === '') {
        return { 
          isValid: false, 
          error: `Le champ ${this.getFieldName(field)} est requis` 
        };
      }
    }

    // Validation des plages de valeurs
    const validations = {
      age: { min: 1, max: 120 },
      trestbps: { min: 80, max: 200 },
      chol: { min: 100, max: 600 },
      thalach: { min: 60, max: 220 },
      oldpeak: { min: 0, max: 10 },
      ca: { min: 0, max: 4 }
    };

    for (const [field, range] of Object.entries(validations)) {
      const value = parseFloat(clinicalData[field]);
      if (value < range.min || value > range.max) {
        return {
          isValid: false,
          error: `${this.getFieldName(field)} doit être entre ${range.min} et ${range.max}`
        };
      }
    }

    return { isValid: true };
  }

  // Obtenir le nom français du champ
  getFieldName(field) {
    const names = {
      age: 'Âge',
      trestbps: 'Tension artérielle',
      chol: 'Cholestérol',
      thalach: 'Fréquence cardiaque max',
      oldpeak: 'Dépression ST',
      ca: 'Nombre de vaisseaux'
    };
    return names[field] || field;
  }

  // Générer un résultat de diagnostic basé sur les données
  generateDiagnosticResult(data) {
    // Calcul du score de risque basé sur les facteurs cliniques
    let riskScore = 0;
    
    // Facteurs d'âge
    const age = parseInt(data.age);
    if (age > 60) riskScore += 0.2;
    if (age > 70) riskScore += 0.1;

    // Facteurs de tension artérielle
    const trestbps = parseInt(data.trestbps);
    if (trestbps > 140) riskScore += 0.15;
    if (trestbps > 160) riskScore += 0.1;

    // Facteurs de cholestérol
    const chol = parseInt(data.chol);
    if (chol > 240) riskScore += 0.1;
    if (chol > 300) riskScore += 0.1;

    // Fréquence cardiaque maximale
    const thalach = parseInt(data.thalach);
    const expectedMaxHR = 220 - age;
    if (thalach < expectedMaxHR * 0.7) riskScore += 0.15;

    // Dépression du segment ST
    const oldpeak = parseFloat(data.oldpeak);
    if (oldpeak > 1.0) riskScore += 0.1;
    if (oldpeak > 2.0) riskScore += 0.1;

    // Nombre de vaisseaux principaux
    const ca = parseInt(data.ca);
    riskScore += ca * 0.1;

    // Type de douleur thoracique
    const cp = parseInt(data.cp);
    if (cp === 0) riskScore += 0.1; // Angine typique

    // Ajouter une variation aléatoire
    riskScore += (Math.random() - 0.5) * 0.2;
    riskScore = Math.max(0, Math.min(1, riskScore));

    // Déterminer la prédiction
    const threshold = 0.5;
    const prediction = riskScore > threshold ? 1 : 0;
    const confidence = prediction === 1 ? riskScore : (1 - riskScore);

    // Générer les recommandations
    const recommendations = this.generateRecommendations(prediction, data);

    return {
      prediction,
      confidence: Math.min(0.99, Math.max(0.6, confidence)),
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      recommendations,
      factors: this.getSignificantFactors(data, riskScore),
      interpretation: this.getInterpretation(prediction, confidence)
    };
  }

  // Déterminer le niveau de risque
  getRiskLevel(riskScore) {
    if (riskScore < 0.3) return 'Faible';
    if (riskScore < 0.6) return 'Modéré';
    if (riskScore < 0.8) return 'Élevé';
    return 'Très élevé';
  }

  // Générer des recommandations personnalisées
  generateRecommendations(prediction, data) {
    const recommendations = [];

    if (prediction === 1) {
      recommendations.push('Consulter un cardiologue dans les plus brefs délais');
      recommendations.push('Éviter les efforts physiques intenses');
      
      if (parseInt(data.trestbps) > 140) {
        recommendations.push('Surveiller régulièrement la tension artérielle');
        recommendations.push('Adopter un régime alimentaire pauvre en sel');
      }
      
      if (parseInt(data.chol) > 240) {
        recommendations.push('Contrôler le taux de cholestérol');
        recommendations.push('Adopter un régime alimentaire équilibré');
      }
      
      recommendations.push('Prendre les médicaments prescrits régulièrement');
    } else {
      recommendations.push('Maintenir un mode de vie sain');
      recommendations.push('Exercice physique régulier modéré');
      recommendations.push('Contrôles médicaux de routine');
      recommendations.push('Alimentation équilibrée riche en fruits et légumes');
      
      if (parseInt(data.age) > 50) {
        recommendations.push('Surveillance cardiaque annuelle recommandée');
      }
    }

    return recommendations;
  }

  // Identifier les facteurs significatifs
  getSignificantFactors(data, riskScore) {
    const factors = [];
    
    if (parseInt(data.age) > 60) factors.push('Âge avancé');
    if (parseInt(data.trestbps) > 140) factors.push('Hypertension');
    if (parseInt(data.chol) > 240) factors.push('Cholestérol élevé');
    if (parseFloat(data.oldpeak) > 1.0) factors.push('Anomalie ST');
    if (parseInt(data.ca) > 0) factors.push('Sténose vasculaire');
    
    return factors;
  }

  // Générer l'interprétation du résultat
  getInterpretation(prediction, confidence) {
    const confidencePercent = Math.round(confidence * 100);
    
    if (prediction === 1) {
      return `Le modèle détecte un risque de maladie cardiaque avec ${confidencePercent}% de confiance. Une évaluation médicale approfondie est recommandée.`;
    } else {
      return `Le modèle n'indique pas de risque significatif de maladie cardiaque avec ${confidencePercent}% de confiance. Continuez à maintenir un mode de vie sain.`;
    }
  }

  // Obtenir l'historique des analyses
  getAnalysisHistory() {
    return [...this.analysisHistory];
  }

  // Supprimer une analyse de l'historique
  deleteAnalysis(analysisId) {
    this.analysisHistory = this.analysisHistory.filter(a => a.id !== analysisId);
  }

  // Exporter les résultats
  exportResults(analysisId) {
    const analysis = this.analysisHistory.find(a => a.id === analysisId);
    if (!analysis) return null;

    const exportData = {
      date: analysis.timestamp.toISOString(),
      patient: analysis.clinicalData,
      diagnostic: analysis.result,
      processingTime: analysis.processingTime
    };

    return JSON.stringify(exportData, null, 2);
  }
}

// Instance singleton
const aiService = new AIService();
export default aiService;
