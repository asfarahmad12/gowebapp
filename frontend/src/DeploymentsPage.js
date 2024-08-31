import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox'; // Ensure you import the SearchBox component

const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState([]);
  const [filteredDeployments, setFilteredDeployments] = useState([]);
  const [sortKey, setSortKey] = useState('namespace');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDeployments = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/deployments');
        const data = await response.json();
        setDeployments(data);
        setFilteredDeployments(data); // Initialize filtered deployments
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

  const handleFilter = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = deployments.filter(deployment =>
      deployment.name.toLowerCase().includes(lowercasedQuery) ||
      deployment.namespace.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredDeployments(filtered);
  };

  const displayedDeployments = sortItems(filteredDeployments, sortKey);

  return (
    <div>
      <h2>Deployments</h2>
      <SearchBox items={deployments} onFilter={handleFilter} />
      <div className="btn-group mb-4" role="group">
        <button className="btn btn-outline-primary" onClick={() => setSortKey('namespace')}>Sort by Namespace</button>
        <button className="btn btn-outline-secondary" onClick={() => setSortKey('name')}>Sort by Name</button>
      </div>
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group list-group-flush">
        {displayedDeployments.map(deployment => (
          <li className="list-group-item" key={deployment.name}>
            {deployment.name} <span className="badge bg-info text-dark">Namespace: {deployment.namespace}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeploymentsPage;
