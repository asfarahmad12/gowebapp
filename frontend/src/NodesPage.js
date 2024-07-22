import React, { useState, useEffect } from 'react';

const NodesPage = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/nodes');
        const data = await response.json();
        setNodes(data);
      } catch (error) {
        setError("Error fetching nodes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  return (
    <div>
      <h2>Nodes</h2>
      {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group list-group-flush">
        {nodes.map(node => (
          <li className="list-group-item" key={node.name}>
            {node.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NodesPage;
