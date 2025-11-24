/**
 * Service de chatbot intelligent pour CardioAI
 * Répond aux questions des utilisateurs sur l'application
 */
class ChatbotService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    
    // Base de connaissances de l'application
    this.knowledgeBase = {
      // Informations générales
      general: {
        keywords: ['cardioai', 'application', 'qu\'est-ce que', 'présentation', 'aide', 'app', 'info', 'test'],
        responses: [
          "CardioAI est une application de diagnostic cardiaque utilisant l'intelligence artificielle et le monitoring IoT. 🫀",
          "Notre application combine un modèle XResNet pour l'analyse d'ECG avec un système de surveillance en temps réel. 📊",
          "CardioAI vous aide à surveiller votre santé cardiaque avec des outils professionnels et des alertes intelligentes. ⚕️",
          "Je suis l'assistant CardioAI ! Je peux vous aider avec toutes les fonctionnalités de l'application. 🤖"
        ]
      },
      
      // Diagnostic IA
      diagnostic: {
        keywords: ['diagnostic', 'ia', 'ecg', 'analyse', 'xresnet', 'modèle'],
        responses: [
          "Le diagnostic IA utilise un modèle XResNet entraîné pour analyser vos images ECG et données cliniques.",
          "Pour utiliser le diagnostic : 1) Téléchargez votre ECG, 2) Remplissez vos données cliniques, 3) Cliquez sur 'Analyser'.",
          "Le modèle analyse votre âge, pression artérielle, cholestérol, fréquence cardiaque et autres paramètres pour un diagnostic précis."
        ]
      },
      
      // Monitoring IoT
      monitoring: {
        keywords: ['monitoring', 'iot', 'capteurs', 'temps réel', 'surveillance'],
        responses: [
          "Le monitoring IoT surveille vos paramètres vitaux en temps réel : fréquence cardiaque, tension, température, SpO₂.",
          "Pour démarrer : Allez sur 'Monitoring IoT' et cliquez sur 'Démarrer le monitoring'. Les données sont automatiquement enregistrées.",
          "Le système génère des alertes automatiques si vos paramètres dépassent les seuils normaux (>100 BPM, >37.5°C, etc.)."
        ]
      },
      
      // Notifications
      notifications: {
        keywords: ['notifications', 'alertes', 'seuils', 'avertissements'],
        responses: [
          "Les notifications vous alertent en temps réel : en haut de page et dans le panneau latéral (icône 🔔).",
          "Types d'alertes : Fréquence cardiaque anormale, fièvre, hypoxémie, hypertension.",
          "Vous pouvez tester les notifications, les supprimer individuellement ou toutes les effacer."
        ]
      },
      
      // Historique
      history: {
        keywords: ['historique', 'sessions', 'données', 'export', 'csv'],
        responses: [
          "L'historique sauvegarde toutes vos sessions de monitoring avec statistiques complètes.",
          "Consultez vos sessions passées, exportez en CSV, et analysez vos tendances de santé.",
          "Chaque session contient : durée, nombre de mesures, alertes générées, et moyennes de tous vos paramètres."
        ]
      },
      
      // Paramètres
      settings: {
        keywords: ['paramètres', 'configuration', 'réglages', 'personnalisation'],
        responses: [
          "Dans les paramètres, configurez vos notifications, seuils d'alerte et préférences de l'application.",
          "Vous pouvez activer/désactiver les notifications, ajuster les seuils de monitoring et personnaliser votre expérience."
        ]
      },
      
      // Seuils médicaux
      thresholds: {
        keywords: ['seuils', 'normaux', 'valeurs', 'limites', 'bpm', 'tension'],
        responses: [
          "Seuils d'alerte : Fréquence cardiaque >100 ou <60 BPM, Température >37.5°C, SpO₂ <95%, Tension >140/90 mmHg.",
          "Ces seuils sont basés sur les recommandations médicales standard pour détecter les anomalies.",
          "Les alertes vous aident à identifier rapidement les situations nécessitant une attention médicale."
        ]
      },
      
      // Utilisation
      usage: {
        keywords: ['comment', 'utiliser', 'commencer', 'démarrer', 'tutoriel'],
        responses: [
          "Pour commencer : 1) Diagnostic IA pour analyser un ECG, 2) Monitoring IoT pour surveillance temps réel, 3) Historique pour consulter vos données.",
          "Navigation simple : utilisez le menu en haut pour accéder à toutes les fonctionnalités.",
          "Chaque section a des boutons clairs et des instructions pour vous guider."
        ]
      },

      // Données cliniques
      clinical: {
        keywords: ['données cliniques', 'paramètres', 'âge', 'cholestérol', 'pression'],
        responses: [
          "Les données cliniques requises : âge, pression artérielle au repos, cholestérol, fréquence cardiaque max, dépression ST.",
          "Aussi nécessaires : type de douleur thoracique, ECG au repos, pente du segment ST, thalassémie.",
          "Ces paramètres permettent au modèle XResNet de faire un diagnostic précis de votre condition cardiaque."
        ]
      },

      // Sécurité et confidentialité
      security: {
        keywords: ['sécurité', 'confidentialité', 'données', 'privé', 'protection'],
        responses: [
          "Vos données sont stockées localement sur votre appareil et ne sont jamais envoyées à des serveurs externes.",
          "CardioAI respecte votre vie privée : aucune donnée personnelle n'est partagée ou vendue.",
          "Vous pouvez supprimer vos sessions et données à tout moment depuis l'historique."
        ]
      },

      // Problèmes techniques
      technical: {
        keywords: ['problème', 'erreur', 'bug', 'ne marche pas', 'aide technique'],
        responses: [
          "Si le diagnostic ne fonctionne pas, vérifiez que votre image ECG est bien téléchargée et que tous les champs sont remplis.",
          "Pour le monitoring, assurez-vous d'avoir cliqué sur 'Démarrer le monitoring' et attendez quelques secondes.",
          "Si les notifications n'apparaissent pas, vérifiez vos paramètres de navigateur et actualisez la page."
        ]
      },

      // Connaissances médicales - ECG
      ecg_medical: {
        keywords: ['ecg', 'électrocardiogramme', 'onde', 'rythme cardiaque', 'arythmie', 'fibrillation'],
        responses: [
          "L'ECG (électrocardiogramme) enregistre l'activité électrique du cœur. Il détecte les arythmies, infarctus, et autres anomalies cardiaques.",
          "Les ondes principales d'un ECG : onde P (contraction auriculaire), complexe QRS (contraction ventriculaire), onde T (relaxation ventriculaire).",
          "Un ECG normal montre un rythme sinusal régulier entre 60-100 BPM. Les anomalies peuvent indiquer des problèmes cardiaques.",
          "Notre modèle IA analyse automatiquement votre ECG pour détecter 12 types de pathologies cardiaques courantes."
        ]
      },

      // Pathologies cardiaques
      pathologies: {
        keywords: ['infarctus', 'crise cardiaque', 'angine', 'insuffisance cardiaque', 'hypertension', 'tachycardie', 'bradycardie'],
        responses: [
          "L'infarctus du myocarde survient quand une artère coronaire se bouche, privant le muscle cardiaque d'oxygène. Symptômes : douleur thoracique, essoufflement.",
          "L'angine de poitrine est une douleur thoracique due à un manque d'oxygène au cœur, souvent déclenchée par l'effort ou le stress.",
          "L'insuffisance cardiaque survient quand le cœur ne pompe plus efficacement. Symptômes : fatigue, essoufflement, œdèmes.",
          "La tachycardie (>100 BPM) et bradycardie (<60 BPM) sont des troubles du rythme cardiaque qui peuvent nécessiter un traitement."
        ]
      },

      // Facteurs de risque
      risk_factors: {
        keywords: ['facteur de risque', 'cholestérol', 'diabète', 'tabac', 'obésité', 'stress', 'hérédité'],
        responses: [
          "Facteurs de risque cardiovasculaire : âge, sexe masculin, tabagisme, hypertension, diabète, cholestérol élevé, obésité, sédentarité.",
          "Le cholestérol LDL ('mauvais') doit être <1.6 g/L. Le HDL ('bon') doit être >0.4 g/L chez l'homme, >0.5 g/L chez la femme.",
          "Le diabète multiplie par 2-4 le risque cardiovasculaire. Un bon contrôle glycémique (HbA1c <7%) est essentiel.",
          "Le stress chronique augmente le risque cardiaque via l'hypertension et l'inflammation. La gestion du stress est importante."
        ]
      },

      // Prévention
      prevention: {
        keywords: ['prévention', 'exercice', 'alimentation', 'régime', 'sport', 'activité physique'],
        responses: [
          "Prévention cardiovasculaire : 150 min d'activité modérée/semaine, alimentation méditerranéenne, arrêt du tabac, gestion du stress.",
          "Alimentation cardio-protectrice : fruits, légumes, poissons gras, noix, huile d'olive. Limiter sel, sucres, graisses saturées.",
          "L'exercice régulier renforce le cœur, améliore la circulation, réduit la pression artérielle et le cholestérol.",
          "Contrôles réguliers : pression artérielle, cholestérol, glycémie. Dépistage précoce = meilleur pronostic."
        ]
      },

      // Paramètres vitaux
      vital_signs: {
        keywords: ['fréquence cardiaque', 'tension', 'pression artérielle', 'pouls', 'saturation', 'température'],
        responses: [
          "Fréquence cardiaque normale : 60-100 BPM au repos. <60 = bradycardie, >100 = tachycardie. Varie selon âge, forme physique.",
          "Pression artérielle normale : <120/80 mmHg. Hypertension si >140/90 mmHg. Facteur de risque majeur d'AVC et infarctus.",
          "Saturation en oxygène (SpO₂) normale : 95-100%. <95% = hypoxémie, peut indiquer un problème cardiaque ou pulmonaire.",
          "Température corporelle normale : 36.1-37.2°C. La fièvre augmente le travail cardiaque et peut déclencher des arythmies."
        ]
      },

      // Urgences cardiaques
      emergencies: {
        keywords: ['urgence', 'douleur thoracique', 'essoufflement', 'malaise', 'palpitations', 'syncope'],
        responses: [
          "URGENCE : Douleur thoracique intense, essoufflement soudain, malaise → Appelez le 15 (SAMU) immédiatement !",
          "Signes d'infarctus : douleur thoracique constrictive, irradiation bras gauche/mâchoire, sueurs, nausées, angoisse.",
          "Palpitations inquiétantes : rythme très rapide/irrégulier, avec malaise, douleur thoracique ou essoufflement.",
          "Syncope cardiaque : perte de connaissance brutale, peut révéler un trouble du rythme grave. Consultation urgente."
        ]
      },

      // Médicaments cardiaques
      medications: {
        keywords: ['médicament', 'traitement', 'bêta-bloquant', 'aspirine', 'statine', 'iec', 'anticoagulant'],
        responses: [
          "Médicaments cardiaques courants : bêta-bloquants (ralentissent le cœur), IEC (protègent le cœur), statines (cholestérol).",
          "L'aspirine à faible dose (75-100mg) prévient les caillots chez les patients à risque cardiovasculaire élevé.",
          "Les anticoagulants (warfarine, nouveaux anticoagulants) préviennent les AVC en cas de fibrillation auriculaire.",
          "⚠️ Ne jamais arrêter un traitement cardiaque sans avis médical. Respecter les doses et horaires prescrits."
        ]
      },

      // Examens cardiaques
      cardiac_tests: {
        keywords: ['examen', 'échographie cardiaque', 'coronarographie', 'holter', 'épreuve d\'effort', 'scanner cardiaque'],
        responses: [
          "Échographie cardiaque : évalue la fonction du cœur, les valves, détecte les anomalies structurelles. Examen de référence.",
          "Coronarographie : radiographie des artères coronaires avec produit de contraste. Gold standard pour diagnostiquer les sténoses.",
          "Holter ECG : enregistrement continu 24-48h pour détecter les troubles du rythme intermittents.",
          "Épreuve d'effort : ECG pendant exercice progressif. Détecte l'ischémie myocardique et évalue la capacité fonctionnelle."
        ]
      }
    };
    
    // Messages de bienvenue
    this.welcomeMessages = [
      "Bonjour ! Je suis l'assistant CardioAI. Comment puis-je vous aider aujourd'hui ? 🫀",
      "Salut ! Je peux répondre à vos questions sur le diagnostic IA, le monitoring IoT, les notifications et plus encore !",
      "Hello ! Besoin d'aide avec CardioAI ? Demandez-moi tout sur l'application !"
    ];
    
    // Messages par défaut
    this.defaultResponses = [
      "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ? 🤔",
      "Hmm, je n'ai pas d'information spécifique sur ce sujet. Essayez de demander sur le diagnostic IA, le monitoring IoT, ou les notifications. 💡",
      "Désolé, je ne trouve pas de réponse à cette question. Voulez-vous en savoir plus sur les fonctionnalités de CardioAI ? 🫀",
      "Je peux vous aider avec : le diagnostic IA, le monitoring IoT, les notifications, l'historique des sessions, ou les paramètres. Que voulez-vous savoir ? 😊"
    ];
  }

  /**
   * Ajoute un listener pour les changements
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifie tous les listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          conversations: this.conversations,
          isTyping: this.isTyping
        });
      } catch (error) {
        console.error('Erreur dans le listener du chatbot:', error);
      }
    });
  }

  /**
   * Démarre une nouvelle conversation
   */
  startConversation() {
    const welcomeMessage = this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)];
    this.addMessage('bot', welcomeMessage);
  }

  /**
   * Ajoute un message à la conversation
   */
  addMessage(sender, content, type = 'text') {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender, // 'user' ou 'bot'
      content,
      type, // 'text', 'suggestion', 'action'
      timestamp: new Date().toISOString()
    };

    this.conversations.push(message);
    this.notifyListeners();
    return message.id;
  }

  /**
   * Traite un message utilisateur et génère une réponse
   */
  async processUserMessage(userMessage) {
    console.log('Processing user message:', userMessage);

    // Ajouter le message utilisateur
    this.addMessage('user', userMessage);

    // Simuler que le bot tape
    this.isTyping = true;
    this.notifyListeners();

    // Délai réaliste pour la réponse
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Analyser le message et générer une réponse
    const response = this.generateResponse(userMessage);
    console.log('Generated response:', response);

    // Arrêter l'indicateur de frappe
    this.isTyping = false;

    // Ajouter la réponse du bot
    this.addMessage('bot', response);

    // Ajouter des suggestions si pertinent
    const suggestions = this.generateSuggestions(userMessage);
    if (suggestions.length > 0) {
      setTimeout(() => {
        suggestions.forEach(suggestion => {
          this.addMessage('bot', suggestion, 'suggestion');
        });
      }, 500);
    }
  }

  /**
   * Normalise le message en remplaçant les synonymes
   */
  normalizeMessage(message) {
    const synonyms = {
      'coeur': 'cardiaque',
      'cœur': 'cardiaque',
      'battement': 'fréquence cardiaque',
      'pouls': 'fréquence cardiaque',
      'tension': 'pression artérielle',
      'ta': 'pression artérielle',
      'souffle': 'essoufflement',
      'fatigue': 'essoufflement',
      'mal': 'douleur',
      'ça fait mal': 'douleur',
      'oxygène': 'saturation',
      'o2': 'saturation',
      'fièvre': 'température',
      'chaud': 'température'
    };

    let normalized = message;
    for (const [synonym, replacement] of Object.entries(synonyms)) {
      normalized = normalized.replace(new RegExp(synonym, 'gi'), replacement);
    }
    return normalized;
  }

  /**
   * Génère une réponse basée sur le message utilisateur
   */
  generateResponse(userMessage) {
    let message = userMessage.toLowerCase().trim();
    message = this.normalizeMessage(message);
    console.log('Analyzing normalized message:', message);

    // Réponses spéciales pour certains mots-clés
    if (message.includes('merci') || message.includes('thanks')) {
      return "De rien ! N'hésitez pas si vous avez d'autres questions sur CardioAI ! 😊";
    }

    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return "Bonjour ! Comment puis-je vous aider avec CardioAI aujourd'hui ?";
    }

    if (message.includes('au revoir') || message.includes('bye')) {
      return "Au revoir ! Prenez soin de votre santé cardiaque ! 🫀";
    }

    // Détection d'urgences médicales
    const urgencyKeywords = ['douleur thoracique', 'mal au cœur', 'crise cardiaque', 'infarctus', 'malaise', 'essoufflement soudain', 'palpitations fortes'];
    const hasUrgency = urgencyKeywords.some(keyword => message.includes(keyword));

    if (hasUrgency) {
      return "🚨 URGENCE MÉDICALE 🚨\n\nSi vous ressentez :\n• Douleur thoracique intense\n• Essoufflement soudain\n• Malaise important\n• Palpitations avec malaise\n\n➡️ APPELEZ LE 15 (SAMU) IMMÉDIATEMENT !\n\nNe perdez pas de temps, chaque minute compte pour votre cœur.";
    }

    // Réponses spécifiques combinées et contextuelles
    if ((message.includes('télécharger') || message.includes('upload')) && message.includes('ecg')) {
      return "Pour télécharger un ECG : 1) Allez sur 'Diagnostic IA', 2) Cliquez sur 'Choisir un fichier', 3) Sélectionnez votre image ECG (JPG, PNG, etc.), 4) L'image apparaîtra dans l'aperçu. 📁";
    }

    if (message.includes('exporter') && message.includes('csv')) {
      return "Pour exporter vos données : 1) Allez sur 'Historique', 2) Cliquez sur l'icône 📥 à côté de la session, 3) Le fichier CSV se télécharge automatiquement avec toutes vos mesures. 📊";
    }

    if (message.includes('supprimer') && message.includes('notification')) {
      return "Pour supprimer les notifications : Cliquez sur l'icône 🔔 en haut, puis sur ❌ pour une notification ou 'Tout effacer' pour toutes les supprimer. 🗑️";
    }

    // Questions médicales spécifiques
    if (message.includes('normal') && (message.includes('valeur') || message.includes('taux'))) {
      return "Valeurs normales : Fréquence cardiaque 60-100 BPM, Tension <120/80 mmHg, SpO₂ >95%, Température 36.1-37.2°C, Cholestérol total <2g/L. ⚕️";
    }

    if (message.includes('que faire') && (message.includes('douleur') || message.includes('mal'))) {
      return "⚠️ URGENCE : Douleur thoracique intense = Appelez le 15 immédiatement ! Douleur légère = Consultez votre médecin. Ne jamais ignorer une douleur thoracique.";
    }

    if (message.includes('interpréter') && message.includes('résultat')) {
      return "Interprétation des résultats : Notre IA donne un diagnostic avec niveau de confiance. Consultez toujours un cardiologue pour confirmation et traitement. 🩺";
    }

    if (message.includes('fiable') || message.includes('précis')) {
      return "Notre modèle XResNet a une précision de >90% sur les pathologies cardiaques courantes. Cependant, il ne remplace pas l'avis médical professionnel. 🎯";
    }

    // Rechercher dans la base de connaissances avec scoring
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      let score = 0;
      for (const keyword of data.keywords) {
        if (message.includes(keyword)) {
          score += keyword.length; // Plus le mot-clé est long, plus il est spécifique
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = data;
      }
    }

    if (bestMatch && bestScore > 0) {
      console.log('Found match with score:', bestScore);
      const responses = bestMatch.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    console.log('No match found, using default response');
    // Réponse par défaut
    const defaultResponses = this.defaultResponses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Génère des suggestions basées sur le contexte
   */
  generateSuggestions(userMessage) {
    const message = userMessage.toLowerCase();
    const suggestions = [];

    if (message.includes('diagnostic') || message.includes('ecg')) {
      suggestions.push("💡 Comment interpréter les résultats du diagnostic ?");
      suggestions.push("💡 Quels paramètres cliniques sont nécessaires ?");
      suggestions.push("💡 Que signifient les ondes P, QRS, T sur un ECG ?");
    }

    if (message.includes('monitoring') || message.includes('capteurs')) {
      suggestions.push("💡 Quels sont les seuils d'alerte normaux ?");
      suggestions.push("💡 Comment exporter mes données de monitoring ?");
      suggestions.push("💡 Que faire si j'ai une alerte ?");
    }

    if (message.includes('notifications') || message.includes('alertes')) {
      suggestions.push("💡 Que signifient les différentes couleurs d'alerte ?");
      suggestions.push("💡 Comment personnaliser les seuils ?");
    }

    if (message.includes('douleur') || message.includes('symptôme')) {
      suggestions.push("💡 Quels sont les signes d'urgence cardiaque ?");
      suggestions.push("💡 Quand consulter un médecin ?");
      suggestions.push("💡 Comment prévenir les problèmes cardiaques ?");
    }

    if (message.includes('médicament') || message.includes('traitement')) {
      suggestions.push("💡 Quels sont les médicaments cardiaques courants ?");
      suggestions.push("💡 Effets secondaires à surveiller ?");
    }

    if (message.includes('exercice') || message.includes('sport')) {
      suggestions.push("💡 Quel exercice pour le cœur ?");
      suggestions.push("💡 Précautions avant le sport ?");
    }

    if (message.includes('cholestérol') || message.includes('tension')) {
      suggestions.push("💡 Comment améliorer mon cholestérol ?");
      suggestions.push("💡 Alimentation pour le cœur ?");
    }

    return suggestions;
  }

  /**
   * Obtient toutes les conversations
   */
  getConversations() {
    return this.conversations;
  }

  /**
   * Efface la conversation
   */
  clearConversation() {
    this.conversations = [];
    this.notifyListeners();
  }

  /**
   * Obtient l'état de frappe
   */
  getTypingState() {
    return this.isTyping;
  }

  /**
   * Obtient des questions fréquentes
   */
  getFrequentQuestions() {
    return [
      // Questions techniques
      "Comment utiliser le diagnostic IA ?",
      "Comment démarrer le monitoring IoT ?",
      "Comment exporter mes données ?",

      // Questions médicales
      "Quels sont les signes d'un infarctus ?",
      "Que signifient les valeurs normales ?",
      "Comment prévenir les maladies cardiaques ?",

      // Questions sur l'ECG
      "Comment interpréter un ECG ?",
      "Que signifient les ondes sur l'ECG ?",

      // Questions sur les symptômes
      "Que faire en cas de douleur thoracique ?",
      "Quand consulter un cardiologue ?",

      // Questions sur les traitements
      "Quels médicaments pour le cœur ?",
      "Quel exercice pour la santé cardiaque ?"
    ];
  }
}

// Instance singleton
const chatbotService = new ChatbotService();

export default chatbotService;
