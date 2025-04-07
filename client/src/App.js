// client/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then((res) => setBackendMessage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Welcome to Mazadzicz! 🎉</h1>
      <p>Backend says: {backendMessage}</p>
    </div>
  );
}

export default App;