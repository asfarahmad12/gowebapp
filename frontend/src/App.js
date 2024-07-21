import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/nodes')
      .then(response => {
        setNodes(response.data);
      })
      .catch(error => {
        setError('There was an error fetching the nodes!');
        console.error('Error fetching nodes:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kubernetes Nodes</h1>
        {error && <p>{error}</p>}
        <ul>
          {nodes.map((node, index) => (
            <li key={index}>{node.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
