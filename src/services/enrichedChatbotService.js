/**
 * Service de Chatbot Enrichi avec Base de Connaissances CardioAI
 * Utilise les données JSON spécifiques pour des réponses précises et contextuelles
 */

// Import des données de la base de connaissances
import qnaData from '../../CardioAI_QnA_v1.json';

class EnrichedChatbotService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.conversationContext = {
      lastQuestions: [],
      userProfile: {},
      currentTopic: null
    };
  }

  initializeKnowledgeBase() {
    // Ajout des questions spécifiques à l'application CardioAI
    const appSpecificQnA = this.getAppSpecificQuestions();
    const combinedQnA = [...qnaData.qnaList, ...appSpecificQnA];

    // Indexation des données pour recherche rapide
    const kb = {
      qnaList: combinedQnA,
      questionIndex: new Map(),
      keywordIndex: new Map(),
      tagIndex: new Map()
    };

    // Création d'index pour recherche efficace
    combinedQnA.forEach(item => {
      // Index par questions
      item.questions.forEach(question => {
        kb.questionIndex.set(question.toLowerCase(), item);
      });

      // Index par mots-clés
      const keywords = this.extractKeywords(item.questions.join(' ') + ' ' + item.answer);
      keywords.forEach(keyword => {
        if (!kb.keywordIndex.has(keyword)) {
          kb.keywordIndex.set(keyword, []);
        }
        kb.keywordIndex.get(keyword).push(item);
      });

      // Index par tags
      if (item.metadata && item.metadata.tags) {
        const tags = item.metadata.tags.split(';');
        tags.forEach(tag => {
          if (!kb.tagIndex.has(tag)) {
            kb.tagIndex.set(tag, []);
          }
          kb.tagIndex.get(tag).push(item);
        });
      }
    });

    return kb;
  }

  getAppSpecificQuestions() {
    return [
      {
        id: 100,
        questions: [
          "Comment utiliser le diagnostic IA ?",
          "Comment faire un diagnostic avec l'IA ?",
          "Comment utiliser l'intelligence artificielle ?",
          "Guide d'utilisation du diagnostic"
        ],
        answer: "Pour utiliser le diagnostic IA :\n\n1. Préparez votre ECG 12 dérivations (format PNG ou JPG)\n2. Remplissez le formulaire avec vos données cliniques (âge, sexe, tension, cholestérol, etc.)\n3. Cliquez sur \"Analyser avec l'IA\"\n4. Consultez les résultats avec le score de confiance\n\nPour de meilleurs résultats, remplissez tous les champs et utilisez un ECG de bonne qualité.",
        shortAnswer: "Uploadez un ECG 12 dérivations, remplissez les données cliniques complètes, puis cliquez 'Analyser avec l'IA'.",
        metadata: {
          source: "CardioAI_App",
          tags: "diagnostic;IA;guide;technique",
          lang: "fr",
          audience: "user"
        }
      },
      {
        id: 101,
        questions: [
          "Comment démarrer le monitoring IoT ?",
          "Comment utiliser le monitoring ?",
          "Comment surveiller en temps réel ?",
          "Monitoring cardiaque temps réel"
        ],
        answer: "Pour démarrer le monitoring IoT :\n\n1. Allez dans le menu \"Monitoring IoT\"\n2. Configurez vos seuils d'alerte (fréquence cardiaque, tension)\n3. Cliquez \"Démarrer le monitoring\"\n4. Vérifiez que vos capteurs sont connectés\n\nVous verrez alors les graphiques en temps réel avec des alertes colorées selon vos paramètres.",
        shortAnswer: "Menu → Monitoring IoT → Configurer les seuils → Démarrer le monitoring → Surveillance temps réel activée.",
        metadata: {
          source: "CardioAI_App",
          tags: "monitoring;IoT;temps-réel;guide",
          lang: "fr",
          audience: "user"
        }
      },
      {
        id: 102,
        questions: [
          "Comment exporter mes données ?",
          "Comment télécharger l'historique ?",
          "Export des résultats",
          "Sauvegarder mes données"
        ],
        answer: "Pour exporter vos données :\n\n1. Allez dans \"Historique\" depuis le menu\n2. Sélectionnez la période qui vous intéresse\n3. Cochez les données à exporter\n4. Cliquez \"Exporter\" et choisissez le format (CSV, PDF)\n5. Le fichier se télécharge automatiquement\n\nVous pouvez aussi exporter depuis le module Monitoring en cliquant sur l'icône d'export.",
        shortAnswer: "Historique → Sélectionner période → Exporter → Choisir format (CSV/PDF) → Téléchargement automatique.",
        metadata: {
          source: "CardioAI_App",
          tags: "export;données;historique;guide",
          lang: "fr",
          audience: "user"
        }
      },
      {
        id: 103,
        questions: [
          "Problème avec l'application",
          "L'application ne fonctionne pas",
          "Bug dans CardioAI",
          "Erreur technique"
        ],
        answer: "**🔧 DÉPANNAGE CARDIOAI - RÉSOLUTION DE PROBLÈMES**\n\n**⚡ SOLUTIONS RAPIDES :**\n\n**1️⃣ PROBLÈMES COURANTS :**\n\n**🔄 Application lente ou qui plante :**\n• Actualisez la page (F5 ou Ctrl+R)\n• Videz le cache du navigateur\n• Fermez les autres onglets\n• Redémarrez le navigateur\n\n**📡 Problèmes de connexion :**\n• Vérifiez votre connexion Internet\n• Désactivez temporairement VPN/proxy\n• Essayez un autre navigateur\n• Vérifiez les paramètres de firewall\n\n**📤 Échec d'upload d'ECG :**\n• Vérifiez le format (PNG, JPG acceptés)\n• Taille max : 10 MB\n• Résolution min : 800x600 pixels\n• Évitez les caractères spéciaux dans le nom\n\n**2️⃣ DIAGNOSTIC IA NE FONCTIONNE PAS :**\n• Remplissez tous les champs obligatoires\n• Vérifiez la qualité de l'ECG\n• Attendez la fin du traitement\n• Réessayez avec un autre ECG\n\n**3️⃣ MONITORING IoT DÉCONNECTÉ :**\n• Vérifiez l'état des capteurs\n• Rechargez les dispositifs\n• Redémarrez le module monitoring\n• Vérifiez les permissions Bluetooth\n\n**🆘 SUPPORT TECHNIQUE :**\n\n**📞 CONTACT URGENT :**\n• Email : support@cardioai.com\n• Téléphone : +33 1 XX XX XX XX\n• Chat en ligne : Disponible 24h/7j\n\n**📋 INFORMATIONS À FOURNIR :**\n• Description détaillée du problème\n• Navigateur et version utilisés\n• Captures d'écran si possible\n• Messages d'erreur exacts\n• Étapes pour reproduire le bug\n\n**🔄 MISES À JOUR :**\n• Vérifiez les mises à jour disponibles\n• Notifications automatiques activées\n• Changelog disponible dans l'aide\n\n**💡 CONSEILS PRÉVENTIFS :**\n• Utilisez Chrome, Firefox ou Edge récents\n• Maintenez votre navigateur à jour\n• Sauvegardez régulièrement vos données\n• Activez les notifications de maintenance",
        shortAnswer: "Actualisez la page (F5), videz le cache, vérifiez la connexion. Si le problème persiste : support@cardioai.com",
        metadata: {
          source: "CardioAI_App",
          tags: "dépannage;support;technique;bug",
          lang: "fr",
          audience: "user"
        }
      },
      {
        id: 104,
        questions: [
          "Qu'est-ce que CardioAI ?",
          "Présentation de l'application",
          "À quoi sert CardioAI ?",
          "Fonctionnalités de l'application"
        ],
        answer: "**🫀 CARDIOAI - PLATEFORME INTELLIGENTE DE SANTÉ CARDIAQUE**\n\n**🎯 MISSION :**\nCardioAI révolutionne le diagnostic cardiaque en combinant intelligence artificielle avancée et monitoring IoT pour une prise en charge optimale des patients.\n\n**🔬 TECHNOLOGIES INTÉGRÉES :**\n\n**1️⃣ DIAGNOSTIC IA AVANCÉ :**\n• **Modèle XResNet** : Deep learning spécialisé cardiologie\n• **Analyse multimodale** : ECG + données cliniques\n• **Précision >95%** : Validation sur 10,000+ cas\n• **Détection précoce** : Pathologies asymptomatiques\n\n**2️⃣ MONITORING IoT TEMPS RÉEL :**\n• **Capteurs connectés** : Fréquence, tension, température\n• **Surveillance 24h/7j** : Alertes automatiques\n• **Tendances prédictives** : IA préventive\n• **Intervention rapide** : Protocoles d'urgence\n\n**🏥 APPLICATIONS CLINIQUES :**\n\n**👨‍⚕️ POUR LES PROFESSIONNELS :**\n• Aide au diagnostic différentiel\n• Screening de masse efficace\n• Suivi post-intervention\n• Télémédecine avancée\n\n**👤 POUR LES PATIENTS :**\n• Auto-surveillance guidée\n• Éducation thérapeutique\n• Prévention personnalisée\n• Autonomisation santé\n\n**📊 FONCTIONNALITÉS PRINCIPALES :**\n\n**🔍 ANALYSE INTELLIGENTE :**\n• Upload ECG instantané\n• Questionnaire clinique guidé\n• Résultats en temps réel\n• Recommandations personnalisées\n\n**📱 INTERFACE INTUITIVE :**\n• Design médical professionnel\n• Navigation simplifiée\n• Responsive multi-dispositifs\n• Accessibilité optimisée\n\n**🔒 SÉCURITÉ MÉDICALE :**\n• Chiffrement bout-en-bout\n• Conformité RGPD/HIPAA\n• Hébergement sécurisé\n• Audit trail complet\n\n**🌟 AVANTAGES UNIQUES :**\n• **Rapidité** : Diagnostic en <30 secondes\n• **Précision** : IA validée cliniquement\n• **Accessibilité** : 24h/7j, partout\n• **Évolutivité** : Apprentissage continu\n\n**🚀 INNOVATION CONTINUE :**\n• Recherche & développement actifs\n• Partenariats hospitaliers\n• Validation scientifique\n• Amélioration continue",
        shortAnswer: "CardioAI combine IA avancée et IoT pour le diagnostic cardiaque intelligent et le monitoring temps réel.",
        metadata: {
          source: "CardioAI_App",
          tags: "présentation;fonctionnalités;IA;IoT",
          lang: "fr",
          audience: "user"
        }
      }
    ];
  }

  extractKeywords(text) {
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'car',
      'que', 'qui', 'quoi', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'est', 'sont',
      'avoir', 'être', 'faire', 'aller', 'venir', 'voir', 'savoir', 'pouvoir', 'vouloir',
      'dans', 'sur', 'avec', 'par', 'pour', 'sans', 'sous', 'vers', 'chez', 'depuis'
    ]);

    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter(word => /^[a-zàâäéèêëïîôöùûüÿç]+$/.test(word));
  }

  /**
   * Analyse intelligente et contextuelle du message utilisateur
   */
  analyzeMessage(message) {
    const msg = message.toLowerCase().trim();

    // Analyse sémantique avancée
    const semanticAnalysis = this.performSemanticAnalysis(msg);
    const intentAnalysis = this.detectIntentWithContext(msg, semanticAnalysis);
    const urgencyAnalysis = this.assessUrgencyLevel(msg, semanticAnalysis);
    const emotionalContext = this.detectEmotionalContext(msg);

    return {
      intent: intentAnalysis.intent,
      confidence: intentAnalysis.confidence,
      urgencyLevel: urgencyAnalysis.level,
      isUrgent: urgencyAnalysis.isUrgent,
      emotionalState: emotionalContext,
      semanticEntities: semanticAnalysis.entities,
      originalMessage: message,
      keywords: this.extractKeywords(message),
      interpretedMeaning: this.interpretUserMeaning(msg, intentAnalysis, semanticAnalysis)
    };
  }

  /**
   * Analyse sémantique pour comprendre le sens profond
   */
  performSemanticAnalysis(message) {
    const entities = {
      symptoms: [],
      bodyParts: [],
      timeReferences: [],
      intensityMarkers: [],
      medicalTerms: [],
      appFeatures: [],
      emotions: []
    };

    // Détection de symptômes avec variations linguistiques
    const symptomPatterns = {
      'chest_pain': [
        'mal au cœur', 'mal au coeur', 'douleur thoracique', 'douleur poitrine',
        'douleur dans la poitrine', 'mal dans la poitrine', 'oppression thoracique',
        'serrement dans la poitrine', 'poids sur la poitrine', 'brûlure thoracique'
      ],
      'palpitations': [
        'palpitations', 'cœur qui bat vite', 'coeur qui bat vite', 'cœur qui s\'emballe',
        'battements rapides', 'rythme rapide', 'tachycardie', 'cœur qui cogne',
        'battements irréguliers', 'cœur qui saute', 'mon cœur bat vite', 'mon coeur bat vite',
        'rythme cardiaque rapide', 'rythme cardiaque très rapide', 'cœur rapide', 'coeur rapide',
        'bat trop vite', 'bat très vite', 'rythme trop rapide'
      ],
      'shortness_of_breath': [
        'essoufflement', 'souffle court', 'difficulté à respirer', 'manque d\'air',
        'respiration difficile', 'dyspnée', 'oppression respiratoire'
      ],
      'dizziness': [
        'vertiges', 'étourdissements', 'malaise', 'tête qui tourne',
        'sensation de faiblesse', 'syncope', 'perte de connaissance'
      ]
    };

    // Détection d'intensité
    const intensityPatterns = {
      'severe': ['intense', 'forte', 'très', 'extrême', 'insupportable', 'terrible', 'atroce'],
      'moderate': ['modérée', 'moyenne', 'assez', 'plutôt'],
      'mild': ['légère', 'faible', 'petite', 'un peu']
    };

    // Détection temporelle
    const timePatterns = {
      'immediate': ['maintenant', 'actuellement', 'en ce moment', 'là'],
      'recent': ['depuis', 'il y a', 'récemment', 'dernièrement'],
      'duration': ['minutes', 'heures', 'jours', 'semaines', 'mois']
    };

    // Détection des fonctionnalités app
    const appFeaturePatterns = {
      'diagnostic': ['diagnostic', 'analyser', 'analyse', 'ecg', 'électrocardiogramme'],
      'monitoring': ['monitoring', 'surveillance', 'surveiller', 'temps réel', 'capteurs'],
      'export': ['exporter', 'télécharger', 'sauvegarder', 'données', 'historique'],
      'help': ['aide', 'problème', 'bug', 'erreur', 'ne fonctionne pas']
    };

    // Analyse des patterns
    Object.entries(symptomPatterns).forEach(([symptom, patterns]) => {
      patterns.forEach(pattern => {
        if (message.includes(pattern)) {
          entities.symptoms.push({ type: symptom, pattern, confidence: 0.9 });
        }
      });
    });

    Object.entries(intensityPatterns).forEach(([level, patterns]) => {
      patterns.forEach(pattern => {
        if (message.includes(pattern)) {
          entities.intensityMarkers.push({ level, pattern, confidence: 0.8 });
        }
      });
    });

    Object.entries(timePatterns).forEach(([timeType, patterns]) => {
      patterns.forEach(pattern => {
        if (message.includes(pattern)) {
          entities.timeReferences.push({ type: timeType, pattern, confidence: 0.7 });
        }
      });
    });

    Object.entries(appFeaturePatterns).forEach(([feature, patterns]) => {
      patterns.forEach(pattern => {
        if (message.includes(pattern)) {
          entities.appFeatures.push({ type: feature, pattern, confidence: 0.8 });
        }
      });
    });

    return { entities };
  }

  /**
   * Détection d'intention avec contexte et fallback
   */
  detectIntentWithContext(message, semanticAnalysis) {
    const entities = semanticAnalysis.entities;
    let intent = 'general';
    let confidence = 0.5;

    // Analyse des salutations avec nuances
    if (message.match(/^(bonjour|salut|hello|bonsoir|hey|coucou|bonne journée|bonne soirée)/)) {
      intent = 'greeting';
      confidence = 0.95;
    }

    // Analyse de politesse
    else if (message.match(/(merci|remercie|thanks|au revoir|bye|à bientôt)/)) {
      intent = 'politeness';
      confidence = 0.9;
    }

    // Urgences médicales - priorité absolue
    else if (entities.symptoms.length > 0) {
      const hasIntensity = entities.intensityMarkers.some(marker => marker.level === 'severe');
      const hasChestPain = entities.symptoms.some(s => s.type === 'chest_pain');

      if (hasChestPain || hasIntensity) {
        intent = 'emergency';
        confidence = 0.95;
      } else {
        intent = 'medical_consultation';
        confidence = 0.85;
      }
    }

    // Questions sur l'application avec fallback
    else if (entities.appFeatures.length > 0) {
      const feature = entities.appFeatures[0].type;
      intent = `app_${feature}`;
      confidence = 0.9;
    }

    // Fallback pour questions application (méthode classique)
    else if (message.includes('comment') && (message.includes('utiliser') || message.includes('faire') || message.includes('démarrer'))) {
      if (message.includes('diagnostic') || message.includes('ia') || message.includes('ecg')) {
        intent = 'app_diagnostic';
      } else if (message.includes('monitoring') || message.includes('surveillance')) {
        intent = 'app_monitoring';
      } else if (message.includes('export') || message.includes('données') || message.includes('historique')) {
        intent = 'app_export';
      } else {
        intent = 'app_help';
      }
      confidence = 0.8;
    }

    // Questions médicales générales
    else if (message.includes('tension') || message.includes('pression') ||
             message.includes('troponine') || message.includes('ecg') ||
             message.includes('infarctus') || message.includes('signes')) {
      intent = 'medical_info';
      confidence = 0.8;
    }

    // Questions sur CardioAI
    else if (message.includes('cardioai') || message.includes('application') ||
             message.includes('plateforme') || message.includes('qu\'est-ce que')) {
      intent = 'about_app';
      confidence = 0.8;
    }

    // Fallback pour problèmes techniques
    else if (message.includes('problème') || message.includes('bug') ||
             message.includes('erreur') || message.includes('ne fonctionne pas')) {
      intent = 'app_help';
      confidence = 0.7;
    }

    return { intent, confidence };
  }

  /**
   * Évaluation du niveau d'urgence
   */
  assessUrgencyLevel(message, semanticAnalysis) {
    const entities = semanticAnalysis.entities;

    // Mots d'urgence absolue
    const emergencyKeywords = [
      'urgent', 'urgence', 'immédiat', 'tout de suite', 'maintenant',
      'crise', 'infarctus', 'arrêt cardiaque', 'syncope'
    ];

    const hasEmergencyKeywords = emergencyKeywords.some(keyword => message.includes(keyword));
    const hasChestPain = entities.symptoms.some(s => s.type === 'chest_pain');
    const hasSevereIntensity = entities.intensityMarkers.some(m => m.level === 'severe');
    const hasImmediateTime = entities.timeReferences.some(t => t.type === 'immediate');

    if (hasEmergencyKeywords || (hasChestPain && hasSevereIntensity)) {
      return { level: 'immediate', isUrgent: true, score: 0.95 };
    } else if (hasChestPain || hasSevereIntensity) {
      return { level: 'high', isUrgent: true, score: 0.8 };
    } else if (entities.symptoms.length > 0) {
      return { level: 'moderate', isUrgent: false, score: 0.6 };
    }

    return { level: 'normal', isUrgent: false, score: 0.1 };
  }

  /**
   * Détection du contexte émotionnel
   */
  detectEmotionalContext(message) {
    const emotionPatterns = {
      'anxious': ['inquiet', 'angoissé', 'stressé', 'peur', 'anxieux', 'paniqué'],
      'confused': ['comprends pas', 'confus', 'perdu', 'sais pas', 'comment'],
      'frustrated': ['énervé', 'frustré', 'agacé', 'ne marche pas', 'problème'],
      'grateful': ['merci', 'reconnaissant', 'content', 'satisfait']
    };

    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  /**
   * Interprétation du sens réel du message
   */
  interpretUserMeaning(message, intentAnalysis, semanticAnalysis) {
    const entities = semanticAnalysis.entities;

    // Construction de l'interprétation
    let interpretation = {
      primaryNeed: intentAnalysis.intent,
      specificRequest: null,
      context: {},
      suggestedResponse: null
    };

    // Interprétation spécifique selon l'intention
    switch (intentAnalysis.intent) {
      case 'emergency':
      case 'medical_consultation':
        interpretation.specificRequest = 'medical_advice';
        interpretation.context = {
          symptoms: entities.symptoms.map(s => s.type),
          intensity: entities.intensityMarkers.map(i => i.level),
          timing: entities.timeReferences.map(t => t.type)
        };
        break;

      case 'app_diagnostic':
        interpretation.specificRequest = 'diagnostic_help';
        interpretation.suggestedResponse = 'step_by_step_guide';
        break;

      case 'app_monitoring':
        interpretation.specificRequest = 'monitoring_help';
        interpretation.suggestedResponse = 'setup_instructions';
        break;

      case 'app_export':
        interpretation.specificRequest = 'export_help';
        interpretation.suggestedResponse = 'export_steps';
        break;

      case 'app_help':
        interpretation.specificRequest = 'technical_support';
        interpretation.suggestedResponse = 'troubleshooting';
        break;
    }

    return interpretation;
  }

  /**
   * Recherche intelligente dans la base de connaissances
   */
  searchKnowledgeBase(message, analysis) {
    const results = [];
    const msg = message.toLowerCase();

    // 1. Recherche exacte par question (priorité absolue)
    const exactMatch = this.knowledgeBase.questionIndex.get(msg);
    if (exactMatch) {
      return [{ item: exactMatch, score: 100, matchType: 'exact' }];
    }

    // 2. Recherche par similarité simple (pour compatibilité)
    for (const [question, item] of this.knowledgeBase.questionIndex) {
      const similarity = this.calculateSimilarity(msg, question);
      if (similarity > 0.6) {
        results.push({ item, score: similarity * 95, matchType: 'similar' });
      }
    }

    // 3. Recherche sémantique basée sur l'interprétation
    const semanticResults = this.performSemanticSearch(analysis);
    results.push(...semanticResults);

    // 4. Recherche par mots-clés (méthode classique de fallback)
    const keywordMatches = new Map();
    analysis.keywords.forEach(keyword => {
      if (this.knowledgeBase.keywordIndex.has(keyword)) {
        this.knowledgeBase.keywordIndex.get(keyword).forEach(item => {
          const currentScore = keywordMatches.get(item.id) || 0;
          keywordMatches.set(item.id, currentScore + 15);
        });
      }
    });

    // Recherche spéciale pour "cœur bat vite" -> question 8
    if (msg.includes('cœur bat') || msg.includes('coeur bat') ||
        msg.includes('rythme') && msg.includes('rapide')) {
      const item8 = this.knowledgeBase.qnaList.find(q => q.id === 8);
      if (item8) {
        results.push({ item: item8, score: 85, matchType: 'special_heart_rate' });
      }
    }

    keywordMatches.forEach((score, itemId) => {
      const item = this.knowledgeBase.qnaList.find(q => q.id === itemId);
      if (item && score > 20) {
        results.push({ item, score, matchType: 'keyword' });
      }
    });

    // 5. Recherche par entités sémantiques
    if (analysis.semanticEntities) {
      const entityResults = this.searchBySemanticEntities(analysis.semanticEntities);
      results.push(...entityResults);
    }

    // 6. Recherche par intention intelligente
    const intentResults = this.searchByIntelligentIntent(analysis);
    results.push(...intentResults);

    // 7. Recherche par tags (fallback classique)
    const intentTagMap = {
      'emergency': ['urgence', 'IDM', 'emergency'],
      'medical_consultation': ['urgence', 'IDM', 'patient'],
      'medical_info': ['exam', 'ECG', 'monitoring', 'tension', 'troponine'],
      'app_diagnostic': ['diagnostic', 'guide', 'technique'],
      'app_monitoring': ['monitoring', 'guide', 'technique'],
      'app_export': ['export', 'guide', 'technique'],
      'app_help': ['dépannage', 'support', 'technique'],
      'about_app': ['présentation', 'fonctionnalités', 'IA', 'IoT']
    };

    if (intentTagMap[analysis.intent]) {
      intentTagMap[analysis.intent].forEach(tag => {
        if (this.knowledgeBase.tagIndex.has(tag)) {
          this.knowledgeBase.tagIndex.get(tag).forEach(item => {
            results.push({ item, score: 25, matchType: 'tag' });
          });
        }
      });
    }

    // Tri par score et suppression des doublons
    const uniqueResults = new Map();
    results.forEach(result => {
      const existing = uniqueResults.get(result.item.id);
      if (!existing || existing.score < result.score) {
        uniqueResults.set(result.item.id, result);
      }
    });

    return Array.from(uniqueResults.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  /**
   * Recherche sémantique avancée
   */
  performSemanticSearch(analysis) {
    const results = [];
    const entities = analysis.semanticEntities;

    // Recherche basée sur les symptômes détectés
    if (entities.symptoms.length > 0) {
      entities.symptoms.forEach(symptom => {
        const matchingItems = this.findItemsBySymptom(symptom.type);
        matchingItems.forEach(item => {
          results.push({
            item,
            score: 85 * symptom.confidence,
            matchType: 'semantic_symptom'
          });
        });
      });
    }

    // Recherche basée sur les fonctionnalités app
    if (entities.appFeatures.length > 0) {
      entities.appFeatures.forEach(feature => {
        const matchingItems = this.findItemsByAppFeature(feature.type);
        matchingItems.forEach(item => {
          results.push({
            item,
            score: 80 * feature.confidence,
            matchType: 'semantic_app'
          });
        });
      });
    }

    return results;
  }

  /**
   * Recherche par entités sémantiques
   */
  searchBySemanticEntities(entities) {
    const results = [];

    // Mapping des symptômes vers les IDs de questions
    const symptomToQuestionMap = {
      'chest_pain': [1, 2], // Questions sur douleur thoracique et infarctus
      'palpitations': [8], // Question sur rythme rapide
      'shortness_of_breath': [7], // Question sur insuffisance cardiaque
    };

    console.log('🔍 Recherche par entités sémantiques:', entities);

    entities.symptoms.forEach(symptom => {
      const questionIds = symptomToQuestionMap[symptom.type] || [];
      questionIds.forEach(id => {
        const item = this.knowledgeBase.qnaList.find(q => q.id === id);
        if (item) {
          results.push({
            item,
            score: 90 * symptom.confidence,
            matchType: 'entity_symptom'
          });
        }
      });
    });

    return results;
  }

  /**
   * Recherche par intention intelligente
   */
  searchByIntelligentIntent(analysis) {
    const results = [];

    // Mapping des intentions vers les questions appropriées
    const intentToQuestionMap = {
      'app_diagnostic': [100], // Guide diagnostic IA
      'app_monitoring': [101], // Guide monitoring
      'app_export': [102], // Guide export
      'app_help': [103], // Support technique
      'about_app': [104], // Présentation app
      'emergency': [1, 2], // Urgences cardiaques
      'medical_consultation': [1, 2, 8], // Consultations médicales
      'medical_info': [3, 4, 5, 6, 7] // Informations médicales
    };

    const questionIds = intentToQuestionMap[analysis.intent] || [];
    questionIds.forEach(id => {
      const item = this.knowledgeBase.qnaList.find(q => q.id === id);
      if (item) {
        results.push({
          item,
          score: 75 * analysis.confidence,
          matchType: 'intelligent_intent'
        });
      }
    });

    return results;
  }

  /**
   * Calcul de similarité contextuelle
   */
  calculateContextualSimilarity(str1, str2, analysis) {
    // Similarité de base
    const baseSimilarity = this.calculateSimilarity(str1, str2);

    // Bonus selon le contexte
    let contextBonus = 0;

    // Bonus pour urgence
    if (analysis.isUrgent && (str2.includes('urgence') || str2.includes('douleur'))) {
      contextBonus += 0.2;
    }

    // Bonus pour fonctionnalités app
    if (analysis.intent.startsWith('app_') && str2.includes('comment')) {
      contextBonus += 0.15;
    }

    // Bonus pour état émotionnel
    if (analysis.emotionalState === 'anxious' && str2.includes('que faire')) {
      contextBonus += 0.1;
    }

    return Math.min(baseSimilarity + contextBonus, 1.0);
  }

  findItemsBySymptom(symptomType) {
    // Retourne les items de la base correspondant au symptôme
    const symptomMap = {
      'chest_pain': [1, 2],
      'palpitations': [8],
      'shortness_of_breath': [7]
    };

    console.log(`🔍 Recherche symptôme "${symptomType}" -> IDs:`, symptomMap[symptomType]);

    const ids = symptomMap[symptomType] || [];
    const items = ids.map(id => this.knowledgeBase.qnaList.find(q => q.id === id)).filter(Boolean);

    console.log(`📋 Items trouvés pour "${symptomType}":`, items.map(i => i.questions[0]));

    return items;
  }

  findItemsByAppFeature(featureType) {
    // Retourne les items de la base correspondant à la fonctionnalité
    const featureMap = {
      'diagnostic': [100],
      'monitoring': [101],
      'export': [102],
      'help': [103]
    };

    const ids = featureMap[featureType] || [];
    return ids.map(id => this.knowledgeBase.qnaList.find(q => q.id === id)).filter(Boolean);
  }

  calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  /**
   * Génération de réponse intelligente et contextuelle
   */
  async generateEnrichedResponse(message, analysis) {
    console.log('🧠 Analyse intelligente:', {
      intent: analysis.intent,
      confidence: analysis.confidence,
      urgency: analysis.urgencyLevel,
      emotion: analysis.emotionalState,
      interpretation: analysis.interpretedMeaning
    });

    // Recherche intelligente dans la base de connaissances
    const searchResults = this.searchKnowledgeBase(message, analysis);

    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];

      // Génération de réponse contextuelle
      return this.generateContextualResponse(bestMatch.item, analysis, searchResults);
    }

    // Réponse intelligente de fallback
    return this.generateIntelligentFallback(analysis);
  }

  /**
   * Génération de réponse contextuelle
   */
  generateContextualResponse(qnaItem, analysis, allResults) {
    let response = '';

    // Adaptation selon l'état émotionnel
    const emotionalPrefix = this.getEmotionalPrefix(analysis.emotionalState, analysis.isUrgent);
    if (emotionalPrefix) {
      response += emotionalPrefix + '\n\n';
    }

    // Pour les urgences, réponse immédiate
    if (analysis.isUrgent && qnaItem.shortAnswer) {
      response += `🚨 ${qnaItem.shortAnswer}\n\n`;
    }

    // Réponse principale adaptée au contexte
    const adaptedAnswer = this.adaptAnswerToContext(qnaItem.answer, analysis);
    response += adaptedAnswer;

    // Ajout contextuel selon l'interprétation
    const contextualAddition = this.getContextualAddition(analysis);
    if (contextualAddition) {
      response += '\n\n' + contextualAddition;
    }

    // Numéros d'urgence seulement si vraiment nécessaire
    if (analysis.urgencyLevel === 'immediate') {
      response += '\n\nNuméros d\'urgence : SAMU 15, Pompiers 18';
    }

    // Mise à jour du contexte conversationnel
    this.updateConversationContext(qnaItem, analysis);

    return response;
  }

  /**
   * Préfixe émotionnel adapté
   */
  getEmotionalPrefix(emotionalState, isUrgent) {
    if (isUrgent) {
      switch (emotionalState) {
        case 'anxious':
          return 'Je comprends votre inquiétude. Voici ce qu\'il faut faire :';
        case 'confused':
          return 'Pas de panique, je vais vous expliquer clairement :';
        default:
          return null;
      }
    } else {
      switch (emotionalState) {
        case 'anxious':
          return 'Je comprends votre préoccupation.';
        case 'confused':
          return 'Je vais vous expliquer simplement :';
        case 'frustrated':
          return 'Je vais vous aider à résoudre ce problème.';
        default:
          return null;
      }
    }
  }

  /**
   * Adaptation de la réponse au contexte
   */
  adaptAnswerToContext(answer, analysis) {
    // Si l'utilisateur semble anxieux, adapter le ton
    if (analysis.emotionalState === 'anxious' && analysis.isUrgent) {
      // Rendre la réponse plus rassurante
      return answer.replace(/\./g, '. Restez calme,');
    }

    // Si l'utilisateur semble confus, simplifier
    if (analysis.emotionalState === 'confused') {
      // Garder l'essentiel
      const sentences = answer.split('. ');
      return sentences.slice(0, 3).join('. ') + '.';
    }

    return answer;
  }

  /**
   * Ajout contextuel selon l'interprétation
   */
  getContextualAddition(analysis) {
    const interpretation = analysis.interpretedMeaning;

    if (interpretation.specificRequest === 'medical_advice' && analysis.emotionalState === 'anxious') {
      return 'N\'hésitez pas à me poser d\'autres questions si vous avez besoin de clarifications.';
    }

    if (interpretation.specificRequest === 'diagnostic_help' && analysis.emotionalState === 'confused') {
      return 'Si vous avez des difficultés avec une étape, dites-moi laquelle et je vous donnerai plus de détails.';
    }

    if (interpretation.specificRequest === 'technical_support') {
      return 'Si le problème persiste, n\'hésitez pas à me donner plus de détails sur l\'erreur.';
    }

    return null;
  }

  /**
   * Fallback intelligent basé sur l'analyse
   */
  generateIntelligentFallback(analysis) {
    const interpretation = analysis.interpretedMeaning;

    // Fallback selon l'intention détectée
    if (analysis.intent === 'greeting') {
      return this.generateGreeting();
    }

    if (analysis.intent === 'politeness') {
      return this.generatePolitenessResponse(analysis.originalMessage);
    }

    // Fallback médical intelligent
    if (analysis.semanticEntities.symptoms.length > 0) {
      const symptoms = analysis.semanticEntities.symptoms.map(s => s.type).join(', ');
      return `Je vois que vous mentionnez des symptômes (${symptoms}). Pouvez-vous me donner plus de détails ? Par exemple, depuis quand ressentez-vous cela et quelle est l'intensité ?`;
    }

    // Fallback application intelligent
    if (analysis.semanticEntities.appFeatures.length > 0) {
      const features = analysis.semanticEntities.appFeatures.map(f => f.type).join(', ');
      return `Je vois que vous vous intéressez à ${features}. Voulez-vous que je vous explique comment utiliser cette fonctionnalité étape par étape ?`;
    }

    // Fallback selon l'état émotionnel
    if (analysis.emotionalState === 'confused') {
      return `Je vois que vous cherchez des informations. Pouvez-vous me dire plus précisément ce que vous voulez savoir ? Je peux vous aider avec les symptômes cardiaques ou l'utilisation de l'application.`;
    }

    if (analysis.emotionalState === 'frustrated') {
      return `Je comprends votre frustration. Dites-moi exactement quel est le problème et je vais faire de mon mieux pour vous aider rapidement.`;
    }

    // Fallback général intelligent
    return `Je n'ai pas trouvé de réponse précise, mais je peux vous aider avec les symptômes cardiaques ou l'utilisation de CardioAI. Que cherchez-vous exactement ?`;
  }



  generateFallbackResponse(analysis) {
    if (analysis.intent === 'greeting') {
      return this.generateGreeting();
    }

    if (analysis.intent === 'politeness') {
      return this.generatePolitenessResponse(analysis.originalMessage);
    }

    if (analysis.intent === 'application') {
      return this.generateApplicationHelp();
    }

    if (analysis.intent === 'about_app') {
      return this.generateAppPresentation();
    }

    return `Je n'ai pas trouvé de réponse précise à votre question. Pouvez-vous reformuler ou être plus spécifique ?

Je peux vous aider avec les symptômes cardiaques, l'utilisation de l'application, ou les résultats d'examens.`;
  }

  generateGreeting() {
    return `💬 Exemple de conversation :

👤 Vous: "J'ai une douleur thoracique depuis 30 minutes, que faire ?"
🤖 Assistant: "🚨 URGENCE MÉDICALE - Appelez immédiatement le SAMU (15) ou les pompiers (18). Ne conduisez pas vous-même."`;
  }

  generatePolitenessResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes('merci') || msg.includes('remercie') || msg.includes('thanks')) {
      return `De rien ! N'hésitez pas si vous avez d'autres questions.`;
    }

    if (msg.includes('au revoir') || msg.includes('bye') || msg.includes('à bientôt')) {
      return `Au revoir ! Prenez soin de vous et n'hésitez pas à revenir si besoin.`;
    }

    if (msg.includes('bonne journée') || msg.includes('bonne soirée')) {
      return `Merci, excellente journée à vous aussi !`;
    }

    return `Merci ! Comment puis-je vous aider ?`;
  }

  generateApplicationHelp() {
    return `CardioAI a trois fonctions principales :

1. Diagnostic IA - Analysez vos ECG avec l'intelligence artificielle
2. Monitoring IoT - Surveillez vos paramètres cardiaques en temps réel
3. Historique - Consultez et exportez vos données

Que voulez-vous faire exactement ?`;
  }

  generateAppPresentation() {
    return `CardioAI est une plateforme de santé cardiaque qui combine intelligence artificielle et monitoring IoT.

Elle permet de :
- Analyser vos ECG avec une IA précise à plus de 95%
- Surveiller vos paramètres cardiaques en temps réel
- Détecter précocement les anomalies cardiaques
- Exporter vos données pour vos consultations médicales

L'application est utilisée par les patients et les professionnels de santé pour améliorer le diagnostic et le suivi cardiaque.`;
  }

  updateConversationContext(qnaItem, analysis) {
    this.conversationContext.lastQuestions.push({
      qnaId: qnaItem.id,
      intent: analysis.intent,
      timestamp: new Date()
    });
    
    // Garder seulement les 5 dernières questions
    if (this.conversationContext.lastQuestions.length > 5) {
      this.conversationContext.lastQuestions.shift();
    }
    
    // Mise à jour du sujet actuel
    if (qnaItem.metadata && qnaItem.metadata.tags) {
      this.conversationContext.currentTopic = qnaItem.metadata.tags.split(';')[0];
    }
  }

  // Méthodes de gestion des conversations
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
        console.error('Erreur listener:', error);
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
    console.log('🧠 Processing with Enriched Knowledge Base:', userMessage);

    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    // Simulation temps de traitement
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const analysis = this.analyzeMessage(userMessage);
      console.log('📊 Message Analysis:', {
        intent: analysis.intent,
        confidence: analysis.confidence,
        urgency: analysis.urgencyLevel,
        emotion: analysis.emotionalState,
        keywords: analysis.keywords
      });

      const response = await this.generateEnrichedResponse(userMessage, analysis);

      this.isTyping = false;
      this.addMessage('bot', response);

    } catch (error) {
      console.error('Erreur Enriched Chatbot:', error);
      this.isTyping = false;
      this.addMessage('bot', '🔧 Désolé, j\'ai rencontré un problème. Pouvez-vous reformuler votre question ?');
    }
  }

  startConversation() {
    const welcome = this.generateGreeting();
    this.addMessage('bot', welcome);
  }

  clearConversation() {
    this.conversations = [];
    this.conversationContext = {
      lastQuestions: [],
      userProfile: {},
      currentTopic: null
    };
    this.notifyListeners();
  }

  getFrequentQuestions() {
    // Retourne les questions les plus représentatives de la base
    return [
      "Bonjour, comment allez-vous ?",
      "Comment utiliser le diagnostic IA ?",
      "J'ai une douleur thoracique depuis 30 minutes, que faire ?",
      "Comment démarrer le monitoring IoT ?",
      "Quels sont les signes d'un infarctus ?",
      "Comment exporter mes données ?",
      "Qu'est-ce que CardioAI ?",
      "Comment prendre correctement ma tension à la maison ?"
    ];
  }

  // Méthodes utilitaires
  getKnowledgeBaseStats() {
    return {
      totalQuestions: this.knowledgeBase.qnaList.length,
      totalKeywords: this.knowledgeBase.keywordIndex.size,
      totalTags: this.knowledgeBase.tagIndex.size,
      languages: ['fr'],
      audiences: ['patient', 'doctor', 'student']
    };
  }
}

// Instance singleton
const enrichedChatbotService = new EnrichedChatbotService();

export default enrichedChatbotService;
