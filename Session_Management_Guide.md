# 📊 Guide de Gestion des Sessions et Préférences - CardioAI

Ce guide explique les nouvelles fonctionnalités de sauvegarde des sessions de monitoring IoT et de gestion des préférences utilisateur.

## 🎯 **Fonctionnalités Implémentées**

### 📋 **1. Sauvegarde Automatique des Sessions**

#### **Qu'est-ce qu'une session ?**
Une session de monitoring représente une période continue de surveillance des paramètres vitaux avec :
- **ID unique** de session
- **Horodatage** de début et fin
- **Données complètes** de tous les capteurs actifs
- **Historique des valeurs** mesurées
- **Alertes générées** pendant la session
- **Résumé statistique** (moyennes, min, max)

#### **Sauvegarde automatique**
- ✅ **Démarrage automatique** : Chaque fois que vous lancez le monitoring
- ✅ **Sauvegarde en temps réel** : Les données sont collectées en continu
- ✅ **Fin automatique** : Quand vous arrêtez le monitoring
- ✅ **Persistance locale** : Sauvegarde dans le navigateur (localStorage)
- ✅ **Sauvegarde serveur** : Synchronisation avec le backend Flask

### 🔔 **2. Barre de Notifications Persistantes**

#### **Accès aux notifications**
- **Icône de notification** dans la barre de navigation (en haut à droite)
- **Badge rouge** indiquant le nombre de nouvelles sessions
- **Clic** pour ouvrir le panneau des notifications

#### **Contenu des notifications**
- **Liste des sessions** récentes (20 dernières)
- **Résumé de chaque session** :
  - Durée de monitoring
  - Nombre d'alertes critiques/warnings
  - Moyennes des paramètres vitaux
  - Date et heure
- **Actions disponibles** :
  - Visualiser les détails
  - Exporter en CSV
  - Supprimer la session

### ⚙️ **3. Page de Paramètres Avancés**

#### **Accès aux paramètres**
- **Menu navigation** → "Paramètres"
- **URL directe** : `/settings`

#### **Configuration des capteurs**
- **Activation/Désactivation** de chaque capteur :
  - 💓 Rythme cardiaque
  - 🩸 Tension artérielle
  - 🌡️ Température corporelle
  - 🫁 Saturation en oxygène
  - 🫁 Fréquence respiratoire

- **Seuils d'alerte personnalisés** pour chaque capteur :
  - Valeurs minimum et maximum
  - Unités appropriées
  - Validation en temps réel

#### **Paramètres d'alertes**
- **Sons d'alerte** : Activer/désactiver les notifications sonores
- **Alertes visuelles** : Notifications à l'écran
- **Mode critique uniquement** : Ne montrer que les alertes importantes

#### **Paramètres d'affichage**
- **Graphiques en temps réel** : Activer/désactiver
- **Durée des graphiques** : 5 à 60 minutes d'historique
- **Intervalle de mise à jour** : 1 à 10 secondes

## 🔧 **Utilisation Pratique**

### **Scénario 1 : Monitoring quotidien**
1. **Configurez vos préférences** dans les paramètres
2. **Démarrez le monitoring** IoT
3. **Surveillez en temps réel** vos paramètres
4. **Arrêtez le monitoring** → Session automatiquement sauvegardée
5. **Consultez l'historique** via les notifications

### **Scénario 2 : Suivi médical**
1. **Activez uniquement** les capteurs prescrits par votre médecin
2. **Configurez les seuils** selon les recommandations médicales
3. **Exportez les données** en CSV pour votre médecin
4. **Partagez l'historique** des sessions

### **Scénario 3 : Monitoring sportif**
1. **Activez** rythme cardiaque et saturation O₂
2. **Ajustez les seuils** pour l'effort physique
3. **Surveillez** pendant l'exercice
4. **Analysez** les performances via l'historique

## 📊 **Structure des Données**

