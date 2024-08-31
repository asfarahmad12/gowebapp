import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox'; // Ensure you import the SearchBox component

const NodesPage = () => {
  const [nodes, setNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('name'); // Default sort key
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/nodes');
        const data = await response.json();
        setNodes(data);
        setFilteredNodes(data); // Initialize filtered nodes
      } catch (error) {
        setError("Error fetching nodes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const sortItems = (items, key) => {
    return [...items].sort((a, b) => a[key].localeCompare(b[key]));
  };

  const handleFilter = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = nodes.filter(node =>
      node.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredNodes(filtered);
  };

  const displayedNodes = sortItems(filteredNodes, sortKey);

  return (
    <div>
      <h2>Nodes</h2>
      <SearchBox items={nodes} onFilter={handleFilter} />
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group list-group-flush">
        {displayedNodes.map(node => (
          <li className="list-group-item" key={node.name}>
            {node.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NodesPage;
