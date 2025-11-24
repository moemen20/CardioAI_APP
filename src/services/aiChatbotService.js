/**
 * Service de chatbot intelligent avec IA avancée pour CardioAI
 * Utilise un modèle de langage avancé pour des réponses intelligentes
 */
class AIChatbotService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    this.apiKey = null; // Sera configuré par l'utilisateur
    this.useLocalFallback = true;
    
    // Contexte système pour l'IA
    this.systemPrompt = `Tu es un assistant médical intelligent spécialisé en cardiologie pour l'application CardioAI.

CONTEXTE DE L'APPLICATION:
- CardioAI est une application de diagnostic cardiaque utilisant l'IA (modèle XResNet)
- Elle combine diagnostic ECG automatisé et monitoring IoT en temps réel
- Fonctionnalités: Diagnostic IA, Monitoring IoT, Historique des sessions, Notifications

FONCTIONNALITÉS TECHNIQUES:
1. DIAGNOSTIC IA:
   - Upload d'images ECG (JPG, PNG)
   - Saisie de données cliniques: âge, pression artérielle, cholestérol, fréquence cardiaque max, dépression ST
   - Paramètres: type douleur thoracique, ECG repos, pente segment ST, thalassémie
   - Modèle XResNet analyse et donne diagnostic + niveau de confiance

2. MONITORING IoT:
   - Surveillance temps réel: fréquence cardiaque, pression artérielle, température, SpO₂
   - Seuils d'alerte: FC >100 ou <60 BPM, Temp >37.5°C, SpO₂ <95%, PA >140/90
   - Sessions automatiquement enregistrées avec statistiques

3. HISTORIQUE:
   - Consultation sessions passées
   - Export CSV des données
   - Statistiques globales et par session

4. NOTIFICATIONS:
   - Alertes temps réel en haut de page
   - Panneau latéral avec historique
   - Couleurs: bleu (info), vert (succès), orange (warning), rouge (erreur)

EXPERTISE MÉDICALE:
Tu as une connaissance approfondie en cardiologie:
- Pathologies: infarctus, angine, arythmies, insuffisance cardiaque
- ECG: interprétation ondes P, QRS, T, troubles du rythme
- Paramètres vitaux et valeurs normales
- Facteurs de risque cardiovasculaire
- Prévention et traitements
- Urgences cardiaques

RÈGLES IMPORTANTES:
1. Toujours rappeler que l'IA ne remplace pas l'avis médical
2. Pour urgences (douleur thoracique intense, malaise): diriger vers SAMU (15)
3. Donner des réponses précises, claires et bienveillantes
4. Utiliser des émojis médicaux appropriés
5. Proposer des actions concrètes dans l'application
6. Adapter le niveau de réponse à la question

Réponds de manière professionnelle, empathique et précise.`;

    // Base de connaissances locale de fallback
    this.localKnowledge = this.initializeLocalKnowledge();
  }

  initializeLocalKnowledge() {
    return {
      // Réponses rapides pour les cas courants
      quickResponses: {
        'bonjour': "Bonjour ! Je suis votre assistant CardioAI intelligent. Comment puis-je vous aider avec votre santé cardiaque aujourd'hui ? 🫀",
        'aide': "Je peux vous aider avec : le diagnostic IA, le monitoring IoT, l'interprétation des résultats, les questions médicales, et l'utilisation de l'application. Que souhaitez-vous savoir ? 🤖",
        'urgence': "🚨 URGENCE : Si vous ressentez une douleur thoracique intense, un essoufflement soudain ou un malaise important, appelez immédiatement le 15 (SAMU) ! 🚨"
      },
      
      // Valeurs médicales de référence
      medicalValues: {
        heartRate: { normal: '60-100 BPM', low: '<60 BPM (bradycardie)', high: '>100 BPM (tachycardie)' },
        bloodPressure: { normal: '<120/80 mmHg', high: '>140/90 mmHg (hypertension)' },
        temperature: { normal: '36.1-37.2°C', fever: '>37.5°C' },
        oxygen: { normal: '95-100%', low: '<95% (hypoxémie)' },
        cholesterol: { normal: '<2g/L total', ldl: '<1.6g/L (LDL)', hdl: '>0.4g/L homme, >0.5g/L femme (HDL)' }
      }
    };
  }

  /**
   * Configure la clé API pour l'IA
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.useLocalFallback = !apiKey;
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
    const welcomeMessage = "Bonjour ! Je suis votre assistant CardioAI intelligent alimenté par l'IA. Je peux vous aider avec le diagnostic, le monitoring, les questions médicales et l'utilisation de l'application. Comment puis-je vous assister aujourd'hui ? 🫀🤖";
    this.addMessage('bot', welcomeMessage);
  }

  /**
   * Ajoute un message à la conversation
   */
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

  /**
   * Traite un message utilisateur avec l'IA
   */
  async processUserMessage(userMessage) {
    console.log('Processing user message with AI:', userMessage);
    
    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    try {
      let response;
      
      if (this.apiKey && !this.useLocalFallback) {
        // Utiliser l'API OpenAI
        response = await this.getAIResponse(userMessage);
      } else {
        // Utiliser le fallback local intelligent
        response = await this.getLocalIntelligentResponse(userMessage);
      }

      this.isTyping = false;
      this.addMessage('bot', response);

      // Générer des suggestions contextuelles
      const suggestions = this.generateSmartSuggestions(userMessage, response);
      if (suggestions.length > 0) {
        setTimeout(() => {
          suggestions.forEach(suggestion => {
            this.addMessage('bot', suggestion, 'suggestion');
          });
        }, 1000);
      }

    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);
      this.isTyping = false;
      this.addMessage('bot', "Désolé, j'ai rencontré un problème technique. Pouvez-vous reformuler votre question ? 🔧");
    }
  }

  /**
   * Obtient une réponse de l'API OpenAI
   */
  async getAIResponse(userMessage) {
    const conversationHistory = this.conversations
      .slice(-10) // Garder les 10 derniers messages pour le contexte
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Génère une réponse intelligente locale
   */
  async getLocalIntelligentResponse(userMessage) {
    // Simuler un délai de traitement IA
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const message = userMessage.toLowerCase().trim();
    
    // Détection d'urgences
    const urgencyKeywords = ['douleur thoracique', 'mal au cœur', 'crise cardiaque', 'infarctus', 'malaise grave', 'essoufflement soudain'];
    if (urgencyKeywords.some(keyword => message.includes(keyword))) {
      return "🚨 URGENCE MÉDICALE 🚨\n\nSi vous ressentez actuellement :\n• Douleur thoracique intense\n• Essoufflement soudain et sévère\n• Malaise important avec sueurs\n• Palpitations avec douleur\n\n➡️ APPELEZ IMMÉDIATEMENT LE 15 (SAMU) !\n\nChaque minute compte pour votre cœur. N'attendez pas !";
    }

    // Analyse contextuelle avancée
    if (message.includes('diagnostic') && message.includes('comment')) {
      return "Pour utiliser le diagnostic IA de CardioAI :\n\n1️⃣ **Préparez votre ECG** : Image claire (JPG/PNG)\n2️⃣ **Allez sur 'Diagnostic IA'** dans le menu\n3️⃣ **Téléchargez votre ECG** via 'Choisir un fichier'\n4️⃣ **Remplissez vos données cliniques** :\n   • Âge, pression artérielle, cholestérol\n   • Fréquence cardiaque max, dépression ST\n   • Type de douleur, ECG repos, pente ST, thalassémie\n5️⃣ **Cliquez 'Analyser avec IA'**\n\n🤖 Notre modèle XResNet analysera vos données et fournira un diagnostic avec niveau de confiance.\n\n⚠️ **Important** : Ce diagnostic est une aide, consultez toujours un cardiologue pour confirmation.";
    }

    if (message.includes('monitoring') && (message.includes('comment') || message.includes('démarrer'))) {
      return "Pour démarrer le monitoring IoT CardioAI :\n\n1️⃣ **Accédez au monitoring** : Menu → 'Monitoring IoT'\n2️⃣ **Cliquez 'Démarrer le monitoring'** 🟢\n3️⃣ **Surveillance automatique** des paramètres :\n   • 💓 Fréquence cardiaque (60-100 BPM)\n   • 🩸 Pression artérielle (<140/90)\n   • 🌡️ Température corporelle (<37.5°C)\n   • 🫁 Saturation oxygène (>95%)\n\n📊 **Fonctionnalités** :\n• Alertes automatiques si seuils dépassés\n• Enregistrement continu de la session\n• Graphiques temps réel\n• Statistiques en direct\n\n🛑 **Arrêt** : Cliquez 'Arrêter' pour sauvegarder la session\n\n💾 Toutes vos données sont automatiquement sauvegardées dans l'historique !";
    }

    // Interprétation de valeurs spécifiques
    if (message.includes('normal') || message.includes('valeur')) {
      return "📊 **Valeurs normales des paramètres cardiaques** :\n\n💓 **Fréquence cardiaque** :\n• Normal : 60-100 BPM au repos\n• Bradycardie : <60 BPM\n• Tachycardie : >100 BPM\n\n🩸 **Pression artérielle** :\n• Optimale : <120/80 mmHg\n• Normale : <130/85 mmHg\n• Hypertension : >140/90 mmHg\n\n🌡️ **Température** :\n• Normale : 36.1-37.2°C\n• Fièvre : >37.5°C\n\n🫁 **Saturation O₂** :\n• Normale : 95-100%\n• Hypoxémie : <95%\n\n🧪 **Cholestérol** :\n• Total : <2.0 g/L\n• LDL ('mauvais') : <1.6 g/L\n• HDL ('bon') : >0.4 g/L (H), >0.5 g/L (F)\n\n⚠️ Ces valeurs sont indicatives. Consultez votre médecin pour une interprétation personnalisée.";
    }

    // Interprétation de résultats spécifiques
    if (message.includes('interpréter') || message.includes('résultat')) {
      return "🔬 **Interprétation des résultats CardioAI** :\n\n📊 **Diagnostic IA** :\n• Le modèle XResNet analyse votre ECG et données cliniques\n• Résultat : Diagnostic + niveau de confiance (0-100%)\n• Confiance >80% = Résultat fiable\n• Confiance <60% = Nécessite confirmation\n\n📈 **Monitoring IoT** :\n• Surveillance continue des paramètres vitaux\n• Alertes automatiques si seuils dépassés\n• Tendances et moyennes calculées\n\n⚠️ **Important** :\n• Ces résultats sont une aide au diagnostic\n• Toujours consulter un cardiologue pour confirmation\n• En cas d'urgence, appelez le 15 immédiatement\n\n💡 **Conseil** : Imprimez vos résultats pour votre médecin !";
    }

    // Questions sur l'ECG
    if (message.includes('ecg') || message.includes('électrocardiogramme')) {
      return "📈 **Tout sur l'ECG (Électrocardiogramme)** :\n\n🔍 **Qu'est-ce que c'est ?**\n• Enregistrement de l'activité électrique du cœur\n• Détecte arythmies, infarctus, anomalies\n\n📊 **Ondes principales** :\n• **Onde P** : Contraction des oreillettes\n• **Complexe QRS** : Contraction des ventricules\n• **Onde T** : Relaxation des ventricules\n\n🤖 **Dans CardioAI** :\n• Upload de votre image ECG\n• Analyse automatique par IA\n• Détection de 12 pathologies courantes\n• Résultat avec niveau de confiance\n\n📋 **Comment préparer votre ECG** :\n• Image claire et nette\n• Format JPG ou PNG\n• Toutes les dérivations visibles\n• Pas de reflets ou ombres\n\n⚕️ Un ECG normal montre un rythme sinusal régulier 60-100 BPM.";
    }

    // Réponse par défaut intelligente
    return "Je comprends votre question sur CardioAI. Pouvez-vous être plus spécifique ? Je peux vous aider avec :\n\n🔬 **Diagnostic IA** : Upload ECG, données cliniques, interprétation\n📊 **Monitoring IoT** : Surveillance temps réel, alertes, sessions\n📋 **Historique** : Consultation données, export CSV, statistiques\n🔔 **Notifications** : Alertes, seuils, personnalisation\n⚕️ **Questions médicales** : Cardiologie, symptômes, prévention\n\nQue souhaitez-vous savoir exactement ? 🤖";
  }

  /**
   * Génère des suggestions intelligentes
   */
  generateSmartSuggestions(userMessage, botResponse) {
    const message = userMessage.toLowerCase();
    const suggestions = [];

    if (message.includes('diagnostic')) {
      suggestions.push("💡 Comment interpréter les résultats du diagnostic ?");
      suggestions.push("💡 Quelle est la précision du modèle XResNet ?");
    }

    if (message.includes('monitoring')) {
      suggestions.push("💡 Comment personnaliser les seuils d'alerte ?");
      suggestions.push("💡 Comment exporter mes données de monitoring ?");
    }

    if (botResponse.includes('urgence') || botResponse.includes('SAMU')) {
      suggestions.push("💡 Quels sont les autres signes d'urgence cardiaque ?");
      suggestions.push("💡 Comment prévenir les crises cardiaques ?");
    }

    return suggestions.slice(0, 2); // Limiter à 2 suggestions
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
   * Questions fréquentes intelligentes
   */
  getFrequentQuestions() {
    return [
      "Comment utiliser le diagnostic IA ?",
      "Comment interpréter mes résultats ?",
      "Quelles sont les valeurs normales ?",
      "Comment démarrer le monitoring ?",
      "Que faire en cas d'alerte ?",
      "Comment exporter mes données ?",
      "Quels sont les signes d'urgence ?",
      "Comment prévenir les maladies cardiaques ?"
    ];
  }
}

// Instance singleton
const aiChatbotService = new AIChatbotService();

export default aiChatbotService;
