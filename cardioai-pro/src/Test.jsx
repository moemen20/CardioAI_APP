import React from 'react';

function Test() {
  console.log('Test component is rendering');
  
  return (
    <div style={{
      padding: '50px',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '30px',
      textAlign: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '60px', margin: '0 0 30px 0' }}>
        🔥 TEST RÉUSSI !
      </h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        Si vous voyez cette page rouge, React fonctionne !
      </p>
      <p style={{ fontSize: '18px', color: '#ffcccc' }}>
        Heure: {new Date().toLocaleString()}
      </p>
      <button 
        onClick={() => alert('Bouton cliqué !')}
        style={{
          padding: '15px 30px',
          fontSize: '20px',
          backgroundColor: 'white',
          color: 'red',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          marginTop: '30px'
        }}
      >
        Cliquez-moi !
      </button>
    </div>
  );
}

export default Test;
