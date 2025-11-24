/**
 * Service d'IA avancée pour CardioAI avec intelligence contextuelle et réponses formatées
 */
class AdvancedAIService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    this.context = {
      userProfile: {},
      sessionHistory: [],
      currentTopic: null,
      conversationFlow: []
    };
    
    // Base de connaissances structurée avec intelligence contextuelle
    this.knowledgeGraph = this.initializeKnowledgeGraph();
    this.responseTemplates = this.initializeResponseTemplates();
    this.nlpProcessor = this.initializeNLPProcessor();
  }

  initializeKnowledgeGraph() {
    return {
      // Graphe de connaissances médicales interconnectées
      medical: {
        cardiology: {
          pathologies: {
            infarctus: {
              symptoms: ['douleur thoracique', 'essoufflement', 'sueurs', 'nausées'],
              urgency: 'immediate',
              actions: ['appeler 15', 'position demi-assise', 'aspirine si prescrite'],
              related: ['angine', 'arythmie', 'insuffisance cardiaque']
            },
            arythmie: {
              types: ['tachycardie', 'bradycardie', 'fibrillation'],
              symptoms: ['palpitations', 'vertiges', 'fatigue'],
              monitoring: ['ECG', 'Holter', 'monitoring IoT'],
              related: ['infarctus', 'insuffisance cardiaque']
            },
            hypertension: {
              values: { normal: '<120/80', elevated: '120-129/<80', stage1: '130-139/80-89', stage2: '≥140/≥90' },
              risks: ['AVC', 'infarctus', 'insuffisance rénale'],
              prevention: ['exercice', 'alimentation', 'réduction sel'],
              related: ['cholestérol', 'diabète', 'obésité']
            }
          },
          diagnostics: {
            ecg: {
              waves: { P: 'contraction auriculaire', QRS: 'contraction ventriculaire', T: 'repolarisation' },
              abnormalities: ['onde Q pathologique', 'sus-décalage ST', 'onde T inversée'],
              interpretation: 'requires medical expertise',
              ai_analysis: 'XResNet model with 90%+ accuracy'
            },
            monitoring: {
              parameters: ['heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation'],
              thresholds: {
                heart_rate: { min: 60, max: 100, unit: 'BPM' },
                blood_pressure: { systolic_max: 140, diastolic_max: 90, unit: 'mmHg' },
                temperature: { max: 37.5, unit: '°C' },
                oxygen_saturation: { min: 95, unit: '%' }
              }
            }
          }
        }
      },
      
      // Connaissances techniques de l'application
      technical: {
        features: {
          diagnostic_ai: {
            input: ['ECG image', 'clinical data'],
            process: 'XResNet deep learning model',
            output: ['diagnosis', 'confidence level'],
            steps: ['upload ECG', 'fill clinical data', 'analyze', 'interpret results']
          },
          iot_monitoring: {
            sensors: ['heart rate', 'blood pressure', 'temperature', 'SpO2'],
            alerts: 'real-time threshold monitoring',
            storage: 'automatic session recording',
            export: 'CSV data export'
          },
          history: {
            sessions: 'complete monitoring history',
            statistics: 'global and per-session stats',
            export: 'CSV format with timestamps'
          }
        }
      }
    };
  }

  initializeResponseTemplates() {
    return {
      // Templates pour différents types de réponses
      medical_advice: {
        structure: ['🩺 **Analyse médicale**', 'symptoms', 'recommendations', 'urgency', 'disclaimer'],
        urgency_levels: {
          immediate: '🚨 **URGENCE IMMÉDIATE** - Appelez le 15 maintenant !',
          urgent: '⚠️ **URGENT** - Consultez rapidement un médecin',
          moderate: '💡 **À surveiller** - Prenez rendez-vous avec votre médecin',
          info: 'ℹ️ **Information** - Pour votre connaissance'
        }
      },
      
      technical_help: {
        structure: ['🔧 **Guide technique**', 'steps', 'tips', 'troubleshooting'],
        step_format: '**Étape {number}** : {description}'
      },
      
      interpretation: {
        structure: ['📊 **Interprétation**', 'values', 'meaning', 'context', 'next_steps'],
        value_format: '• **{parameter}** : {value} {unit} ({status})'
      }
    };
  }

  initializeNLPProcessor() {
    return {
      // Processeur de langage naturel avancé
      intentClassifier: {
        medical_question: ['symptôme', 'douleur', 'mal', 'problème', 'maladie', 'pathologie'],
        technical_help: ['comment', 'utiliser', 'faire', 'configurer', 'problème technique'],
        interpretation: ['interpréter', 'signifie', 'résultat', 'valeur', 'analyse'],
        emergency: ['urgence', 'grave', 'intense', 'soudain', 'immédiat', 'crise'],
        prevention: ['prévenir', 'éviter', 'protéger', 'améliorer', 'conseils']
      },
      
      entityExtractor: {
        medical_terms: ['cœur', 'cardiaque', 'tension', 'pression', 'ECG', 'arythmie', 'infarctus'],
        values: /(\d+(?:\.\d+)?)\s*(bpm|mmhg|°c|%|g\/l)/gi,
        symptoms: ['douleur', 'mal', 'fatigue', 'essoufflement', 'palpitations', 'vertiges']
      },
      
      contextAnalyzer: {
        conversation_flow: ['greeting', 'question', 'clarification', 'follow_up', 'conclusion'],
        emotional_state: ['inquiet', 'rassuré', 'confus', 'urgent', 'curieux']
      }
    };
  }

  /**
   * Analyse intelligente du message utilisateur
   */
  analyzeMessage(message) {
    const analysis = {
      intent: this.classifyIntent(message),
      entities: this.extractEntities(message),
      context: this.analyzeContext(message),
      urgency: this.assessUrgency(message),
      emotional_state: this.detectEmotionalState(message)
    };
    
    console.log('Message analysis:', analysis);
    return analysis;
  }

  classifyIntent(message) {
    const msg = message.toLowerCase();
    const intents = this.nlpProcessor.intentClassifier;
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => msg.includes(keyword))) {
        return intent;
      }
    }
    return 'general_question';
  }

  extractEntities(message) {
    const entities = {
      medical_terms: [],
      values: [],
      symptoms: []
    };
    
    const msg = message.toLowerCase();
    
    // Extraire les termes médicaux
    this.nlpProcessor.entityExtractor.medical_terms.forEach(term => {
      if (msg.includes(term)) {
        entities.medical_terms.push(term);
      }
    });
    
    // Extraire les valeurs numériques
    const valueMatches = message.match(this.nlpProcessor.entityExtractor.values);
    if (valueMatches) {
      entities.values = valueMatches;
    }
    
    // Extraire les symptômes
    this.nlpProcessor.entityExtractor.symptoms.forEach(symptom => {
      if (msg.includes(symptom)) {
        entities.symptoms.push(symptom);
      }
    });
    
    return entities;
  }

  analyzeContext(message) {
    // Analyser le contexte de la conversation
    const recentMessages = this.conversations.slice(-5);
    const topics = recentMessages.map(msg => this.extractTopics(msg.content));
    
    return {
      recent_topics: [...new Set(topics.flat())],
      conversation_length: this.conversations.length,
      user_expertise: this.assessUserExpertise(recentMessages)
    };
  }

  assessUrgency(message) {
    const urgentKeywords = [
      'douleur thoracique intense', 'mal au cœur', 'crise cardiaque', 
      'infarctus', 'malaise grave', 'essoufflement soudain', 'palpitations fortes'
    ];
    
    const msg = message.toLowerCase();
    if (urgentKeywords.some(keyword => msg.includes(keyword))) {
      return 'immediate';
    }
    
    const moderateKeywords = ['douleur', 'mal', 'inquiet', 'problème'];
    if (moderateKeywords.some(keyword => msg.includes(keyword))) {
      return 'moderate';
    }
    
    return 'info';
  }

  detectEmotionalState(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('inquiet') || msg.includes('peur') || msg.includes('angoisse')) {
      return 'worried';
    }
    if (msg.includes('merci') || msg.includes('parfait') || msg.includes('bien')) {
      return 'satisfied';
    }
    if (msg.includes('comprends pas') || msg.includes('confus') || msg.includes('compliqué')) {
      return 'confused';
    }
    
    return 'neutral';
  }

  /**
   * Génère une réponse intelligente et formatée
   */
  async generateIntelligentResponse(message) {
    try {
      console.log('Analyzing message...');
      const analysis = this.analyzeMessage(message);
      console.log('Analysis result:', analysis);

      // Sélectionner la stratégie de réponse basée sur l'analyse
      let response;

      console.log('Intent detected:', analysis.intent);

      switch (analysis.intent) {
        case 'emergency':
          console.log('Generating emergency response');
          response = this.generateEmergencyResponse(analysis);
          break;
        case 'medical_question':
          console.log('Generating medical response');
          response = this.generateMedicalResponse(analysis, message);
          break;
        case 'technical_help':
          console.log('Generating technical response');
          response = this.generateTechnicalResponse(analysis, message);
          break;
        case 'interpretation':
          console.log('Generating interpretation response');
          response = this.generateInterpretationResponse(analysis, message);
          break;
        default:
          console.log('Generating contextual response');
          response = this.generateContextualResponse(analysis, message);
      }

      console.log('Raw response:', response);

      // Formater la réponse avec style visuel
      const formattedResponse = this.formatResponse(response, analysis);
      console.log('Formatted response:', formattedResponse);

      return formattedResponse;

    } catch (error) {
      console.error('Error in generateIntelligentResponse:', error);

      // Réponse de secours simple
      return `🤖 **Assistant CardioAI**

Bonjour ! Je peux vous aider avec :

• **Diagnostic IA** - Utilisation et interprétation
• **Monitoring IoT** - Configuration et alertes
• **Questions médicales** - Cardiologie générale
• **Support technique** - Aide application

Que souhaitez-vous savoir ?`;
    }
  }

  generateEmergencyResponse(analysis) {
    return {
      type: 'emergency',
      title: '🚨 URGENCE MÉDICALE',
      content: [
        'Si vous ressentez actuellement :',
        '• Douleur thoracique intense et persistante',
        '• Essoufflement soudain et sévère',
        '• Malaise important avec sueurs froides',
        '• Palpitations avec douleur ou malaise',
        '',
        '➡️ **APPELEZ IMMÉDIATEMENT LE 15 (SAMU)**',
        '',
        '⏰ Chaque minute compte pour votre cœur !',
        '🚑 N\'attendez pas, n\'hésitez pas !'
      ],
      urgency: 'immediate',
      actions: ['Appeler le 15', 'Position demi-assise', 'Rester calme']
    };
  }

  generateMedicalResponse(analysis, message) {
    const msg = message.toLowerCase();

    // Réponses médicales spécifiques
    if (msg.includes('valeur') && msg.includes('normal')) {
      return this.generateNormalValuesResponse();
    }

    if (msg.includes('douleur') || msg.includes('mal')) {
      return this.generateSymptomResponse(analysis.entities.symptoms, analysis.urgency);
    }

    if (msg.includes('cœur') || msg.includes('cardiaque')) {
      return this.generateCardiacInfoResponse();
    }

    return this.generateGeneralMedicalResponse();
  }

  generateSymptomResponse(symptoms, urgency) {
    if (urgency === 'immediate') {
      return this.generateEmergencyResponse();
    }

    return {
      type: 'medical',
      title: '⚕️ **Analyse des Symptômes**',
      content: [
        'Symptômes détectés dans votre message.',
        '',
        '**Recommandations générales :**',
        '• Surveillez l\'évolution des symptômes',
        '• Notez la fréquence et l\'intensité',
        '• Consultez un médecin si persistance',
        '',
        '**Signes d\'urgence à surveiller :**',
        '• Douleur thoracique intense',
        '• Essoufflement soudain',
        '• Malaise important',
        '• Palpitations avec douleur'
      ],
      urgency: urgency,
      suggestions: ['Quand consulter un médecin ?', 'Que faire en urgence ?']
    };
  }

  generateCardiacInfoResponse() {
    return {
      type: 'medical',
      title: '🫀 **Informations Cardiaques**',
      content: [
        '**Le cœur et son fonctionnement :**',
        '• Muscle qui pompe le sang',
        '• 4 cavités : 2 oreillettes, 2 ventricules',
        '• Rythme normal : 60-100 battements/min',
        '',
        '**Principales pathologies :**',
        '• Infarctus du myocarde',
        '• Arythmies cardiaques',
        '• Insuffisance cardiaque',
        '• Hypertension artérielle',
        '',
        '**Prévention :**',
        '• Exercice régulier',
        '• Alimentation équilibrée',
        '• Arrêt du tabac',
        '• Gestion du stress'
      ],
      suggestions: ['Comment prévenir ?', 'Signes à surveiller ?']
    };
  }

  generateGeneralMedicalResponse() {
    return {
      type: 'medical',
      title: '⚕️ **Information Médicale Générale**',
      content: [
        'Je peux vous renseigner sur :',
        '',
        '🫀 **Cardiologie :**',
        '• Pathologies cardiaques',
        '• Interprétation ECG',
        '• Facteurs de risque',
        '• Prévention',
        '',
        '📊 **Paramètres vitaux :**',
        '• Fréquence cardiaque',
        '• Pression artérielle',
        '• Température',
        '• Saturation oxygène',
        '',
        '🚨 **Urgences :**',
        '• Signes d\'alerte',
        '• Conduite à tenir',
        '• Numéros d\'urgence'
      ],
      suggestions: ['Valeurs normales ?', 'Signes d\'urgence ?']
    };
  }

  generateTechnicalResponse(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('diagnostic')) {
      return this.generateDiagnosticGuide();
    }
    if (msg.includes('monitoring')) {
      return this.generateMonitoringGuide();
    }
    if (msg.includes('export') || msg.includes('données')) {
      return this.generateExportGuide();
    }

    return this.generateGeneralTechnicalResponse();
  }

  generateExportGuide() {
    return {
      type: 'technical',
      title: '📥 **Guide d\'Export des Données**',
      content: [
        '**Étape 1** : Accéder à l\'historique',
        '• Menu → "Historique"',
        '• Liste de toutes vos sessions',
        '',
        '**Étape 2** : Sélectionner une session',
        '• Cliquez sur l\'icône 📥 "Export"',
        '• Ou cliquez sur 👁️ puis "Exporter CSV"',
        '',
        '**Étape 3** : Téléchargement automatique',
        '• Fichier CSV généré automatiquement',
        '• Contient toutes les mesures avec timestamps',
        '• Compatible Excel, Google Sheets',
        '',
        '**Contenu du fichier CSV :**',
        '• Timestamp de chaque mesure',
        '• Fréquence cardiaque (BPM)',
        '• Pression artérielle (mmHg)',
        '• Température (°C)',
        '• Saturation oxygène (%)'
      ],
      suggestions: ['Comment ouvrir le CSV ?', 'Que faire des données ?']
    };
  }

  generateGeneralTechnicalResponse() {
    return {
      type: 'technical',
      title: '🔧 **Support Technique CardioAI**',
      content: [
        'Je peux vous aider avec :',
        '',
        '🔬 **Diagnostic IA :**',
        '• Upload d\'ECG',
        '• Saisie données cliniques',
        '• Interprétation résultats',
        '',
        '📊 **Monitoring IoT :**',
        '• Démarrage sessions',
        '• Configuration alertes',
        '• Lecture des données',
        '',
        '📋 **Gestion des données :**',
        '• Consultation historique',
        '• Export CSV',
        '• Suppression sessions',
        '',
        '⚙️ **Configuration :**',
        '• Paramètres application',
        '• Personnalisation seuils',
        '• Notifications'
      ],
      suggestions: ['Problème spécifique ?', 'Guide étape par étape ?']
    };
  }

  generateInterpretationResponse(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('confiance') || msg.includes('fiable')) {
      return this.generateConfidenceGuide();
    }

    if (msg.includes('ecg') || msg.includes('électrocardiogramme')) {
      return this.generateECGInterpretation();
    }

    return this.generateInterpretationGuide();
  }

  generateConfidenceGuide() {
    return {
      type: 'interpretation',
      title: '🎯 **Guide des Niveaux de Confiance**',
      content: [
        '**Interprétation des scores IA :**',
        '',
        '✅ **90-100% - Très Fiable**',
        '• Diagnostic très probable',
        '• Imprimez pour votre médecin',
        '• Planifiez consultation de suivi',
        '',
        '👍 **80-89% - Fiable**',
        '• Diagnostic probable',
        '• Confirmation médicale recommandée',
        '• Surveillez les symptômes',
        '',
        '⚠️ **70-79% - Modéré**',
        '• Résultat à confirmer',
        '• Consultation médicale conseillée',
        '• Répétez l\'analyse si possible',
        '',
        '❌ **<70% - Incertain**',
        '• Résultat peu fiable',
        '• Consultation médicale obligatoire',
        '• Ne pas se fier au diagnostic seul'
      ],
      suggestions: ['Que faire si confiance faible ?', 'Comment améliorer précision ?']
    };
  }

  generateECGInterpretation() {
    return {
      type: 'interpretation',
      title: '📈 **Interprétation ECG**',
      content: [
        '**Éléments analysés par l\'IA :**',
        '',
        '**Onde P :**',
        '• Contraction des oreillettes',
        '• Normale : arrondie, positive',
        '',
        '**Complexe QRS :**',
        '• Contraction des ventricules',
        '• Durée normale : <120ms',
        '',
        '**Onde T :**',
        '• Repolarisation ventriculaire',
        '• Normale : positive en V2-V6',
        '',
        '**Rythme et fréquence :**',
        '• Rythme sinusal normal',
        '• Fréquence : 60-100 BPM',
        '',
        '**Anomalies détectées par IA :**',
        '• Troubles du rythme',
        '• Signes d\'ischémie',
        '• Hypertrophie ventriculaire',
        '• Troubles de conduction'
      ],
      suggestions: ['Que signifie mon ECG ?', 'Anomalies détectées ?']
    };
  }

  formatResponse(response, analysis) {
    // Formatage visuel avancé avec émojis et structure
    let formatted = '';
    
    // En-tête avec urgence
    if (response.urgency === 'immediate') {
      formatted += '🚨🚨🚨 **URGENCE IMMÉDIATE** 🚨🚨🚨\n\n';
    } else if (response.urgency === 'urgent') {
      formatted += '⚠️ **ATTENTION URGENTE** ⚠️\n\n';
    }
    
    // Titre principal
    if (response.title) {
      formatted += `${response.title}\n\n`;
    }
    
    // Contenu principal
    if (Array.isArray(response.content)) {
      formatted += response.content.join('\n') + '\n\n';
    } else {
      formatted += response.content + '\n\n';
    }
    
    // Actions recommandées
    if (response.actions && response.actions.length > 0) {
      formatted += '🎯 **Actions recommandées :**\n';
      response.actions.forEach((action, index) => {
        formatted += `${index + 1}. ${action}\n`;
      });
      formatted += '\n';
    }
    
    // Disclaimer médical
    if (response.type === 'medical' || analysis.intent === 'medical_question') {
      formatted += '⚠️ *Cette information est fournie à titre éducatif. Consultez toujours un professionnel de santé pour un avis médical personnalisé.*\n\n';
    }
    
    // Suggestions de suivi
    if (response.suggestions) {
      formatted += '💡 **Vous pourriez aussi demander :**\n';
      response.suggestions.forEach(suggestion => {
        formatted += `• ${suggestion}\n`;
      });
    }
    
    return formatted.trim();
  }

  // Méthodes de génération spécialisées
  generateDiagnosticGuide() {
    return {
      type: 'technical',
      title: '🔬 **Guide Diagnostic IA CardioAI**',
      content: [
        '**Étape 1** : Préparez votre ECG',
        '• Image claire et nette (JPG/PNG)',
        '• Toutes les dérivations visibles',
        '• Pas de reflets ou d\'ombres',
        '',
        '**Étape 2** : Accédez au diagnostic',
        '• Menu → "Diagnostic IA"',
        '• Cliquez "Choisir un fichier"',
        '• Sélectionnez votre ECG',
        '',
        '**Étape 3** : Données cliniques',
        '• Âge, pression artérielle, cholestérol',
        '• Fréquence cardiaque maximale',
        '• Type de douleur thoracique',
        '• ECG au repos, pente ST, thalassémie',
        '',
        '**Étape 4** : Analyse IA',
        '• Cliquez "Analyser avec IA"',
        '• Modèle XResNet traite vos données',
        '• Résultat avec niveau de confiance',
        '',
        '**Interprétation** :',
        '• Confiance >80% = Résultat fiable',
        '• Confiance 60-80% = À confirmer',
        '• Confiance <60% = Nécessite expertise médicale'
      ],
      actions: ['Préparer ECG de qualité', 'Remplir toutes les données', 'Consulter un cardiologue'],
      suggestions: ['Comment interpréter les résultats ?', 'Quelle est la précision du modèle ?']
    };
  }

  // Listeners et gestion d'état
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          conversations: this.conversations,
          isTyping: this.isTyping
        });
      } catch (error) {
        console.error('Erreur dans le listener:', error);
      }
    });
  }

  addMessage(sender, content, type = 'text') {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender,
      content,
      type,
      timestamp: new Date().toISOString()
    };

    this.conversations.push(message);
    this.notifyListeners();
    return message.id;
  }

  async processUserMessage(userMessage) {
    console.log('Processing with advanced AI:', userMessage);

    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    // Simuler temps de traitement IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      console.log('Generating intelligent response...');
      const response = await this.generateIntelligentResponse(userMessage);
      console.log('Response generated:', response);

      this.isTyping = false;
      this.addMessage('bot', response);

      // Générer suggestions contextuelles
      setTimeout(() => {
        try {
          const suggestions = this.generateContextualSuggestions(userMessage, response);
          suggestions.forEach(suggestion => {
            this.addMessage('bot', suggestion, 'suggestion');
          });
        } catch (suggestionError) {
          console.error('Erreur suggestions:', suggestionError);
        }
      }, 1000);

    } catch (error) {
      console.error('Erreur IA complète:', error);
      console.error('Stack trace:', error.stack);
      this.isTyping = false;

      // Réponse de fallback simple
      const fallbackResponse = `🤖 **Assistant CardioAI**

Je peux vous aider avec :
• Questions sur le diagnostic IA
• Utilisation du monitoring IoT
• Informations médicales cardiaques
• Support technique

Que souhaitez-vous savoir ?`;

      this.addMessage('bot', fallbackResponse);
    }
  }

  startConversation() {
    const welcome = `🤖 **Bonjour ! Je suis votre Assistant CardioAI Ultra-Intelligent**

🧠 **Mes capacités avancées :**
• Analyse contextuelle de vos questions
• Expertise médicale en cardiologie
• Guide technique de l'application
• Détection d'urgences automatique
• Réponses personnalisées et formatées

💬 **Comment puis-je vous aider aujourd'hui ?**

💡 *Posez-moi n'importe quelle question sur votre santé cardiaque ou l'utilisation de CardioAI !*`;

    this.addMessage('bot', welcome);
  }

  generateContextualSuggestions(userMessage, response) {
    // Suggestions intelligentes basées sur le contexte
    const suggestions = [];
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('diagnostic')) {
      suggestions.push('💡 Comment interpréter le niveau de confiance ?');
      suggestions.push('💡 Que faire si le diagnostic est incertain ?');
    }
    
    if (msg.includes('monitoring')) {
      suggestions.push('💡 Comment personnaliser les seuils d\'alerte ?');
      suggestions.push('💡 Comment exporter mes données ?');
    }
    
    if (response.includes('urgence') || response.includes('15')) {
      suggestions.push('💡 Quels sont les autres signes d\'urgence ?');
      suggestions.push('💡 Comment prévenir les crises cardiaques ?');
    }
    
    return suggestions.slice(0, 2);
  }

  getConversations() {
    return this.conversations;
  }

  clearConversation() {
    this.conversations = [];
    this.context = { userProfile: {}, sessionHistory: [], currentTopic: null, conversationFlow: [] };
    this.notifyListeners();
  }

  getTypingState() {
    return this.isTyping;
  }

  getFrequentQuestions() {
    return [
      "Comment utiliser le diagnostic IA ?",
      "Comment interpréter mes résultats ?",
      "Quelles sont les valeurs normales ?",
      "Que faire en cas d'alerte ?",
      "Comment prévenir les maladies cardiaques ?",
      "Quels sont les signes d'urgence ?",
      "Comment exporter mes données ?",
      "Comment améliorer la précision ?"
    ];
  }

  // Méthodes de génération spécialisées manquantes
  generateContextualResponse(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('valeur') && msg.includes('normal')) {
      return this.generateNormalValuesResponse();
    }

    if (msg.includes('comment') && msg.includes('utiliser')) {
      return this.generateUsageGuide(msg);
    }

    if (msg.includes('interpréter') || msg.includes('résultat')) {
      return this.generateInterpretationGuide();
    }

    return this.generateGeneralResponse(message);
  }

  generateNormalValuesResponse() {
    return {
      type: 'medical',
      title: '📊 **Valeurs Normales des Paramètres Cardiaques**',
      content: [
        '**💓 Fréquence Cardiaque :**',
        '• Normal au repos : 60-100 BPM',
        '• Bradycardie : <60 BPM',
        '• Tachycardie : >100 BPM',
        '',
        '**🩸 Pression Artérielle :**',
        '• Optimale : <120/80 mmHg',
        '• Normale : <130/85 mmHg',
        '• Hypertension : ≥140/90 mmHg',
        '',
        '**🌡️ Température :**',
        '• Normale : 36.1-37.2°C',
        '• Fièvre : >37.5°C',
        '',
        '**🫁 Saturation O₂ :**',
        '• Normale : 95-100%',
        '• Hypoxémie : <95%'
      ],
      urgency: 'info',
      suggestions: ['Comment améliorer ces valeurs ?', 'Que faire si anormal ?']
    };
  }

  generateUsageGuide(message) {
    if (message.includes('diagnostic')) {
      return this.generateDiagnosticGuide();
    } else if (message.includes('monitoring')) {
      return this.generateMonitoringGuide();
    } else {
      return this.generateGeneralResponse(message);
    }
  }

  generateMonitoringGuide() {
    return {
      type: 'technical',
      title: '📊 **Guide Monitoring IoT**',
      content: [
        '**Étape 1** : Menu → "Monitoring IoT"',
        '**Étape 2** : Cliquer "Démarrer le monitoring"',
        '**Étape 3** : Surveillance automatique des paramètres',
        '**Étape 4** : Alertes en temps réel',
        '**Étape 5** : "Arrêter" pour sauvegarder'
      ],
      suggestions: ['Comment personnaliser les alertes ?', 'Comment exporter ?']
    };
  }

  generateInterpretationGuide() {
    return {
      type: 'interpretation',
      title: '🔬 **Guide d\'Interprétation**',
      content: [
        '**Niveaux de Confiance :**',
        '• 90-100% : Très fiable ✅',
        '• 80-89% : Fiable 👍',
        '• 70-79% : Probable ⚠️',
        '• <70% : Incertain ❌',
        '',
        '**Actions recommandées :**',
        '• >80% : Imprimez pour médecin',
        '• <80% : Consultez rapidement'
      ],
      suggestions: ['Que faire si confiance faible ?', 'Comment améliorer précision ?']
    };
  }

  generateGeneralResponse(message) {
    return {
      type: 'general',
      title: '🤖 **Assistant CardioAI**',
      content: [
        'Je peux vous aider avec :',
        '• Diagnostic IA et interprétation',
        '• Monitoring IoT et alertes',
        '• Questions médicales cardiaques',
        '• Support technique application'
      ],
      suggestions: ['Comment utiliser diagnostic ?', 'Valeurs normales ?']
    };
  }

  extractTopics(content) {
    // Extraction simple des sujets
    const topics = [];
    if (content.includes('diagnostic')) topics.push('diagnostic');
    if (content.includes('monitoring')) topics.push('monitoring');
    if (content.includes('ECG')) topics.push('ecg');
    return topics;
  }

  assessUserExpertise(messages) {
    // Évaluation simple du niveau d'expertise
    return messages.length > 5 ? 'experienced' : 'beginner';
  }
}

// Instance singleton
const advancedAIService = new AdvancedAIService();

export default advancedAIService;
