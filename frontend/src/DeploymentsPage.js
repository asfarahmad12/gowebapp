import React, { useState, useEffect } from 'react';

const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState([]);
  const [sortKey, setSortKey] = useState('namespace');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeployments = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/deployments');
        const data = await response.json();
        setDeployments(data);
      } catch (error) {
        setError("Error fetching deployments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const sortItems = (items, key) => {
    return [...items].sort((a, b) => a[key].localeCompare(b[key]));
  };

  return (
    <div>
      <h2>Deployments</h2>
      <div className="btn-group mb-4" role="group">
        <button className="btn btn-outline-primary" onClick={() => setSortKey('namespace')}>Sort by Namespace</button>
        <button className="btn btn-outline-secondary" onClick={() => setSortKey('name')}>Sort by Name</button>
      </div>
      {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group list-group-flush">
        {sortItems(deployments, sortKey).map(deployment => (
          <li className="list-group-item" key={deployment.name}>
            {deployment.name} <span className="badge bg-info text-dark">Namespace: {deployment.namespace}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeploymentsPage;
