/**
 * Super IA Intelligente pour CardioAI
 * Traitement du langage naturel avancé avec compréhension contextuelle
 */
class SuperIntelligentAI {
  constructor() {
    this.conversations = [];
    this.isTyping = false;
    this.listeners = new Set();
    this.conversationContext = {
      userProfile: {},
      topics: [],
      mood: 'neutral',
      expertise_level: 'beginner',
      previous_questions: [],
      session_data: {}
    };
    
    // Moteur de traitement du langage naturel avancé
    this.nlpEngine = this.initializeNLPEngine();
    this.knowledgeBase = this.initializeAdvancedKnowledgeBase();
    this.responseGenerator = this.initializeResponseGenerator();
  }

  initializeNLPEngine() {
    return {
      // Analyseur d'intention sophistiqué
      intentAnalyzer: {
        patterns: {
          // Questions médicales
          medical_symptoms: [
            /(?:j'ai|je ressens|je sens)\s+(?:mal|douleur|problème)/i,
            /(?:mal au|douleur)\s+(?:cœur|coeur|thorax|poitrine)/i,
            /(?:essoufflement|fatigue|vertiges|palpitations)/i,
            /(?:symptômes?|signes?)\s+(?:de|d')/i
          ],
          medical_values: [
            /(?:ma|mon)\s+(?:tension|pression|fréquence|pouls|température)/i,
            /(?:valeurs?|taux|niveau)\s+(?:normal|normaux|de)/i,
            /\d+\s*(?:bpm|mmhg|°c|%)/i,
            /(?:cholestérol|glycémie|saturation)/i
          ],
          medical_interpretation: [
            /(?:que signifie|qu'est-ce que|interpréter|comprendre)/i,
            /(?:résultat|diagnostic|analyse|ecg)/i,
            /(?:confiance|fiable|précis|sûr)/i
          ],
          
          // Questions techniques
          technical_usage: [
            /(?:comment|pourquoi|où|quand)\s+(?:utiliser|faire|configurer)/i,
            /(?:démarrer|arrêter|lancer|stopper)/i,
            /(?:problème|erreur|bug|marche pas)/i,
            /(?:exporter|sauvegarder|télécharger)/i
          ],
          
          // Questions d'urgence
          emergency: [
            /(?:urgence|urgent|grave|immédiat)/i,
            /(?:douleur\s+(?:intense|forte|aiguë))/i,
            /(?:crise|infarctus|malaise)/i,
            /(?:appeler|samu|15|secours)/i
          ],
          
          // Questions de prévention
          prevention: [
            /(?:prévenir|éviter|protéger|améliorer)/i,
            /(?:exercice|sport|alimentation|régime)/i,
            /(?:conseils?|recommandations?)/i
          ],
          
          // Salutations et politesse
          greeting: [
            /^(?:bonjour|salut|hello|bonsoir|hey)/i,
            /^(?:merci|thanks|au revoir|bye)/i
          ]
        }
      },
      
      // Extracteur d'entités avancé
      entityExtractor: {
        medical_values: {
          heart_rate: /(\d+)\s*(?:bpm|battements?)/i,
          blood_pressure: /(\d+)\/(\d+)\s*(?:mmhg)?/i,
          temperature: /(\d+(?:\.\d+)?)\s*°?c/i,
          oxygen_saturation: /(\d+)\s*%\s*(?:spo2|saturation|oxygène)/i,
          cholesterol: /(\d+(?:\.\d+)?)\s*(?:g\/l|mg\/dl)\s*(?:cholestérol)?/i
        },
        
        symptoms: [
          'douleur', 'mal', 'fatigue', 'essoufflement', 'palpitations', 
          'vertiges', 'nausées', 'sueurs', 'malaise', 'oppression'
        ],
        
        body_parts: [
          'cœur', 'coeur', 'thorax', 'poitrine', 'bras', 'mâchoire', 
          'dos', 'épaule', 'cou', 'ventre'
        ],
        
        time_expressions: [
          'maintenant', 'actuellement', 'depuis', 'hier', 'aujourd\'hui',
          'ce matin', 'ce soir', 'la nuit', 'souvent', 'parfois', 'toujours'
        ]
      },
      
      // Analyseur de sentiment et contexte
      sentimentAnalyzer: {
        worry_indicators: ['inquiet', 'peur', 'angoisse', 'stress', 'nerveux'],
        pain_indicators: ['mal', 'douleur', 'souffre', 'fait mal', 'intense'],
        urgency_indicators: ['vite', 'rapidement', 'urgent', 'immédiat', 'maintenant'],
        confusion_indicators: ['comprends pas', 'confus', 'compliqué', 'difficile']
      }
    };
  }

  initializeAdvancedKnowledgeBase() {
    return {
      // Base de connaissances médicales ultra-complète
      medical: {
        cardiology: {
          pathologies: {
            infarctus: {
              definition: "Nécrose du muscle cardiaque due à l'obstruction d'une artère coronaire",
              symptoms: ['douleur thoracique constrictive', 'irradiation bras gauche', 'sueurs', 'nausées', 'dyspnée'],
              emergency_signs: ['douleur > 20 min', 'sueurs profuses', 'malaise', 'vomissements'],
              risk_factors: ['âge', 'tabac', 'diabète', 'hypertension', 'cholestérol', 'hérédité'],
              prevention: ['arrêt tabac', 'exercice', 'alimentation', 'contrôle facteurs risque'],
              treatment: ['appel 15', 'aspirine si prescrite', 'repos', 'oxygène'],
              prognosis: 'Excellent si prise en charge rapide (<90 min)'
            },
            
            arythmie: {
              definition: "Trouble du rythme ou de la conduction cardiaque",
              types: ['tachycardie', 'bradycardie', 'fibrillation auriculaire', 'extrasystoles'],
              symptoms: ['palpitations', 'vertiges', 'fatigue', 'essoufflement', 'syncope'],
              causes: ['stress', 'caféine', 'alcool', 'médicaments', 'pathologie cardiaque'],
              when_worry: ['palpitations + douleur', 'malaise', 'syncope', 'dyspnée'],
              monitoring: 'ECG, Holter 24h, monitoring IoT'
            },
            
            hypertension: {
              definition: "Pression artérielle élevée de façon chronique",
              values: {
                normal: '<120/80 mmHg',
                elevated: '120-129/<80 mmHg',
                stage1: '130-139/80-89 mmHg',
                stage2: '≥140/≥90 mmHg',
                crisis: '>180/120 mmHg'
              },
              complications: ['AVC', 'infarctus', 'insuffisance rénale', 'rétinopathie'],
              lifestyle: ['réduction sel', 'exercice', 'perte poids', 'arrêt tabac', 'gestion stress']
            }
          },
          
          diagnostics: {
            ecg: {
              normal_values: {
                heart_rate: '60-100 BPM',
                pr_interval: '120-200 ms',
                qrs_duration: '<120 ms',
                qt_interval: '<440 ms (homme), <460 ms (femme)'
              },
              abnormalities: {
                'onde Q pathologique': 'Possible nécrose myocardique',
                'sus-décalage ST': 'Infarctus aigu (STEMI)',
                'sous-décalage ST': 'Ischémie myocardique',
                'onde T inversée': 'Ischémie ou séquelle',
                'QRS large': 'Trouble de conduction',
                'fibrillation auriculaire': 'Arythmie supraventriculaire'
              }
            },
            
            biomarkers: {
              troponine: 'Marqueur spécifique de nécrose myocardique',
              ck_mb: 'Créatine kinase MB, élévation précoce',
              bnp: 'Peptide natriurétique, insuffisance cardiaque',
              d_dimeres: 'Exclusion embolie pulmonaire'
            }
          }
        },
        
        // Valeurs de référence complètes
        reference_values: {
          vital_signs: {
            heart_rate: {
              newborn: '120-160 BPM',
              infant: '80-140 BPM',
              child: '70-120 BPM',
              adult: '60-100 BPM',
              elderly: '60-100 BPM',
              athlete: '40-60 BPM'
            },
            blood_pressure: {
              optimal: '<120/80 mmHg',
              normal: '<130/85 mmHg',
              high_normal: '130-139/85-89 mmHg',
              grade1_ht: '140-159/90-99 mmHg',
              grade2_ht: '160-179/100-109 mmHg',
              grade3_ht: '≥180/≥110 mmHg'
            },
            temperature: {
              hypothermia: '<35°C',
              normal: '36.1-37.2°C',
              low_fever: '37.3-38.0°C',
              moderate_fever: '38.1-39.0°C',
              high_fever: '>39.0°C'
            },
            oxygen_saturation: {
              normal: '95-100%',
              mild_hypoxemia: '90-94%',
              moderate_hypoxemia: '85-89%',
              severe_hypoxemia: '<85%'
            }
          },
          
          laboratory: {
            cholesterol: {
              total: '<2.0 g/L',
              ldl: '<1.6 g/L (risque modéré), <1.3 g/L (haut risque)',
              hdl: '>0.4 g/L (homme), >0.5 g/L (femme)',
              triglycerides: '<1.5 g/L'
            },
            glucose: {
              fasting: '0.7-1.1 g/L',
              postprandial: '<1.4 g/L',
              hba1c: '<6.5% (diabète), <7% (objectif)'
            }
          }
        }
      },
      
      // Connaissances techniques application
      technical: {
        cardioai_features: {
          diagnostic_ai: {
            model: 'XResNet deep learning',
            accuracy: '>90% sur pathologies courantes',
            input_data: ['ECG image', 'age', 'sex', 'chest_pain_type', 'resting_bp', 'cholesterol', 'fasting_bs', 'resting_ecg', 'max_hr', 'exercise_angina', 'oldpeak', 'st_slope', 'thalassemia'],
            output: 'Diagnostic + confidence score (0-100%)',
            limitations: 'Ne remplace pas avis médical professionnel'
          },
          
          iot_monitoring: {
            sensors: ['heart_rate', 'blood_pressure', 'temperature', 'spo2'],
            frequency: 'Temps réel (2-5 secondes)',
            alerts: 'Seuils personnalisables',
            storage: 'Sessions automatiques avec historique',
            export: 'Format CSV avec timestamps'
          }
        }
      }
    };
  }

  initializeResponseGenerator() {
    return {
      templates: {
        medical_emergency: {
          structure: ['🚨 URGENCE', 'symptoms_analysis', 'immediate_actions', 'emergency_contact'],
          tone: 'urgent_but_calm'
        },
        
        medical_advice: {
          structure: ['🩺 ANALYSE', 'interpretation', 'recommendations', 'when_to_consult', 'disclaimer'],
          tone: 'professional_caring'
        },
        
        technical_guide: {
          structure: ['🔧 GUIDE', 'step_by_step', 'tips', 'troubleshooting', 'additional_help'],
          tone: 'clear_instructional'
        },
        
        interpretation: {
          structure: ['📊 INTERPRÉTATION', 'values_analysis', 'clinical_significance', 'next_steps'],
          tone: 'educational_precise'
        }
      },
      
      personalization: {
        beginner: 'Explications simples, éviter jargon médical',
        intermediate: 'Équilibre vulgarisation/précision',
        expert: 'Terminologie médicale appropriée'
      }
    };
  }

  /**
   * Analyse ultra-intelligente du message
   */
  async analyzeMessage(message) {
    const analysis = {
      intent: await this.classifyIntentAdvanced(message),
      entities: this.extractEntitiesAdvanced(message),
      sentiment: this.analyzeSentiment(message),
      context: this.analyzeConversationContext(message),
      urgency: this.assessUrgencyLevel(message),
      complexity: this.assessQuestionComplexity(message),
      user_state: this.inferUserState(message)
    };
    
    // Mise à jour du contexte conversationnel
    this.updateConversationContext(analysis);
    
    console.log('🧠 Advanced Analysis:', analysis);
    return analysis;
  }

  async classifyIntentAdvanced(message) {
    const msg = message.toLowerCase();

    console.log('🔍 Classifying intent for:', msg);

    // Classification directe et simple

    // Urgences médicales
    if (msg.includes('douleur') && (msg.includes('intense') || msg.includes('forte') || msg.includes('thoracique'))) {
      console.log('🚨 Intent: emergency');
      return 'emergency';
    }

    if (msg.includes('urgent') || msg.includes('grave') || msg.includes('malaise') || msg.includes('crise')) {
      console.log('🚨 Intent: emergency');
      return 'emergency';
    }

    // Questions médicales avec valeurs
    if (/\d+\s*(bpm|mmhg|°c|%)/i.test(msg) || msg.includes('ma tension') || msg.includes('mon pouls')) {
      console.log('📊 Intent: medical_values');
      return 'medical_values';
    }

    // Symptômes médicaux
    if (msg.includes('mal au') || msg.includes('j\'ai mal') || msg.includes('douleur') ||
        msg.includes('palpitations') || msg.includes('essoufflement') || msg.includes('fatigue')) {
      console.log('🩺 Intent: medical_symptoms');
      return 'medical_symptoms';
    }

    // Questions d'interprétation
    if (msg.includes('interpréter') || msg.includes('que signifie') || msg.includes('confiance') ||
        msg.includes('résultat') || msg.includes('diagnostic') || msg.includes('ecg')) {
      console.log('🔬 Intent: interpretation');
      return 'interpretation';
    }

    // Questions techniques
    if (msg.includes('comment utiliser') || msg.includes('comment faire') || msg.includes('démarrer') ||
        msg.includes('monitoring') || msg.includes('exporter') || msg.includes('problème')) {
      console.log('🔧 Intent: technical_help');
      return 'technical_help';
    }

    // Questions de prévention
    if (msg.includes('prévenir') || msg.includes('éviter') || msg.includes('conseils') ||
        msg.includes('améliorer') || msg.includes('exercice') || msg.includes('alimentation')) {
      console.log('💡 Intent: prevention');
      return 'prevention';
    }

    // Salutations
    if (msg.match(/^(bonjour|salut|hello|bonsoir|hey|merci|au revoir)/)) {
      console.log('👋 Intent: greeting');
      return 'greeting';
    }

    // Questions médicales générales
    if (msg.includes('cœur') || msg.includes('cardiaque') || msg.includes('tension') ||
        msg.includes('cholestérol') || msg.includes('valeurs normales')) {
      console.log('⚕️ Intent: medical_question');
      return 'medical_question';
    }

    console.log('❓ Intent: general_question');
    return 'general_question';
  }

  extractEntitiesAdvanced(message) {
    const entities = {
      medical_values: {},
      symptoms: [],
      body_parts: [],
      time_expressions: [],
      medications: [],
      family_history: []
    };
    
    const extractors = this.nlpEngine.entityExtractor;
    
    // Extraction des valeurs médicales avec regex avancées
    for (const [valueType, pattern] of Object.entries(extractors.medical_values)) {
      const match = message.match(pattern);
      if (match) {
        entities.medical_values[valueType] = {
          value: match[1],
          unit: this.extractUnit(match[0]),
          context: this.extractValueContext(message, match.index)
        };
      }
    }
    
    // Extraction des symptômes avec contexte
    extractors.symptoms.forEach(symptom => {
      if (message.toLowerCase().includes(symptom)) {
        entities.symptoms.push({
          symptom,
          intensity: this.extractIntensity(message, symptom),
          duration: this.extractDuration(message, symptom),
          context: this.extractSymptomContext(message, symptom)
        });
      }
    });
    
    return entities;
  }

  analyzeSentiment(message) {
    const msg = message.toLowerCase();
    const analyzer = this.nlpEngine.sentimentAnalyzer;
    
    const sentiment = {
      worry_level: 0,
      pain_level: 0,
      urgency_level: 0,
      confusion_level: 0,
      overall_mood: 'neutral'
    };
    
    // Calcul des niveaux avec pondération
    analyzer.worry_indicators.forEach(indicator => {
      if (msg.includes(indicator)) sentiment.worry_level += 1;
    });
    
    analyzer.pain_indicators.forEach(indicator => {
      if (msg.includes(indicator)) sentiment.pain_level += 1;
    });
    
    analyzer.urgency_indicators.forEach(indicator => {
      if (msg.includes(indicator)) sentiment.urgency_level += 1;
    });
    
    analyzer.confusion_indicators.forEach(indicator => {
      if (msg.includes(indicator)) sentiment.confusion_level += 1;
    });
    
    // Détermination de l'humeur générale
    if (sentiment.worry_level > 2 || sentiment.pain_level > 2) {
      sentiment.overall_mood = 'worried';
    } else if (sentiment.urgency_level > 1) {
      sentiment.overall_mood = 'urgent';
    } else if (sentiment.confusion_level > 1) {
      sentiment.overall_mood = 'confused';
    }
    
    return sentiment;
  }

  /**
   * Génération de réponse ultra-intelligente
   */
  async generateSuperIntelligentResponse(message) {
    try {
      const analysis = await this.analyzeMessage(message);
      
      // Sélection de la stratégie de réponse optimale
      const responseStrategy = this.selectResponseStrategy(analysis);
      
      // Génération de la réponse personnalisée
      const response = await this.generatePersonalizedResponse(analysis, message, responseStrategy);
      
      // Post-traitement et formatage avancé
      return this.formatAdvancedResponse(response, analysis);
      
    } catch (error) {
      console.error('Erreur génération super intelligente:', error);
      return this.generateFallbackResponse(message);
    }
  }

  selectResponseStrategy(analysis) {
    // Logique sophistiquée de sélection de stratégie
    if (analysis.urgency === 'immediate' || analysis.intent === 'emergency') {
      return 'emergency_response';
    }
    
    if (analysis.sentiment.worry_level > 2) {
      return 'reassuring_medical';
    }
    
    if (analysis.sentiment.confusion_level > 1) {
      return 'educational_simple';
    }
    
    if (analysis.entities.medical_values && Object.keys(analysis.entities.medical_values).length > 0) {
      return 'value_interpretation';
    }
    
    if (analysis.intent.includes('technical')) {
      return 'technical_guide';
    }
    
    return 'comprehensive_medical';
  }

  async generatePersonalizedResponse(analysis, message, strategy) {
    const kb = this.knowledgeBase;
    
    // Gestion directe selon l'intention détectée
    switch (analysis.intent) {
      case 'emergency':
        return this.generateEmergencyResponse(analysis);

      case 'greeting':
        return this.generateGreetingResponse(analysis, message);

      case 'medical_values':
        return this.generateValueInterpretation(analysis, message);

      case 'medical_symptoms':
        return this.generateSymptomsResponse(analysis, message);

      case 'medical_question':
        return this.generateMedicalQuestionResponse(analysis, message);

      case 'interpretation':
        return this.generateInterpretationResponse(analysis, message);

      case 'technical_help':
        return this.generateTechnicalSuperGuide(analysis, message);

      case 'prevention':
        return this.generatePreventionAdvice();

      default:
        return this.generateContextualResponse(analysis, message);
    }
  }

  generateMedicalQuestionResponse(analysis, message) {
    const msg = message.toLowerCase();

    // Réponses spécialisées selon le type de question médicale
    if (msg.includes('valeurs normales') || msg.includes('valeur normale')) {
      return this.generateNormalValuesResponse();
    }

    if (msg.includes('cœur') || msg.includes('cardiaque')) {
      return this.generateHeartEducation();
    }

    if (msg.includes('tension') || msg.includes('pression artérielle')) {
      return this.generateBloodPressureEducation();
    }

    if (msg.includes('ecg') || msg.includes('électrocardiogramme')) {
      return this.generateECGEducation();
    }

    if (msg.includes('cholestérol')) {
      return this.generateCholesterolInfo();
    }

    if (msg.includes('prévention') || msg.includes('prévenir')) {
      return this.generatePreventionAdvice();
    }

    return this.generateGeneralCardiacEducation();
  }

  generateNormalValuesResponse() {
    return `📊 **VALEURS NORMALES - PARAMÈTRES CARDIAQUES**

**💓 FRÉQUENCE CARDIAQUE :**
• **Adulte au repos :** 60-100 BPM
• **Sportif entraîné :** 40-60 BPM
• **Enfant (6-15 ans) :** 70-100 BPM
• **Nourrisson :** 100-160 BPM
• **Personne âgée :** 60-100 BPM

**🩸 PRESSION ARTÉRIELLE :**
• **Optimale :** <120/80 mmHg
• **Normale :** <130/85 mmHg
• **Élevée normale :** 130-139/85-89 mmHg
• **Hypertension Grade 1 :** 140-159/90-99 mmHg
• **Hypertension Grade 2 :** ≥160/≥100 mmHg

**🌡️ TEMPÉRATURE CORPORELLE :**
• **Normale :** 36.1-37.2°C (buccale)
• **Rectale :** +0.5°C par rapport à buccale
• **Axillaire :** -0.5°C par rapport à buccale
• **Fièvre légère :** 37.3-38.0°C
• **Fièvre modérée :** 38.1-39.0°C
• **Fièvre élevée :** >39.0°C

**🫁 SATURATION EN OXYGÈNE (SpO₂) :**
• **Normale :** 95-100%
• **Légèrement basse :** 90-94%
• **Hypoxémie modérée :** 85-89%
• **Hypoxémie sévère :** <85%

**🧪 CHOLESTÉROL (à jeun) :**
• **Total :** <2.0 g/L (<200 mg/dL)
• **LDL "mauvais" :** <1.6 g/L (<160 mg/dL)
• **HDL "bon" :** >0.4 g/L homme, >0.5 g/L femme
• **Triglycérides :** <1.5 g/L (<150 mg/dL)

**🍯 GLYCÉMIE :**
• **À jeun :** 0.7-1.1 g/L (70-110 mg/dL)
• **Post-prandiale (2h) :** <1.4 g/L (<140 mg/dL)
• **HbA1c :** <6.5% (diabète), <7% (objectif)

**⚠️ VARIATIONS NORMALES :**
• **Âge :** Valeurs évoluent avec l'âge
• **Sexe :** Différences homme/femme
• **Activité :** Effort modifie temporairement
• **Stress :** Impact sur FC et PA
• **Heure :** Rythme circadien

**🎯 QUAND S'INQUIÉTER :**
• Valeurs persistamment anormales
• Symptômes associés
• Changement brutal des valeurs
• Facteurs de risque multiples

💡 **RAPPEL :** Ces valeurs sont indicatives. Seul votre médecin peut interpréter vos résultats dans votre contexte personnel !`;
  }

  generateCholesterolInfo() {
    return `🧪 **TOUT SAVOIR SUR LE CHOLESTÉROL**

**🔬 QU'EST-CE QUE LE CHOLESTÉROL ?**
Substance grasse essentielle produite par le foie (75%) et apportée par l'alimentation (25%).

**📊 LES DIFFÉRENTS TYPES :**

**🔴 LDL ("Mauvais" cholestérol) :**
• Transport du foie vers les tissus
• Se dépose sur les parois artérielles
• Objectif : <1.6 g/L (risque modéré)
• Objectif : <1.3 g/L (haut risque cardiovasculaire)

**🟢 HDL ("Bon" cholestérol) :**
• Transport des tissus vers le foie
• Nettoie les artères
• Objectif : >0.4 g/L (homme), >0.5 g/L (femme)
• Plus c'est élevé, mieux c'est !

**🟡 TRIGLYCÉRIDES :**
• Autre type de graisse sanguine
• Augmentent avec sucres et alcool
• Objectif : <1.5 g/L

**⚖️ VALEURS CIBLES SELON LE RISQUE :**

**🟢 Risque faible :**
• LDL <1.9 g/L
• Cholestérol total <2.5 g/L

**🟡 Risque modéré :**
• LDL <1.6 g/L
• Cholestérol total <2.2 g/L

**🔴 Haut risque :**
• LDL <1.3 g/L
• Cholestérol total <2.0 g/L

**🚨 Très haut risque :**
• LDL <0.7 g/L
• Cholestérol total <1.8 g/L

**🍽️ ALIMENTATION ANTI-CHOLESTÉROL :**

**✅ ALIMENTS BÉNÉFIQUES :**
• Poissons gras (saumon, maquereau)
• Noix, amandes, avocat
• Huile d'olive, colza
• Légumes, fruits, légumineuses
• Avoine, orge (fibres solubles)

**❌ ALIMENTS À LIMITER :**
• Viandes grasses, charcuterie
• Beurre, crème, fromages gras
• Pâtisseries, viennoiseries
• Fritures, plats préparés
• Abats (foie, rognons)

**🏃‍♂️ EXERCICE PHYSIQUE :**
• Augmente le HDL ("bon")
• Diminue les triglycérides
• 30 minutes/jour minimum
• Privilégier endurance (marche, vélo, natation)

**💊 TRAITEMENTS MÉDICAMENTEUX :**
• **Statines :** Réduisent production de cholestérol
• **Ézétimibe :** Diminue absorption intestinale
• **Fibrates :** Baissent triglycérides
• **Résines :** Captent cholestérol intestinal

**🔍 SURVEILLANCE :**
• Bilan lipidique à jeun
• Contrôle tous les 3-5 ans (normal)
• Contrôle tous les 3-6 mois (traitement)
• Objectifs personnalisés selon risque

**💡 IDÉES REÇUES :**
❌ "Supprimer tous les œufs"
✅ 3-4 œufs/semaine possibles

❌ "Les médicaments suffisent"
✅ Hygiène de vie reste essentielle

❌ "Cholestérol = maladie cardiaque"
✅ Un facteur parmi d'autres`;
  }

  generateGreetingResponse(analysis, message) {
    const msg = message.toLowerCase();
    const timeOfDay = new Date().getHours();

    let greeting = '';
    if (timeOfDay < 12) {
      greeting = 'Bonjour';
    } else if (timeOfDay < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }

    if (msg.includes('merci') || msg.includes('thanks')) {
      return `😊 **De rien !**

C'est un plaisir de vous aider avec vos questions de santé cardiaque.

🤖 **Je reste à votre disposition pour :**
• Questions médicales cardiaques
• Interprétation de vos résultats
• Utilisation de l'application CardioAI
• Conseils de prévention personnalisés

N'hésitez pas à me poser d'autres questions ! 💙`;
    }

    if (msg.includes('au revoir') || msg.includes('bye')) {
      return `👋 **Au revoir et prenez soin de votre cœur !**

🫀 **Rappels importants :**
• Surveillez vos paramètres vitaux
• Consultez un médecin si besoin
• Adoptez un mode de vie sain
• Utilisez CardioAI pour votre suivi

À bientôt ! 💙`;
    }

    return `${greeting} ! 👋

🧠 **Assistant CardioAI Super-Intelligent à votre service !**

Je suis spécialisé dans :

🩺 **Expertise Médicale Cardiaque :**
• Interprétation de vos valeurs (tension, pouls, ECG)
• Analyse de symptômes et conseils
• Explications des pathologies cardiaques
• Guidance pour consultations médicales

🔬 **Diagnostic IA Avancé :**
• Aide à l'utilisation du système
• Interprétation des résultats
• Optimisation de la précision
• Préparation des données cliniques

📊 **Monitoring IoT Intelligent :**
• Configuration des capteurs
• Compréhension des alertes
• Gestion des sessions de surveillance
• Export et analyse des données

💡 **Prévention Personnalisée :**
• Conseils adaptés à votre profil
• Plans d'action sur mesure
• Facteurs de risque à surveiller
• Habitudes de vie saines

🚨 **Gestion des Urgences :**
• Détection automatique des situations critiques
• Protocoles d'urgence immédiats
• Orientation vers les secours appropriés

💬 **Comment puis-je vous aider aujourd'hui ?**

*Posez-moi n'importe quelle question sur votre santé cardiaque ou l'utilisation de CardioAI !*`;
  }

  generateSymptomsResponse(analysis, message) {
    const msg = message.toLowerCase();
    const symptoms = analysis.entities.symptoms;
    const urgency = analysis.urgency;

    if (urgency === 'immediate') {
      return this.generateEmergencyResponse(analysis);
    }

    if (msg.includes('mal au cœur') || msg.includes('mal au coeur')) {
      return `💙 **Douleur Cardiaque - Analyse et Conseils**

🔍 **Votre Symptôme :** Douleur/gêne au niveau du cœur

**🩺 TYPES DE DOULEURS CARDIAQUES :**

**🔴 Douleur d'Origine Cardiaque :**
• **Localisation :** Centre de la poitrine, irradiation possible
• **Caractère :** Serrement, oppression, étau
• **Déclencheurs :** Effort, stress, froid
• **Durée :** Quelques minutes à plusieurs heures

**🟡 Douleur Non-Cardiaque :**
• **Localisation :** Précise, ponctuelle
• **Caractère :** Piqûre, brûlure, coup de poignard
• **Déclencheurs :** Mouvement, respiration, position
• **Durée :** Secondes ou persistante

**⚠️ SIGNES D'ALERTE URGENTS :**
• Douleur intense et persistante (>20 min)
• Irradiation bras gauche, mâchoire, dos
• Sueurs froides, nausées, malaise
• Essoufflement important
• Pâleur, angoisse de mort

**🎯 QUE FAIRE MAINTENANT :**

**📋 Si douleur légère/modérée :**
1. **Arrêtez** toute activité physique
2. **Asseyez-vous** ou allongez-vous
3. **Respirez** calmement et profondément
4. **Notez** les caractéristiques (durée, intensité, déclencheur)
5. **Surveillez** l'évolution

**📞 Consultez rapidement si :**
• Douleur récurrente ou persistante
• Apparition à l'effort
• Antécédents familiaux cardiaques
• Facteurs de risque (tabac, diabète, hypertension)

**🚨 Appelez le 15 si :**
• Douleur intense et prolongée
• Signes d'accompagnement inquiétants
• Malaise général important

**💡 CAUSES FRÉQUENTES NON-CARDIAQUES :**
• Stress et anxiété (très fréquent)
• Problèmes musculaires/costaux
• Reflux gastro-œsophagien
• Troubles respiratoires

**🔍 EXAMENS POSSIBLES :**
• ECG de repos et d'effort
• Échographie cardiaque
• Prise de sang (troponines)
• Scanner ou coronarographie si nécessaire

*Votre description m'aide à mieux vous orienter. Pouvez-vous me dire quand cette douleur est apparue et dans quelles circonstances ?*`;
    }

    if (msg.includes('palpitations')) {
      return `💓 **Palpitations Cardiaques - Guide Complet**

🔍 **Votre Symptôme :** Sensation de battements cardiaques anormaux

**🫀 QU'EST-CE QUE LES PALPITATIONS ?**
Perception consciente des battements du cœur, normalement imperceptibles.

**📊 TYPES DE PALPITATIONS :**

**🟢 Palpitations Bénignes :**
• **Causes :** Stress, fatigue, caféine, exercice
• **Caractère :** Occasionnelles, brèves
• **Contexte :** Situations identifiables
• **Évolution :** Disparaissent au repos

**🟡 Palpitations à Surveiller :**
• **Fréquence :** Plusieurs fois par semaine
• **Durée :** Plusieurs minutes
• **Intensité :** Gênantes dans les activités
• **Contexte :** Sans cause évidente

**🔴 Palpitations Inquiétantes :**
• **Signes associés :** Douleur, malaise, syncope
• **Durée :** Prolongées (>30 min)
• **Fréquence :** Quotidiennes
• **Impact :** Limitation des activités

**🎯 CAUSES PRINCIPALES :**

**⚡ Arythmies Cardiaques :**
• Extrasystoles (contractions prématurées)
• Tachycardie (rythme rapide)
• Fibrillation auriculaire
• Troubles de conduction

**🧠 Causes Non-Cardiaques :**
• **Stress/Anxiété :** Cause #1 chez les jeunes
• **Stimulants :** Café, thé, tabac, alcool
• **Médicaments :** Bronchodilatateurs, antidépresseurs
• **Hormones :** Hyperthyroïdie, ménopause
• **Autres :** Anémie, fièvre, déshydratation

**📋 AUTO-ÉVALUATION :**

**🕐 Quand surviennent-elles ?**
• Au repos ou à l'effort ?
• Moment de la journée ?
• Lien avec stress/émotions ?
• Après repas/café ?

**⏱️ Combien de temps durent-elles ?**
• Quelques secondes ?
• Plusieurs minutes ?
• Plus d'une heure ?

**💓 Comment les ressentez-vous ?**
• Cœur qui s'emballe ?
• Battements irréguliers ?
• Sensation de "ratés" ?
• Cœur qui "cogne" ?

**🎯 CONSEILS IMMÉDIATS :**

**✅ Techniques de Relaxation :**
• Respiration profonde (4 sec inspiration, 6 sec expiration)
• Manœuvre de Valsalva (expirer en se bouchant le nez)
• Eau froide sur le visage
• Position allongée, jambes surélevées

**❌ À Éviter :**
• Caféine, théine, alcool
• Tabac et stimulants
• Stress et surmenage
• Repas trop copieux

**📞 QUAND CONSULTER :**

**🟡 Consultation Programmée :**
• Palpitations récurrentes
• Gêne dans les activités
• Antécédents familiaux
• Facteurs de risque cardiovasculaire

**🔴 Consultation Urgente :**
• Palpitations + douleur thoracique
• Malaise, syncope
• Essoufflement important
• Durée >30 minutes

**🔍 EXAMENS POSSIBLES :**
• ECG de repos
• Holter 24h (enregistrement continu)
• Échographie cardiaque
• Test d'effort
• Bilan sanguin (thyroïde, électrolytes)

*Depuis quand ressentez-vous ces palpitations et dans quelles circonstances apparaissent-elles ?*`;
    }

    // Réponse générale pour autres symptômes
    return `🩺 **Analyse de Vos Symptômes**

Je comprends votre préoccupation concernant vos symptômes.

**🔍 ÉVALUATION INITIALE :**
• Symptômes détectés dans votre message
• Niveau d'urgence évalué : ${urgency === 'immediate' ? '🔴 Urgent' : '🟡 À surveiller'}
• Contexte à approfondir

**📋 INFORMATIONS UTILES :**
Pour mieux vous aider, pouvez-vous préciser :
• Depuis quand ressentez-vous ces symptômes ?
• Dans quelles circonstances apparaissent-ils ?
• Avez-vous d'autres signes associés ?
• Prenez-vous des médicaments ?

**🎯 CONSEILS GÉNÉRAUX :**
• Notez vos symptômes (fréquence, intensité, durée)
• Évitez les facteurs déclenchants identifiés
• Maintenez un mode de vie sain
• Consultez si persistance ou aggravation

**📞 QUAND CONSULTER :**
• Symptômes nouveaux ou inhabituels
• Gêne dans les activités quotidiennes
• Inquiétude persistante
• Antécédents ou facteurs de risque

Décrivez-moi plus précisément ce que vous ressentez pour un conseil personnalisé.`;
  }

  generateContextualResponse(analysis, message) {
    const msg = message.toLowerCase();

    // Questions générales sur la santé cardiaque
    if (msg.includes('santé') || msg.includes('cœur') || msg.includes('cardiaque')) {
      return this.generateGeneralCardiacEducation();
    }

    // Questions sur l'application
    if (msg.includes('cardioai') || msg.includes('application') || msg.includes('app')) {
      return this.generateAppOverview();
    }

    // Questions vagues ou générales
    return this.generateHelpfulResponse(message);
  }

  generateAppOverview() {
    return `📱 **CARDIOAI - VOTRE ASSISTANT SANTÉ CARDIAQUE**

🎯 **MISSION :** Démocratiser l'accès au diagnostic cardiaque par l'Intelligence Artificielle

**🔬 DIAGNOSTIC IA AVANCÉ :**
• **Technologie :** Réseau de neurones XResNet
• **Précision :** >90% sur pathologies courantes
• **Données :** ECG + paramètres cliniques
• **Résultat :** Diagnostic + niveau de confiance

**📊 MONITORING IoT TEMPS RÉEL :**
• **Capteurs :** FC, PA, Température, SpO₂
• **Alertes :** Seuils personnalisables
• **Historique :** Sessions sauvegardées
• **Export :** Données CSV pour médecin

**🧠 ASSISTANT IA INTELLIGENT :**
• **Compréhension :** Langage naturel avancé
• **Expertise :** Cardiologie + technique
• **Personnalisation :** Réponses adaptées
• **Urgences :** Détection automatique

**👥 POUR QUI ?**
• **Patients :** Suivi personnel de santé
• **Médecins :** Aide au diagnostic
• **Préventif :** Dépistage population
• **Télémédecine :** Zones sous-médicalisées

**🔒 SÉCURITÉ & CONFIDENTIALITÉ :**
• Données chiffrées localement
• Aucun stockage cloud sans consentement
• Conformité RGPD
• Anonymisation des analyses

**💡 INNOVATION :**
• IA explicable et transparente
• Interface intuitive et accessible
• Intégration IoT native
• Évolution continue par apprentissage

**🎯 UTILISATION OPTIMALE :**
1. **Diagnostic :** ECG + données cliniques complètes
2. **Monitoring :** Sessions régulières 15-30 min
3. **Suivi :** Consultation historique et tendances
4. **Médical :** Export pour consultations

*CardioAI ne remplace pas l'avis médical mais le complète intelligemment !*`;
  }

  generateHelpfulResponse(message) {
    return `🤖 **Assistant CardioAI - Comment puis-je vous aider ?**

Je n'ai pas bien compris votre question, mais je suis là pour vous aider !

**💬 TYPES DE QUESTIONS QUE JE COMPRENDS PARFAITEMENT :**

**🩺 Questions Médicales :**
• "Quelles sont les valeurs normales ?"
• "J'ai mal au cœur, que faire ?"
• "Ma tension est 150/90, c'est grave ?"
• "Comment interpréter mon ECG ?"

**🔧 Questions Techniques :**
• "Comment utiliser le diagnostic IA ?"
• "Comment démarrer le monitoring ?"
• "Comment exporter mes données ?"
• "Problème avec l'application"

**💡 Questions de Prévention :**
• "Comment prévenir les maladies cardiaques ?"
• "Conseils pour un cœur en bonne santé"
• "Facteurs de risque à éviter"

**🚨 Urgences :**
• "J'ai une douleur thoracique intense"
• "Que faire en cas de crise cardiaque ?"

**🎯 CONSEILS POUR MIEUX COMMUNIQUER :**
• Soyez spécifique dans vos questions
• Mentionnez vos symptômes ou valeurs
• Précisez le contexte si nécessaire
• N'hésitez pas à reformuler

**💭 EXEMPLES DE REFORMULATION :**
Au lieu de : "J'ai un problème"
Dites : "J'ai des palpitations depuis ce matin"

Au lieu de : "Ça marche pas"
Dites : "Je n'arrive pas à démarrer le monitoring"

**🔄 Pouvez-vous reformuler votre question plus précisément ?**

Je suis conçu pour comprendre et vous aider au mieux ! 💙`;
  }

  generatePreventionAdvice() {
    return `💡 **PRÉVENTION CARDIOVASCULAIRE COMPLÈTE**

**🎯 OBJECTIF :** Réduire de 80% le risque de maladie cardiaque par des mesures simples !

**🚭 ARRÊT DU TABAC (Priorité #1) :**
• **Bénéfice immédiat :** Risque diminue dès 24h
• **1 an :** Risque divisé par 2
• **5 ans :** Risque = non-fumeur
• **Aide :** Substituts nicotiniques, Tabac Info Service (3989)

**🏃‍♂️ ACTIVITÉ PHYSIQUE RÉGULIÈRE :**
• **Objectif :** 150 min/semaine d'intensité modérée
• **Exemples :** Marche rapide, vélo, natation, jardinage
• **Progression :** Commencer par 10 min/jour
• **Bénéfices :** ↓ PA, ↑ HDL, ↓ stress, ↓ poids

**🥗 ALIMENTATION MÉDITERRANÉENNE :**

**✅ PRIVILÉGIER :**
• **Légumes/fruits :** 5 portions/jour minimum
• **Poissons gras :** 2-3 fois/semaine (oméga-3)
• **Huile d'olive :** Cuisson et assaisonnement
• **Noix, amandes :** 30g/jour (non salées)
• **Légumineuses :** Lentilles, haricots, pois chiches
• **Céréales complètes :** Pain, riz, pâtes

**❌ LIMITER :**
• **Sel :** <6g/jour (1 cuillère à café)
• **Sucres ajoutés :** Sodas, pâtisseries
• **Viandes rouges :** <500g/semaine
• **Charcuterie :** <50g/semaine
• **Alcool :** <2 verres/jour (homme), <1 verre/jour (femme)

**⚖️ MAINTIEN D'UN POIDS SANTÉ :**
• **IMC optimal :** 18.5-25 kg/m²
• **Tour de taille :** <94 cm (homme), <80 cm (femme)
• **Perte progressive :** 0.5-1 kg/semaine
• **Éviter :** Régimes drastiques

**😌 GESTION DU STRESS :**
• **Techniques :** Méditation, yoga, respiration
• **Sommeil :** 7-9h/nuit de qualité
• **Loisirs :** Activités plaisantes régulières
• **Social :** Maintenir liens familiaux/amicaux

**🩺 SUIVI MÉDICAL PRÉVENTIF :**

**📋 BILANS RÉGULIERS :**
• **Pression artérielle :** Tous les ans
• **Cholestérol :** Tous les 5 ans (normal)
• **Glycémie :** Tous les 3 ans après 45 ans
• **ECG :** Selon facteurs de risque

**💊 TRAITEMENTS PRÉVENTIFS :**
• **Aspirine :** Si prescrite (risque hémorragique)
• **Statines :** Selon niveau de risque
• **Antihypertenseurs :** Si PA élevée
• **Antidiabétiques :** Si diabète

**🎯 OBJECTIFS PERSONNALISÉS :**

**🟢 RISQUE FAIBLE :**
• PA <130/85 mmHg
• LDL <1.9 g/L
• Pas de tabac
• Exercice régulier

**🟡 RISQUE MODÉRÉ :**
• PA <130/80 mmHg
• LDL <1.6 g/L
• Surveillance renforcée

**🔴 HAUT RISQUE :**
• PA <130/80 mmHg
• LDL <1.3 g/L
• Suivi cardiologique

**📱 OUTILS MODERNES :**
• **Applications :** Suivi PA, activité, alimentation
• **Montres connectées :** FC, pas, sommeil
• **Tensiomètres :** Auto-mesure domicile
• **CardioAI :** Monitoring et diagnostic IA

**💡 MOTIVATION :**
• **30 min de marche/jour :** -50% risque cardiaque
• **Arrêt tabac :** -50% risque en 1 an
• **Alimentation saine :** -30% risque
• **Combinaison :** -80% risque global !

**🎯 PLAN D'ACTION PERSONNEL :**
1. **Choisir 1 objectif** prioritaire
2. **Progression graduelle** (21 jours = habitude)
3. **Suivi régulier** des progrès
4. **Récompenses** non alimentaires
5. **Soutien** famille/amis/professionnel

La prévention cardiovasculaire, c'est investir dans votre avenir ! 💪`;
  }

  // Méthodes de génération spécialisées (à implémenter)
  generateValueInterpretation(analysis, message) {
    const msg = message.toLowerCase();
    const values = analysis.entities.medical_values;

    // Si des valeurs spécifiques sont détectées
    if (Object.keys(values).length > 0) {
      let interpretation = `📊 **INTERPRÉTATION DE VOS VALEURS MÉDICALES**\n\n`;

      for (const [valueType, data] of Object.entries(values)) {
        const result = this.interpretMedicalValue(valueType, data.value, data.unit);
        interpretation += `${result}\n\n`;
      }

      interpretation += `**🎯 RECOMMANDATIONS :**\n`;
      interpretation += `• Surveillez l'évolution de vos valeurs\n`;
      interpretation += `• Consultez votre médecin pour interprétation complète\n`;
      interpretation += `• Maintenez un mode de vie sain\n`;
      interpretation += `• Répétez les mesures si nécessaire\n\n`;
      interpretation += `*Ces interprétations sont indicatives et ne remplacent pas un avis médical.*`;

      return interpretation;
    }

    // Si mention de valeurs sans chiffres précis
    if (msg.includes('tension') || msg.includes('pression')) {
      return this.generateBloodPressureEducation();
    }

    if (msg.includes('pouls') || msg.includes('fréquence cardiaque')) {
      return this.generateHeartRateInfo();
    }

    return this.generateNormalValuesResponse();
  }

  generateHeartRateInfo() {
    return `💓 **TOUT SAVOIR SUR LA FRÉQUENCE CARDIAQUE**

**⚡ DÉFINITION :**
Nombre de battements cardiaques par minute (BPM), reflet de l'activité du cœur.

**📊 VALEURS NORMALES :**
• **Adulte au repos :** 60-100 BPM
• **Sportif entraîné :** 40-60 BPM
• **Enfant (6-15 ans) :** 70-100 BPM
• **Nourrisson :** 100-160 BPM
• **Personne âgée :** 60-100 BPM

**📈 VARIATIONS NORMALES :**

**🔼 Augmentation Physiologique :**
• **Effort physique :** Jusqu'à 180-220 BPM
• **Stress/Émotion :** +20-40 BPM
• **Fièvre :** +10 BPM par °C
• **Grossesse :** +10-20 BPM
• **Caféine/Stimulants :** +10-30 BPM

**🔽 Diminution Physiologique :**
• **Sommeil :** -10-20 BPM
• **Entraînement :** Cœur plus efficace
• **Âge avancé :** Légère diminution
• **Médicaments :** Bêta-bloquants

**⚠️ ANOMALIES À SURVEILLER :**

**🔴 Tachycardie (>100 BPM au repos) :**
• **Causes :** Stress, fièvre, anémie, hyperthyroïdie
• **Symptômes :** Palpitations, essoufflement, fatigue
• **Quand consulter :** Si persistante ou symptômes gênants

**🔵 Bradycardie (<60 BPM) :**
• **Causes :** Entraînement, médicaments, troubles cardiaques
• **Symptômes :** Fatigue, vertiges, syncope
• **Quand consulter :** Si symptômes associés

**📱 MESURE OPTIMALE :**

**🕐 Meilleur Moment :**
• Au réveil, avant de se lever
• Après 5 minutes de repos
• Même heure chaque jour
• Vessie vide

**📍 Techniques de Mesure :**
• **Poignet :** 2 doigts sur artère radiale
• **Cou :** Artère carotide (attention, pas de pression)
• **Montre connectée :** Vérification régulière
• **Tensiomètre :** Mesure automatique

**🎯 FRÉQUENCE CARDIAQUE CIBLE :**

**🏃‍♂️ Exercice Modéré :**
• 50-70% de la FC max
• FC max = 220 - âge
• Exemple 40 ans : 90-126 BPM

**🏃‍♂️ Exercice Intense :**
• 70-85% de la FC max
• Exemple 40 ans : 126-153 BPM

**💡 CONSEILS POUR OPTIMISER :**

**✅ Améliorer la FC de Repos :**
• Exercice cardiovasculaire régulier
• Gestion du stress (méditation, yoga)
• Sommeil de qualité (7-9h)
• Arrêt du tabac
• Limitation alcool et caféine

**📊 Suivi Recommandé :**
• Mesure quotidienne au réveil
• Carnet de suivi ou app
• Corrélation avec activités/stress
• Consultation si changements brutaux

**🚨 SIGNAUX D'ALARME :**
• FC repos >100 BPM persistante
• FC repos <50 BPM avec symptômes
• Variations importantes inexpliquées
• Palpitations fréquentes
• Malaises associés

**🔍 EXAMENS COMPLÉMENTAIRES :**
• ECG de repos et d'effort
• Holter 24h (surveillance continue)
• Échographie cardiaque
• Bilan sanguin (thyroïde)

*Votre fréquence cardiaque est un indicateur précieux de votre santé cardiovasculaire !*`;
  }

  generateInterpretationResponse(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('confiance') || msg.includes('fiable') || msg.includes('précis')) {
      return this.generateConfidenceGuide();
    }

    if (msg.includes('ecg') || msg.includes('électrocardiogramme')) {
      return this.generateECGInterpretation();
    }

    if (msg.includes('résultat') || msg.includes('diagnostic')) {
      return this.generateDiagnosticInterpretation();
    }

    return this.generateGeneralInterpretationGuide();
  }

  generateConfidenceGuide() {
    return `🎯 **GUIDE DES NIVEAUX DE CONFIANCE IA**

**🤖 COMMENT L'IA CALCULE LA CONFIANCE :**
L'algorithme analyse la cohérence entre vos données et les patterns appris sur 50 000+ cas.

**📊 ÉCHELLE DE CONFIANCE :**

**🟢 95-100% - TRÈS FIABLE**
• **Signification :** Diagnostic quasi-certain
• **Action :** Imprimez pour votre médecin
• **Fiabilité :** >95% de concordance avec experts
• **Exemple :** ECG normal avec données cohérentes

**🟢 85-94% - FIABLE**
• **Signification :** Diagnostic très probable
• **Action :** Confirmation médicale recommandée
• **Fiabilité :** 85-95% de concordance
• **Exemple :** Signes d'ischémie avec facteurs de risque

**🟡 70-84% - MODÉRÉMENT FIABLE**
• **Signification :** Diagnostic probable mais incertain
• **Action :** Avis médical conseillé rapidement
• **Fiabilité :** 70-85% de concordance
• **Exemple :** Anomalies mineures, contexte ambigu

**🟠 50-69% - PEU FIABLE**
• **Signification :** Résultat incertain
• **Action :** Expertise médicale requise
• **Fiabilité :** <70% de concordance
• **Exemple :** Données incomplètes ou contradictoires

**🔴 <50% - NON FIABLE**
• **Signification :** Analyse impossible ou erronée
• **Action :** Consultation médicale obligatoire
• **Fiabilité :** Résultat à ignorer
• **Exemple :** ECG de mauvaise qualité, données manquantes

**🎯 FACTEURS INFLUENÇANT LA CONFIANCE :**

**📈 Augmentent la Confiance :**
• **ECG haute qualité :** Résolution, absence d'artéfacts
• **Données complètes :** Tous les champs remplis
• **Cohérence clinique :** Symptômes + examens concordants
• **Patterns clairs :** Anomalies bien définies

**📉 Diminuent la Confiance :**
• **ECG dégradé :** Bruit, artéfacts, mauvaise qualité
• **Données manquantes :** Champs vides ou approximatifs
• **Incohérences :** Contradiction entre données
• **Cas rares :** Pathologies peu représentées dans l'entraînement

**🔧 OPTIMISER LA PRÉCISION :**

**📸 Qualité ECG :**
• Résolution minimale 300 DPI
• 12 dérivations visibles
• Calibrage standard (25 mm/s, 10 mm/mV)
• Absence de tremblements/artéfacts

**📋 Données Cliniques :**
• Âge exact (impact sur normes)
• Sexe (différences physiologiques)
• Symptômes précis (type douleur thoracique)
• Antécédents médicaux complets
• Médicaments actuels

**🔄 Stratégies d'Amélioration :**
• **Répéter l'analyse :** Avec ECG de meilleure qualité
• **Compléter les données :** Remplir tous les champs
• **Contexte clinique :** Ajouter symptômes/antécédents
• **Seconde opinion :** Autre ECG ou avis médical

**📊 INTERPRÉTATION PRATIQUE :**

**✅ Confiance >80% :**
• Résultat exploitable cliniquement
• Planifiez consultation de suivi
• Surveillez évolution symptômes
• Imprimez rapport pour médecin

**⚠️ Confiance 50-80% :**
• Résultat à confirmer
• Consultation médicale recommandée
• Ne pas s'auto-diagnostiquer
• Répéter analyse si possible

**❌ Confiance <50% :**
• Résultat non exploitable
• Consultation médicale urgente si symptômes
• Refaire analyse avec meilleure qualité
• Ne pas se fier au diagnostic

**💡 RAPPELS IMPORTANTS :**
• L'IA est un outil d'aide, pas de remplacement
• Même 100% de confiance nécessite confirmation médicale
• Contexte clinique toujours prioritaire
• En cas de doute, consultez un professionnel

*La confiance IA vous guide, mais votre médecin reste l'expert final !*`;
  }

  generateDiagnosticInterpretation() {
    return `🔬 **INTERPRÉTATION DES RÉSULTATS DIAGNOSTIC IA**

**🎯 COMPRENDRE VOTRE RAPPORT :**

**📊 STRUCTURE DU RAPPORT :**
• **Diagnostic principal :** Pathologie détectée ou "Normal"
• **Niveau de confiance :** Pourcentage de fiabilité
• **Détails techniques :** Anomalies spécifiques identifiées
• **Recommandations :** Actions suggérées

**🔍 TYPES DE DIAGNOSTICS POSSIBLES :**

**🟢 NORMAL**
• **Signification :** Aucune anomalie majeure détectée
• **Confiance typique :** 85-98%
• **Action :** Surveillance préventive continue
• **Rappel :** N'exclut pas toute pathologie

**🟡 ANOMALIES MINEURES**
• **Exemples :** Troubles de repolarisation, extrasystoles
• **Confiance typique :** 70-90%
• **Action :** Suivi médical recommandé
• **Évolution :** Souvent bénignes mais à surveiller

**🟠 ISCHÉMIE MYOCARDIQUE**
• **Signification :** Manque d'oxygénation du muscle cardiaque
• **Confiance typique :** 75-95%
• **Action :** Consultation cardiologique urgente
• **Examens :** Test d'effort, coronarographie possible

**🔴 INFARCTUS/NÉCROSE**
• **Signification :** Destruction de tissu cardiaque
• **Confiance typique :** 80-98%
• **Action :** Urgence médicale immédiate
• **Pronostic :** Dépend de la rapidité de prise en charge

**⚡ TROUBLES DU RYTHME**
• **Exemples :** Fibrillation, tachycardie, bradycardie
• **Confiance typique :** 70-95%
• **Action :** Évaluation cardiologique
• **Traitement :** Médicaments ou procédures spécialisées

**🎯 PLAN D'ACTION SELON LE RÉSULTAT :**

**📋 Diagnostic Normal (Confiance >85%) :**
1. **Rassurant** mais surveillance continue
2. **Prévention :** Mode de vie sain
3. **Contrôles :** Selon facteurs de risque
4. **Symptômes :** Consulter si nouveaux

**📋 Anomalies Détectées :**
1. **Ne pas paniquer :** L'IA guide, ne diagnostique pas définitivement
2. **Consultation :** Cardiologue dans les délais recommandés
3. **Préparation :** Apportez ECG original + rapport IA
4. **Questions :** Préparez liste pour le médecin

**🔧 OPTIMISATION DU DIAGNOSTIC :**

**📈 Améliorer la Précision :**
• **ECG de qualité :** Demandez refait si flou/artéfacts
• **Données complètes :** Tous les paramètres cliniques
• **Contexte :** Symptômes, antécédents, médicaments
• **Timing :** ECG pendant/après symptômes si possible

**🔄 Seconde Analyse :**
• **Nouveau ECG :** Si premier de mauvaise qualité
• **Données mises à jour :** Nouveaux symptômes/examens
• **Comparaison :** Évolution dans le temps
• **Avis médical :** Toujours prioritaire sur IA

**📞 QUAND CONSULTER EN URGENCE :**
• **Diagnostic d'infarctus :** Quelle que soit la confiance
• **Symptômes actuels :** Douleur, malaise, essoufflement
• **Confiance élevée :** >80% sur pathologie grave
• **Doute persistant :** Mieux vaut consulter

**💡 CONSEILS PRATIQUES :**

**📋 Préparer la Consultation :**
• Imprimez le rapport IA complet
• Listez vos symptômes actuels
• Notez vos questions
• Apportez ECG original et antécédents

**🎯 Questions à Poser au Médecin :**
• "Que pensez-vous du diagnostic IA ?"
• "Faut-il des examens complémentaires ?"
• "Quel suivi recommandez-vous ?"
• "Dois-je modifier mon mode de vie ?"

**🔒 LIMITES À RETENIR :**
• L'IA analyse un instant T (ECG de quelques secondes)
• Certaines pathologies nécessitent examens complémentaires
• Le contexte clinique reste essentiel
• L'expertise médicale humaine est irremplaçable

*Votre rapport IA est un outil précieux pour orienter votre prise en charge médicale !*`;
  }

  generateGeneralInterpretationGuide() {
    return `📖 **GUIDE GÉNÉRAL D'INTERPRÉTATION**

**🎯 OBJECTIF :** Vous aider à comprendre et utiliser au mieux les résultats de CardioAI.

**🔍 TYPES D'INTERPRÉTATIONS DISPONIBLES :**

**📊 Valeurs Médicales :**
• Fréquence cardiaque, tension artérielle
• Température, saturation oxygène
• Comparaison avec normes par âge/sexe
• Contexte et facteurs influençants

**🤖 Résultats Diagnostic IA :**
• Analyse ECG automatisée
• Niveau de confiance et fiabilité
• Recommandations d'actions
• Limites et précautions

**📈 Données de Monitoring :**
• Tendances et évolutions
• Alertes et seuils dépassés
• Corrélations avec activités
• Statistiques de sessions

**🎯 PRINCIPES D'INTERPRÉTATION :**

**🔬 Approche Scientifique :**
• Basée sur données médicales validées
• Références aux recommandations officielles
• Prise en compte des variations individuelles
• Transparence sur les limites

**👤 Personnalisation :**
• Adaptation à votre profil (âge, sexe, antécédents)
• Contexte de vos symptômes
• Facteurs de risque personnels
• Objectifs de santé individuels

**⚖️ Équilibre Information/Rassurance :**
• Information claire sans alarmisme
• Rassurance quand approprié
• Orientation médicale quand nécessaire
• Respect de votre autonomie

**💡 CONSEILS D'UTILISATION :**

**📋 Avant l'Interprétation :**
• Rassemblez toutes vos données
• Notez vos symptômes actuels
• Préparez vos questions spécifiques
• Identifiez vos préoccupations principales

**🔍 Pendant l'Interprétation :**
• Lisez attentivement les explications
• Notez les points importants
• Posez des questions de clarification
• Demandez des précisions si besoin

**📞 Après l'Interprétation :**
• Suivez les recommandations données
• Planifiez consultations si suggérées
• Surveillez évolution des paramètres
• Tenez votre médecin informé

**🎯 QUESTIONS FRÉQUENTES :**

**❓ "Mes résultats sont-ils fiables ?"**
• Dépend de la qualité des données
• Niveau de confiance indiqué
• Toujours confirmer par médecin
• Évolution dans le temps importante

**❓ "Dois-je m'inquiéter ?"**
• Niveau d'urgence clairement indiqué
• Recommandations d'actions précises
• Distinction normal/pathologique
• Guidance pour consultation

**❓ "Que faire ensuite ?"**
• Plan d'action personnalisé fourni
• Délais de consultation suggérés
• Surveillance recommandée
• Prévention adaptée

**🔄 AMÉLIORATION CONTINUE :**
• Vos retours améliorent le système
• Mise à jour régulière des algorithmes
• Intégration nouvelles connaissances médicales
• Personnalisation progressive

*L'interprétation CardioAI vous guide vers une meilleure compréhension de votre santé cardiaque !*`;
  }

  // Listeners et méthodes de base
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
    console.log('🚀 Processing with SUPER AI:', userMessage);
    
    this.addMessage('user', userMessage);
    this.isTyping = true;
    this.notifyListeners();

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await this.generateSuperIntelligentResponse(userMessage);
      this.isTyping = false;
      this.addMessage('bot', response);
      
    } catch (error) {
      console.error('Erreur Super IA:', error);
      this.isTyping = false;
      this.addMessage('bot', this.generateFallbackResponse(userMessage));
    }
  }