### **Format d'une session**
```json
{
  "id": "session_1732467890123",
  "startTime": "2024-11-24T15:30:00.000Z",
  "endTime": "2024-11-24T16:00:00.000Z",
  "status": "completed",
  "sensorData": {
    "heartRate": {
      "value": 75,
      "unit": "bpm",
      "status": "normal",
      "history": [
        {
          "timestamp": "2024-11-24T15:30:00.000Z",
          "time": "15:30:00",
          "value": 72
        }
      ]
    }
  },
  "alerts": [
    {
      "id": "alert_123",
      "sensor": "heartRate",
      "type": "high",
      "message": "Rythme cardiaque élevé: 105 bpm",
      "timestamp": "2024-11-24T15:45:00.000Z",
      "severity": "warning"
    }
  ]
}
```

### **Format des préférences**
```json
{
  "enabledSensors": {
    "heartRate": true,
    "bloodPressure": true,
    "temperature": false,
    "oxygenSaturation": true,
    "respiratoryRate": false
  },
  "alertSettings": {
    "soundEnabled": true,
    "visualAlerts": true,
    "criticalOnly": false
  },
  "displaySettings": {
    "showCharts": true,
    "chartDuration": 20,
    "updateInterval": 2000
  },
  "thresholds": {
    "heartRate": { "min": 60, "max": 100 },
    "temperature": { "min": 36.0, "max": 37.5 }
  }
}
```

## 🔄 **API Endpoints**

### **Sessions**
- `POST /api/sessions/save` - Sauvegarder une session
- `GET /api/sessions/history?limit=20` - Récupérer l'historique
- `GET /api/sessions/{id}` - Récupérer une session spécifique
- `DELETE /api/sessions/{id}` - Supprimer une session

### **Préférences**
- `POST /api/preferences/save` - Sauvegarder les préférences
- `GET /api/preferences` - Récupérer les préférences

## 💾 **Sauvegarde et Synchronisation**

### **Sauvegarde locale (localStorage)**
- **Automatique** : Toutes les données sont sauvegardées localement
- **Persistante** : Les données survivent à la fermeture du navigateur
- **Limite** : 50 sessions maximum en local
- **Fallback** : Utilisée si le serveur n'est pas disponible

### **Sauvegarde serveur**
- **Synchronisation** : Données envoyées au backend Flask
- **Persistance** : 100 sessions maximum sur le serveur
- **Récupération** : Données récupérées depuis le serveur en priorité

## 📤 **Export des Données**

### **Format CSV**
```csv
Timestamp,Sensor,Value,Unit,Status
2024-11-24T15:30:00.000Z,heartRate,72,bpm,normal
2024-11-24T15:30:02.000Z,heartRate,74,bpm,normal
2024-11-24T15:30:04.000Z,temperature,36.5,°C,normal
```

### **Utilisation de l'export**
1. **Ouvrir** les notifications
2. **Cliquer** sur le menu "⋮" d'une session
3. **Sélectionner** "Exporter CSV"
4. **Télécharger** le fichier automatiquement

## 🔒 **Sécurité et Confidentialité**

### **Données locales**
- **Chiffrement** : Données stockées en clair dans localStorage
- **Accès** : Limité au domaine de l'application
- **Suppression** : Possible via les paramètres du navigateur

### **Données serveur**
- **Transmission** : HTTP (HTTPS recommandé en production)
- **Stockage** : En mémoire (non persistant au redémarrage)
- **Accès** : API REST protégée par CORS

## 🚀 **Prochaines Améliorations**

### **Fonctionnalités futures**
- 🔐 **Authentification utilisateur** multi-comptes
- 💾 **Base de données** persistante (PostgreSQL/MongoDB)
- 📱 **Application mobile** compagnon
- 🔔 **Notifications push** en temps réel
- 📊 **Analyses avancées** et tendances
- 🏥 **Intégration médicale** (HL7 FHIR)
- 🤖 **IA prédictive** sur les données historiques

---

**Note** : Cette fonctionnalité transforme CardioAI en une plateforme complète de monitoring médical avec historique et personnalisation avancée ! 🎉
