/**
 * Service Azure Cognitive Services pour CardioAI
 * Intègre QnA Maker, Language Studio, Text Analytics et Embeddings
 */

class AzureCognitiveService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    
    // Configuration Azure (à remplir avec vos clés)
    this.config = {
      // QnA Maker Configuration
      qnaMaker: {
        endpoint: process.env.REACT_APP_QNA_ENDPOINT || 'https://your-qna-resource.cognitiveservices.azure.com',
        subscriptionKey: process.env.REACT_APP_QNA_KEY || 'your-qna-key',
        knowledgeBaseId: process.env.REACT_APP_KB_ID || 'your-kb-id',
        endpointKey: process.env.REACT_APP_QNA_ENDPOINT_KEY || 'your-endpoint-key'
      },
      
      // Language Studio Configuration
      language: {
        endpoint: process.env.REACT_APP_LANGUAGE_ENDPOINT || 'https://your-language-resource.cognitiveservices.azure.com',
        subscriptionKey: process.env.REACT_APP_LANGUAGE_KEY || 'your-language-key',
        projectName: process.env.REACT_APP_CLU_PROJECT || 'cardioai-understanding'
      },
      
      // Text Analytics Configuration
      textAnalytics: {
        endpoint: process.env.REACT_APP_TEXT_ANALYTICS_ENDPOINT || 'https://your-text-analytics.cognitiveservices.azure.com',
        subscriptionKey: process.env.REACT_APP_TEXT_ANALYTICS_KEY || 'your-text-analytics-key'
      }
    };
    
    // Mode de développement avec fallback local
    this.developmentMode = true;
    this.localFallback = this.initializeLocalFallback();
  }

  initializeLocalFallback() {
    // Fallback local basé sur votre base JSON pour le développement
    return {
      qnaData: [
        {
          id: 1,
          questions: ["J'ai une douleur thoracique depuis 30 minutes, que faire ?"],
          answer: "Les signes d'alerte d'un infarctus comprennent douleur thoracique oppressante, irradiant vers le bras ou la mâchoire, sueurs, nausées ou essoufflement. Si vous avez ces symptômes, n'allez pas seul au volant si possible. Appelez le service d'urgence et préparez les informations : antécédents, médicaments. En milieu hospitalier, ECG en 10 minutes et bilan biologique (troponine) sont réalisés.",
          shortAnswer: "Si la douleur est intense ou accompagnée de sueurs/essoufflement, appelez immédiatement le numéro d'urgence local ou rendez-vous aux urgences.",
          confidence: 0.95,
          metadata: { source: "medical", urgency: "high" }
        },
        {
          id: 8,
          questions: [
            "Que faire si mon rythme cardiaque est très rapide ?",
            "Mon cœur bat vite, que faire ?",
            "Mon coeur bat vite, qu'est-ce que je fais ?"
          ],
          answer: "Une tachycardie soutenue accompagnée de symptômes (vertiges, syncope, douleur thoracique) nécessite une prise en charge urgente. Si la tachycardie est isolée et tolérée, planifier une consultation médicale afin d'évaluer la cause (FA, tachycardie supraventriculaire, hyperthyroïdie, etc.).",
          shortAnswer: "Si associé à vertiges, douleur ou syncope → appeler urgences immédiatement.",
          confidence: 0.9,
          metadata: { source: "medical", urgency: "medium" }
        },
        {
          id: 100,
          questions: [
            "Comment utiliser le diagnostic IA ?",
            "Comment faire un diagnostic avec l'IA ?",
            "Guide d'utilisation du diagnostic"
          ],
          answer: "Pour utiliser le diagnostic IA :\n\n1. Préparez votre ECG 12 dérivations (format PNG ou JPG)\n2. Remplissez le formulaire avec vos données cliniques (âge, sexe, tension, cholestérol, etc.)\n3. Cliquez sur \"Analyser avec l'IA\"\n4. Consultez les résultats avec le score de confiance\n\nPour de meilleurs résultats, remplissez tous les champs et utilisez un ECG de bonne qualité.",
          shortAnswer: "Uploadez un ECG 12 dérivations, remplissez les données cliniques complètes, puis cliquez 'Analyser avec l'IA'.",
          confidence: 0.85,
          metadata: { source: "application", urgency: "low" }
        }
      ]
    };
  }

  /**
   * Analyse avancée avec Azure Text Analytics
   */
  async analyzeWithAzure(message) {
    try {
      if (this.developmentMode) {
        return this.analyzeLocally(message);
      }

      // Analyse de sentiment et d'entités avec Azure
      const sentimentResponse = await this.callAzureTextAnalytics(message, 'sentiment');
      const entitiesResponse = await this.callAzureTextAnalytics(message, 'entities');
      const keyPhrasesResponse = await this.callAzureTextAnalytics(message, 'keyPhrases');

      return {
        sentiment: sentimentResponse.sentiment,
        confidence: sentimentResponse.confidence,
        entities: entitiesResponse.entities,
        keyPhrases: keyPhrasesResponse.keyPhrases,
        language: sentimentResponse.language,
        urgencyLevel: this.assessUrgencyFromAzure(sentimentResponse, entitiesResponse)
      };
    } catch (error) {
      console.error('Erreur Azure Text Analytics:', error);
      return this.analyzeLocally(message);
    }
  }

  /**
   * Recherche QnA avec Azure QnA Maker
   */
  async searchQnAMaker(message, analysis) {
    try {
      if (this.developmentMode) {
        return this.searchLocalQnA(message, analysis);
      }

      const qnaResponse = await this.callAzureQnAMaker(message);
      
      if (qnaResponse.answers && qnaResponse.answers.length > 0) {
        return qnaResponse.answers.map(answer => ({
          answer: answer.answer,
          confidence: answer.score / 100,
          source: answer.source,
          metadata: answer.metadata,
          questions: answer.questions
        }));
      }

      return [];
    } catch (error) {
      console.error('Erreur Azure QnA Maker:', error);
      return this.searchLocalQnA(message, analysis);
    }
  }

  /**
   * Recherche par similarité avec embeddings
   */
  async searchWithEmbeddings(message, analysis) {
    try {
      if (this.developmentMode) {
        return this.searchLocalSimilarity(message);
      }

      // Génération d'embeddings avec Azure
      const messageEmbedding = await this.generateEmbedding(message);
      
      // Recherche par similarité cosinus
      const similarities = await this.calculateSimilarities(messageEmbedding);
      
      return similarities
        .filter(sim => sim.score > 0.7)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    } catch (error) {
      console.error('Erreur recherche embeddings:', error);
      return this.searchLocalSimilarity(message);
    }
  }

  /**
   * Détection d'intention avec Azure Language Understanding
   */
  async detectIntentWithAzure(message, analysis) {
    try {
      if (this.developmentMode) {
        return this.detectIntentLocally(message);
      }

      const luisResponse = await this.callAzureLUIS(message);
      
      return {
        intent: luisResponse.prediction.topIntent,
        confidence: luisResponse.prediction.intents[luisResponse.prediction.topIntent]?.score || 0,
        entities: luisResponse.prediction.entities
      };
    } catch (error) {
      console.error('Erreur Azure LUIS:', error);
      return this.detectIntentLocally(message);
    }
  }

  /**
   * Appels API Azure (à implémenter avec les vraies clés)
   */
  async callAzureTextAnalytics(text, operation) {
    // Simulation pour le développement
    if (this.developmentMode) {
      return this.simulateTextAnalytics(text, operation);
    }

    const url = `${this.config.textAnalytics.endpoint}/text/analytics/v3.1/${operation}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.textAnalytics.subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: [{ id: '1', text: text, language: 'fr' }]
      })
    });

    return await response.json();
  }

  async callAzureQnAMaker(question) {
    // Simulation pour le développement
    if (this.developmentMode) {
      return this.simulateQnAMaker(question);
    }

    const url = `${this.config.qnaMaker.endpoint}/qnamaker/knowledgebases/${this.config.qnaMaker.knowledgeBaseId}/generateAnswer`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `EndpointKey ${this.config.qnaMaker.endpointKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question,
        top: 3,
        scoreThreshold: 0.3,
        strictFilters: [],
        metadataBoost: []
      })
    });

    return await response.json();
  }

  /**
   * Méthodes de simulation pour le développement
   */
  simulateTextAnalytics(text, operation) {
    const lowerText = text.toLowerCase();
    
    switch (operation) {
      case 'sentiment':
        const isNegative = lowerText.includes('mal') || lowerText.includes('douleur') || lowerText.includes('problème');
        const isPositive = lowerText.includes('merci') || lowerText.includes('bien') || lowerText.includes('parfait');
        
        return {
          sentiment: isNegative ? 'negative' : isPositive ? 'positive' : 'neutral',
          confidence: 0.8,
          language: 'fr'
        };
        
      case 'entities':
        const entities = [];
        if (lowerText.includes('cœur') || lowerText.includes('coeur')) {
          entities.push({ text: 'cœur', category: 'BodyPart', confidence: 0.9 });
        }
        if (lowerText.includes('tension') || lowerText.includes('pression')) {
          entities.push({ text: 'tension', category: 'MedicalCondition', confidence: 0.8 });
        }
        return { entities };
        
      case 'keyPhrases':
        const phrases = text.split(' ').filter(word => word.length > 3);
        return { keyPhrases: phrases.slice(0, 5) };
        
      default:
        return {};
    }
  }

  simulateQnAMaker(question) {
    const results = this.searchLocalQnA(question, {});
    return {
      answers: results.map(result => ({
        answer: result.answer,
        score: result.confidence * 100,
        source: result.metadata?.source || 'local',
        metadata: result.metadata,
        questions: result.questions
      }))
    };
  }

  /**
   * Méthodes locales de fallback
   */
  analyzeLocally(message) {
    const lowerText = message.toLowerCase();
    
    return {
      sentiment: lowerText.includes('mal') || lowerText.includes('douleur') ? 'negative' : 'neutral',
      confidence: 0.7,
      entities: this.extractEntitiesLocally(message),
      keyPhrases: message.split(' ').filter(word => word.length > 3).slice(0, 5),
      language: 'fr',
      urgencyLevel: this.assessUrgencyLocally(message)
    };
  }

  extractEntitiesLocally(message) {
    const entities = [];
    const lowerText = message.toLowerCase();
    
    if (lowerText.includes('cœur') || lowerText.includes('coeur')) {
      entities.push({ text: 'cœur', category: 'BodyPart', confidence: 0.9 });
    }
    if (lowerText.includes('douleur')) {
      entities.push({ text: 'douleur', category: 'Symptom', confidence: 0.8 });
    }
    if (lowerText.includes('tension') || lowerText.includes('pression')) {
      entities.push({ text: 'tension', category: 'MedicalCondition', confidence: 0.8 });
    }
    
    return entities;
  }

  searchLocalQnA(message, analysis) {
    const lowerMessage = message.toLowerCase();
    const results = [];
    
    this.localFallback.qnaData.forEach(item => {
      item.questions.forEach(question => {
        const similarity = this.calculateSimpleSimilarity(lowerMessage, question.toLowerCase());
        if (similarity > 0.5) {
          results.push({
            ...item,
            confidence: similarity * item.confidence,
            matchType: 'local_similarity'
          });
        }
      });
    });
    
    return results.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  searchLocalSimilarity(message) {
    return this.searchLocalQnA(message, {});
  }

  detectIntentLocally(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/^(bonjour|salut|hello|bonsoir)/)) {
      return { intent: 'greeting', confidence: 0.9 };
    }
    if (lowerMessage.includes('merci') || lowerMessage.includes('au revoir')) {
      return { intent: 'politeness', confidence: 0.9 };
    }
    if (lowerMessage.includes('douleur') || lowerMessage.includes('mal au')) {
      return { intent: 'medical_emergency', confidence: 0.8 };
    }
    if (lowerMessage.includes('comment') && lowerMessage.includes('utiliser')) {
      return { intent: 'app_help', confidence: 0.8 };
    }
    
    return { intent: 'general', confidence: 0.5 };
  }

  calculateSimpleSimilarity(str1, str2) {
    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  assessUrgencyLocally(message) {
    const urgentKeywords = ['urgent', 'urgence', 'immédiat', 'douleur intense', 'mal au cœur'];
    const hasUrgentKeywords = urgentKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    return hasUrgentKeywords ? 'high' : 'normal';
  }

  assessUrgencyFromAzure(sentiment, entities) {
    if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.8) {
      return 'high';
    }

    const medicalEntities = entities.entities.filter(e =>
      e.category === 'MedicalCondition' || e.category === 'Symptom'
    );

    return medicalEntities.length > 0 ? 'medium' : 'normal';
  }

  /**
   * Traitement principal du message utilisateur
   */
  async processUserMessage(userMessage) {
    console.log('🧠 Azure Cognitive Services - Processing:', userMessage);

    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    try {
      // 1. Analyse avancée avec Azure Text Analytics
      const analysis = await this.analyzeWithAzure(userMessage);
      console.log('📊 Azure Analysis:', analysis);

      // 2. Détection d'intention avec Azure LUIS
      const intentResult = await this.detectIntentWithAzure(userMessage, analysis);
      console.log('🎯 Intent Detection:', intentResult);

      // 3. Recherche dans QnA Maker
      const qnaResults = await this.searchQnAMaker(userMessage, analysis);
      console.log('📚 QnA Results:', qnaResults);

      // 4. Recherche par similarité avec embeddings
      const similarityResults = await this.searchWithEmbeddings(userMessage, analysis);
      console.log('🔍 Similarity Results:', similarityResults);

      // 5. Génération de réponse intelligente
      const response = await this.generateIntelligentResponse(
        userMessage,
        analysis,
        intentResult,
        qnaResults,
        similarityResults
      );

      this.isTyping = false;
      this.addMessage('bot', response);

    } catch (error) {
      console.error('Erreur Azure Cognitive Services:', error);
      this.isTyping = false;
      this.addMessage('bot', 'Désolé, j\'ai rencontré un problème technique. Pouvez-vous reformuler votre question ?');
    }
  }

  /**
   * Génération de réponse intelligente combinant tous les services Azure
   */
  async generateIntelligentResponse(message, analysis, intentResult, qnaResults, similarityResults) {
    // Priorisation des résultats
    let bestResult = null;
    let confidence = 0;

    // 1. Priorité aux résultats QnA Maker avec haute confiance
    if (qnaResults.length > 0 && qnaResults[0].confidence > 0.7) {
      bestResult = qnaResults[0];
      confidence = qnaResults[0].confidence;
    }
    // 2. Sinon, utiliser la recherche par similarité
    else if (similarityResults.length > 0 && similarityResults[0].confidence > 0.6) {
      bestResult = similarityResults[0];
      confidence = similarityResults[0].confidence;
    }

    // Génération de réponse contextuelle
    if (bestResult) {
      return this.formatContextualResponse(bestResult, analysis, intentResult, confidence);
    }

    // Fallback intelligent basé sur l'intention
    return this.generateIntentBasedFallback(intentResult, analysis);
  }

  /**
   * Formatage de réponse contextuelle
   */
  formatContextualResponse(result, analysis, intentResult, confidence) {
    let response = '';

    // Adaptation selon le sentiment
    if (analysis.sentiment === 'negative' && analysis.urgencyLevel === 'high') {
      response += 'Je comprends votre inquiétude. ';
    }

    // Réponse principale
    if (result.shortAnswer && analysis.urgencyLevel === 'high') {
      response += `🚨 ${result.shortAnswer}\n\n`;
    }

    response += result.answer;

    // Ajout contextuel selon l'urgence
    if (analysis.urgencyLevel === 'high') {
      response += '\n\nNuméros d\'urgence : SAMU 15, Pompiers 18';
    }

    // Indication de confiance si faible
    if (confidence < 0.8) {
      response += '\n\nSi cette réponse ne correspond pas à votre question, pouvez-vous la reformuler ?';
    }

    return response;
  }

  /**
   * Fallback intelligent basé sur l'intention
   */
  generateIntentBasedFallback(intentResult, analysis) {
    switch (intentResult.intent) {
      case 'greeting':
        return this.generateGreeting();

      case 'politeness':
        return this.generatePolitenessResponse();

      case 'medical_emergency':
        return 'Je détecte une préoccupation médicale. Pouvez-vous me donner plus de détails sur vos symptômes ? En cas d\'urgence, appelez immédiatement le 15.';

      case 'app_help':
        return 'Je peux vous aider avec l\'utilisation de CardioAI. Que voulez-vous faire exactement ? Diagnostic IA, monitoring, ou export de données ?';

      default:
        // Fallback basé sur les entités détectées
        if (analysis.entities.length > 0) {
          const entityTypes = analysis.entities.map(e => e.category).join(', ');
          return `Je vois que vous mentionnez des éléments liés à ${entityTypes}. Pouvez-vous être plus spécifique dans votre question ?`;
        }

        return 'Je n\'ai pas trouvé de réponse précise. Pouvez-vous reformuler votre question ou être plus spécifique ?';
    }
  }

  generateGreeting() {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    return `${greeting} ! Je suis votre assistant CardioAI alimenté par Azure Cognitive Services. Comment puis-je vous aider ?`;
  }

  generatePolitenessResponse() {
    return 'De rien ! N\'hésitez pas si vous avez d\'autres questions.';
  }