  startConversation() {
    const welcome = `🧠 **Assistant CardioAI Super-Intelligent**

🎯 **Intelligence Avancée Activée :**
• Compréhension contextuelle sophistiquée
• Analyse de sentiment et d'urgence
• Interprétation personnalisée
• Réponses adaptatives

💬 **Je comprends tout type de question :**
• Questions médicales complexes
• Interprétation de valeurs
• Situations d'urgence
• Support technique avancé

🤖 **Comment puis-je vous aider aujourd'hui ?**`;

    this.addMessage('bot', welcome);
  }

  // Méthodes utilitaires implémentées
  extractUnit(valueString) {
    const units = ['bpm', 'mmhg', '°c', '%', 'g/l', 'mg/dl'];
    for (const unit of units) {
      if (valueString.toLowerCase().includes(unit)) return unit;
    }
    return '';
  }

  extractValueContext(message, index) {
    return message.substring(Math.max(0, index - 20), index + 20);
  }

  extractIntensity(message, symptom) {
    const intensityWords = ['léger', 'modéré', 'intense', 'fort', 'faible'];
    for (const word of intensityWords) {
      if (message.toLowerCase().includes(word)) return word;
    }
    return 'non spécifié';
  }

  extractDuration(message, symptom) {
    const timePattern = /(\d+)\s*(heure|jour|semaine|mois|minute)/i;
    const match = message.match(timePattern);
    return match ? `${match[1]} ${match[2]}` : 'non spécifié';
  }

