import React, { useState, useEffect } from 'react';
import notificationService from './services/notificationService';
import emergencyService from './services/emergencyService';
import NotificationCenter from './components/NotificationCenter';
import ToastNotification from './components/ToastNotification';

// Styles globaux pour plein écran avec animations
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Arial', sans-serif;
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }



  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    25% { transform: translateX(-50%) translateY(-2px); }
    75% { transform: translateX(-50%) translateY(2px); }
  }

  @keyframes progressBar {
    0% { width: 100%; }
    100% { width: 0%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Animations spécialisées pour les notifications toast */
  @keyframes slideInFromTop {
    0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    100% { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  @keyframes bounceIn {
    0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.05); }
    70% { transform: translateX(-50%) scale(0.9); }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
  }

  @keyframes criticalPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
    50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1); }
    75% { transform: scale(1.05); }
  }

  @keyframes temperatureFlash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; color: #ff6b35; }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes pressurePulse {
    0%, 100% { transform: scale(1); }
    33% { transform: scale(1.05); }
    66% { transform: scale(0.95); }
  }

  @keyframes connectionBlink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.5; }
  }

  @keyframes systemRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* Transitions globales */
  button, input, select {
    transition: all 0.2s ease;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  /* Scrollbar personnalisée */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
  }
`;

// Pages plein écran
const HomePage = () => (
  <div style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxSizing: 'border-box'
  }}>
    <h1 style={{ fontSize: '64px', margin: '0 0 20px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
      ❤️ CardioAI Pro
    </h1>
    <p style={{ fontSize: '24px', margin: '0 0 40px 0', opacity: '0.9' }}>
      Intelligence Artificielle pour le Diagnostic Cardiaque
    </p>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      width: '100%',
      maxWidth: '1400px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
        <h3 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>Monitoring IoT</h3>
        <p style={{ fontSize: '14px', opacity: '0.8', margin: '0' }}>Surveillance temps réel</p>
      </div>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧠</div>
        <h3 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>Diagnostic IA</h3>
        <p style={{ fontSize: '14px', opacity: '0.8', margin: '0' }}>Analyse intelligente</p>
      </div>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚙️</div>
        <h3 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>Paramètres</h3>
        <p style={{ fontSize: '14px', opacity: '0.8', margin: '0' }}>Configuration</p>
      </div>
    </div>
  </div>
);

const MonitoringPage = () => {
  const [sensorData, setSensorData] = useState({
    heartRate: { value: 72, status: 'normal', unit: 'bpm', trend: 'stable' },
    temperature: { value: 36.8, status: 'normal', unit: '°C', trend: 'stable' },
    bloodPressure: { value: '120/80', status: 'normal', unit: 'mmHg', trend: 'stable' },
    oxygenSaturation: { value: 98, status: 'normal', unit: '%', trend: 'stable' }
  });
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [dailyStats, setDailyStats] = useState({
    heartRate: { avg: 72, min: 65, max: 85, readings: 0 },
    temperature: { avg: 36.8, min: 36.5, max: 37.1, readings: 0 }
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // États avancés pour l'enregistrement
  const [recordingName, setRecordingName] = useState('');
  const [recordingNotes, setRecordingNotes] = useState('');
  const [recordingQuality, setRecordingQuality] = useState('high');
  const [autoSave, setAutoSave] = useState(true);
  const [recordingsList, setRecordingsList] = useState([]);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingStats, setRecordingStats] = useState({
    totalRecordings: 0,
    totalDuration: 0,
    averageHeartRate: 0,
    anomaliesDetected: 0
  });
  const [currentRecording, setCurrentRecording] = useState(null);

  // États pour l'historique avancé
  const [historyView, setHistoryView] = useState('list'); // 'list', 'grid', 'timeline'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'duration', 'name', 'heartRate'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'today', 'week', 'month'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [showRecordingDetails, setShowRecordingDetails] = useState(null);
  const [showRecordingHistory, setShowRecordingHistory] = useState(false);

  // Charger les enregistrements sauvegardés
  React.useEffect(() => {
    try {
      const savedRecordings = localStorage.getItem('cardioai-recordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        // Convertir les dates string en objets Date
        const recordingsWithDates = recordings.map(r => ({
          ...r,
          startTime: new Date(r.startTime),
          endTime: r.endTime ? new Date(r.endTime) : null
        }));
        setRecordingsList(recordingsWithDates);
      } else {
        // Créer des enregistrements de démonstration si aucun n'existe
        const demoRecordings = [
          {
            id: 'demo-1',
            name: 'Session matinale',
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
            endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000), // +15 minutes
            duration: 900, // 15 minutes
            quality: 'high',
            notes: 'Mesure après exercice matinal',
            data: Array.from({length: 450}, (_, i) => ({
              heartRate: 75 + Math.sin(i/10) * 10 + Math.random() * 5,
              temperature: 36.5 + Math.random() * 0.5,
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + i * 2000)
            })),
            stats: {
              avgHeartRate: 78,
              minHeartRate: 65,
              maxHeartRate: 92,
              avgTemperature: 36.7,
              anomalies: 2
            }
          },
          {
            id: 'demo-2',
            name: 'Contrôle médical',
            startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
            endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 minutes
            duration: 1800, // 30 minutes
            quality: 'high',
            notes: 'Visite de contrôle chez le cardiologue',
            data: Array.from({length: 900}, (_, i) => ({
              heartRate: 72 + Math.sin(i/15) * 8 + Math.random() * 4,
              temperature: 36.3 + Math.random() * 0.4,
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + i * 2000)
            })),
            stats: {
              avgHeartRate: 74,
              minHeartRate: 62,
              maxHeartRate: 88,
              avgTemperature: 36.5,
              anomalies: 0
            }
          },
          {
            id: 'demo-3',
            name: 'Session de repos',
            startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Il y a 3 heures
            endTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000), // +10 minutes
            duration: 600, // 10 minutes
            quality: 'medium',
            notes: 'Mesure au repos après déjeuner',
            data: Array.from({length: 120}, (_, i) => ({
              heartRate: 68 + Math.sin(i/8) * 6 + Math.random() * 3,
              temperature: 36.8 + Math.random() * 0.3,
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + i * 5000)
            })),
            stats: {
              avgHeartRate: 70,
              minHeartRate: 58,
              maxHeartRate: 82,
              avgTemperature: 36.9,
              anomalies: 1
            }
          }
        ];

        setRecordingsList(demoRecordings);

        // Calculer les statistiques globales
        const totalDuration = demoRecordings.reduce((sum, r) => sum + r.duration, 0);
        const avgHeartRate = Math.round(demoRecordings.reduce((sum, r) => sum + r.stats.avgHeartRate, 0) / demoRecordings.length);
        const totalAnomalies = demoRecordings.reduce((sum, r) => sum + r.stats.anomalies, 0);

        setRecordingStats({
          totalRecordings: demoRecordings.length,
          totalDuration,
          averageHeartRate: avgHeartRate,
          anomaliesDetected: totalAnomalies
        });

        // Sauvegarder les données de démonstration
        localStorage.setItem('cardioai-recordings', JSON.stringify(demoRecordings));
        localStorage.setItem('cardioai-recording-stats', JSON.stringify({
          totalRecordings: demoRecordings.length,
          totalDuration,
          averageHeartRate: avgHeartRate,
          anomaliesDetected: totalAnomalies
        }));
      }

      const savedStats = localStorage.getItem('cardioai-recording-stats');
      if (savedStats) {
        setRecordingStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Erreur chargement enregistrements:', error);
    }
  }, []);

  // Simulation avancée des données en temps réel
  React.useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date();

      // Simulation plus réaliste avec tendances
      const timeOfDay = timestamp.getHours();
      const baseHeartRate = timeOfDay < 6 || timeOfDay > 22 ? 65 : 75; // Plus bas la nuit
      const newHeartRate = baseHeartRate + Math.random() * 20 - 5;

      const baseTemp = 36.8 + (timeOfDay > 14 && timeOfDay < 18 ? 0.2 : 0); // Plus chaud l'après-midi
      const newTemp = baseTemp + Math.random() * 0.6 - 0.3;

      const newOxygen = 97 + Math.random() * 3;

      // Simulation tension artérielle variable
      const systolic = 115 + Math.random() * 20;
      const diastolic = 75 + Math.random() * 15;

      // Calculer les tendances
      const getTrend = (current, previous) => {
        if (!previous) return 'stable';
        const diff = current - previous;
        if (diff > 2) return 'up';
        if (diff < -2) return 'down';
        return 'stable';
      };

      const newData = {
        heartRate: {
          value: Math.round(newHeartRate),
          status: newHeartRate > 100 || newHeartRate < 60 ? 'warning' : 'normal',
          unit: 'bpm',
          trend: getTrend(newHeartRate, sensorData.heartRate.value)
        },
        temperature: {
          value: Math.round(newTemp * 10) / 10,
          status: newTemp > 37.5 || newTemp < 37.0 ? 'warning' : 'normal',
          unit: '°C',
          trend: getTrend(newTemp, sensorData.temperature.value)
        },
        bloodPressure: {
          value: `${Math.round(systolic)}/${Math.round(diastolic)}`,
          status: systolic > 140 || diastolic > 90 || systolic < 120 || diastolic < 80 ? 'warning' : 'normal',
          unit: 'mmHg',
          trend: 'stable'
        },
        oxygenSaturation: {
          value: Math.round(newOxygen),
          status: newOxygen < 96 ? 'warning' : 'normal',
          unit: '%',
          trend: getTrend(newOxygen, sensorData.oxygenSaturation.value)
        }
      };

      setSensorData(newData);
      setLastUpdate(timestamp);

      // Ajouter aux données historiques
      const dataPoint = {
        timestamp,
        heartRate: newData.heartRate.value,
        temperature: newData.temperature.value,
        oxygenSaturation: newData.oxygenSaturation.value,
        bloodPressure: newData.bloodPressure.value
      };

      setHistoricalData(prev => {
        const updated = [...prev, dataPoint];
        return updated.slice(-50); // Garder les 50 derniers points
      });

      // Mettre à jour les statistiques quotidiennes
      setDailyStats(prev => {
        const hrReadings = prev.heartRate.readings + 1;
        const tempReadings = prev.temperature.readings + 1;

        return {
          heartRate: {
            avg: Math.round(((prev.heartRate.avg * prev.heartRate.readings) + newData.heartRate.value) / hrReadings),
            min: Math.min(prev.heartRate.min, newData.heartRate.value),
            max: Math.max(prev.heartRate.max, newData.heartRate.value),
            readings: hrReadings
          },
          temperature: {
            avg: Math.round(((prev.temperature.avg * prev.temperature.readings) + newData.temperature.value) * 10) / 10,
            min: Math.min(prev.temperature.min, newData.temperature.value),
            max: Math.max(prev.temperature.max, newData.temperature.value),
            readings: tempReadings
          }
        };
      });

      // Système d'alertes avancé avec notifications
      const newAlerts = [];

      // Vérifier rythme cardiaque
      if (newData.heartRate.status === 'warning') {
        const severity = newData.heartRate.value > 120 || newData.heartRate.value < 50 ? 'critical' : 'warning';
        const alertData = {
          id: Date.now() + Math.random(),
          type: 'heartRate',
          message: `Rythme cardiaque ${newData.heartRate.value > 100 ? 'élevé' : 'bas'}: ${newData.heartRate.value} bpm`,
          severity,
          timestamp
        };
        newAlerts.push(alertData);

        // Créer notification spécialisée pour le rythme cardiaque
        notificationService.addNotification({
          type: 'sensor',
          severity: 'heartRate',
          title: `❤️ Alerte Rythme Cardiaque`,
          message: `Rythme cardiaque ${newData.heartRate.value > 100 ? 'élevé' : 'bas'}: ${newData.heartRate.value} bpm`,
          value: `${newData.heartRate.value} bpm`,
          threshold: { min: 60, max: 100 },
          sensorType: 'heartRate'
        });
      }

      // Vérifier température
      if (newData.temperature.status === 'warning') {
        const severity = newData.temperature.value > 38.5 || newData.temperature.value < 35.5 ? 'critical' : 'warning';
        const alertData = {
          id: Date.now() + Math.random() + 1,
          type: 'temperature',
          message: `Température ${newData.temperature.value > 37.5 ? 'élevée' : 'basse'}: ${newData.temperature.value}°C`,
          severity,
          timestamp
        };
        newAlerts.push(alertData);

        // Créer notification spécialisée pour la température
        notificationService.addNotification({
          type: 'sensor',
          severity: 'temperature',
          title: `🌡️ Alerte Température`,
          message: `Température ${newData.temperature.value > 37.5 ? 'élevée' : 'basse'}: ${newData.temperature.value}°C`,
          value: `${newData.temperature.value}°C`,
          threshold: { min: 37.0, max: 37.5 },
          sensorType: 'temperature'
        });
      }

      // Vérifier saturation oxygène
      if (newData.oxygenSaturation.status === 'warning') {
        const severity = newData.oxygenSaturation.value < 90 ? 'critical' : 'warning';
        const alertData = {
          id: Date.now() + Math.random() + 2,
          type: 'oxygen',
          message: `Saturation en oxygène faible: ${newData.oxygenSaturation.value}%`,
          severity,
          timestamp
        };
        newAlerts.push(alertData);

        // Créer notification spécialisée pour la saturation en oxygène
        notificationService.addNotification({
          type: 'sensor',
          severity: 'oxygenSaturation',
          title: `🫁 Alerte Saturation Oxygène`,
          message: `Saturation en oxygène faible: ${newData.oxygenSaturation.value}%`,
          value: `${newData.oxygenSaturation.value}%`,
          threshold: { min: 96, max: 100 },
          sensorType: 'oxygenSaturation'
        });
      }

      // Vérifier tension artérielle
      if (newData.bloodPressure.status === 'warning') {
        const severity = 'warning'; // La tension artérielle est généralement moins critique
        const alertData = {
          id: Date.now() + Math.random() + 3,
          type: 'bloodPressure',
          message: `Tension artérielle anormale: ${newData.bloodPressure.value}`,
          severity,
          timestamp
        };
        newAlerts.push(alertData);

        // Créer notification spécialisée pour la tension artérielle
        const systolicValue = parseInt(newData.bloodPressure.value.split('/')[0]);
        const diastolicValue = parseInt(newData.bloodPressure.value.split('/')[1]);
        let pressureMessage = '';

        if (systolicValue > 140 || diastolicValue > 90) {
          pressureMessage = `Tension artérielle élevée: ${newData.bloodPressure.value}`;
        } else if (systolicValue < 120 || diastolicValue < 80) {
          pressureMessage = `Tension artérielle basse: ${newData.bloodPressure.value}`;
        }

        notificationService.addNotification({
          type: 'sensor',
          severity: 'bloodPressure',
          title: `🩸 Alerte Tension Artérielle`,
          message: pressureMessage,
          value: `${newData.bloodPressure.value}`,
          threshold: { min: '120/80', max: '140/90' },
          sensorType: 'bloodPressure'
        });
      }



      setAlerts(prev => {
        const updated = [...prev, ...newAlerts];
        return updated.slice(-10); // Garder les 10 dernières alertes
      });

      // Enregistrement automatique si activé
      if (isRecording) {
        setRecordingDuration(prev => prev + 2);
      }

      // Vérifier les conditions d'urgence
      emergencyService.checkEmergencyCondition(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, [sensorData, isRecording]);

  // Fonctions utilitaires améliorées
  const getSensorIcon = (type) => {
    const icons = {
      heartRate: '❤️',
      temperature: '🌡️',
      bloodPressure: '🩸',
      oxygenSaturation: '🫁'
    };
    return icons[type] || '📊';
  };

  const getSensorName = (type) => {
    const names = {
      heartRate: 'Rythme Cardiaque',
      temperature: 'Température',
      bloodPressure: 'Tension Artérielle',
      oxygenSaturation: 'Saturation O₂'
    };
    return names[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      normal: '#4caf50',
      warning: '#ff9800',
      critical: '#f44336'
    };
    return colors[status] || '#4caf50';
  };

  const getTrendIcon = (trend) => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };
    return icons[trend] || '➡️';
  };

  const getTrendColor = (trend) => {
    const colors = {
      up: '#ff6b35',
      down: '#2196f3',
      stable: '#4caf50'
    };
    return colors[trend] || '#4caf50';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Fonction pour obtenir les seuils de chaque capteur
  const getThresholds = (sensorType) => {
    switch(sensorType) {
      case 'heartRate':
        return '60-100 bpm';
      case 'temperature':
        return '37.0-37.5°C';
      case 'oxygenSaturation':
        return '96-100%';
      case 'bloodPressure':
        return '120/80-140/90 mmHg';
      default:
        return 'N/A';
    }
  };

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currentData: sensorData,
      historicalData,
      dailyStats,
      alerts: alerts.slice(-5) // Dernières 5 alertes
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardioai-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Fonctions d'enregistrement avancées
  const startRecording = () => {
    const newRecording = {
      id: Date.now().toString(),
      name: recordingName || `Enregistrement ${new Date().toLocaleString()}`,
      startTime: new Date(),
      duration: 0,
      quality: recordingQuality,
      notes: recordingNotes,
      data: [],
      stats: {
        avgHeartRate: 0,
        minHeartRate: 999,
        maxHeartRate: 0,
        avgTemperature: 0,
        anomalies: 0
      }
    };

    setCurrentRecording(newRecording);
    setIsRecording(true);
    setRecordingDuration(0);
    setShowRecordingModal(false);
    setShowRecordingHistory(false);

    // Réinitialiser les champs
    setRecordingName('');
    setRecordingNotes('');
  };

  const stopRecording = () => {
    if (currentRecording && isRecording) {
      const finalRecording = {
        ...currentRecording,
        endTime: new Date(),
        duration: recordingDuration,
        data: [...historicalData]
      };

      // Calculer les statistiques finales
      if (historicalData.length > 0) {
        const heartRates = historicalData.map(d => d.heartRate);
        finalRecording.stats = {
          avgHeartRate: Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length),
          minHeartRate: Math.min(...heartRates),
          maxHeartRate: Math.max(...heartRates),
          avgTemperature: Math.round(historicalData.map(d => d.temperature).reduce((a, b) => a + b, 0) / historicalData.length * 10) / 10,
          anomalies: alerts.length
        };
      }

      // Sauvegarder l'enregistrement
      const updatedRecordings = [...recordingsList, finalRecording];
      setRecordingsList(updatedRecordings);

      // Mettre à jour les statistiques globales
      setRecordingStats(prev => ({
        totalRecordings: prev.totalRecordings + 1,
        totalDuration: prev.totalDuration + recordingDuration,
        averageHeartRate: Math.round((prev.averageHeartRate * prev.totalRecordings + finalRecording.stats.avgHeartRate) / (prev.totalRecordings + 1)),
        anomaliesDetected: prev.anomaliesDetected + finalRecording.stats.anomalies
      }));

      // Sauvegarde automatique si activée
      if (autoSave) {
        localStorage.setItem('cardioai-recordings', JSON.stringify(updatedRecordings));
        localStorage.setItem('cardioai-recording-stats', JSON.stringify(recordingStats));
      }
    }

    setIsRecording(false);
    setRecordingDuration(0);
    setCurrentRecording(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setShowRecordingHistory(false);
      setShowRecordingModal(true);
    }
  };

  const deleteRecording = (recordingId) => {
    const updatedRecordings = recordingsList.filter(r => r.id !== recordingId);
    setRecordingsList(updatedRecordings);

    if (autoSave) {
      localStorage.setItem('cardioai-recordings', JSON.stringify(updatedRecordings));
    }
  };

  // Export Excel avancé
  const exportToExcel = (recordings, type = 'single') => {
    // Créer les données pour Excel
    const worksheetData = [];

    // En-têtes
    const headers = [
      'Nom de l\'enregistrement',
      'Date de début',
      'Heure de début',
      'Date de fin',
      'Heure de fin',
      'Durée (secondes)',
      'Durée formatée',
      'Qualité',
      'Notes',
      'FC Moyenne (bpm)',
      'FC Minimale (bpm)',
      'FC Maximale (bpm)',
      'Température Moyenne (°C)',
      'Anomalies détectées',
      'Nombre de points',
      'Exporté le'
    ];
    worksheetData.push(headers);

    // Données des enregistrements
    const recordingsToExport = Array.isArray(recordings) ? recordings : [recordings];
    recordingsToExport.forEach(recording => {
      const row = [
        recording.name,
        recording.startTime.toLocaleDateString(),
        recording.startTime.toLocaleTimeString(),
        recording.endTime ? recording.endTime.toLocaleDateString() : '',
        recording.endTime ? recording.endTime.toLocaleTimeString() : '',
        recording.duration,
        formatDuration(recording.duration),
        recording.quality === 'high' ? 'Haute' : recording.quality === 'medium' ? 'Moyenne' : 'Basse',
        recording.notes || '',
        recording.stats.avgHeartRate,
        recording.stats.minHeartRate,
        recording.stats.maxHeartRate,
        recording.stats.avgTemperature,
        recording.stats.anomalies,
        recording.data ? recording.data.length : 0,
        new Date().toLocaleString()
      ];
      worksheetData.push(row);
    });

    // Créer le fichier Excel en utilisant une approche simple
    const csvContent = worksheetData.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const fileName = type === 'multiple'
      ? `cardioai-enregistrements-${new Date().toISOString().split('T')[0]}.csv`
      : `cardioai-${recordings.name.replace(/[^a-z0-9]/gi, '_')}-${recordings.startTime.toISOString().split('T')[0]}.csv`;

    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRecording = (recording, format = 'json') => {
    if (format === 'excel') {
      exportToExcel(recording);
      return;
    }

    const exportData = {
      ...recording,
      exportDate: new Date().toISOString(),
      patientInfo: {
        name: 'Patient',
        exportedBy: 'CardioAI Pro'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardioai-recording-${recording.name.replace(/[^a-z0-9]/gi, '_')}-${recording.startTime.toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export multiple en Excel
  const exportMultipleRecordings = () => {
    const recordingsToExport = selectedRecordings.length > 0
      ? recordingsList.filter(r => selectedRecordings.includes(r.id))
      : getFilteredRecordings();

    exportToExcel(recordingsToExport, 'multiple');
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // Fonctions de filtrage et tri pour l'historique
  const getFilteredRecordings = () => {
    let filtered = [...recordingsList];

    // Filtrage par période
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filterBy) {
      case 'today':
        filtered = filtered.filter(r => new Date(r.startTime) >= today);
        break;
      case 'week':
        filtered = filtered.filter(r => new Date(r.startTime) >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(r => new Date(r.startTime) >= monthAgo);
        break;
    }

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.startTime);
          bValue = new Date(b.startTime);
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'heartRate':
          aValue = a.stats.avgHeartRate;
          bValue = b.stats.avgHeartRate;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const toggleRecordingSelection = (recordingId) => {
    setSelectedRecordings(prev =>
      prev.includes(recordingId)
        ? prev.filter(id => id !== recordingId)
        : [...prev, recordingId]
    );
  };

  const selectAllRecordings = () => {
    const filtered = getFilteredRecordings();
    setSelectedRecordings(filtered.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedRecordings([]);
  };

  const simulateDisconnection = () => {
    setIsConnected(false);
    notificationService.addNotification({
      type: 'connection',
      severity: 'connection',
      title: '📡 Connexion Perdue',
      message: 'La connexion avec les capteurs IoT a été interrompue'
    });
    setTimeout(() => {
      setIsConnected(true);
      notificationService.addNotification({
        type: 'connection',
        severity: 'connection',
        title: '📡 Connexion Rétablie',
        message: 'La connexion avec les capteurs IoT est maintenant stable'
      });
    }, 5000);
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
      color: 'white',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* En-tête avec statut et contrôles avancés */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '36px', margin: '0 0 5px 0' }}>📊 Monitoring IoT</h1>
            <p style={{ fontSize: '14px', margin: '0', opacity: '0.8' }}>
              Dernière mise à jour: {lastUpdate.toLocaleTimeString()} • {dailyStats.heartRate.readings} mesures aujourd'hui
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Statut de connexion */}
            <div style={{
              backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: `1px solid ${isConnected ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`
            }}>
              {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
            </div>

            {/* Statut d'enregistrement */}
            {isRecording && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '1px solid rgba(244, 67, 54, 0.5)',
                animation: 'pulse 2s infinite'
              }}>
                🔴 REC {formatDuration(recordingDuration)}
              </div>
            )}

            {/* Indicateur de détection des seuils */}
            <div style={{
              backgroundColor: 'rgba(33, 150, 243, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: '1px solid rgba(33, 150, 243, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: Object.values(sensorData).every(data => data.status === 'normal') ? '#4caf50' : '#ff9800',
                animation: 'pulse 1.5s infinite'
              }} />
              🎯 Seuils: {Object.values(sensorData).filter(data => data.status === 'normal').length}/4 OK
            </div>

            {/* Contrôles d'enregistrement avancés */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={toggleRecording}
                style={{
                  backgroundColor: isRecording ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                  color: 'white',
                  border: `1px solid ${isRecording ? 'rgba(244, 67, 54, 0.5)' : 'rgba(76, 175, 80, 0.5)'}`,
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {isRecording ? '⏹️ Arrêter' : '⏺️ Nouveau'}
              </button>

              <button
                onClick={() => {
                  setShowRecordingModal(true);
                  setShowRecordingHistory(true);
                }}
                style={{
                  backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(33, 150, 243, 0.5)',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📁 Historique ({recordingsList.length})
              </button>
            </div>

            <button
              onClick={exportData}
              style={{
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                color: 'white',
                border: '1px solid rgba(33, 150, 243, 0.5)',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              💾 Exporter
            </button>



            <button
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              style={{
                backgroundColor: showAdvancedMetrics ? 'rgba(156, 39, 176, 0.3)' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(156, 39, 176, 0.5)',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📈 Métriques
            </button>
          </div>
        </div>
      </div>

      {/* Système d'alertes avancé */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: '0', fontSize: '16px' }}>
              🚨 Alertes Actives ({alerts.length})
            </h3>
            <button
              onClick={clearAlerts}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️ Effacer
            </button>
          </div>

          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {alerts.map((alert, index) => (
              <div key={alert.id || index} style={{
                backgroundColor: alert.severity === 'critical' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                border: `1px solid ${alert.severity === 'critical' ? 'rgba(244, 67, 54, 0.5)' : 'rgba(255, 152, 0, 0.5)'}`,
                padding: '10px 15px',
                borderRadius: '8px',
                marginBottom: '5px',
                fontSize: '13px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ marginRight: '8px' }}>
                    {alert.severity === 'critical' ? '🚨' : '⚠️'}
                  </span>
                  {alert.message}
                </div>
                <span style={{ fontSize: '11px', opacity: '0.8' }}>
                  {alert.timestamp ? alert.timestamp.toLocaleTimeString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cartes des capteurs améliorées */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Object.entries(sensorData).map(([type, data]) => (
          <div key={type} style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${getStatusColor(data.status)}40`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            {/* Indicateur de tendance */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '16px',
              color: getTrendColor(data.trend)
            }}>
              {getTrendIcon(data.trend)}
            </div>

            <div style={{ fontSize: '36px', marginBottom: '10px' }}>
              {getSensorIcon(type)}
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
              {getSensorName(type)}
            </h3>

            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 0 5px 0',
              color: getStatusColor(data.status),
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {data.value}
            </p>

            <p style={{ fontSize: '12px', margin: '0 0 10px 0', opacity: '0.8' }}>
              {data.unit}
            </p>

            {/* Statistiques quotidiennes */}
            {(type === 'heartRate' || type === 'temperature') && dailyStats[type] && (
              <div style={{
                fontSize: '10px',
                opacity: '0.7',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-around'
              }}>
                <span>Min: {dailyStats[type].min}</span>
                <span>Moy: {dailyStats[type].avg}</span>
                <span>Max: {dailyStats[type].max}</span>
              </div>
            )}

            {/* Badge de statut */}
            <div style={{
              padding: '6px 12px',
              borderRadius: '15px',
              backgroundColor: getStatusColor(data.status) + '40',
              fontSize: '11px',
              fontWeight: 'bold',
              border: `1px solid ${getStatusColor(data.status)}60`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {data.status === 'normal' ? '✓' : data.status === 'critical' ? '🚨' : '⚠️'}
              {data.status === 'normal' ? 'Normal' : data.status === 'critical' ? 'Critique' : 'Attention'}
            </div>

            {/* Animation de pulsation pour les valeurs critiques */}
            {data.status === 'critical' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid #f44336',
                borderRadius: '15px',
                animation: 'pulse 1s infinite',
                pointerEvents: 'none'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Métriques avancées */}
      {showAdvancedMetrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>📊 Variabilité FC</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#4caf50' }}>
              {Math.round(Math.random() * 20 + 10)} ms
            </p>
            <p style={{ fontSize: '10px', opacity: '0.7', margin: '0' }}>RMSSD</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>💪 Stress Index</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#ff9800' }}>
              {Math.round(Math.random() * 50 + 25)}
            </p>
            <p style={{ fontSize: '10px', opacity: '0.7', margin: '0' }}>Score 0-100</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>⚡ Énergie</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#2196f3' }}>
              {Math.round(Math.random() * 30 + 70)}%
            </p>
            <p style={{ fontSize: '10px', opacity: '0.7', margin: '0' }}>Niveau estimé</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🎯 Qualité Signal</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#4caf50' }}>
              {isConnected ? '98%' : '0%'}
            </p>
            <p style={{ fontSize: '10px', opacity: '0.7', margin: '0' }}>Fiabilité</p>
          </div>
        </div>
      )}

      {/* Panneau de statut des seuils en temps réel */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎯 Surveillance des Seuils
          </h4>
          <div style={{
            fontSize: '14px',
            backgroundColor: Object.values(sensorData).every(data => data.status === 'normal')
              ? 'rgba(76, 175, 80, 0.3)'
              : 'rgba(255, 152, 0, 0.3)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${Object.values(sensorData).every(data => data.status === 'normal')
              ? '#4caf50'
              : '#ff9800'}`,
            fontWeight: 'bold'
          }}>
            {Object.values(sensorData).every(data => data.status === 'normal')
              ? '✅ Tous les seuils OK'
              : `⚠️ ${Object.values(sensorData).filter(data => data.status !== 'normal').length} alerte(s)`}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {Object.entries(sensorData).map(([key, data]) => {
            const isInRange = data.status === 'normal';
            const thresholds = getThresholds(key);
            const sensorNames = {
              heartRate: 'Rythme Cardiaque',
              temperature: 'Température',
              oxygenSaturation: 'Saturation O₂',
              bloodPressure: 'Tension Artérielle'
            };
            const sensorIcons = {
              heartRate: '❤️',
              temperature: '🌡️',
              oxygenSaturation: '🫁',
              bloodPressure: '🩸'
            };

            return (
              <div key={key} style={{
                backgroundColor: isInRange ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: `2px solid ${isInRange ? '#4caf50' : '#f44336'}`,
                padding: '15px',
                borderRadius: '12px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                {/* Animation de pulsation pour les valeurs hors seuil */}
                {!isInRange && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '2px solid #f44336',
                    borderRadius: '12px',
                    animation: 'pulse 1.5s infinite',
                    pointerEvents: 'none'
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '24px' }}>
                    {sensorIcons[key]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {sensorNames[key]}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: isInRange ? '#4caf50' : '#f44336' }}>
                      {data.value} {data.unit}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '24px',
                    animation: isInRange ? 'none' : 'pulse 1s infinite'
                  }}>
                    {isInRange ? '✅' : '⚠️'}
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  opacity: '0.8',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '8px',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  <strong>Seuil normal:</strong> {thresholds}
                </div>

                <div style={{
                  fontSize: '11px',
                  opacity: '0.7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Tendance: {data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️'}</span>
                  <span style={{
                    backgroundColor: isInRange ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    {isInRange ? 'NORMAL' : 'ALERTE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '15px',
          fontSize: '12px',
          opacity: '0.7',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '15px'
        }}>
          💡 Les notifications toast apparaissent automatiquement quand les valeurs sortent des seuils normaux
        </div>
      </div>

      {/* Graphiques améliorés */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: '250px' }}>
        {/* Graphique principal */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          flex: 2
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: '0', fontSize: '16px' }}>📈 Évolution Temps Réel</h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['1h', '6h', '24h'].map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  style={{
                    backgroundColor: selectedTimeRange === range ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            height: '180px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-around',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            paddingBottom: '10px',
            position: 'relative'
          }}>
            {/* Grille de fond */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />

            {/* Données historiques */}
            {historicalData.slice(-20).map((point, i) => {
              const height = Math.max(10, (point.heartRate - 50) * 2);
              return (
                <div key={i} style={{
                  width: '8px',
                  height: `${height}px`,
                  backgroundColor: point.heartRate > 100 ? '#ff6b35' : '#4caf50',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }} />
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', opacity: '0.7' }}>
            <span>-{selectedTimeRange}</span>
            <span>Rythme cardiaque (bpm)</span>
            <span>Maintenant</span>
          </div>
        </div>

        {/* Panneau de statistiques */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📊 Statistiques</h3>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: '0.8' }}>Aujourd'hui</h4>
              <p style={{ margin: '0', fontSize: '14px' }}>
                📊 {dailyStats.heartRate.readings} mesures<br />
                ❤️ {dailyStats.heartRate.min}-{dailyStats.heartRate.max} bpm<br />
                🌡️ {dailyStats.temperature.min}-{dailyStats.temperature.max} °C
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: '0.8' }}>Alertes</h4>
              <p style={{ margin: '0', fontSize: '14px' }}>
                🚨 {alerts.filter(a => a.severity === 'critical').length} critiques<br />
                ⚠️ {alerts.filter(a => a.severity === 'warning').length} avertissements<br />
                ✅ {isConnected ? 'Système stable' : 'Déconnecté'}
              </p>
            </div>

            {/* Statistiques d'enregistrement */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: '0.8' }}>📊 Enregistrements</h4>
              <p style={{ margin: '0', fontSize: '14px' }}>
                📁 {recordingStats.totalRecordings} sessions<br />
                ⏱️ {formatDuration(recordingStats.totalDuration)} total<br />
                ❤️ {recordingStats.averageHeartRate} bpm moyen
              </p>
            </div>

            {isRecording && currentRecording && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(244, 67, 54, 0.5)'
              }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '12px' }}>🔴 En cours</h4>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  📝 {currentRecording.name}<br />
                  ⏱️ {formatDuration(recordingDuration)}<br />
                  📊 {historicalData.length} points<br />
                  🎯 Qualité: {recordingQuality}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'enregistrement avancé */}
      {showRecordingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 50, 100, 0.95)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {!showRecordingHistory ? (
              // Mode création d'enregistrement
              <div>
                <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>🎬 Nouvel Enregistrement</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                      📝 Nom de l'enregistrement
                    </label>
                    <input
                      type="text"
                      value={recordingName}
                      onChange={(e) => setRecordingName(e.target.value)}
                      placeholder={`Session ${new Date().toLocaleString()}`}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                      🎯 Qualité d'enregistrement
                    </label>
                    <select
                      value={recordingQuality}
                      onChange={(e) => setRecordingQuality(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="high" style={{ backgroundColor: '#333' }}>Haute (2s) - Recommandé</option>
                      <option value="medium" style={{ backgroundColor: '#333' }}>Moyenne (5s)</option>
                      <option value="low" style={{ backgroundColor: '#333' }}>Basse (10s)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                      📋 Notes (optionnel)
                    </label>
                    <textarea
                      value={recordingNotes}
                      onChange={(e) => setRecordingNotes(e.target.value)}
                      placeholder="Contexte, symptômes, activité..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <label htmlFor="autoSave" style={{ fontSize: '14px', cursor: 'pointer' }}>
                      💾 Sauvegarde automatique
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button
                      onClick={startRecording}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(76, 175, 80, 0.3)',
                        color: 'white',
                        border: '1px solid rgba(76, 175, 80, 0.5)',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      🎬 Démarrer l'enregistrement
                    </button>
                    <button
                      onClick={() => {
                        setShowRecordingModal(false);
                        setShowRecordingHistory(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(158, 158, 158, 0.3)',
                        color: 'white',
                        border: '1px solid rgba(158, 158, 158, 0.5)',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Mode historique avancé des enregistrements
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: '0', fontSize: '20px' }}>📁 Historique des Enregistrements</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowRecordingHistory(false)}
                      style={{
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(76, 175, 80, 0.5)',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      ➕ Nouveau
                    </button>
                    <button
                      onClick={() => setHistoryView(historyView === 'list' ? 'grid' : 'list')}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      {historyView === 'list' ? '⊞ Grille' : '☰ Liste'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRecordingModal(false);
                        setShowRecordingHistory(false);
                      }}
                      style={{
                        backgroundColor: 'rgba(158, 158, 158, 0.3)',
                        color: 'white',
                        border: '1px solid rgba(158, 158, 158, 0.5)',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Statistiques globales */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📊 Statistiques Globales</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>{recordingStats.totalRecordings}</div>
                      <div style={{ opacity: '0.8' }}>Sessions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>{formatDuration(recordingStats.totalDuration)}</div>
                      <div style={{ opacity: '0.8' }}>Durée totale</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>{recordingStats.averageHeartRate}</div>
                      <div style={{ opacity: '0.8' }}>FC moyenne</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>{recordingStats.anomaliesDetected}</div>
                      <div style={{ opacity: '0.8' }}>Anomalies</div>
                    </div>
                  </div>
                </div>

                {/* Contrôles de filtrage et tri */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    {/* Recherche */}
                    <div>
                      <input
                        type="text"
                        placeholder="🔍 Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '5px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                    </div>

                    {/* Filtre par période */}
                    <div>
                      <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '5px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        <option value="all" style={{ backgroundColor: '#333' }}>📅 Toutes les périodes</option>
                        <option value="today" style={{ backgroundColor: '#333' }}>📅 Aujourd'hui</option>
                        <option value="week" style={{ backgroundColor: '#333' }}>📅 Cette semaine</option>
                        <option value="month" style={{ backgroundColor: '#333' }}>📅 Ce mois</option>
                      </select>
                    </div>

                    {/* Tri */}
                    <div>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [sort, order] = e.target.value.split('-');
                          setSortBy(sort);
                          setSortOrder(order);
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '5px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        <option value="date-desc" style={{ backgroundColor: '#333' }}>📅 Plus récent</option>
                        <option value="date-asc" style={{ backgroundColor: '#333' }}>📅 Plus ancien</option>
                        <option value="duration-desc" style={{ backgroundColor: '#333' }}>⏱️ Plus long</option>
                        <option value="duration-asc" style={{ backgroundColor: '#333' }}>⏱️ Plus court</option>
                        <option value="name-asc" style={{ backgroundColor: '#333' }}>📝 Nom A-Z</option>
                        <option value="name-desc" style={{ backgroundColor: '#333' }}>📝 Nom Z-A</option>
                        <option value="heartRate-desc" style={{ backgroundColor: '#333' }}>❤️ FC élevée</option>
                        <option value="heartRate-asc" style={{ backgroundColor: '#333' }}>❤️ FC basse</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions de sélection multiple */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={selectAllRecordings}
                        style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(76, 175, 80, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        ✅ Tout sélectionner
                      </button>
                      <button
                        onClick={clearSelection}
                        style={{
                          backgroundColor: 'rgba(158, 158, 158, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(158, 158, 158, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        ❌ Désélectionner
                      </button>
                      {selectedRecordings.length > 0 && (
                        <span style={{ fontSize: '11px', opacity: '0.8' }}>
                          {selectedRecordings.length} sélectionné(s)
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={exportMultipleRecordings}
                        disabled={getFilteredRecordings().length === 0}
                        style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(76, 175, 80, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: getFilteredRecordings().length === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '10px',
                          opacity: getFilteredRecordings().length === 0 ? 0.5 : 1
                        }}
                      >
                        📊 Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Liste/Grille des enregistrements */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {getFilteredRecordings().length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: '0.6' }}>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                        {searchTerm || filterBy !== 'all' ? '🔍' : '📭'}
                      </div>
                      <p>
                        {searchTerm || filterBy !== 'all'
                          ? 'Aucun enregistrement trouvé avec ces critères'
                          : 'Aucun enregistrement disponible'
                        }
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      display: historyView === 'grid' ? 'grid' : 'flex',
                      gridTemplateColumns: historyView === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'none',
                      flexDirection: historyView === 'list' ? 'column' : 'none',
                      gap: '10px'
                    }}>
                      {getFilteredRecordings().map(recording => (
                        <div key={recording.id} style={{
                          backgroundColor: selectedRecordings.includes(recording.id)
                            ? 'rgba(33, 150, 243, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                          padding: '15px',
                          borderRadius: '10px',
                          border: `1px solid ${selectedRecordings.includes(recording.id)
                            ? 'rgba(33, 150, 243, 0.5)'
                            : 'rgba(255, 255, 255, 0.2)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => toggleRecordingSelection(recording.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                <input
                                  type="checkbox"
                                  checked={selectedRecordings.includes(recording.id)}
                                  onChange={() => toggleRecordingSelection(recording.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ transform: 'scale(1.1)' }}
                                />
                                <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                                  {recording.name}
                                </h4>
                              </div>

                              <div style={{ fontSize: '11px', opacity: '0.8', lineHeight: '1.4' }}>
                                <div style={{ marginBottom: '3px' }}>
                                  📅 {recording.startTime.toLocaleDateString()} à {recording.startTime.toLocaleTimeString()}
                                </div>
                                <div style={{ marginBottom: '3px' }}>
                                  ⏱️ {formatDuration(recording.duration)} • 🎯 {recording.quality === 'high' ? 'Haute' : recording.quality === 'medium' ? 'Moyenne' : 'Basse'}
                                </div>
                                <div style={{ marginBottom: '3px' }}>
                                  ❤️ {recording.stats.avgHeartRate} bpm ({recording.stats.minHeartRate}-{recording.stats.maxHeartRate})
                                </div>
                                <div>
                                  🌡️ {recording.stats.avgTemperature}°C • 🚨 {recording.stats.anomalies} anomalies
                                </div>
                              </div>

                              {recording.notes && (
                                <p style={{ margin: '8px 0 0 0', fontSize: '11px', fontStyle: 'italic', opacity: '0.7', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '4px' }}>
                                  💭 "{recording.notes}"
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '10px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowRecordingDetails(recording);
                                }}
                                style={{
                                  backgroundColor: 'rgba(156, 39, 176, 0.3)',
                                  color: 'white',
                                  border: '1px solid rgba(156, 39, 176, 0.5)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '10px'
                                }}
                              >
                                👁️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportRecording(recording, 'excel');
                                }}
                                style={{
                                  backgroundColor: 'rgba(76, 175, 80, 0.3)',
                                  color: 'white',
                                  border: '1px solid rgba(76, 175, 80, 0.5)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '10px'
                                }}
                              >
                                📊
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportRecording(recording, 'json');
                                }}
                                style={{
                                  backgroundColor: 'rgba(33, 150, 243, 0.3)',
                                  color: 'white',
                                  border: '1px solid rgba(33, 150, 243, 0.5)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '10px'
                                }}
                              >
                                💾
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRecording(recording.id);
                                }}
                                style={{
                                  backgroundColor: 'rgba(244, 67, 54, 0.3)',
                                  color: 'white',
                                  border: '1px solid rgba(244, 67, 54, 0.5)',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '10px'
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de détails d'enregistrement */}
      {showRecordingDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10001
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 50, 100, 0.95)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: '0', fontSize: '20px' }}>📊 Détails de l'Enregistrement</h2>
              <button
                onClick={() => setShowRecordingDetails(null)}
                style={{
                  backgroundColor: 'rgba(158, 158, 158, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(158, 158, 158, 0.5)',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Informations générales */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📋 Informations Générales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <strong>📝 Nom:</strong><br />
                  <span style={{ opacity: '0.8' }}>{showRecordingDetails.name}</span>
                </div>
                <div>
                  <strong>📅 Date de début:</strong><br />
                  <span style={{ opacity: '0.8' }}>{showRecordingDetails.startTime.toLocaleString()}</span>
                </div>
                <div>
                  <strong>📅 Date de fin:</strong><br />
                  <span style={{ opacity: '0.8' }}>
                    {showRecordingDetails.endTime ? showRecordingDetails.endTime.toLocaleString() : 'En cours'}
                  </span>
                </div>
                <div>
                  <strong>⏱️ Durée:</strong><br />
                  <span style={{ opacity: '0.8' }}>{formatDuration(showRecordingDetails.duration)}</span>
                </div>
                <div>
                  <strong>🎯 Qualité:</strong><br />
                  <span style={{ opacity: '0.8' }}>
                    {showRecordingDetails.quality === 'high' ? 'Haute (2s)' :
                     showRecordingDetails.quality === 'medium' ? 'Moyenne (5s)' : 'Basse (10s)'}
                  </span>
                </div>
                <div>
                  <strong>📊 Points de données:</strong><br />
                  <span style={{ opacity: '0.8' }}>{showRecordingDetails.data ? showRecordingDetails.data.length : 0}</span>
                </div>
              </div>

              {showRecordingDetails.notes && (
                <div style={{ marginTop: '15px' }}>
                  <strong>💭 Notes:</strong><br />
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginTop: '5px',
                    fontStyle: 'italic',
                    opacity: '0.8'
                  }}>
                    "{showRecordingDetails.notes}"
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques détaillées */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📈 Statistiques Détaillées</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(244, 67, 54, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
                    {showRecordingDetails.stats.avgHeartRate}
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>FC Moyenne (bpm)</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(76, 175, 80, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                    {showRecordingDetails.stats.minHeartRate}
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>FC Minimale (bpm)</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(255, 152, 0, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                    {showRecordingDetails.stats.maxHeartRate}
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>FC Maximale (bpm)</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(33, 150, 243, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                    {showRecordingDetails.stats.avgTemperature}°C
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>Température Moyenne</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(156, 39, 176, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
                    {showRecordingDetails.stats.anomalies}
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>Anomalies Détectées</div>
                </div>
                <div style={{ textAlign: 'center', backgroundColor: 'rgba(96, 125, 139, 0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#607d8b' }}>
                    {showRecordingDetails.stats.maxHeartRate - showRecordingDetails.stats.minHeartRate}
                  </div>
                  <div style={{ fontSize: '12px', opacity: '0.8' }}>Variabilité FC (bpm)</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => exportRecording(showRecordingDetails, 'excel')}
                style={{
                  backgroundColor: 'rgba(76, 175, 80, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(76, 175, 80, 0.5)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📊 Exporter Excel
              </button>
              <button
                onClick={() => exportRecording(showRecordingDetails, 'json')}
                style={{
                  backgroundColor: 'rgba(33, 150, 243, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(33, 150, 243, 0.5)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                💾 Exporter JSON
              </button>
              <button
                onClick={() => {
                  deleteRecording(showRecordingDetails.id);
                  setShowRecordingDetails(null);
                }}
                style={{
                  backgroundColor: 'rgba(244, 67, 54, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(244, 67, 54, 0.5)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosticPage = () => {
  const [ecgImage, setEcgImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedModel, setSelectedModel] = useState('ResNet18');
  const [patientData, setPatientData] = useState({
    age: '',
    trestbps: '',
    chol: '',
    thalach: '',
    oldpeak: '',
    ca: '',
    slope: '1',
    restecg: '0',
    cp: '0',
    thal: '3'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Modèles d'IA disponibles
  const availableModels = {
    'ResNet18': {
      name: 'ResNet18',
      description: 'Réseau résiduel léger, rapide et efficace',
      accuracy: '92.3%',
      speed: 'Très rapide',
      status: 'Disponible',
      icon: '🚀',
      color: '#4caf50'
    },
    'ResNet50': {
      name: 'ResNet50',
      description: 'Réseau résiduel profond, haute précision',
      accuracy: '94.7%',
      speed: 'Rapide',
      status: 'Intégration prochaine',
      icon: '🎯',
      color: '#ff9800'
    },
    'DenseNet121': {
      name: 'DenseNet121',
      description: 'Réseau dense, excellent pour les détails fins',
      accuracy: '93.8%',
      speed: 'Moyen',
      status: 'Intégration prochaine',
      icon: '🔬',
      color: '#ff9800'
    },
    'EfficientNet': {
      name: 'EfficientNet',
      description: 'Optimisé efficacité/performance',
      accuracy: '95.2%',
      speed: 'Rapide',
      status: 'Intégration prochaine',
      icon: '⚡',
      color: '#ff9800'
    },
    'ViT': {
      name: 'Vision Transformer',
      description: 'Transformer pour analyse d\'images médicales',
      accuracy: '96.1%',
      speed: 'Moyen',
      status: 'Intégration prochaine',
      icon: '🧠',
      color: '#ff9800'
    }
  };
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Upload, 2: Data, 3: Results

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEcgImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setStep(2);
    }
  };

  const handleInputChange = (field, value) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  // Fonction d'export PDF professionnel
  const exportToPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // Créer le contenu HTML pour le PDF
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #4169e1;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              color: #4169e1;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              color: #333;
              margin: 0;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
              margin: 5px 0 0 0;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border-left: 4px solid #4169e1;
              background-color: #f8f9fa;
            }
            .section-title {
              font-size: 18px;
              color: #4169e1;
              margin: 0 0 15px 0;
              font-weight: bold;
            }
            .result-box {
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              border: 2px solid;
            }
            .risk-high {
              background-color: #ffebee;
              border-color: #f44336;
              color: #c62828;
            }
            .risk-low {
              background-color: #e8f5e8;
              border-color: #4caf50;
              color: #2e7d32;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 15px 0;
            }
            .info-item {
              padding: 10px;
              background-color: white;
              border-radius: 5px;
              border: 1px solid #ddd;
            }
            .info-label {
              font-weight: bold;
              color: #4169e1;
              font-size: 12px;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 16px;
              margin-top: 5px;
            }
            .recommendations {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
            }
            .recommendation-item {
              margin: 8px 0;
              padding-left: 20px;
              position: relative;
            }
            .recommendation-item:before {
              content: "•";
              color: #4169e1;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .factors {
              background-color: #e3f2fd;
              border: 1px solid #bbdefb;
              border-radius: 5px;
              padding: 15px;
            }
            .factor-item {
              display: inline-block;
              background-color: #4169e1;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              margin: 3px;
              font-size: 12px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .model-info {
              background-color: #e8f4fd;
              border: 1px solid #4169e1;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
            }
            .confidence-bar {
              background-color: #e0e0e0;
              border-radius: 10px;
              height: 20px;
              margin: 10px 0;
              overflow: hidden;
            }
            .confidence-fill {
              height: 100%;
              background: linear-gradient(90deg, #4caf50, #8bc34a);
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">❤️ CardioAI Pro</div>
            <h1 class="title">Rapport de Diagnostic Cardiaque</h1>
            <p class="subtitle">Analyse par Intelligence Artificielle • ${new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>

          <div class="section">
            <h2 class="section-title">🧠 Modèle d'Intelligence Artificielle</h2>
            <div class="model-info">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Modèle utilisé</div>
                  <div class="info-value">${results.modelInfo?.name || results.model}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Précision du modèle</div>
                  <div class="info-value">${results.modelInfo?.accuracy}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Vitesse d'analyse</div>
                  <div class="info-value">${results.modelInfo?.speed}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Statut</div>
                  <div class="info-value">${results.modelInfo?.status}</div>
                </div>
              </div>
              <p><strong>Description:</strong> ${results.modelInfo?.description}</p>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">👤 Données Patient</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Âge</div>
                <div class="info-value">${patientData.age} ans</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tension artérielle au repos</div>
                <div class="info-value">${patientData.trestbps} mmHg</div>
              </div>
              <div class="info-item">
                <div class="info-label">Cholestérol</div>
                <div class="info-value">${patientData.chol} mg/dl</div>
              </div>
              <div class="info-item">
                <div class="info-label">Fréquence cardiaque maximale</div>
                <div class="info-value">${patientData.thalach} bpm</div>
              </div>
              <div class="info-item">
                <div class="info-label">Dépression du segment ST</div>
                <div class="info-value">${patientData.oldpeak}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nombre de vaisseaux principaux</div>
                <div class="info-value">${patientData.ca}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">📊 Résultats de l'Analyse</h2>
            <div class="result-box ${results.prediction === 1 ? 'risk-high' : 'risk-low'}">
              <div style="font-size: 48px; margin-bottom: 10px;">
                ${results.prediction === 1 ? '⚠️' : '✅'}
              </div>
              <h3 style="margin: 0 0 10px 0; font-size: 24px;">
                ${results.prediction === 1 ? 'RISQUE CARDIAQUE DÉTECTÉ' : 'AUCUN RISQUE MAJEUR DÉTECTÉ'}
              </h3>
              <p style="margin: 0; font-size: 18px;">
                Niveau de risque: <strong>${results.riskLevel}</strong>
              </p>
            </div>

            <div style="margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0;">Niveau de confiance de l'analyse</h4>
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${Math.round(results.confidence * 100)}%;">
                  ${Math.round(results.confidence * 100)}%
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">🔍 Facteurs de Risque Identifiés</h2>
            <div class="factors">
              ${results.factors?.map(factor => `<span class="factor-item">${factor}</span>`).join('') || '<span class="factor-item">Aucun facteur de risque majeur</span>'}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">💡 Recommandations Médicales</h2>
            <div class="recommendations">
              ${results.recommendations?.map(rec => `<div class="recommendation-item">${rec}</div>`).join('') || ''}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">🔬 Détails Techniques</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Algorithme</div>
                <div class="info-value">${results.model}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Confiance</div>
                <div class="info-value">${Math.round(results.confidence * 100)}%</div>
              </div>
              <div class="info-item">
                <div class="info-label">Facteurs analysés</div>
                <div class="info-value">${results.factors?.length || 0}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Timestamp</div>
                <div class="info-value">${new Date().toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p><strong>CardioAI Pro</strong> - Système de diagnostic cardiaque par intelligence artificielle</p>
            <p>Ce rapport est généré automatiquement et ne remplace pas un avis médical professionnel.</p>
            <p>En cas de symptômes ou de préoccupations, consultez immédiatement un professionnel de santé.</p>
            <p>Rapport généré le ${new Date().toLocaleString('fr-FR')} • Version 2.1.0</p>
          </div>
        </body>
        </html>
      `;

      // Créer un iframe invisible pour le rendu
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      document.body.appendChild(iframe);

      // Écrire le contenu dans l'iframe
      iframe.contentDocument.open();
      iframe.contentDocument.write(pdfContent);
      iframe.contentDocument.close();

      // Attendre que le contenu soit chargé
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Imprimer en PDF
      iframe.contentWindow.print();

      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);

    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulation de l'analyse IA avec modèle sélectionné
      const modelInfo = availableModels[selectedModel];
      const analysisTime = selectedModel === 'ResNet18' ? 2000 :
                          selectedModel === 'ViT' ? 4000 : 3000;

      await new Promise(resolve => setTimeout(resolve, analysisTime));

      // Résultats simulés basés sur les données et le modèle
      const age = parseInt(patientData.age);
      const trestbps = parseInt(patientData.trestbps);
      const chol = parseInt(patientData.chol);
      const thalach = parseInt(patientData.thalach);
      const oldpeak = parseFloat(patientData.oldpeak);
      const ca = parseInt(patientData.ca);

      let riskScore = 0;

      // Scoring de base
      if (age > 60) riskScore += 0.2;
      if (trestbps > 140) riskScore += 0.15;
      if (chol > 240) riskScore += 0.1;
      if (thalach < 120) riskScore += 0.1;
      if (oldpeak > 2) riskScore += 0.15;
      if (ca > 0) riskScore += 0.2;

      // Ajustement selon le modèle sélectionné
      let modelAccuracyBonus = 1;
      switch (selectedModel) {
        case 'ResNet18':
          modelAccuracyBonus = 0.92;
          break;
        case 'ResNet50':
          modelAccuracyBonus = 0.95;
          riskScore += Math.random() > 0.7 ? 0.05 : 0; // Meilleure détection
          break;
        case 'DenseNet121':
          modelAccuracyBonus = 0.94;
          riskScore += Math.random() > 0.8 ? 0.05 : 0; // Bon pour les détails
          break;
        case 'EfficientNet':
          modelAccuracyBonus = 0.95;
          riskScore += Math.random() > 0.75 ? 0.05 : 0; // Équilibré
          break;
        case 'ViT':
          modelAccuracyBonus = 0.96;
          riskScore += Math.random() > 0.6 ? 0.05 : 0; // Très précis
          break;
      }

      riskScore += Math.random() * 0.2;
      const prediction = riskScore > 0.5 ? 1 : 0;
      const baseConfidence = 0.75 + Math.random() * 0.15;
      const confidence = Math.min(0.99, baseConfidence * modelAccuracyBonus);

      const result = {
        prediction,
        confidence,
        model: selectedModel,
        modelInfo: modelInfo,
        riskLevel: prediction === 1 ? 'Élevé' : 'Faible',
        recommendations: prediction === 1 ? [
          'Consulter un cardiologue rapidement',
          'Éviter les efforts physiques intenses',
          'Surveiller la tension artérielle',
          'Adopter un régime alimentaire sain'
        ] : [
          'Maintenir un mode de vie sain',
          'Exercice physique régulier',
          'Contrôles médicaux de routine',
          'Alimentation équilibrée'
        ],
        factors: [
          ...(age > 60 ? ['Âge avancé'] : []),
          ...(trestbps > 140 ? ['Hypertension'] : []),
          ...(chol > 240 ? ['Cholestérol élevé'] : []),
          ...(thalach < 120 ? ['Fréquence cardiaque basse'] : []),
          ...(oldpeak > 2 ? ['Dépression ST élevée'] : []),
          ...(ca > 0 ? ['Vaisseaux obstrués'] : [])
        ]
      };

      if (result.factors.length === 0) {
        result.factors = ['Aucun facteur de risque majeur détecté'];
      }

      setResults(result);
      setStep(3);

      // Créer notification pour le diagnostic
      notificationService.createDiagnosticAlert(result);
    } catch (err) {
      setError('Erreur lors de l\'analyse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca'];
    return requiredFields.every(field => patientData[field] !== '') && ecgImage;
  };

  const resetAnalysis = () => {
    setStep(1);
    setEcgImage(null);
    setImagePreview('');
    setResults(null);
    setError('');
    setPatientData({
      age: '', trestbps: '', chol: '', thalach: '', oldpeak: '', ca: '',
      slope: '1', restecg: '0', cp: '0', thal: '3'
    });
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      color: 'white',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* En-tête */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>🧠 Diagnostic IA</h1>
        <p style={{ fontSize: '16px', margin: '0', opacity: '0.9' }}>
          Analyse cardiaque par intelligence artificielle - Modèle XResNet
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        {[1, 2, 3].map(stepNum => (
          <div key={stepNum} style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step >= stepNum ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: step === stepNum ? '2px solid white' : '1px solid rgba(255,255,255,0.3)'
          }}>
            {stepNum}
          </div>
        ))}
      </div>

      {/* Sélecteur de modèle IA */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: '20px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', textAlign: 'center' }}>
          🧠 Sélection du Modèle d'Intelligence Artificielle
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '15px'
        }}>
          {Object.entries(availableModels).map(([modelKey, model]) => (
            <div
              key={modelKey}
              onClick={() => model.status === 'Disponible' ? setSelectedModel(modelKey) : null}
              style={{
                backgroundColor: selectedModel === modelKey
                  ? 'rgba(76, 175, 80, 0.3)'
                  : model.status === 'Disponible'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(158, 158, 158, 0.1)',
                border: `2px solid ${selectedModel === modelKey ? '#4caf50' : model.color}`,
                padding: '15px',
                borderRadius: '10px',
                cursor: model.status === 'Disponible' ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: model.status === 'Disponible' ? 1 : 0.6,
                position: 'relative'
              }}
            >
              {/* Badge de statut */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: model.status === 'Disponible' ? '#4caf50' : '#ff9800',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '9px',
                fontWeight: 'bold'
              }}>
                {model.status === 'Disponible' ? '✓' : '⏳'}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {model.icon}
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                  {model.name}
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', opacity: '0.8', lineHeight: '1.3' }}>
                  {model.description}
                </p>

                <div style={{ fontSize: '10px', opacity: '0.9' }}>
                  <div style={{ marginBottom: '3px' }}>
                    <strong>Précision:</strong> {model.accuracy}
                  </div>
                  <div style={{ marginBottom: '3px' }}>
                    <strong>Vitesse:</strong> {model.speed}
                  </div>
                  <div style={{
                    color: model.status === 'Disponible' ? '#4caf50' : '#ff9800',
                    fontWeight: 'bold'
                  }}>
                    {model.status}
                  </div>
                </div>
              </div>

              {selectedModel === modelKey && (
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  border: '2px solid #4caf50',
                  borderRadius: '12px',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          border: '1px solid rgba(33, 150, 243, 0.5)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          <strong>Modèle sélectionné:</strong> {availableModels[selectedModel].name}
          ({availableModels[selectedModel].accuracy} de précision)
          {availableModels[selectedModel].status !== 'Disponible' && (
            <div style={{ marginTop: '5px', color: '#ff9800' }}>
              ⚠️ Ce modèle sera disponible dans une prochaine mise à jour
            </div>
          )}
        </div>
      </div>

      {/* Étape 1: Upload ECG */}
      {step === 1 && (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '50px',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>📁</div>
            <h2 style={{ margin: '0 0 20px 0' }}>Télécharger votre ECG</h2>
            <p style={{ margin: '0 0 30px 0', opacity: '0.9' }}>
              Sélectionnez une image ECG pour commencer l'analyse
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="ecg-upload"
            />
            <label htmlFor="ecg-upload" style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)',
              display: 'inline-block'
            }}>
              📁 Choisir un fichier ECG
            </label>
          </div>
        </div>
      )}

      {/* Étape 2: Données cliniques */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
          {/* Aperçu ECG */}
          <div style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>📊 ECG Téléchargé</h3>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="ECG Preview"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              />
            )}
            <button
              onClick={() => setStep(1)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              🔄 Changer d'image
            </button>
          </div>

          {/* Formulaire données cliniques */}
          <div style={{
            flex: 2,
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>📋 Données Cliniques</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Âge
                </label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Ex: 45"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Tension (mmHg)
                </label>
                <input
                  type="number"
                  value={patientData.trestbps}
                  onChange={(e) => handleInputChange('trestbps', e.target.value)}
                  placeholder="Ex: 120"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Cholestérol (mg/dl)
                </label>
                <input
                  type="number"
                  value={patientData.chol}
                  onChange={(e) => handleInputChange('chol', e.target.value)}
                  placeholder="Ex: 200"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Fréq. cardiaque max
                </label>
                <input
                  type="number"
                  value={patientData.thalach}
                  onChange={(e) => handleInputChange('thalach', e.target.value)}
                  placeholder="Ex: 150"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Dépression ST
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={patientData.oldpeak}
                  onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                  placeholder="Ex: 1.0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Nb vaisseaux
                </label>
                <input
                  type="number"
                  value={patientData.ca}
                  onChange={(e) => handleInputChange('ca', e.target.value)}
                  placeholder="Ex: 0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleAnalyze}
                disabled={!isFormValid() || loading}
                style={{
                  backgroundColor: isFormValid() ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  cursor: isFormValid() ? 'pointer' : 'not-allowed',
                  backdropFilter: 'blur(5px)',
                  fontWeight: 'bold'
                }}
              >
                {loading ? '🔄 Analyse en cours...' : '🧠 Lancer l\'analyse IA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Étape 3: Résultats */}
      {step === 3 && results && (
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 20px 0' }}>📊 Résultats de l'Analyse</h2>

            {/* Informations du modèle utilisé */}
            <div style={{
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              border: '1px solid rgba(33, 150, 243, 0.5)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ fontSize: '32px' }}>
                {results.modelInfo?.icon || '🧠'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                  Modèle utilisé: {results.modelInfo?.name || results.model}
                </h4>
                <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
                  {results.modelInfo?.description} • Précision: {results.modelInfo?.accuracy}
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ✓ Analyse terminée
              </div>
            </div>

            {/* Résultat principal */}
            <div style={{
              backgroundColor: results.prediction === 1 ? 'rgba(255, 107, 53, 0.3)' : 'rgba(76, 175, 80, 0.3)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {results.prediction === 1 ? '⚠️' : '✅'}
              </div>
              <h3 style={{ margin: '0 0 10px 0' }}>
                {results.prediction === 1 ? 'Risque Détecté' : 'Pas de Risque Majeur'}
              </h3>
              <p style={{ margin: '0', fontSize: '18px' }}>
                Confiance: {Math.round(results.confidence * 100)}%
              </p>
            </div>

            {/* Recommandations */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>📋 Recommandations</h4>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {results.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Informations techniques */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🔬 Détails Techniques</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '12px' }}>
                <div>
                  <strong>Modèle:</strong><br />
                  <span style={{ opacity: '0.8' }}>{results.modelInfo?.name || results.model}</span>
                </div>
                <div>
                  <strong>Précision:</strong><br />
                  <span style={{ opacity: '0.8' }}>{results.modelInfo?.accuracy}</span>
                </div>
                <div>
                  <strong>Vitesse:</strong><br />
                  <span style={{ opacity: '0.8' }}>{results.modelInfo?.speed}</span>
                </div>
                <div>
                  <strong>Confiance:</strong><br />
                  <span style={{ opacity: '0.8' }}>{Math.round(results.confidence * 100)}%</span>
                </div>
                <div>
                  <strong>Facteurs analysés:</strong><br />
                  <span style={{ opacity: '0.8' }}>{results.factors?.length || 0}</span>
                </div>
                <div>
                  <strong>Timestamp:</strong><br />
                  <span style={{ opacity: '0.8' }}>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={resetAnalysis}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🔄 Nouvelle Analyse
              </button>
              <button
                onClick={() => {
                  const exportData = {
                    timestamp: new Date().toISOString(),
                    model: results.model,
                    modelInfo: results.modelInfo,
                    patient: patientData,
                    results: results,
                    ecgImage: ecgImage ? 'Image ECG incluse' : 'Aucune image'
                  };
                  const data = JSON.stringify(exportData, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `diagnostic-${results.model}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                style={{
                  backgroundColor: 'rgba(76, 175, 80, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(76, 175, 80, 0.5)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                💾 Exporter JSON
              </button>

              <button
                onClick={exportToPDF}
                disabled={isGeneratingPDF}
                style={{
                  backgroundColor: isGeneratingPDF ? 'rgba(158, 158, 158, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                  color: 'white',
                  border: `1px solid ${isGeneratingPDF ? 'rgba(158, 158, 158, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isGeneratingPDF ? 0.6 : 1
                }}
              >
                {isGeneratingPDF ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                    Génération PDF...
                  </>
                ) : (
                  <>
                    📄 Exporter PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(244, 67, 54, 0.3)',
          border: '1px solid rgba(244, 67, 54, 0.5)',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // États pour le système d'urgence
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  const [emergencySettings, setEmergencySettings] = useState({});
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '', isPrimary: false });

  const [settings, setSettings] = useState({
    alertSettings: {
      soundEnabled: true,
      visualAlerts: true,
      criticalOnly: false,
      emergencyCall: false,
      emergencyNumber: '15',
      contactName: 'SAMU'
    },
    sensors: {
      heartRate: { enabled: true },
      bloodPressure: { enabled: true },
      temperature: { enabled: true },
      oxygenSaturation: { enabled: true }
    },
    displaySettings: {
      darkMode: false,
      animations: true,
      compactMode: false,
      updateInterval: 1
    },
    thresholds: {
      heartRate: { min: 60, max: 100 },
      temperature: { min: 36.0, max: 38.0 },
      oxygenSaturation: { min: 95, max: 100 }
    }
  });

  // Charger les paramètres au démarrage
  React.useEffect(() => {
    const saved = localStorage.getItem('cardioai-settings');
    if (saved) {
      try {
        const savedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...savedSettings }));
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    }

    // Initialiser le service d'urgence
    const handleEmergencyUpdate = (data) => {
      setEmergencyContacts(data.contacts);
      setPatientInfo(data.patientInfo);
      setEmergencySettings(data.settings);
      setActiveEmergency(data.activeEmergency);
    };

    emergencyService.addListener(handleEmergencyUpdate);

    // Charger les données initiales
    setEmergencyContacts(emergencyService.getEmergencyContacts());
    setPatientInfo(emergencyService.getPatientInfo());
    setEmergencySettings(emergencyService.getEmergencySettings());
    setActiveEmergency(emergencyService.getActiveEmergency());

    return () => {
      emergencyService.removeListener(handleEmergencyUpdate);
    };
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSensorChange = (sensorId, enabled) => {
    setSettings(prev => ({
      ...prev,
      sensors: { ...prev.sensors, [sensorId]: { enabled } }
    }));
    setHasUnsavedChanges(true);
  };

  const handleThresholdChange = (sensor, threshold, value) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [sensor]: { ...prev.thresholds[sensor], [threshold]: value }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('cardioai-settings', JSON.stringify(settings));
      setHasUnsavedChanges(false);
      setNotification({ show: true, message: 'Paramètres sauvegardés !', type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    } catch (error) {
      setNotification({ show: true, message: 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('cardioai-settings');
    window.location.reload();
  };

  // Fonctions pour gérer les contacts d'urgence
  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone) {
      emergencyService.addEmergencyContact(newContact);
      setNewContact({ name: '', phone: '', relationship: '', isPrimary: false });
      setShowAddContact(false);
      setNotification({ show: true, message: 'Contact d\'urgence ajouté !', type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const removeEmergencyContact = (contactId) => {
    emergencyService.removeEmergencyContact(contactId);
    setNotification({ show: true, message: 'Contact supprimé', type: 'success' });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const updatePatientInfo = (field, value) => {
    const updatedInfo = { ...patientInfo, [field]: value };
    setPatientInfo(updatedInfo);
    emergencyService.updatePatientInfo(updatedInfo);
    setHasUnsavedChanges(true);
  };

  const updateEmergencySettings = (field, value) => {
    const updatedSettings = { ...emergencySettings, [field]: value };
    setEmergencySettings(updatedSettings);
    emergencyService.updateEmergencySettings(updatedSettings);
    setHasUnsavedChanges(true);
  };

  const testEmergencyCall = () => {
    emergencyService.triggerEmergency(['Test d\'urgence manuel'], {
      heartRate: { value: 180, status: 'critical' },
      timestamp: new Date()
    });
    setNotification({ show: true, message: 'Test d\'urgence déclenché !', type: 'warning' });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const tabs = [
    { id: 0, name: 'Alertes', icon: '🔔' },
    { id: 1, name: 'Notifications', icon: '📢' },
    { id: 2, name: 'Urgences', icon: '🚨' },
    { id: 3, name: 'Capteurs', icon: '📡' },
    { id: 4, name: 'Affichage', icon: '📊' },
    { id: 5, name: 'Seuils', icon: '⚖️' },
    { id: 6, name: 'Avancé', icon: '🔧' }
  ];

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
      color: 'white',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* En-tête */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>⚙️ Paramètres</h1>
        <p style={{ fontSize: '16px', margin: '0', opacity: '0.9' }}>
          Configuration de votre application CardioAI
        </p>
      </div>

      {/* Navigation par onglets */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            style={{
              backgroundColor: currentTab === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Notification */}
      {notification.show && (
        <div style={{
          backgroundColor: notification.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`,
          padding: '10px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      {/* Contenu des onglets */}
      <div style={{ flex: 1 }}>
        {/* Onglet Alertes */}
        {currentTab === 0 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>🔔 Configuration des Alertes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.alertSettings.soundEnabled}
                  onChange={(e) => handleSettingChange('alertSettings', 'soundEnabled', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Sons d'alerte activés</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.alertSettings.visualAlerts}
                  onChange={(e) => handleSettingChange('alertSettings', 'visualAlerts', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Alertes visuelles</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.alertSettings.criticalOnly}
                  onChange={(e) => handleSettingChange('alertSettings', 'criticalOnly', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Alertes critiques uniquement</span>
              </label>
            </div>
          </div>
        )}

        {/* Onglet Notifications */}
        {currentTab === 1 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>📢 Paramètres de Notifications</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Sons et vibrations */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🔊 Sons et Vibrations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => notificationService.updateSettings({ soundEnabled: e.target.checked })}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Sons de notification</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => notificationService.updateSettings({ vibrationEnabled: e.target.checked })}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Vibrations (mobile)</span>
                  </label>
                  <button style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(33, 150, 243, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}
                  onClick={() => notificationService.sounds.info()}
                  >
                    🔊 Tester le son
                  </button>
                </div>
              </div>

              {/* Notifications navigateur */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🌐 Notifications Navigateur</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => notificationService.updateSettings({ browserNotifications: e.target.checked })}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Notifications bureau</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => notificationService.updateSettings({ visualAlerts: e.target.checked })}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Alertes visuelles (flash)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => notificationService.updateSettings({ toastNotifications: e.target.checked })}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Notifications toast (haut de page)</span>
                  </label>
                </div>

                {/* Boutons de test */}
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🧪 Tests de Notifications</h4>

                {/* Informations sur les notifications automatiques */}
                <div style={{
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🔔 Notifications Automatiques</h5>
                  <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
                    Les notifications toast apparaissent automatiquement lors de l'enregistrement quand les valeurs sortent des seuils normaux.
                    Surveillez le panneau "Surveillance des Seuils" dans la page de monitoring pour voir le statut en temps réel.
                  </p>
                </div>


                  <p style={{ fontSize: '11px', opacity: '0.7', margin: '8px 0 0 0' }}>
                    Permission navigateur: {Notification?.permission || 'Non supporté'}
                  </p>
                  {Notification?.permission === 'default' && (
                    <button style={{
                      backgroundColor: 'rgba(255, 152, 0, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 152, 0, 0.5)',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    onClick={() => Notification.requestPermission()}
                    >
                      🔓 Autoriser notifications
                    </button>
                  )}
                </div>
              </div>

              {/* Test notifications */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🧪 Tests</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(33, 150, 243, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => notificationService.addNotification({
                    type: 'test',
                    severity: 'info',
                    title: '💡 Test Info',
                    message: 'Ceci est une notification de test de niveau info'
                  })}
                  >
                    ℹ️ Test Info
                  </button>
                  <button style={{
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 152, 0, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => notificationService.addNotification({
                    type: 'test',
                    severity: 'warning',
                    title: '⚠️ Test Avertissement',
                    message: 'Ceci est une notification de test de niveau avertissement'
                  })}
                  >
                    ⚠️ Test Warning
                  </button>
                  <button style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(244, 67, 54, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => notificationService.addNotification({
                    type: 'test',
                    severity: 'critical',
                    title: '🚨 Test Critique',
                    message: 'Ceci est une notification de test de niveau critique'
                  })}
                  >
                    🚨 Test Critical
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Urgences - Système Avancé */}
        {currentTab === 2 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0' }}>🚨 Système d'Urgence Avancé</h3>
              {activeEmergency && (
                <div style={{
                  backgroundColor: 'rgba(244, 67, 54, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  animation: 'pulse 1s infinite'
                }}>
                  🚨 URGENCE ACTIVE
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

              {/* Configuration générale */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>⚙️ Configuration</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={emergencySettings.autoCallEnabled || false}
                      onChange={(e) => updateEmergencySettings('autoCallEnabled', e.target.checked)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Appels automatiques activés</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={emergencySettings.locationSharingEnabled || false}
                      onChange={(e) => updateEmergencySettings('locationSharingEnabled', e.target.checked)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px' }}>Partage de localisation</span>
                  </label>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                      Délai avant appel: {emergencySettings.autoCallDelay || 30}s
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={emergencySettings.autoCallDelay || 30}
                      onChange={(e) => updateEmergencySettings('autoCallDelay', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(244, 67, 54, 0.5)',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '10px'
                  }}
                  onClick={testEmergencyCall}
                  >
                    🧪 Test d'urgence
                  </button>
                </div>
              </div>

              {/* Contacts d'urgence */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: '0', fontSize: '16px' }}>📞 Contacts d'Urgence</h4>
                  <button style={{
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(76, 175, 80, 0.5)',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                  onClick={() => setShowAddContact(!showAddContact)}
                  >
                    + Ajouter
                  </button>
                </div>

                {/* Liste des contacts */}
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                  {emergencyContacts.length === 0 ? (
                    <p style={{ fontSize: '12px', opacity: '0.7', textAlign: 'center', margin: '20px 0' }}>
                      Aucun contact d'urgence configuré
                    </p>
                  ) : (
                    emergencyContacts.map(contact => (
                      <div key={contact.id} style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                            {contact.isPrimary && '⭐ '}{contact.name}
                          </div>
                          <div style={{ fontSize: '11px', opacity: '0.8' }}>
                            {contact.phone} • {contact.relationship}
                          </div>
                        </div>
                        <button style={{
                          backgroundColor: 'rgba(244, 67, 54, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(244, 67, 54, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                        onClick={() => removeEmergencyContact(contact.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Formulaire d'ajout de contact */}
                {showAddContact && (
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Nom complet"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        style={{
                          padding: '6px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="Numéro de téléphone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        style={{
                          padding: '6px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      />
                      <select
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                        style={{
                          padding: '6px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        <option value="">Relation</option>
                        <option value="Conjoint(e)">Conjoint(e)</option>
                        <option value="Famille">Famille</option>
                        <option value="Ami(e)">Ami(e)</option>
                        <option value="Médecin">Médecin</option>
                        <option value="Voisin(e)">Voisin(e)</option>
                      </select>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newContact.isPrimary}
                          onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                          style={{ transform: 'scale(1.1)' }}
                        />
                        <span style={{ fontSize: '11px' }}>Contact principal</span>
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(76, 175, 80, 0.5)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          flex: 1
                        }}
                        onClick={addEmergencyContact}
                        >
                          ✅ Ajouter
                        </button>
                        <button style={{
                          backgroundColor: 'rgba(158, 158, 158, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(158, 158, 158, 0.5)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          flex: 1
                        }}
                        onClick={() => setShowAddContact(false)}
                        >
                          ❌ Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informations patient */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>👤 Informations Patient</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={patientInfo.name || ''}
                    onChange={(e) => updatePatientInfo('name', e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="Âge"
                      value={patientInfo.age || ''}
                      onChange={(e) => updatePatientInfo('age', e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '12px',
                        flex: 1
                      }}
                    />
                    <select
                      value={patientInfo.bloodType || ''}
                      onChange={(e) => updatePatientInfo('bloodType', e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '12px',
                        flex: 1
                      }}
                    >
                      <option value="">Groupe sanguin</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Allergies connues"
                    value={patientInfo.allergies || ''}
                    onChange={(e) => updatePatientInfo('allergies', e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '12px',
                      minHeight: '40px',
                      resize: 'vertical'
                    }}
                  />
                  <textarea
                    placeholder="Conditions médicales"
                    value={patientInfo.medicalConditions || ''}
                    onChange={(e) => updatePatientInfo('medicalConditions', e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '12px',
                      minHeight: '40px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Seuils d'urgence */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>⚠️ Seuils d'Urgence</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                      Rythme cardiaque critique: {emergencySettings.emergencyThresholds?.heartRateMin || 40} - {emergencySettings.emergencyThresholds?.heartRateMax || 150} bpm
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px' }}>Min</span>
                      <input
                        type="range"
                        min="30"
                        max="60"
                        value={emergencySettings.emergencyThresholds?.heartRateMin || 40}
                        onChange={(e) => updateEmergencySettings('emergencyThresholds', {
                          ...emergencySettings.emergencyThresholds,
                          heartRateMin: parseInt(e.target.value)
                        })}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '10px' }}>Max</span>
                      <input
                        type="range"
                        min="120"
                        max="200"
                        value={emergencySettings.emergencyThresholds?.heartRateMax || 150}
                        onChange={(e) => updateEmergencySettings('emergencyThresholds', {
                          ...emergencySettings.emergencyThresholds,
                          heartRateMax: parseInt(e.target.value)
                        })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>
                      Saturation O₂ critique: &lt; {emergencySettings.emergencyThresholds?.oxygenSaturationMin || 85}%
                    </label>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      value={emergencySettings.emergencyThresholds?.oxygenSaturationMin || 85}
                      onChange={(e) => updateEmergencySettings('emergencyThresholds', {
                        ...emergencySettings.emergencyThresholds,
                        oxygenSaturationMin: parseInt(e.target.value)
                      })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Urgence active */}
            {activeEmergency && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                border: '2px solid rgba(244, 67, 54, 0.5)',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '20px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🚨 Urgence en Cours</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>
                  <strong>Raisons:</strong> {activeEmergency.reasons?.join(', ')}
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>
                  <strong>Statut:</strong> {activeEmergency.status}
                </p>
                {activeEmergency.autoCallCountdown > 0 && (
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    Appel automatique dans: {activeEmergency.autoCallCountdown}s
                  </p>
                )}
                <button style={{
                  backgroundColor: 'rgba(158, 158, 158, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(158, 158, 158, 0.5)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                onClick={() => emergencyService.cancelEmergency()}
                >
                  🚫 Annuler l'urgence
                </button>
              </div>
            )}
          </div>
        )}

        {/* Onglet Capteurs */}
        {currentTab === 3 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>📡 Capteurs Médicaux</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {Object.entries(settings.sensors).map(([sensorId, sensor]) => {
                const sensorInfo = {
                  heartRate: { name: 'Rythme cardiaque', icon: '❤️' },
                  bloodPressure: { name: 'Tension artérielle', icon: '🩸' },
                  temperature: { name: 'Température', icon: '🌡️' },
                  oxygenSaturation: { name: 'Saturation O₂', icon: '🫁' }
                };
                const info = sensorInfo[sensorId];

                return (
                  <div key={sensorId} style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '15px',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{info.icon}</div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{info.name}</h4>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={sensor.enabled}
                        onChange={(e) => handleSensorChange(sensorId, e.target.checked)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontSize: '12px' }}>Activé</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Onglet Affichage */}
        {currentTab === 4 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>📊 Paramètres d'Affichage</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.displaySettings.darkMode}
                  onChange={(e) => handleSettingChange('displaySettings', 'darkMode', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Mode sombre</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.displaySettings.animations}
                  onChange={(e) => handleSettingChange('displaySettings', 'animations', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Animations</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.displaySettings.compactMode}
                  onChange={(e) => handleSettingChange('displaySettings', 'compactMode', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Mode compact</span>
              </label>

              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Intervalle de mise à jour: {settings.displaySettings.updateInterval}s
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={settings.displaySettings.updateInterval}
                  onChange={(e) => handleSettingChange('displaySettings', 'updateInterval', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Onglet Seuils */}
        {currentTab === 5 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>⚖️ Seuils d'Alerte</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Rythme cardiaque */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Rythme cardiaque: {settings.thresholds.heartRate.min} - {settings.thresholds.heartRate.max} bpm
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px' }}>Min</span>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={settings.thresholds.heartRate.min}
                    onChange={(e) => handleThresholdChange('heartRate', 'min', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '12px' }}>Max</span>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    value={settings.thresholds.heartRate.max}
                    onChange={(e) => handleThresholdChange('heartRate', 'max', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Température */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Température: {settings.thresholds.temperature.min} - {settings.thresholds.temperature.max} °C
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px' }}>Min</span>
                  <input
                    type="range"
                    min="35"
                    max="37"
                    step="0.1"
                    value={settings.thresholds.temperature.min}
                    onChange={(e) => handleThresholdChange('temperature', 'min', parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '12px' }}>Max</span>
                  <input
                    type="range"
                    min="37.5"
                    max="40"
                    step="0.1"
                    value={settings.thresholds.temperature.max}
                    onChange={(e) => handleThresholdChange('temperature', 'max', parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Saturation O2 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Saturation O₂: {settings.thresholds.oxygenSaturation.min} - {settings.thresholds.oxygenSaturation.max} %
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px' }}>Min</span>
                  <input
                    type="range"
                    min="90"
                    max="98"
                    value={settings.thresholds.oxygenSaturation.min}
                    onChange={(e) => handleThresholdChange('oxygenSaturation', 'min', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '12px' }}>Max</span>
                  <input
                    type="range"
                    min="98"
                    max="100"
                    value={settings.thresholds.oxygenSaturation.max}
                    onChange={(e) => handleThresholdChange('oxygenSaturation', 'max', parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Avancé */}
        {currentTab === 6 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>🔧 Paramètres Avancés</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Développeur */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>👨‍💻 Mode Développeur</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Mode debug activé</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Logs détaillés</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Télémétrie</span>
                  </label>
                  <button style={{
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 152, 0, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '10px'
                  }}>
                    📋 Copier logs système
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>⚡ Performance</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                      Qualité graphiques: Haute
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high" selected>Haute</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                      FPS limite: 60
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      defaultValue="60"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Optimisation batterie</span>
                  </label>
                </div>
              </div>

              {/* Sécurité */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🔒 Sécurité</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Chiffrement des données</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '14px' }}>Authentification 2FA</span>
                  </label>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                      Délai de verrouillage: 15 min
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      <option value="5">5 minutes</option>
                      <option value="15" selected>15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations système */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>ℹ️ Informations Système</h4>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  <p style={{ margin: '0 0 5px 0' }}>Version: CardioAI Pro v2.1.0</p>
                  <p style={{ margin: '0 0 5px 0' }}>Build: {Date.now().toString().slice(-6)}</p>
                  <p style={{ margin: '0 0 5px 0' }}>Navigateur: {navigator.userAgent.split(' ')[0]}</p>
                  <p style={{ margin: '0 0 5px 0' }}>Plateforme: {navigator.platform}</p>
                  <p style={{ margin: '0 0 10px 0' }}>Mémoire: ~{Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024 || 0)} MB</p>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button style={{
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(33, 150, 243, 0.5)',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}>
                      📋 Copier infos
                    </button>
                    <button style={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(76, 175, 80, 0.5)',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}>
                      🔄 Vérifier MAJ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          {hasUnsavedChanges ? (
            <span style={{
              backgroundColor: 'rgba(255, 193, 7, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              ⚠️ Modifications non sauvegardées
            </span>
          ) : (
            <span style={{
              backgroundColor: 'rgba(76, 175, 80, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              ✅ Tout est sauvegardé
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={resetSettings}
            style={{
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              color: 'white',
              border: '1px solid rgba(244, 67, 54, 0.5)',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🔄 Réinitialiser
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasUnsavedChanges || saving}
            style={{
              backgroundColor: hasUnsavedChanges ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(76, 175, 80, 0.5)',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  console.log('App component is rendering');
  const [currentPage, setCurrentPage] = useState('home');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentToast, setCurrentToast] = useState(null);

  // Injection des styles globaux
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Initialisation du service de notifications
  useEffect(() => {
    notificationService.loadSettings();

    const handleNotificationUpdate = (data) => {
      setUnreadNotifications(data.unreadCount);

      // Afficher le toast pour les nouvelles notifications si activé
      if (data.newNotification && notificationService.getSettings().toastNotifications !== false) {
        setCurrentToast(data.newNotification);
      }
    };

    notificationService.addListener(handleNotificationUpdate);
    setUnreadNotifications(notificationService.getUnreadCount());

    // Notification de bienvenue
    setTimeout(() => {
      notificationService.addNotification({
        type: 'system',
        severity: 'info',
        title: '🎉 Bienvenue sur CardioAI Pro',
        message: 'Application de monitoring cardiaque et diagnostic IA initialisée avec succès'
      });
    }, 2000);

    return () => {
      notificationService.removeListener(handleNotificationUpdate);
    };
  }, []);



  const renderPage = () => {
    switch(currentPage) {
      case 'monitoring': return <MonitoringPage />;
      case 'diagnostic': return <DiagnosticPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      margin: '0',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#4169e1',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>❤️ CardioAI Pro</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              backgroundColor: currentPage === 'home' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🏠 Accueil
          </button>
          <button
            onClick={() => setCurrentPage('monitoring')}
            style={{
              backgroundColor: currentPage === 'monitoring' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📊 Monitoring
          </button>
          <button
            onClick={() => setCurrentPage('diagnostic')}
            style={{
              backgroundColor: currentPage === 'diagnostic' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🧠 Diagnostic
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            style={{
              backgroundColor: currentPage === 'settings' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ⚙️ Paramètres
          </button>

          {/* Bouton notifications */}
          <button
            onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
            style={{
              backgroundColor: notificationCenterOpen ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            🔔
            {unreadNotifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#ff4757',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                animation: unreadNotifications > 0 ? 'pulse 2s infinite' : 'none'
              }}>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </nav>



      {/* Contenu de la page */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f0f8ff',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '15px 30px',
        flexShrink: 0,
        borderTop: '1px solid #555',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <p style={{ margin: '0' }}>
          © 2024 CardioAI Pro - Application de diagnostic cardiaque par IA
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: '0.7' }}>
          Dernière mise à jour: {new Date().toLocaleString()}
        </p>
      </footer>

      {/* Centre de notifications */}
      <NotificationCenter
        notificationService={notificationService}
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* Toast notifications en haut de page */}
      <ToastNotification
        notification={currentToast}
        onClose={() => setCurrentToast(null)}
      />






    </div>
  );
}

export default App;
