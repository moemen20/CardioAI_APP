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
      minHeight: '100vh'
    }}>
      <h1>🔥 TEST PAGE WORKS!</h1>
      <p>If you see this red page, React is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default Test;