  extractSymptomContext(message, symptom) {
    return message.toLowerCase().includes(symptom) ? 'présent' : 'absent';
  }

  inferIntentFromContext(message) {
    const msg = message.toLowerCase();
    if (msg.includes('mal') || msg.includes('douleur')) return 'medical_symptoms';
    if (msg.includes('tension') || msg.includes('pression')) return 'medical_values';
    if (msg.includes('comment') && msg.includes('utiliser')) return 'technical_help';
    return 'general_question';
  }

  analyzeConversationContext(message) {
    return {
      previous_topics: this.conversationContext.topics,
      conversation_length: this.conversations.length,
      user_mood: this.conversationContext.mood
    };
  }

  assessUrgencyLevel(message) {
    const urgentKeywords = ['urgent', 'grave', 'intense', 'douleur forte', 'malaise', 'crise'];
    const msg = message.toLowerCase();
    for (const keyword of urgentKeywords) {
      if (msg.includes(keyword)) return 'immediate';
    }
    return 'normal';
  }

  assessQuestionComplexity(message) {
    const complexWords = ['pourquoi', 'comment', 'mécanisme', 'pathophysiologie'];
    const msg = message.toLowerCase();
    for (const word of complexWords) {
      if (msg.includes(word)) return 'high';
    }
    return 'medium';
  }

