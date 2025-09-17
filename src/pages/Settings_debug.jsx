import React from 'react';

function Settings() {
  console.log('Settings component is rendering');
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>
        🔥 SETTINGS PAGE WORKS!
      </h1>
      
      <p style={{ fontSize: '20px', marginTop: '20px' }}>
        ✅ If you see this message, the page is loading correctly.
      </p>
      
      <p style={{ fontSize: '16px', color: '#666' }}>
        Timestamp: {new Date().toLocaleString()}
      </p>
      
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

export default Settings;
