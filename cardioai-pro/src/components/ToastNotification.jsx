import React, { useState, useEffect } from 'react';

const ToastNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Déterminer la sévérité à utiliser pour le style
  const getEffectiveSeverity = (notification) => {
    if (!notification) return 'info';

    // Si c'est une notification de capteur, mapper vers les bonnes sévérités
    if (notification.type === 'sensor' && notification.sensorType) {
      const sensorTypeMap = {
        'heartRate': 'heartRate',
        'temperature': 'temperature',
        'oxygenSaturation': 'oxygenSaturation',
        'bloodPressure': 'bloodPressure'
      };
      return sensorTypeMap[notification.sensorType] || 'warning';
    }

    // Sinon utiliser la sévérité normale
    return notification.severity || 'info';
  };

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setProgress(100);

      // Durée variable selon la sévérité effective
      const duration = getDurationBySeverity(getEffectiveSeverity(notification));

      // Animation de la barre de progression
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      // Disparition automatique
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    } else {
      setIsVisible(false);
    }
  }, [notification, onClose]);

  const getDurationBySeverity = (severity) => {
    const durations = {
      info: 3000,      // 3 secondes
      success: 2500,   // 2.5 secondes
      warning: 4000,   // 4 secondes
      critical: 6000,  // 6 secondes (plus long pour les alertes critiques)
      heartRate: 5000,
      temperature: 4500,
      oxygenSaturation: 5500,
      bloodPressure: 5000,
      connection: 3500,
      system: 3000
    };
    return durations[severity] || 3000;
  };

  const getIconAnimation = (severity) => {
    const animations = {
      info: 'none',
      success: 'bounce 0.6s ease-out',
      warning: 'shake 0.5s ease-in-out',
      critical: 'pulse 1s infinite',
      heartRate: 'heartbeat 1.2s infinite',
      temperature: 'temperatureFlash 2s infinite',
      oxygenSaturation: 'breathe 3s infinite',
      bloodPressure: 'pressurePulse 1.5s infinite',
      connection: 'connectionBlink 2s infinite',
      system: 'systemRotate 4s infinite linear'
    };
    return animations[severity] || 'none';
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      info: 'INFO',
      success: 'SUCCÈS',
      warning: 'ATTENTION',
      critical: 'CRITIQUE',
      heartRate: 'CARDIAQUE',
      temperature: 'THERMIQUE',
      oxygenSaturation: 'OXYGÈNE',
      bloodPressure: 'TENSION',
      connection: 'CONNEXION',
      system: 'SYSTÈME'
    };
    return labels[severity] || 'INFO';
  };

  // Si pas de notification, ne rien afficher
  if (!notification) {
    return null;
  }





  const getSeverityConfig = (severity) => {
    const configs = {
      info: {
        backgroundColor: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(30, 136, 229, 0.95))',
        borderColor: '#2196f3',
        icon: '💡',
        textColor: '#ffffff',
        shadowColor: 'rgba(33, 150, 243, 0.4)',
        animation: 'slideInFromTop',
        progressColor: '#64b5f6'
      },
      success: {
        backgroundColor: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(67, 160, 71, 0.95))',
        borderColor: '#4caf50',
        icon: '✅',
        textColor: '#ffffff',
        shadowColor: 'rgba(76, 175, 80, 0.4)',
        animation: 'bounceIn',
        progressColor: '#81c784'
      },
      warning: {
        backgroundColor: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(251, 140, 0, 0.95))',
        borderColor: '#ff9800',
        icon: '⚠️',
        textColor: '#ffffff',
        shadowColor: 'rgba(255, 152, 0, 0.4)',
        animation: 'shake',
        progressColor: '#ffb74d'
      },
      critical: {
        backgroundColor: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(229, 57, 53, 0.95))',
        borderColor: '#f44336',
        icon: '🚨',
        textColor: '#ffffff',
        shadowColor: 'rgba(244, 67, 54, 0.6)',
        animation: 'criticalPulse',
        progressColor: '#e57373'
      },
      // Types spécifiques pour les alertes médicales
      heartRate: {
        backgroundColor: 'linear-gradient(135deg, rgba(233, 30, 99, 0.95), rgba(216, 27, 96, 0.95))',
        borderColor: '#e91e63',
        icon: '❤️',
        textColor: '#ffffff',
        shadowColor: 'rgba(233, 30, 99, 0.5)',
        animation: 'heartbeat',
        progressColor: '#f06292'
      },
      temperature: {
        backgroundColor: 'linear-gradient(135deg, rgba(255, 87, 34, 0.95), rgba(244, 81, 30, 0.95))',
        borderColor: '#ff5722',
        icon: '🌡️',
        textColor: '#ffffff',
        shadowColor: 'rgba(255, 87, 34, 0.5)',
        animation: 'temperatureFlash',
        progressColor: '#ff8a65'
      },
      oxygenSaturation: {
        backgroundColor: 'linear-gradient(135deg, rgba(103, 58, 183, 0.95), rgba(94, 53, 177, 0.95))',
        borderColor: '#673ab7',
        icon: '🫁',
        textColor: '#ffffff',
        shadowColor: 'rgba(103, 58, 183, 0.5)',
        animation: 'breathe',
        progressColor: '#9575cd'
      },
      bloodPressure: {
        backgroundColor: 'linear-gradient(135deg, rgba(121, 85, 72, 0.95), rgba(109, 76, 65, 0.95))',
        borderColor: '#795548',
        icon: '🩸',
        textColor: '#ffffff',
        shadowColor: 'rgba(121, 85, 72, 0.5)',
        animation: 'pressurePulse',
        progressColor: '#a1887f'
      },
      connection: {
        backgroundColor: 'linear-gradient(135deg, rgba(96, 125, 139, 0.95), rgba(84, 110, 122, 0.95))',
        borderColor: '#607d8b',
        icon: '📡',
        textColor: '#ffffff',
        shadowColor: 'rgba(96, 125, 139, 0.5)',
        animation: 'connectionBlink',
        progressColor: '#90a4ae'
      },
      system: {
        backgroundColor: 'linear-gradient(135deg, rgba(158, 158, 158, 0.95), rgba(117, 117, 117, 0.95))',
        borderColor: '#9e9e9e',
        icon: '⚙️',
        textColor: '#ffffff',
        shadowColor: 'rgba(158, 158, 158, 0.4)',
        animation: 'systemRotate',
        progressColor: '#bdbdbd'
      }
    };

    // Retourner la config ou une config par défaut
    const config = configs[severity];
    if (!config) {
      console.warn('⚠️ Configuration non trouvée pour severity:', severity, 'utilisation de info par défaut');
      return configs.info;
    }
    return config;
  };

  const effectiveSeverity = getEffectiveSeverity(notification);
  const config = getSeverityConfig(effectiveSeverity);



  return (
    <div
      style={{
        position: 'fixed',
        top: isVisible ? '20px' : '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: config.backgroundColor,
        color: config.textColor,
        padding: '18px 28px',
        borderRadius: '16px',
        border: `3px solid ${config.borderColor}`,
        backdropFilter: 'blur(15px)',
        boxShadow: `0 12px 40px ${config.shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.15)`,
        minWidth: '320px',
        maxWidth: '650px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        animation: isVisible ? `${config.animation} 0.6s ease-out` : 'none',
        overflow: 'hidden'
      }}
      onClick={() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }}
    >
      {/* Effet de brillance pour les alertes critiques */}
      {effectiveSeverity === 'critical' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shine 2s infinite'
        }} />
      )}

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '32px',
          animation: getIconAnimation(effectiveSeverity),
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          {config.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '18px',
            marginBottom: '6px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            {notification.title || 'Notification'}
          </div>
          <div style={{
            fontSize: '15px',
            opacity: '0.95',
            lineHeight: '1.5',
            marginBottom: '8px'
          }}>
            {notification.message || 'Message de notification'}
          </div>

          {/* Informations supplémentaires pour les alertes médicales */}
          {(notification.value || notification.threshold) && (
            <div style={{
              fontSize: '13px',
              opacity: '0.85',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '6px 10px',
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              {notification.value && (
                <span>📊 Valeur: <strong>{notification.value}</strong></span>
              )}
              {notification.threshold && (
                <span style={{ marginLeft: '10px' }}>
                  🎯 Seuil: <strong>{notification.threshold.min}-{notification.threshold.max}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{
          fontSize: '11px',
          opacity: '0.8',
          textAlign: 'right',
          minWidth: '80px'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            {new Date().toLocaleTimeString()}
          </div>
          <div style={{
            marginTop: '4px',
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {getSeverityLabel(effectiveSeverity)}
          </div>
          <div style={{ marginTop: '6px', fontSize: '9px', opacity: '0.7' }}>
            Cliquer pour fermer
          </div>
        </div>
      </div>

      {/* Barre de progression personnalisée */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '0 0 13px 13px',
        overflow: 'hidden',
        width: '100%'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: config.progressColor,
          width: `${progress}%`,
          transition: 'width 0.1s linear',
          borderRadius: '0 0 13px 13px',
          boxShadow: `0 0 10px ${config.progressColor}`
        }} />
      </div>


    </div>
  );
};

export default ToastNotification;
