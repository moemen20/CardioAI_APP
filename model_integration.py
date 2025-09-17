"""
Script d'intégration du modèle de Deep Learning pour la détection de pathologies cardiaques.
Ce script simule l'utilisation d'un modèle .keras et expose une API REST pour l'analyse des images ECG et des données cliniques.

Pour utiliser ce script:
1. Installez les dépendances: pip install flask flask-cors pillow numpy
2. Exécutez: python model_integration.py

Note: Cette version du script simule les prédictions du modèle XResNet sans charger réellement le modèle,
en raison de contraintes d'environnement pour l'installation de TensorFlow.
"""

import os
import io
import json
import numpy as np
import threading
import time
import random
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# Configuration
MODEL_PATH = 'model.keras'  # Chemin vers votre modèle .keras
PORT = 5000
DEBUG = True

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Variable globale pour indiquer si le modèle est "chargé"
model_loaded = False

# Variables globales pour le système IoT
iot_monitoring_active = False
sensor_data = {
    'heartRate': {'value': 72, 'unit': 'bpm', 'status': 'normal', 'history': []},
    'bloodPressure': {'systolic': 120, 'diastolic': 80, 'unit': 'mmHg', 'status': 'normal', 'history': []},
    'temperature': {'value': 36.5, 'unit': '°C', 'status': 'normal', 'history': []},
    'oxygenSaturation': {'value': 98, 'unit': '%', 'status': 'normal', 'history': []},
    'respiratoryRate': {'value': 16, 'unit': 'rpm', 'status': 'normal', 'history': []}
}
active_alerts = []
monitoring_thread = None

# Variables globales pour la gestion des sessions et préférences
monitoring_sessions = []
user_preferences = {
    'enabledSensors': {
        'heartRate': True,
        'bloodPressure': True,
        'temperature': True,
        'oxygenSaturation': True,
        'respiratoryRate': False
    },
    'alertSettings': {
        'soundEnabled': True,
        'visualAlerts': True,
        'criticalOnly': False
    },
    'displaySettings': {
        'showCharts': True,
        'chartDuration': 20,
        'updateInterval': 2000,
        'theme': 'light'
    },
    'thresholds': {
        'heartRate': {'min': 60, 'max': 100},
        'temperature': {'min': 36.0, 'max': 37.5},
        'oxygenSaturation': {'min': 95, 'max': 100},
        'systolicBP': {'min': 90, 'max': 140},
        'diastolicBP': {'min': 60, 'max': 90}
    }
}

def load_model():
    """Simule le chargement du modèle .keras"""
    global model_loaded
    if not model_loaded:
        print(f"Simulation du chargement du modèle depuis {MODEL_PATH}...")
        # Vérifier si le fichier existe réellement
        if os.path.exists(MODEL_PATH):
            print(f"Le fichier {MODEL_PATH} existe et a une taille de {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} Mo")
        else:
            print(f"ATTENTION: Le fichier {MODEL_PATH} n'existe pas!")

        model_loaded = True
        print("Modèle 'chargé' avec succès (simulation)!")

    return "XResNet Model (Simulation)"

def preprocess_image(image_bytes):
    """
    Prétraite l'image ECG pour l'analyse par le modèle

    Args:
        image_bytes: Bytes de l'image ECG

    Returns:
        Tableau numpy prétraité prêt pour le modèle
    """
    # Ouvrir l'image depuis les bytes
    image = Image.open(io.BytesIO(image_bytes))

    # Redimensionner l'image aux dimensions attendues par le modèle
    # Ajustez ces dimensions selon les spécifications de votre modèle
    image = image.resize((224, 224))

    # Convertir en tableau numpy et normaliser
    img_array = np.array(image)

    # Si l'image est en niveaux de gris, ajouter une dimension de canal
    if len(img_array.shape) == 2:
        img_array = np.expand_dims(img_array, axis=-1)

    # Si l'image est en RGB et que le modèle attend du grayscale, convertir
    # if len(img_array.shape) == 3 and img_array.shape[2] == 3:
    #     img_array = np.mean(img_array, axis=2, keepdims=True)

    # Normaliser les valeurs des pixels
    img_array = img_array / 255.0

    # Ajouter la dimension de batch
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

