# 🔗 Guide d'Intégration IoT - Capteurs Cardiaques

Ce guide explique comment intégrer de vrais capteurs IoT avec votre application CardioAI pour le monitoring en temps réel des paramètres cardiaques.

## 📋 Capteurs Recommandés

### 1. **Capteur de Rythme Cardiaque**
- **Modèle recommandé**: MAX30102 ou MAX30105
- **Interface**: I2C
- **Précision**: ±2 bpm
- **Plage**: 50-200 bpm
- **Alimentation**: 3.3V

### 2. **Capteur de Tension Artérielle**
- **Modèle recommandé**: Module de pression différentielle + brassard
- **Interface**: Analogique (ADC requis)
- **Précision**: ±3 mmHg
- **Plage**: 60-200 mmHg

### 3. **Capteur de Température Corporelle**
- **Modèle recommandé**: DS18B20 ou MLX90614 (infrarouge)
- **Interface**: 1-Wire ou I2C
- **Précision**: ±0.1°C
- **Plage**: 35-42°C

### 4. **Capteur de Saturation en Oxygène (SpO2)**
- **Modèle recommandé**: MAX30102 (même que rythme cardiaque)
- **Interface**: I2C
- **Précision**: ±2%
- **Plage**: 85-100%

## 🔧 Configuration Matérielle

### Microcontrôleur Recommandé
- **ESP32** ou **Arduino Uno WiFi Rev2**
- **Connectivité**: WiFi intégrée
- **Alimentation**: 5V via USB ou batterie Li-Po

### Schéma de Connexion
```
ESP32 Pinout:
├── GPIO21 (SDA) → Capteurs I2C
├── GPIO22 (SCL) → Capteurs I2C  
├── GPIO4       → DS18B20 (1-Wire)
├── GPIO34      → Capteur de pression (Analogique)
├── 3.3V        → Alimentation capteurs
└── GND         → Masse commune
```

## 💻 Code Arduino/ESP32

### Configuration de Base
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// Configuration WiFi
const char* ssid = "VOTRE_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE";
const char* serverURL = "http://192.168.1.100:5000/api/iot";

// Objets capteurs
MAX30105 particleSensor;

void setup() {
  Serial.begin(115200);
  
  // Initialisation WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connexion WiFi...");
  }
  
  // Initialisation capteurs
  if (!particleSensor.begin()) {
    Serial.println("Erreur: Capteur MAX30105 non trouvé");
    while(1);
  }
  
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void loop() {
  // Lecture des capteurs
  SensorData data = readAllSensors();
  
  // Envoi des données
  sendDataToServer(data);
  
  delay(2000); // Envoi toutes les 2 secondes
}
```

### Lecture des Capteurs
```cpp
struct SensorData {
  float heartRate;
  float temperature;
  float spO2;
  int systolic;
  int diastolic;
};