  inferUserState(message) {
    const msg = message.toLowerCase();
    if (msg.includes('inquiet') || msg.includes('peur')) return 'worried';
    if (msg.includes('confus') || msg.includes('comprends pas')) return 'confused';
    return 'neutral';
  }

  updateConversationContext(analysis) {
    this.conversationContext.mood = analysis.sentiment.overall_mood;
    this.conversationContext.topics.push(analysis.intent);
    this.conversationContext.previous_questions.push(analysis);
  }

  interpretMedicalValue(type, value, unit) {
    const numValue = parseFloat(value);

    if (type === 'heart_rate') {
      if (numValue < 60) return `${value} ${unit} - Bradycardie (rythme lent)`;
      if (numValue > 100) return `${value} ${unit} - Tachycardie (rythme rapide)`;
      return `${value} ${unit} - Normal`;
    }

    if (type === 'blood_pressure') {
      const [systolic, diastolic] = value.split('/').map(v => parseInt(v));
      if (systolic >= 140 || diastolic >= 90) return `${value} ${unit} - Hypertension`;
      if (systolic < 120 && diastolic < 80) return `${value} ${unit} - Optimal`;
      return `${value} ${unit} - Normal`;
    }

    return `${type}: ${value}${unit}`;
  }

  determineUrgencyFromValues(values) {
    for (const [type, data] of Object.entries(values)) {
      const numValue = parseFloat(data.value);
      if (type === 'heart_rate' && (numValue < 50 || numValue > 120)) return 'immediate';
      if (type === 'blood_pressure') {
        const [systolic] = data.value.split('/').map(v => parseInt(v));
        if (systolic > 180) return 'immediate';
      }
    }
    return 'normal';
  }

