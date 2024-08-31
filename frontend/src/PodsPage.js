import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox'; // Ensure you import the SearchBox component

const PodsPage = () => {
  const [pods, setPods] = useState([]);
  const [filteredPods, setFilteredPods] = useState([]);
  const [sortKey, setSortKey] = useState('namespace');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPods = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/pods');
        const data = await response.json();
        setPods(data);
        setFilteredPods(data); // Initialize filtered pods
      } catch (error) {
        setError("Error fetching pods. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPods();
  }, []);

  const sortItems = (items, key) => {
    return [...items].sort((a, b) => a[key].localeCompare(b[key]));
  };

  const handleFilter = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = pods.filter(pod =>
      pod.name.toLowerCase().includes(lowercasedQuery) ||
      pod.namespace.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPods(filtered);
  };

  const displayedPods = sortItems(filteredPods, sortKey);

  return (
    <div>
      <h2>Pods</h2>
      <SearchBox items={pods} onFilter={handleFilter} />
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
        {displayedPods.map(pod => (
          <li className="list-group-item" key={pod.name}>
            {pod.name} <span className="badge bg-info text-dark">Namespace: {pod.namespace}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PodsPage;