def preprocess_clinical_data(data):
    """
    Prétraite les données cliniques pour l'analyse par le modèle

    Args:
        data: Dictionnaire contenant les données cliniques du patient

    Returns:
        Tableau numpy prétraité prêt pour le modèle
    """
    # Extraire et convertir les colonnes numériques
    numeric_features = [
        float(data.get('age', 0)),
        float(data.get('trestbps', 0)),
        float(data.get('chol', 0)),
        float(data.get('thalach', 0)),
        float(data.get('oldpeak', 0)),
        float(data.get('ca', 0))
    ]

    # Extraire et convertir les colonnes catégorielles (one-hot encoding si nécessaire)
    # Pour cet exemple, nous utilisons simplement les valeurs directement
    categorical_features = [
        int(data.get('slope', 1)),
        int(data.get('restecg', 0)),
        int(data.get('cp', 0)),
        int(data.get('thal', 3))
    ]

    # Combiner toutes les caractéristiques
    all_features = numeric_features + categorical_features

    # Convertir en tableau numpy et ajouter la dimension de batch
    features_array = np.array(all_features, dtype=np.float32).reshape(1, -1)

    return features_array

def interpret_prediction(prediction):
    """
    Interprète la prédiction du modèle

    Args:
        prediction: Sortie du modèle

    Returns:
        Dictionnaire contenant le diagnostic, la confiance et les détails
    """
    # Extraire la probabilité de la prédiction
    # Ajustez selon la structure de sortie de votre modèle
    if isinstance(prediction, list):
        confidence = float(prediction[0][0])
    else:
        confidence = float(prediction[0])

    # Déterminer le diagnostic basé sur la probabilité
    if confidence > 0.5:
        diagnosis = "Maladie cardiaque détectée"
        if confidence > 0.85:
            details = "Signes fortement évocateurs d'une pathologie cardiaque sévère."
        elif confidence > 0.7:
            details = "Signes modérément évocateurs d'une pathologie cardiaque."
        else:
            details = "Signes légers évocateurs d'une pathologie cardiaque."
    else:
        diagnosis = "Normal"
        details = "Aucune anomalie significative détectée."

    return {
        "diagnosis": diagnosis,
        "confidence": confidence,
        "details": details,
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# FONCTIONS IoT POUR LE MONITORING DES CAPTEURS
# ============================================================================

def simulate_sensor_reading(sensor_type, current_value):
    """Simule la lecture d'un capteur avec des variations réalistes"""

    if sensor_type == 'heartRate':
        # Variation normale du rythme cardiaque (±5 bpm)
        variation = random.uniform(-5, 5)
        new_value = max(50, min(120, current_value + variation))
        status = 'normal'
        if new_value < 60:
            status = 'low'
        elif new_value > 100:
            status = 'high'
        return round(new_value), status

    elif sensor_type == 'bloodPressure':
        # Variation de la tension artérielle
        systolic_var = random.uniform(-3, 3)
        diastolic_var = random.uniform(-2, 2)
        new_systolic = max(80, min(180, current_value['systolic'] + systolic_var))
        new_diastolic = max(50, min(110, current_value['diastolic'] + diastolic_var))

        status = 'normal'
        if new_systolic > 140 or new_diastolic > 90:
            status = 'high'
        elif new_systolic < 90 or new_diastolic < 60:
            status = 'low'

        return {'systolic': round(new_systolic), 'diastolic': round(new_diastolic)}, status

    elif sensor_type == 'temperature':
        # Variation de température (±0.2°C)
        variation = random.uniform(-0.2, 0.2)
        new_value = max(35.0, min(39.0, current_value + variation))
        status = 'normal'
        if new_value > 37.5:
            status = 'high'
        elif new_value < 36.0:
            status = 'low'
        return round(new_value, 1), status

    elif sensor_type == 'oxygenSaturation':
        # Variation de saturation en oxygène (±1%)
        variation = random.uniform(-1, 1)
        new_value = max(85, min(100, current_value + variation))
        status = 'normal'
        if new_value < 95:
            status = 'low'
        return round(new_value), status

    elif sensor_type == 'respiratoryRate':
        # Variation du rythme respiratoire (±1 rpm)
        variation = random.uniform(-1, 1)
        new_value = max(8, min(30, current_value + variation))
        status = 'normal'
        if new_value < 12 or new_value > 20:
            status = 'warning'
        return round(new_value), status

    return current_value, 'normal'

def update_sensor_data():
    """Met à jour les données des capteurs en continu"""
    global sensor_data, active_alerts

    while iot_monitoring_active:
        timestamp = datetime.now()

        for sensor_type in sensor_data:
            if sensor_type == 'bloodPressure':
                current_value = {
                    'systolic': sensor_data[sensor_type].get('systolic', 120),
                    'diastolic': sensor_data[sensor_type].get('diastolic', 80)
                }
            else:
                current_value = sensor_data[sensor_type]['value']

            new_value, status = simulate_sensor_reading(sensor_type, current_value)

            # Mise à jour des données
            if sensor_type == 'bloodPressure':
                sensor_data[sensor_type]['systolic'] = new_value['systolic']
                sensor_data[sensor_type]['diastolic'] = new_value['diastolic']
            else:
                sensor_data[sensor_type]['value'] = new_value

            sensor_data[sensor_type]['status'] = status
            sensor_data[sensor_type]['lastUpdate'] = timestamp.isoformat()

            # Ajouter à l'historique (garder seulement les 50 dernières valeurs)
            history_entry = {
                'timestamp': timestamp.isoformat(),
                'time': timestamp.strftime('%H:%M:%S'),
                'value': new_value if sensor_type != 'bloodPressure' else f"{new_value['systolic']}/{new_value['diastolic']}"
            }

            sensor_data[sensor_type]['history'].append(history_entry)
            if len(sensor_data[sensor_type]['history']) > 50:
                sensor_data[sensor_type]['history'].pop(0)

            # Vérifier les seuils et créer des alertes si nécessaire
            check_thresholds_and_create_alerts(sensor_type, new_value, status)

        time.sleep(2)  # Mise à jour toutes les 2 secondes

def check_thresholds_and_create_alerts(sensor_type, value, status):
    """Vérifie les seuils et crée des alertes si nécessaire"""
    global active_alerts

    if status in ['high', 'low', 'warning']:
        alert = {
            'id': f"{sensor_type}_{datetime.now().timestamp()}",
            'sensor': sensor_type,
            'type': status,
            'message': f"Valeur {status} détectée pour {sensor_type}: {value}",
            'timestamp': datetime.now().isoformat(),
            'severity': 'warning' if status == 'warning' else 'error',
            'read': False
        }

        # Éviter les doublons d'alertes récentes
        recent_alerts = [a for a in active_alerts if a['sensor'] == sensor_type and
                        datetime.fromisoformat(a['timestamp']) > datetime.now() - timedelta(minutes=5)]

        if not recent_alerts:
            active_alerts.append(alert)
            print(f"Nouvelle alerte: {alert['message']}")

def start_iot_monitoring():
    """Démarre le monitoring IoT"""
    global iot_monitoring_active, monitoring_thread

    if not iot_monitoring_active:
        iot_monitoring_active = True
        monitoring_thread = threading.Thread(target=update_sensor_data, daemon=True)
        monitoring_thread.start()
        print("Monitoring IoT démarré")
        return True
    return False

def stop_iot_monitoring():
    """Arrête le monitoring IoT"""
    global iot_monitoring_active

    if iot_monitoring_active:
        iot_monitoring_active = False
        print("Monitoring IoT arrêté")
        return True
    return False

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Endpoint pour analyser une image ECG et des données cliniques"""
    try:
        # Vérifier si une image a été fournie
        if 'ecgImage' not in request.files:
            return jsonify({"error": "Aucune image ECG fournie"}), 400

        # Récupérer l'image
        image_file = request.files['ecgImage']
        image_bytes = image_file.read()

        # Récupérer les données cliniques
        if 'patientData' not in request.form:
            return jsonify({"error": "Aucune donnée clinique fournie"}), 400

        patient_data = json.loads(request.form['patientData'])

        # Prétraiter les données (pour la démonstration)
        _ = preprocess_image(image_bytes)  # Nous n'utilisons pas réellement cette valeur
        clinical_features = preprocess_clinical_data(patient_data)

        # Simuler le chargement du modèle
        _ = load_model()

        # Simuler une prédiction basée sur les données cliniques
        # Calculer un score de risque basé sur les données cliniques
        # Extraire les valeurs des caractéristiques
        features = clinical_features[0]  # Enlever la dimension de batch

        # Colonnes numériques (indices 0-5)
        age = features[0]
        trestbps = features[1]  # Tension artérielle au repos
        chol = features[2]  # Cholestérol
        thalach = features[3]  # Fréquence cardiaque maximale
        oldpeak = features[4]  # Dépression ST
        ca = features[5]  # Nombre de vaisseaux principaux

        # Colonnes catégorielles (indices 6-9)
        slope = features[6]  # Pente du segment ST
        restecg = features[7]  # ECG au repos
        cp = features[8]  # Type de douleur thoracique
        thal = features[9]  # Thalassémie

        # Calculer un score de risque (similaire à celui du service de simulation)
        risk_score = (
            (2 if age > 60 else 0) +
            (2 if trestbps > 140 else 0) +
            (2 if chol > 240 else 0) +
            (2 if thalach < 120 else 0) +
            (3 if oldpeak > 2 else 0) +
            (3 if ca > 1 else 0) +
            (2 if cp == 0 else 0) +
            (1 if restecg > 0 else 0) +
            (2 if slope == 0 else 0) +
            (2 if thal != 3 else 0)
        )

        # Normaliser le score en une probabilité entre 0 et 1
        confidence = min(0.5 + (risk_score / 20), 0.95)

        # Créer une prédiction simulée
        prediction = np.array([[confidence]])

        # Interpréter les résultats
        result = interpret_prediction(prediction)

        # Ajouter des informations sur le modèle utilisé
        result["model_info"] = "XResNet (Simulation basée sur les données cliniques)"
        result["risk_factors"] = {
            "age": int(age),
            "trestbps": int(trestbps),
            "chol": int(chol),
            "thalach": int(thalach),
            "oldpeak": float(oldpeak),
            "ca": int(ca)
        }

        return jsonify(result)

    except Exception as e:
        print(f"Erreur lors de l'analyse: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ============================================================================
# ENDPOINTS IoT POUR LE MONITORING DES CAPTEURS
# ============================================================================

@app.route('/api/iot/start-monitoring', methods=['POST'])
def start_monitoring():
    """Démarre le monitoring IoT"""
    try:
        success = start_iot_monitoring()
        if success:
            return jsonify({
                "status": "success",
                "message": "Monitoring IoT démarré avec succès",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "status": "info",
                "message": "Le monitoring IoT est déjà actif",
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/stop-monitoring', methods=['POST'])
def stop_monitoring():
    """Arrête le monitoring IoT"""
    try:
        success = stop_iot_monitoring()
        if success:
            return jsonify({
                "status": "success",
                "message": "Monitoring IoT arrêté avec succès",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "status": "info",
                "message": "Le monitoring IoT n'était pas actif",
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/sensors/current', methods=['GET'])
def get_current_sensor_data():
    """Récupère les données actuelles de tous les capteurs"""
    try:
        return jsonify({
            "status": "success",
            "data": sensor_data,
            "monitoring_active": iot_monitoring_active,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/sensors/<sensor_type>/history', methods=['GET'])
def get_sensor_history(sensor_type):
    """Récupère l'historique d'un capteur spécifique"""
    try:
        hours = request.args.get('hours', 24, type=int)

        if sensor_type not in sensor_data:
            return jsonify({"error": "Type de capteur invalide"}), 400

        # Filtrer l'historique selon la période demandée
        cutoff_time = datetime.now() - timedelta(hours=hours)
        history = sensor_data[sensor_type]['history']

        filtered_history = [
            entry for entry in history
            if datetime.fromisoformat(entry['timestamp']) > cutoff_time
        ]

        return jsonify({
            "status": "success",
            "sensor_type": sensor_type,
            "history": filtered_history,
            "period_hours": hours,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/alerts', methods=['GET'])
def get_active_alerts():
    """Récupère les alertes actives"""
    try:
        # Filtrer les alertes des dernières 24 heures
        cutoff_time = datetime.now() - timedelta(hours=24)
        recent_alerts = [
            alert for alert in active_alerts
            if datetime.fromisoformat(alert['timestamp']) > cutoff_time
        ]

        return jsonify({
            "status": "success",
            "alerts": recent_alerts,
            "count": len(recent_alerts),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/alerts/<alert_id>/read', methods=['PATCH'])
def mark_alert_as_read(alert_id):
    """Marque une alerte comme lue"""
    try:
        for alert in active_alerts:
            if alert['id'] == alert_id:
                alert['read'] = True
                return jsonify({
                    "status": "success",
                    "message": "Alerte marquée comme lue",
                    "timestamp": datetime.now().isoformat()
                })

        return jsonify({"error": "Alerte non trouvée"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/sensors/status', methods=['GET'])
def get_sensor_status():
    """Récupère le statut de connexion des capteurs"""
    try:
        sensor_status = {}
        for sensor_type in sensor_data:
            sensor_status[sensor_type] = {
                "connected": iot_monitoring_active,
                "last_update": sensor_data[sensor_type].get('lastUpdate', 'N/A'),
                "status": sensor_data[sensor_type]['status'],
                "battery_level": random.randint(80, 100),  # Simulation
                "signal_strength": random.randint(75, 100)  # Simulation
            }

        return jsonify({
            "status": "success",
            "sensors": sensor_status,
            "monitoring_active": iot_monitoring_active,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/iot/sensors/<sensor_type>/calibrate', methods=['POST'])
def calibrate_sensor(sensor_type):
    """Calibre un capteur spécifique"""
    try:
        if sensor_type not in sensor_data:
            return jsonify({"error": "Type de capteur invalide"}), 400

        # Simulation de calibration
        time.sleep(2)  # Simulation du temps de calibration

        return jsonify({
            "status": "success",
            "message": f"Capteur {sensor_type} calibré avec succès",
            "sensor_type": sensor_type,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# ENDPOINTS POUR LA GESTION DES SESSIONS
# ============================================================================

@app.route('/api/sessions/save', methods=['POST'])
def save_monitoring_session():
    """Sauvegarde une session de monitoring"""
    try:
        session_data = request.get_json()

        if not session_data or 'id' not in session_data:
            return jsonify({"error": "Données de session invalides"}), 400

        # Ajouter un timestamp de sauvegarde
        session_data['savedAt'] = datetime.now().isoformat()

        # Ajouter à la liste des sessions (garder seulement les 100 dernières)
        global monitoring_sessions
        monitoring_sessions.insert(0, session_data)
        if len(monitoring_sessions) > 100:
            monitoring_sessions = monitoring_sessions[:100]

        return jsonify({
            "status": "success",
            "message": "Session sauvegardée avec succès",
            "sessionId": session_data['id'],
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/history', methods=['GET'])
def get_session_history():
    """Récupère l'historique des sessions"""
    try:
        limit = request.args.get('limit', 10, type=int)

        # Limiter le nombre de sessions retournées
        sessions_to_return = monitoring_sessions[:limit]

        return jsonify({
            "status": "success",
            "sessions": sessions_to_return,
            "total": len(monitoring_sessions),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Récupère une session spécifique"""
    try:
        session = next((s for s in monitoring_sessions if s['id'] == session_id), None)

        if session:
            return jsonify({
                "status": "success",
                "session": session,
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({"error": "Session non trouvée"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Supprime une session"""
    try:
        global monitoring_sessions
        initial_count = len(monitoring_sessions)
        monitoring_sessions = [s for s in monitoring_sessions if s['id'] != session_id]

        if len(monitoring_sessions) < initial_count:
            return jsonify({
                "status": "success",
                "message": "Session supprimée avec succès",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({"error": "Session non trouvée"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================================
# ENDPOINTS POUR LA GESTION DES PRÉFÉRENCES
# ============================================================================

@app.route('/api/preferences/save', methods=['POST'])
def save_user_preferences():
    """Sauvegarde les préférences utilisateur"""
    try:
        preferences = request.get_json()

        if not preferences:
            return jsonify({"error": "Préférences invalides"}), 400

        # Mettre à jour les préférences globales
        global user_preferences
        user_preferences.update(preferences)

        return jsonify({
            "status": "success",
            "message": "Préférences sauvegardées avec succès",
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/preferences', methods=['GET'])
def get_user_preferences():
    """Récupère les préférences utilisateur"""
    try:
        return jsonify({
            "status": "success",
            "preferences": user_preferences,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Vérifier si le modèle existe
    if not os.path.exists(MODEL_PATH):
        print(f"ATTENTION: Le modèle {MODEL_PATH} n'a pas été trouvé.")
        print("Placez votre modèle .keras dans le même répertoire que ce script.")
        print("L'API fonctionnera en mode simulation.")

    # Démarrer le serveur
    print(f"Démarrage du serveur sur le port {PORT}...")
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
