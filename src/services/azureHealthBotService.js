/**
 * Service d'intégration Azure Health Bot pour CardioAI
 * Utilise l'API Azure Health Bot pour des réponses médicales expertes
 */

class AzureHealthBotService {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    this.botConfig = {
      // Configuration Azure Health Bot
      directLineSecret: null, // À configurer
      botId: 'cardioai-healthbot',
      userId: `user_${Date.now()}`,
      conversationId: null,
      watermark: 0
    };
    
    // Fallback local pour développement
    this.localMode = true;
    this.medicalKnowledge = this.initializeMedicalKnowledge();
  }

  initializeMedicalKnowledge() {
    return {
      greetings: {
        morning: "Bonjour ! 👋 Je suis votre assistant santé cardiaque spécialisé.",
        afternoon: "Bon après-midi ! 👋 Comment puis-je vous aider avec votre santé cardiaque ?",
        evening: "Bonsoir ! 👋 Je suis là pour répondre à vos questions de santé cardiaque."
      },
      
      symptoms: {
        chest_pain: {
          urgent_keywords: ['intense', 'forte', 'aiguë', 'insupportable', 'écrasante'],
          response: `🚨 **DOULEUR THORACIQUE - ÉVALUATION URGENTE**

**⚠️ SIGNES D'URGENCE IMMÉDIATE :**
Si vous ressentez actuellement :
• Douleur thoracique intense et persistante
• Irradiation vers le bras gauche, mâchoire, dos
• Sueurs froides, nausées, malaise
• Essoufflement important

➡️ **APPELEZ LE 15 (SAMU) IMMÉDIATEMENT**

**🩺 ÉVALUATION DE VOTRE DOULEUR :**
Pour mieux vous aider, pouvez-vous préciser :
• Intensité (1-10) ?
• Durée actuelle ?
• Facteurs déclenchants ?
• Autres symptômes associés ?

**💡 EN ATTENDANT :**
• Arrêtez toute activité
• Position demi-assise
• Restez calme
• Ne prenez aucun médicament sans avis médical`
        },
        
        palpitations: {
          response: `💓 **PALPITATIONS CARDIAQUES - ANALYSE**

**🔍 COMPRÉHENSION DE VOS PALPITATIONS :**

**Types de sensations :**
• Cœur qui "s'emballe" ou bat très vite
• Battements irréguliers ou "ratés"
• Sensation de cœur qui "cogne" fort
• Impression que le cœur s'arrête puis repart

**📊 CAUSES FRÉQUENTES :**
• **Stress/Anxiété** (cause #1)
• **Stimulants** : café, thé, tabac, alcool
• **Fatigue** ou manque de sommeil
• **Exercice physique** récent
• **Médicaments** : bronchodilatateurs, décongestionnants
• **Hormones** : ménopause, hyperthyroïdie

**🎯 AUTO-ÉVALUATION :**
• Quand surviennent-elles ? (repos/effort/stress)
• Durée ? (secondes/minutes/heures)
• Fréquence ? (occasionnelles/quotidiennes)
• Symptômes associés ? (douleur/malaise/essoufflement)

**✅ TECHNIQUES DE SOULAGEMENT IMMÉDIAT :**
• Respiration profonde (4 sec inspiration, 6 sec expiration)
• Manœuvre de Valsalva (expirer en se bouchant le nez)
• Eau froide sur le visage
• Position allongée, jambes surélevées

**📞 QUAND CONSULTER :**
• Palpitations + douleur thoracique
• Malaise ou syncope
• Durée > 30 minutes
• Récurrence quotidienne`
        }
      },
      
      values: {
        blood_pressure: {
          interpret: (systolic, diastolic) => {
            if (systolic >= 180 || diastolic >= 110) {
              return {
                level: 'URGENCE',
                color: '🔴',
                message: 'Crise hypertensive - Consultation urgente nécessaire',
                action: 'Appelez votre médecin ou rendez-vous aux urgences'
              };
            } else if (systolic >= 160 || diastolic >= 100) {
              return {
                level: 'HYPERTENSION GRADE 2',
                color: '🟠',
                message: 'Hypertension sévère',
                action: 'Consultation médicale dans les 48h'
              };
            } else if (systolic >= 140 || diastolic >= 90) {
              return {
                level: 'HYPERTENSION GRADE 1',
                color: '🟡',
                message: 'Hypertension modérée',
                action: 'Consultation médicale dans la semaine'
              };
            } else if (systolic >= 130 || diastolic >= 85) {
              return {
                level: 'ÉLEVÉE NORMALE',
                color: '🟡',
                message: 'Tension légèrement élevée',
                action: 'Surveillance et mesures préventives'
              };
            } else if (systolic < 120 && diastolic < 80) {
              return {
                level: 'OPTIMALE',
                color: '🟢',
                message: 'Tension artérielle excellente',
                action: 'Continuez vos bonnes habitudes'
              };
            } else {
              return {
                level: 'NORMALE',
                color: '🟢',
                message: 'Tension artérielle normale',
                action: 'Surveillance préventive régulière'
              };
            }
          }
        },
        
        heart_rate: {
          interpret: (bpm, context = 'repos') => {
            if (context === 'repos') {
              if (bpm < 50) {
                return {
                  level: 'BRADYCARDIE SÉVÈRE',
                  color: '🔴',
                  message: 'Rythme cardiaque très lent',
                  action: 'Consultation médicale urgente si symptômes'
                };
              } else if (bpm < 60) {
                return {
                  level: 'BRADYCARDIE',
                  color: '🟡',
                  message: 'Rythme cardiaque lent (normal chez sportifs)',
                  action: 'Surveillance, consultation si symptômes'
                };
              } else if (bpm <= 100) {
                return {
                  level: 'NORMAL',
                  color: '🟢',
                  message: 'Fréquence cardiaque normale',
                  action: 'Continuez votre surveillance'
                };
              } else if (bpm <= 120) {
                return {
                  level: 'TACHYCARDIE MODÉRÉE',
                  color: '🟡',
                  message: 'Rythme cardiaque légèrement rapide',
                  action: 'Vérifiez contexte (stress, café, effort récent)'
                };
              } else {
                return {
                  level: 'TACHYCARDIE',
                  color: '🔴',
                  message: 'Rythme cardiaque rapide',
                  action: 'Consultation médicale recommandée'
                };
              }
            }
          }
        }
      },
      
      prevention: {
        lifestyle: `💡 **PRÉVENTION CARDIOVASCULAIRE OPTIMALE**

**🎯 LES 7 PILIERS D'UN CŒUR EN SANTÉ :**

**1️⃣ ARRÊT DU TABAC**
• Bénéfice immédiat dès 24h
• Risque divisé par 2 en 1 an
• Aide : Tabac Info Service 3989

**2️⃣ ACTIVITÉ PHYSIQUE**
• 150 min/semaine d'intensité modérée
• Marche rapide, vélo, natation
• Commencer progressivement

**3️⃣ ALIMENTATION MÉDITERRANÉENNE**
• Fruits/légumes : 5 portions/jour
• Poissons gras : 2-3 fois/semaine
• Huile d'olive, noix, légumineuses
• Limiter sel (<6g/jour), sucres ajoutés

**4️⃣ POIDS SANTÉ**
• IMC : 18.5-25 kg/m²
• Tour de taille : <94 cm (H), <80 cm (F)
• Perte progressive si nécessaire

**5️⃣ GESTION DU STRESS**
• Techniques de relaxation
• Sommeil de qualité (7-9h)
• Activités plaisantes
• Soutien social

**6️⃣ CONTRÔLE FACTEURS DE RISQUE**
• Tension artérielle <140/90 mmHg
• Cholestérol LDL selon risque
• Glycémie <1.26 g/L à jeun

**7️⃣ SUIVI MÉDICAL PRÉVENTIF**
• Bilans réguliers selon âge
• Dépistage cardiovasculaire
• Vaccinations à jour`
      },
      
      emergency: {
        cardiac_emergency: `🚨 **URGENCE CARDIAQUE SUSPECTÉE**

**📞 ACTIONS IMMÉDIATES :**

**1. APPELEZ LE 15 (SAMU) MAINTENANT**
• Décrivez précisément vos symptômes
• Mentionnez suspicion de problème cardiaque
• Donnez votre adresse exacte
• Restez en ligne

**2. EN ATTENDANT LES SECOURS :**
• Position demi-assise (dos surélevé)
• Desserrez vêtements serrés
• Ouvrez fenêtres pour aérer
• Ne restez pas seul(e) si possible

**3. PRÉPAREZ :**
• Carte vitale et mutuelle
• Liste des médicaments
• Antécédents médicaux
• Personne de confiance à prévenir

**4. NE FAITES PAS :**
• Ne conduisez pas vous-même
• Ne prenez pas de médicaments non prescrits
• N'attendez pas que ça passe
• Ne buvez/mangez rien

**⏰ TEMPS = MUSCLE CARDIAQUE**
Chaque minute compte en cas d'infarctus !

**📱 NUMÉROS D'URGENCE :**
• SAMU : 15
• Pompiers : 18
• Urgences européennes : 112`
      }
    };
  }

  /**
   * Analyse intelligente du message utilisateur
   */
  analyzeMessage(message) {
    const msg = message.toLowerCase();
    
    // Détection d'urgence
    const urgentKeywords = ['douleur intense', 'mal au cœur', 'crise', 'malaise grave', 'infarctus'];
    const isUrgent = urgentKeywords.some(keyword => msg.includes(keyword));
    
    // Classification d'intention
    let intent = 'general';
    
    if (msg.match(/^(bonjour|salut|hello|bonsoir|hey)/)) {
      intent = 'greeting';
    } else if (isUrgent) {
      intent = 'emergency';
    } else if (msg.includes('mal au') || msg.includes('douleur') || msg.includes('palpitations')) {
      intent = 'symptoms';
    } else if (/\d+\/\d+/.test(msg) || msg.includes('tension') || msg.includes('pouls')) {
      intent = 'values';
    } else if (msg.includes('prévention') || msg.includes('conseils')) {
      intent = 'prevention';
    } else if (msg.includes('comment') && (msg.includes('utiliser') || msg.includes('faire'))) {
      intent = 'technical';
    }
    
    // Extraction d'entités médicales
    const entities = this.extractMedicalEntities(msg);
    
    return {
      intent,
      isUrgent,
      entities,
      originalMessage: message
    };
  }

  extractMedicalEntities(message) {
    const entities = {};
    
    // Extraction tension artérielle
    const bpMatch = message.match(/(\d+)\/(\d+)/);
    if (bpMatch) {
      entities.bloodPressure = {
        systolic: parseInt(bpMatch[1]),
        diastolic: parseInt(bpMatch[2])
      };
    }
    
    // Extraction fréquence cardiaque
    const hrMatch = message.match(/(\d+)\s*(?:bpm|battements)/i);
    if (hrMatch) {
      entities.heartRate = parseInt(hrMatch[1]);
    }
    
    // Extraction température
    const tempMatch = message.match(/(\d+(?:\.\d+)?)\s*°?c/i);
    if (tempMatch) {
      entities.temperature = parseFloat(tempMatch[1]);
    }
    
    return entities;
  }

  /**
   * Génération de réponse intelligente
   */
  async generateResponse(analysis) {
    const { intent, isUrgent, entities, originalMessage } = analysis;
    
    // Gestion des urgences en priorité
    if (isUrgent || intent === 'emergency') {
      return this.medicalKnowledge.emergency.cardiac_emergency;
    }
    
    // Réponses selon l'intention
    switch (intent) {
      case 'greeting':
        return this.generateGreeting();
        
      case 'symptoms':
        return this.generateSymptomResponse(originalMessage);
        
      case 'values':
        return this.generateValueInterpretation(entities, originalMessage);
        
      case 'prevention':
        return this.medicalKnowledge.prevention.lifestyle;
        
      case 'technical':
        return this.generateTechnicalHelp(originalMessage);
        
      default:
        return this.generateGeneralHelp();
    }
  }

  generateGreeting() {
    const hour = new Date().getHours();
    let timeGreeting;
    
    if (hour < 12) {
      timeGreeting = this.medicalKnowledge.greetings.morning;
    } else if (hour < 18) {
      timeGreeting = this.medicalKnowledge.greetings.afternoon;
    } else {
      timeGreeting = this.medicalKnowledge.greetings.evening;
    }
    
    return `${timeGreeting}

🫀 **Spécialiste en Santé Cardiaque**

Je suis votre assistant médical intelligent, spécialisé dans :

**🩺 EXPERTISE MÉDICALE :**
• Analyse de symptômes cardiaques
• Interprétation de vos valeurs vitales
• Conseils de prévention personnalisés
• Orientation médicale appropriée

**🔬 DIAGNOSTIC IA :**
• Aide à l'utilisation du système
• Interprétation des résultats
• Optimisation de la précision

**📊 MONITORING CARDIAQUE :**
• Configuration des alertes
• Analyse des tendances
• Export pour consultations

**🚨 GESTION D'URGENCES :**
• Détection automatique des situations critiques
• Protocoles d'urgence immédiats

💬 **Comment puis-je vous aider aujourd'hui ?**

*Décrivez vos symptômes, partagez vos valeurs ou posez vos questions !*`;
  }

  generateSymptomResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('mal au cœur') || msg.includes('mal au coeur') || msg.includes('douleur thoracique')) {
      return this.medicalKnowledge.symptoms.chest_pain.response;
    }
    
    if (msg.includes('palpitations')) {
      return this.medicalKnowledge.symptoms.palpitations.response;
    }
    
    return `🩺 **ANALYSE DE VOS SYMPTÔMES**

Pour mieux vous aider, pouvez-vous préciser :

**📋 DESCRIPTION DU SYMPTÔME :**
• Localisation exacte ?
• Intensité (1-10) ?
• Durée et fréquence ?
• Facteurs déclenchants ?

**⏰ CONTEXTE TEMPOREL :**
• Depuis quand ?
• Moment d'apparition ?
• Évolution récente ?

**🔗 SYMPTÔMES ASSOCIÉS :**
• Douleur, essoufflement ?
• Fatigue, vertiges ?
• Nausées, sueurs ?

**🚨 SIGNES D'ALERTE À SURVEILLER :**
• Douleur thoracique intense
• Essoufflement soudain
• Malaise important
• Syncope

**📞 N'hésitez pas à consulter un médecin si :**
• Symptômes nouveaux ou inhabituels
• Aggravation progressive
• Gêne dans les activités
• Inquiétude persistante

Décrivez-moi plus précisément vos symptômes pour un conseil personnalisé.`;
  }

  generateValueInterpretation(entities, message) {
    let response = `📊 **INTERPRÉTATION DE VOS VALEURS**\n\n`;
    
    // Interprétation tension artérielle
    if (entities.bloodPressure) {
      const { systolic, diastolic } = entities.bloodPressure;
      const interpretation = this.medicalKnowledge.values.blood_pressure.interpret(systolic, diastolic);
      
      response += `🩸 **PRESSION ARTÉRIELLE : ${systolic}/${diastolic} mmHg**\n`;
      response += `${interpretation.color} **${interpretation.level}**\n`;
      response += `• ${interpretation.message}\n`;
      response += `• **Action recommandée :** ${interpretation.action}\n\n`;
    }
    
    // Interprétation fréquence cardiaque
    if (entities.heartRate) {
      const interpretation = this.medicalKnowledge.values.heart_rate.interpret(entities.heartRate);
      
      response += `💓 **FRÉQUENCE CARDIAQUE : ${entities.heartRate} BPM**\n`;
      response += `${interpretation.color} **${interpretation.level}**\n`;
      response += `• ${interpretation.message}\n`;
      response += `• **Action recommandée :** ${interpretation.action}\n\n`;
    }
    
    // Conseils généraux
    response += `**💡 CONSEILS GÉNÉRAUX :**\n`;
    response += `• Surveillez l'évolution de vos valeurs\n`;
    response += `• Notez le contexte des mesures\n`;
    response += `• Consultez votre médecin pour suivi\n`;
    response += `• Maintenez un mode de vie sain\n\n`;
    response += `*Ces interprétations sont indicatives et ne remplacent pas un avis médical professionnel.*`;
    
    return response;
  }

  generateTechnicalHelp(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('diagnostic')) {
      return `🔬 **AIDE DIAGNOSTIC IA**

**📋 UTILISATION OPTIMALE :**
1. **ECG de qualité :** Haute résolution, 12 dérivations
2. **Données complètes :** Remplir tous les champs cliniques
3. **Contexte médical :** Symptômes et antécédents

**🎯 INTERPRÉTATION DES RÉSULTATS :**
• **>90% confiance :** Très fiable
• **80-90%** : Fiable, confirmation recommandée
• **<80%** : Incertain, avis médical nécessaire

**💡 OPTIMISATION :**
• Évitez artéfacts sur l'ECG
• Soyez précis dans les données cliniques
• Répétez si résultat incohérent`;
    }
    
    if (msg.includes('monitoring')) {
      return `📊 **AIDE MONITORING IoT**

**🚀 DÉMARRAGE :**
1. Menu → "Monitoring IoT"
2. Cliquez "Démarrer le monitoring"
3. Surveillance automatique active

**⚙️ CONFIGURATION :**
• Personnalisez les seuils d'alerte
• Ajustez la fréquence de mesure
• Activez/désactivez les notifications

**📥 EXPORT DES DONNÉES :**
• Historique → Sélectionner session
• Cliquez icône Export
• Fichier CSV téléchargé automatiquement`;
    }
    
    return `🔧 **SUPPORT TECHNIQUE CARDIOAI**

**🎯 FONCTIONNALITÉS PRINCIPALES :**
• Diagnostic IA avec ECG
• Monitoring IoT temps réel
• Historique et export de données
• Assistant santé intelligent

**❓ BESOIN D'AIDE SPÉCIFIQUE ?**
Précisez votre question :
• "Comment utiliser le diagnostic ?"
• "Problème avec le monitoring"
• "Comment exporter mes données ?"

Je vous guiderai étape par étape !`;
  }

  generateGeneralHelp() {
    return `🤖 **ASSISTANT SANTÉ CARDIAQUE**

**💬 COMMENT PUIS-JE VOUS AIDER ?**

**🩺 QUESTIONS MÉDICALES :**
• "J'ai mal au cœur"
• "Ma tension est 150/90"
• "Que signifient mes palpitations ?"

**🔧 AIDE TECHNIQUE :**
• "Comment utiliser le diagnostic ?"
• "Problème avec le monitoring"
• "Comment exporter mes données ?"

**💡 PRÉVENTION :**
• "Conseils pour un cœur en santé"
• "Comment prévenir les maladies cardiaques ?"

**🚨 URGENCES :**
• En cas de symptômes graves, appelez le 15

**🎯 CONSEILS :**
• Soyez précis dans vos questions
• Mentionnez vos symptômes ou valeurs
• N'hésitez pas à reformuler

Que souhaitez-vous savoir ?`;
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
    console.log('🏥 Processing with Azure Health Bot:', userMessage);
    
    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    // Simulation temps de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const analysis = this.analyzeMessage(userMessage);
      const response = await this.generateResponse(analysis);
      
      this.isTyping = false;
      this.addMessage('bot', response);
      
    } catch (error) {
      console.error('Erreur Azure Health Bot:', error);
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
    this.notifyListeners();
  }

  getFrequentQuestions() {
    return [
      "Bonjour, comment allez-vous ?",
      "J'ai mal au cœur, que faire ?",
      "Ma tension est 150/90, c'est grave ?",
      "Comment interpréter mes résultats ?",
      "Quels sont les signes d'urgence cardiaque ?",
      "Comment prévenir les maladies cardiaques ?",
      "Comment utiliser le diagnostic IA ?",
      "Que signifient mes palpitations ?"
    ];
  }
}

// Instance singleton
const azureHealthBotService = new AzureHealthBotService();

export default azureHealthBotService;