SensorData readAllSensors() {
  SensorData data;
  
  // Lecture rythme cardiaque et SpO2
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue)) {
    data.heartRate = calculateHeartRate();
    data.spO2 = calculateSpO2();
  }
  
  // Lecture température
  data.temperature = readTemperature();
  
  // Lecture tension artérielle (nécessite calibration)
  readBloodPressure(&data.systolic, &data.diastolic);
  
  return data;
}
```

### Envoi des Données
```cpp
void sendDataToServer(SensorData data) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverURL) + "/sensors/data");
    http.addHeader("Content-Type", "application/json");
    
    // Création du JSON
    DynamicJsonDocument doc(1024);
    doc["deviceId"] = WiFi.macAddress();
    doc["timestamp"] = millis();
    
    JsonObject sensors = doc.createNestedObject("sensors");
    sensors["heartRate"] = data.heartRate;
    sensors["temperature"] = data.temperature;
    sensors["spO2"] = data.spO2;
    sensors["systolic"] = data.systolic;
    sensors["diastolic"] = data.diastolic;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Données envoyées: " + String(httpResponseCode));
    } else {
      Serial.println("Erreur envoi: " + String(httpResponseCode));
    }
    
    http.end();
  }
}
```

## 🔧 Modification du Backend Flask

### Nouvel Endpoint pour Recevoir les Données
```python
@app.route('/api/iot/sensors/data', methods=['POST'])
def receive_sensor_data():
    """Reçoit les données des capteurs IoT réels"""
    try:
        data = request.get_json()
        device_id = data.get('deviceId')
        timestamp = data.get('timestamp')
        sensors = data.get('sensors', {})
        
        # Validation des données
        if not device_id or not sensors:
            return jsonify({"error": "Données invalides"}), 400
        
        # Mise à jour des données globales
        global sensor_data
        
        if 'heartRate' in sensors:
            sensor_data['heartRate']['value'] = sensors['heartRate']
            sensor_data['heartRate']['status'] = get_heart_rate_status(sensors['heartRate'])
        
        if 'temperature' in sensors:
            sensor_data['temperature']['value'] = sensors['temperature']
            sensor_data['temperature']['status'] = get_temperature_status(sensors['temperature'])
        
        if 'spO2' in sensors:
            sensor_data['oxygenSaturation']['value'] = sensors['spO2']
            sensor_data['oxygenSaturation']['status'] = get_oxygen_status(sensors['spO2'])
        
        if 'systolic' in sensors and 'diastolic' in sensors:
            sensor_data['bloodPressure']['systolic'] = sensors['systolic']
            sensor_data['bloodPressure']['diastolic'] = sensors['diastolic']
            sensor_data['bloodPressure']['status'] = get_blood_pressure_status(
                sensors['systolic'], sensors['diastolic']
            )
        
        # Ajouter à l'historique
        current_time = datetime.now()
        for sensor_type in sensor_data:
            if sensor_type in ['heartRate', 'temperature']:
                history_entry = {
                    'timestamp': current_time.isoformat(),
                    'time': current_time.strftime('%H:%M:%S'),
                    'value': sensor_data[sensor_type]['value']
                }
                sensor_data[sensor_type]['history'].append(history_entry)
                if len(sensor_data[sensor_type]['history']) > 50:
                    sensor_data[sensor_type]['history'].pop(0)
        
        return jsonify({
            "status": "success",
            "message": "Données reçues",
            "device_id": device_id,
            "timestamp": current_time.isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

## 📱 Configuration de l'Application

### 1. **Mode de Fonctionnement**
Dans `src/services/iotService.js`, ajoutez une configuration pour basculer entre simulation et capteurs réels :

```javascript
const IOT_CONFIG = {
  useRealSensors: false, // Mettre à true pour les vrais capteurs
  deviceId: null,
  simulationMode: true
};
```

### 2. **Détection Automatique**
```javascript
// Fonction pour détecter si des capteurs réels sont connectés
const detectRealSensors = async () => {
  try {
    const response = await axios.get(`${IOT_API_URL}/sensors/detect`);
    return response.data.realSensorsDetected;
  } catch (error) {
    return false;
  }
};
```

## 🔒 Sécurité et Bonnes Pratiques

### 1. **Authentification**
- Utilisez des tokens API pour authentifier les capteurs
- Implémentez HTTPS pour les communications
- Validez toutes les données reçues

### 2. **Gestion des Erreurs**
- Implémentez un système de retry automatique
- Gérez les déconnexions réseau
- Sauvegardez les données localement en cas de perte de connexion

### 3. **Calibration**
- Calibrez régulièrement les capteurs
- Implémentez des seuils de validation
- Alertes en cas de valeurs aberrantes

## 🔧 Dépannage

### Problèmes Courants
1. **Capteur non détecté**: Vérifiez les connexions I2C
2. **Données erratiques**: Calibrez les capteurs
3. **Perte de connexion**: Vérifiez la stabilité WiFi
4. **Valeurs aberrantes**: Implémentez des filtres de données

### Logs de Debug
```cpp
// Activez les logs détaillés
#define DEBUG_MODE 1

#if DEBUG_MODE
  Serial.println("HeartRate: " + String(data.heartRate));
  Serial.println("Temperature: " + String(data.temperature));
  Serial.println("SpO2: " + String(data.spO2));
#endif
```

## 📞 Support

Pour toute question sur l'intégration IoT :
1. Consultez la documentation des capteurs
2. Vérifiez les schémas de connexion
3. Testez chaque capteur individuellement
4. Utilisez le mode debug pour diagnostiquer les problèmes

---

**Note**: Ce guide fournit une base pour l'intégration IoT. L'implémentation complète nécessite des tests approfondis et une validation médicale pour un usage clinique.
