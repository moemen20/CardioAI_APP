import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  console.log('Home component is rendering');
  
  const styles = {
    container: {
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      backgroundColor: '#3f51b5',
      color: 'white',
      padding: '40px',
      borderRadius: '10px',
      marginBottom: '40px'
    },
    title: {
      fontSize: '48px',
      margin: '0 0 20px 0',
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: '24px',
      margin: '0 0 20px 0',
      opacity: '0.9'
    },
    description: {
      fontSize: '18px',
      opacity: '0.8',
      maxWidth: '600px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '40px'
    },
    card: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    },
    cardTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333'
    },
    cardDescription: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '25px',
      lineHeight: '1.5'
    },
    button: {
      backgroundColor: '#3f51b5',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'background-color 0.2s'
    },
    icon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    footer: {
      textAlign: 'center',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.header}>
        <div style={styles.icon}>❤️</div>
        <h1 style={styles.title}>CardioAI</h1>
        <h2 style={styles.subtitle}>Intelligence Artificielle pour le Diagnostic Cardiaque</h2>
        <p style={styles.description}>
          Analysez vos données cardiaques en temps réel avec notre système de monitoring IoT 
          et obtenez un diagnostic précis grâce à notre modèle d'IA avancé.
        </p>
      </div>

      {/* Navigation principale */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon}>📊</div>
          <h3 style={styles.cardTitle}>Monitoring IoT</h3>
          <p style={styles.cardDescription}>
            Surveillez vos paramètres cardiaques en temps réel avec nos capteurs connectés.
            Interface moderne avec graphiques interactifs et alertes intelligentes.
          </p>
          <Link 
            to="/iot-monitoring" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#303f9f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3f51b5'}
          >
            Accéder au Monitoring
          </Link>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🧠</div>
          <h3 style={styles.cardTitle}>Diagnostic IA</h3>
          <p style={styles.cardDescription}>
            Analysez vos ECG et données cliniques avec notre modèle XResNet.
            Diagnostic précis et rapide basé sur l'intelligence artificielle.
          </p>
          <Link 
            to="/mode-selection" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#303f9f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3f51b5'}
          >
            Commencer le Diagnostic
          </Link>
        </div>
      </div>

      {/* Section Paramètres */}
      <div style={styles.footer}>
        <div style={styles.icon}>⚙️</div>
        <h3 style={styles.cardTitle}>Configuration</h3>
        <p style={styles.cardDescription}>
          Personnalisez votre expérience avec nos paramètres avancés
        </p>
        <Link 
          to="/settings" 
          style={{...styles.button, backgroundColor: '#00bcd4'}}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0097a7'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#00bcd4'}
        >
          Accéder aux Paramètres
        </Link>
      </div>

      {/* Informations */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h4 style={{color: '#333'}}>🚀 Application Fonctionnelle</h4>
        <p style={{color: '#666'}}>
          Toutes les fonctionnalités sont opérationnelles • Interface moderne et responsive
        </p>
        <p style={{color: '#999', fontSize: '14px'}}>
          Dernière mise à jour: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Home;