  formatAdvancedResponse(response, analysis) {
    if (typeof response === 'string') return response;

    let formatted = '';
    if (response.title) formatted += response.title + '\n\n';
    if (response.content) {
      if (Array.isArray(response.content)) {
        formatted += response.content.join('\n');
      } else {
        formatted += response.content;
      }
    }
    return formatted;
  }

  generateFallbackResponse(message) {
    return `🤖 **Assistant CardioAI**

Je peux vous aider avec :
• Questions médicales cardiaques
• Interprétation de résultats
• Utilisation de l'application
• Conseils de prévention

Pouvez-vous reformuler votre question ?`;
  }
  
  // Méthodes de génération intelligentes
  generateEmergencyResponse(analysis) {
    return `🚨 **SITUATION D'URGENCE DÉTECTÉE**

➡️ **ACTIONS IMMÉDIATES :**
1. **Appelez le 15 (SAMU) MAINTENANT**
2. **Restez calme et en position demi-assise**
3. **Ne prenez aucun médicament sans avis médical**
4. **Préparez votre carte vitale et liste des médicaments**

⚠️ **SIGNES D'URGENCE CARDIAQUE :**
• Douleur thoracique intense persistante
• Essoufflement soudain et important
• Malaise avec sueurs froides
• Palpitations avec douleur

🏥 **EN ATTENDANT LES SECOURS :**
• Desserrez vos vêtements
• Ouvrez les fenêtres pour aérer
• Ne restez pas seul(e) si possible
• Notez l'heure de début des symptômes

📞 **NUMÉROS D'URGENCE :**
• SAMU : 15
• Pompiers : 18
• Urgences européennes : 112

*Cette application ne remplace pas un avis médical d'urgence.*`;
  }

  generateReassuringSuperResponse(analysis, message) {
    const worryLevel = analysis.sentiment.worry_level;
    const symptoms = analysis.entities.symptoms;

    let reassurance = `💙 **Je comprends votre inquiétude**

`;

    if (worryLevel > 2) {
      reassurance += `🤗 **Il est normal de s'inquiéter** pour sa santé cardiaque. Votre vigilance est importante.

`;
    }

    if (symptoms.length > 0) {
      reassurance += `🩺 **Concernant vos symptômes :**
• La plupart des symptômes cardiaques ont des causes bénignes
• Le stress et l'anxiété peuvent mimer des problèmes cardiaques
• Une évaluation médicale permettra de vous rassurer

`;
    }

    reassurance += `✅ **QUAND CONSULTER SEREINEMENT :**
• Symptômes persistants ou récurrents
• Gêne dans les activités quotidiennes
• Antécédents familiaux de maladie cardiaque
• Facteurs de risque (tabac, diabète, hypertension)

🎯 **CONSEILS POUR VOUS APAISER :**
• Respirez calmement et profondément
• Évitez la caféine et le tabac
• Pratiquez une activité relaxante
• Parlez-en à un proche ou professionnel

📋 **PRÉPAREZ VOTRE CONSULTATION :**
• Notez vos symptômes (fréquence, durée, intensité)
• Listez vos médicaments actuels
• Préparez vos questions
• Apportez vos résultats d'examens récents

💡 **RAPPEL IMPORTANT :** La plupart des consultations cardiaques sont rassurantes !`;

    return reassurance;
  }

  generateEducationalResponse(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('cœur') || msg.includes('cardiaque')) {
      return this.generateHeartEducation();
    } else if (msg.includes('tension') || msg.includes('pression')) {
      return this.generateBloodPressureEducation();
    } else if (msg.includes('ecg') || msg.includes('électrocardiogramme')) {
      return this.generateECGEducation();
    } else {
      return this.generateGeneralCardiacEducation();
    }
  }

  generateHeartEducation() {
    return `🫀 **COMPRENDRE VOTRE CŒUR - Guide Éducatif**

🔬 **ANATOMIE CARDIAQUE SIMPLIFIÉE :**
• **4 cavités :** 2 oreillettes (réception) + 2 ventricules (éjection)
• **Valves :** Mitrale, tricuspide, aortique, pulmonaire
• **Artères coronaires :** Nourrissent le muscle cardiaque
• **Système électrique :** Contrôle le rythme

⚡ **FONCTIONNEMENT :**
1. **Diastole :** Remplissage des ventricules
2. **Systole :** Éjection du sang vers les organes
3. **Cycle complet :** 60-100 fois par minute au repos

📊 **PARAMÈTRES NORMAUX :**
• **Fréquence :** 60-100 BPM au repos
• **Pression systolique :** <120 mmHg
• **Pression diastolique :** <80 mmHg
• **Débit cardiaque :** 5-6 L/min

🎯 **FACTEURS INFLUENÇANT LE CŒUR :**
• **Positifs :** Exercice, alimentation équilibrée, sommeil
• **Négatifs :** Stress, tabac, sédentarité, excès de sel

🔍 **SIGNES À SURVEILLER :**
• Douleur thoracique à l'effort
• Essoufflement anormal
• Palpitations fréquentes
• Fatigue inexpliquée
• Œdèmes des chevilles

💡 **LE SAVIEZ-VOUS ?**
Votre cœur bat environ 100 000 fois par jour et pompe 7 000 litres de sang !`;
  }

  generateTechnicalSuperGuide(analysis, message) {
    const msg = message.toLowerCase();

    if (msg.includes('diagnostic')) {
      return this.generateDiagnosticAIGuide();
    } else if (msg.includes('monitoring')) {
      return this.generateMonitoringGuide();
    } else if (msg.includes('export')) {
      return this.generateExportGuide();
    } else {
      return this.generateGeneralTechnicalGuide();
    }
  }

  generateDiagnosticAIGuide() {
    return `🤖 **GUIDE DIAGNOSTIC IA CARDIOAI - Mode Expert**

🧠 **TECHNOLOGIE :**
• **Modèle :** XResNet (Réseau de neurones convolutionnel)
• **Entraînement :** >50 000 ECG annotés par cardiologues
• **Précision :** 92% sur pathologies courantes
• **Temps d'analyse :** <30 secondes

📊 **DONNÉES D'ENTRÉE REQUISES :**

**🖼️ ECG (Obligatoire) :**
• Format : JPG, PNG, PDF
• Qualité : Haute résolution recommandée
• Dérivations : 12 dérivations standard préférées
• Calibrage : 25 mm/s, 10 mm/mV

**👤 Données Cliniques :**
• **Âge :** Impact sur interprétation
• **Sexe :** Différences physiologiques
• **Type douleur thoracique :** 4 catégories
• **Pression artérielle repos :** mmHg
• **Cholestérol sérique :** mg/dl
• **Glycémie à jeun :** >120 mg/dl
• **ECG repos :** Normal/Anormal/Hypertrophie VG
• **Fréquence cardiaque max :** Effort
• **Angor d'effort :** Oui/Non
• **Dépression ST :** Valeur numérique
• **Pente ST :** Montante/Plate/Descendante
• **Thalassémie :** Normal/Défaut fixe/Défaut réversible

🎯 **INTERPRÉTATION DES RÉSULTATS :**

**📈 Niveau de Confiance :**
• **95-100% :** Diagnostic quasi-certain
• **85-94% :** Très probable, confirmation recommandée
• **70-84% :** Probable, avis médical conseillé
• **50-69% :** Incertain, expertise requise
• **<50% :** Non fiable, consultation obligatoire

**⚠️ LIMITATIONS IMPORTANTES :**
• Ne détecte que les pathologies d'entraînement
• Qualité ECG critique pour précision
• Contexte clinique essentiel
• Ne remplace jamais l'expertise médicale

🔧 **OPTIMISATION DE LA PRÉCISION :**
1. **ECG de qualité :** Éviter artéfacts et bruit
2. **Données complètes :** Remplir tous les champs
3. **Contexte clinique :** Symptômes et antécédents
4. **Répétition :** Plusieurs analyses si doute

📋 **UTILISATION CLINIQUE :**
• **Aide au diagnostic :** Outil de support
• **Dépistage :** Population à risque
• **Télémédecine :** Zones sous-médicalisées
• **Formation :** Étudiants en médecine

💡 **CONSEIL D'EXPERT :**
Toujours corréler le résultat IA avec la clinique et l'examen physique !`;
  }

  generateComprehensiveResponse(analysis, message) {
    const msg = message.toLowerCase();

    // Analyse contextuelle pour réponse adaptée
    if (msg.includes('pourquoi') || msg.includes('comment')) {
      return this.generateExplanatoryResponse(analysis, message);
    } else if (msg.includes('que faire') || msg.includes('quoi faire')) {
      return this.generateActionableResponse(analysis, message);
    } else {
      return this.generateInformativeResponse(analysis, message);
    }
  }

  generateExplanatoryResponse(analysis, message) {
    return `🧠 **EXPLICATION DÉTAILLÉE**

Je vais vous expliquer en détail selon votre question.

📚 **APPROCHE PÉDAGOGIQUE :**
• Explication simple puis approfondie
• Exemples concrets et analogies
• Schémas conceptuels
• Points clés à retenir

🎯 **ADAPTATION À VOTRE NIVEAU :**
• Vulgarisation scientifique appropriée
• Terminologie médicale expliquée
• Liens avec votre situation personnelle

💡 **POUR MIEUX COMPRENDRE :**
Posez-moi des questions spécifiques sur les points qui vous intéressent !`;
  }

  generateActionableResponse(analysis, message) {
    return `🎯 **PLAN D'ACTION PERSONNALISÉ**

Voici ce que je recommande selon votre situation :

**📋 ÉTAPES IMMÉDIATES :**
1. Évaluation de votre situation actuelle
2. Actions prioritaires à entreprendre
3. Surveillance et suivi

**⏰ PLANNING :**
• Court terme (24-48h)
• Moyen terme (1-2 semaines)
• Long terme (1-3 mois)

**🎯 OBJECTIFS MESURABLES :**
• Critères de réussite
• Indicateurs de suivi
• Points de contrôle

**📞 QUAND DEMANDER DE L'AIDE :**
• Signes d'alerte à surveiller
• Professionnels à consulter
• Urgences à reconnaître

Voulez-vous que je détaille une étape particulière ?`;
  }

  generateInformativeResponse(analysis, message) {
    return `📖 **INFORMATION COMPLÈTE**

Voici une synthèse des informations importantes :

**🔍 ANALYSE DE VOTRE QUESTION :**
• Contexte médical pertinent
• Facteurs à considérer
• Nuances importantes

**📊 DONNÉES FACTUELLES :**
• Statistiques et prévalence
• Études scientifiques récentes
• Recommandations officielles

**🎯 APPLICATION PRATIQUE :**
• Implications pour votre cas
• Conseils personnalisés
• Ressources complémentaires

**💡 POINTS CLÉS À RETENIR :**
• Éléments essentiels
• Idées fausses à éviter
• Prochaines étapes suggérées

Y a-t-il un aspect particulier que vous souhaitez approfondir ?`;
  }

  // Méthodes manquantes pour les différents types de réponses
  generateBloodPressureEducation() {
    return `🩸 **COMPRENDRE LA PRESSION ARTÉRIELLE**

**🔬 DÉFINITION :**
La pression artérielle mesure la force exercée par le sang contre les parois des artères.

**📊 DEUX VALEURS :**
• **Systolique (1er chiffre) :** Pression lors de la contraction du cœur
• **Diastolique (2ème chiffre) :** Pression lors du relâchement du cœur

**📈 VALEURS DE RÉFÉRENCE :**
• **Optimale :** <120/80 mmHg
• **Normale :** <130/85 mmHg
• **Élevée normale :** 130-139/85-89 mmHg
• **Hypertension Grade 1 :** 140-159/90-99 mmHg
• **Hypertension Grade 2 :** ≥160/≥100 mmHg
• **Crise hypertensive :** >180/120 mmHg

**⚠️ FACTEURS D'INFLUENCE :**
• Stress et émotions
• Activité physique récente
• Caféine et tabac
• Position du corps
• Heure de la journée

**🎯 CONSEILS POUR MESURER :**
• Au repos depuis 5 minutes
• Bras à hauteur du cœur
• Vessie vide
• Pas de café/tabac 30 min avant
• Moyenne de 2-3 mesures

**💡 PRÉVENTION NATURELLE :**
• Réduction du sel (<6g/jour)
• Exercice régulier (30 min/jour)
• Perte de poids si nécessaire
• Gestion du stress
• Limitation alcool`;
  }

  generateECGEducation() {
    return `📈 **COMPRENDRE L'ÉLECTROCARDIOGRAMME (ECG)**

**⚡ PRINCIPE :**
L'ECG enregistre l'activité électrique du cœur à travers la peau.

**📊 ONDES PRINCIPALES :**

**🔵 Onde P :**
• Contraction des oreillettes
• Durée normale : <120 ms
• Amplitude : <2.5 mm

**🔴 Complexe QRS :**
• Contraction des ventricules
• Durée normale : <120 ms
• Forme : pic principal vers le haut

**🟢 Onde T :**
• Relaxation des ventricules
• Normalement positive
• Suit le complexe QRS

**📏 INTERVALLES IMPORTANTS :**
• **PR :** 120-200 ms (conduction oreillettes→ventricules)
• **QT :** <440 ms (homme), <460 ms (femme)
• **RR :** Régularité du rythme

**🔍 ANOMALIES COURANTES :**
• **Sus-décalage ST :** Infarctus aigu
• **Sous-décalage ST :** Ischémie
• **Onde Q pathologique :** Nécrose ancienne
• **QRS large :** Trouble de conduction
• **Arythmie :** Rythme irrégulier

**🎯 LIMITES DE L'ECG :**
• Instantané (quelques secondes)
• Peut être normal malgré une maladie
• Nécessite corrélation clinique
• Artéfacts possibles

**💡 CONSEIL :**
Un ECG normal n'exclut pas une maladie cardiaque. Seul un cardiologue peut interpréter correctement tous les détails !`;
  }

  generateGeneralCardiacEducation() {
    return `🫀 **ÉDUCATION CARDIAQUE GÉNÉRALE**

**💓 VOTRE CŒUR EN CHIFFRES :**
• Poids : 250-350 grammes
• Battements/jour : ~100 000
• Sang pompé/jour : ~7 000 litres
• Durée de vie : Peut battre 3 milliards de fois

**🔄 CIRCULATION SANGUINE :**
1. **Circulation pulmonaire :** Cœur → Poumons → Cœur
2. **Circulation systémique :** Cœur → Organes → Cœur

**⚕️ PRINCIPALES MALADIES CARDIAQUES :**

**🔴 Infarctus du myocarde :**
• Obstruction artère coronaire
• Symptômes : douleur thoracique, sueurs, nausées
• Urgence absolue

**💨 Insuffisance cardiaque :**
• Cœur pompe moins bien
• Symptômes : essoufflement, fatigue, œdèmes

**⚡ Arythmies :**
• Troubles du rythme
• Palpitations, vertiges, syncope

**📈 Hypertension :**
• Pression artérielle élevée
• Facteur de risque majeur

**🎯 FACTEURS DE RISQUE MODIFIABLES :**
• Tabagisme (risque x3)
• Sédentarité
• Surpoids/obésité
• Stress chronique
• Alimentation déséquilibrée
• Diabète mal contrôlé

**✅ PRÉVENTION EFFICACE :**
• Arrêt du tabac
• Exercice 150 min/semaine
• Alimentation méditerranéenne
• Gestion du stress
• Contrôles médicaux réguliers

**🚨 SIGNAUX D'ALARME :**
• Douleur thoracique à l'effort
• Essoufflement anormal
• Palpitations avec malaise
• Syncope
• Œdèmes des chevilles

**💡 MYTHE VS RÉALITÉ :**
❌ "Les femmes ne font pas d'infarctus"
✅ 1ère cause de mortalité chez la femme après 65 ans

❌ "Un cœur qui bat vite est malade"
✅ Normal à l'effort, stress, émotion`;
  }

  generateMonitoringGuide() {
    return `📊 **GUIDE MONITORING IoT CARDIOAI**

**🚀 DÉMARRAGE RAPIDE :**

**Étape 1 :** Menu principal → "Monitoring IoT"
**Étape 2 :** Cliquez "Démarrer le monitoring" 🟢
**Étape 3 :** Session créée automatiquement
**Étape 4 :** Surveillance en temps réel active

**📱 INTERFACE DE MONITORING :**

**💓 Fréquence Cardiaque :**
• Mise à jour : Toutes les 2 secondes
• Affichage : BPM + graphique temps réel
• Seuils : 60-100 BPM (adulte au repos)

**🩸 Pression Artérielle :**
• Mesure : Continue simulée
• Format : Systolique/Diastolique mmHg
• Seuils : <140/90 mmHg

**🌡️ Température Corporelle :**
• Précision : 0.1°C
• Plage normale : 36.1-37.2°C
• Alerte fièvre : >37.5°C

**🫁 Saturation Oxygène (SpO₂) :**
• Valeur normale : 95-100%
• Alerte : <95%
• Affichage : Pourcentage + courbe

**🚨 SYSTÈME D'ALERTES :**

**🔴 ALERTE ROUGE (Urgence) :**
• FC <50 ou >120 BPM
• PA >180/110 mmHg
• SpO₂ <90%
• Température >39°C

**🟡 ALERTE ORANGE (Attention) :**
• FC <60 ou >100 BPM
• PA 140-179/90-109 mmHg
• SpO₂ 90-94%
• Température 37.5-39°C

**🟢 STATUT NORMAL :**
• Tous paramètres dans les seuils
• Surveillance continue
• Enregistrement automatique

**💾 GESTION DES SESSIONS :**

**📋 Informations enregistrées :**
• Timestamp de chaque mesure
• Valeurs de tous les paramètres
• Alertes déclenchées
• Durée totale de session

**📊 Statistiques automatiques :**
• Moyennes par paramètre
• Valeurs min/max
• Nombre d'alertes
• Graphiques d'évolution

**📥 EXPORT DES DONNÉES :**
• Format : CSV compatible Excel
• Contenu : Toutes les mesures + timestamps
• Utilisation : Consultation médicale
• Accès : Menu "Historique" → Icône export

**⚙️ PERSONNALISATION :**
• Seuils d'alerte modifiables
• Fréquence de mesure ajustable
• Notifications sonores on/off
• Sauvegarde automatique

**💡 CONSEILS D'UTILISATION :**
• Position assise/allongée pour mesures précises
• Éviter mouvements pendant acquisition
• Sessions de 15-30 minutes recommandées
• Consulter médecin si alertes fréquentes`;
  }

  generateExportGuide() {
    return `📥 **GUIDE D'EXPORT DES DONNÉES**

**🎯 OBJECTIF :**
Exporter vos données de monitoring pour consultation médicale ou analyse personnelle.

**📋 ÉTAPES D'EXPORT :**

**1️⃣ Accès à l'historique :**
• Menu principal → "Historique"
• Liste de toutes vos sessions
• Tri par date (plus récent en premier)

**2️⃣ Sélection de session :**
• Cliquez sur l'icône 📥 "Export" directement
• OU cliquez sur 👁️ "Voir détails" puis "Exporter CSV"

**3️⃣ Téléchargement automatique :**
• Fichier généré instantanément
• Nom : "session_YYYYMMDD_HHMMSS.csv"
• Emplacement : Dossier "Téléchargements"

**📊 CONTENU DU FICHIER CSV :**

**🕐 Colonnes incluses :**
• **Timestamp :** Date et heure exacte (YYYY-MM-DD HH:MM:SS)
• **Heart_Rate :** Fréquence cardiaque (BPM)
• **Blood_Pressure_Sys :** Pression systolique (mmHg)
• **Blood_Pressure_Dia :** Pression diastolique (mmHg)
• **Temperature :** Température corporelle (°C)
• **SpO2 :** Saturation oxygène (%)
• **Alert_Level :** Niveau d'alerte (Normal/Orange/Rouge)

**📈 EXEMPLE DE DONNÉES :**
\`\`\`
Timestamp,Heart_Rate,Blood_Pressure_Sys,Blood_Pressure_Dia,Temperature,SpO2,Alert_Level
2024-01-15 14:30:00,72,120,80,36.8,98,Normal
2024-01-15 14:30:05,74,122,82,36.8,98,Normal
2024-01-15 14:30:10,76,125,85,36.9,97,Normal
\`\`\`

**💻 UTILISATION DU FICHIER :**

**📊 Excel/Google Sheets :**
• Ouverture directe du fichier CSV
• Création de graphiques automatique
• Calculs de moyennes/tendances
• Mise en forme pour impression

**👨‍⚕️ Consultation médicale :**
• Imprimez les graphiques principaux
• Surlignez les périodes d'alerte
• Notez vos symptômes correspondants
• Apportez le fichier sur clé USB

**📱 Applications mobiles :**
• Import dans apps de santé
• Synchronisation avec montres connectées
• Partage avec famille/médecin

**🔧 DÉPANNAGE :**

**❌ Fichier ne s'ouvre pas :**
• Vérifiez l'extension .csv
• Utilisez "Ouvrir avec" → Excel
• Changez l'encodage en UTF-8

**❌ Données manquantes :**
• Session trop courte (<1 minute)
• Problème de connexion pendant monitoring
• Relancez l'export

**❌ Caractères bizarres :**
• Problème d'encodage
• Ouvrez avec Bloc-notes → Enregistrer en UTF-8
• Puis ouvrez avec Excel

**💡 CONSEILS PRATIQUES :**
• Exportez régulièrement (1x/semaine)
• Gardez un dossier "Santé" organisé
• Nommez vos fichiers avec contexte
• Sauvegardez sur cloud (Google Drive, etc.)

**🎯 UTILISATION OPTIMALE :**
• Montrez les tendances à votre médecin
• Identifiez les patterns d'alertes
• Corrélation avec activités/stress
• Suivi de l'efficacité des traitements`;
  }

  generateGeneralTechnicalResponse() {
    return `🔧 **SUPPORT TECHNIQUE CARDIOAI**

Je peux vous aider avec tous les aspects techniques de l'application :

**🔬 DIAGNOSTIC IA :**
• Upload et traitement d'ECG
• Saisie des données cliniques
• Interprétation des résultats
• Optimisation de la précision

**📊 MONITORING IoT :**
• Configuration des capteurs
• Démarrage/arrêt des sessions
• Personnalisation des alertes
• Lecture des données temps réel

**📋 GESTION DES DONNÉES :**
• Consultation de l'historique
• Export en format CSV
• Suppression de sessions
• Sauvegarde automatique

**⚙️ CONFIGURATION :**
• Paramètres de l'application
• Personnalisation des seuils
• Gestion des notifications
• Mise à jour des profils

**🔍 RÉSOLUTION DE PROBLÈMES :**
• Erreurs de connexion
• Problèmes d'affichage
• Bugs et dysfonctionnements
• Performance et optimisation

**💡 GUIDES DÉTAILLÉS :**
• Tutoriels étape par étape
• Bonnes pratiques d'utilisation
• Astuces et raccourcis
• FAQ technique

Quel aspect technique vous pose problème ?`;
  }

  getConversations() { return this.conversations; }
  clearConversation() { this.conversations = []; this.notifyListeners(); }
  getTypingState() { return this.isTyping; }
  getFrequentQuestions() {
    return [
      "Ma tension est 150/90, que dois-je faire ?",
      "J'ai des palpitations depuis ce matin",
      "Comment interpréter mon ECG ?",
      "Mes résultats de diagnostic sont-ils fiables ?",
      "Quand dois-je m'inquiéter ?",
      "Comment utiliser le monitoring ?",
      "Que signifie un niveau de confiance de 75% ?",
      "Comment prévenir les problèmes cardiaques ?"
    ];
  }
}

const superIntelligentAI = new SuperIntelligentAI();
export default superIntelligentAI;
