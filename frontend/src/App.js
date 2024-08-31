import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file
import SearchBar from './SearchBar'; // Import the SearchBar component

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [pods, setPods] = useState([]);
  const [services, setServices] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [nodesResponse, podsResponse, servicesResponse, deploymentsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/nodes'),
          fetch('http://localhost:8080/api/pods'),
          fetch('http://localhost:8080/api/services'),
          fetch('http://localhost:8080/api/deployments'),
        ]);

        const nodesData = await nodesResponse.json();
        const podsData = await podsResponse.json();
        const servicesData = await servicesResponse.json();
        const deploymentsData = await deploymentsResponse.json();

        setNodes(nodesData);
        setPods(podsData);
        setServices(servicesData);
        setDeployments(deploymentsData);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterItems = (items) => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery)
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title" onClick={handleReload}>Kubernetes Dashboard</h1>

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange} // Correctly passing the function
      />

      <div className="grid">
        <section className="card">
          <h3>Nodes</h3>
          <ul className="list-group">
            {filterItems(nodes).map(node => (
              <li className="list-group-item" key={node.name}>{node.name}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Pods</h3>
          <ul className="list-group">
            {filterItems(pods).map(pod => (
              <li className="list-group-item" key={pod.name}>
                {pod.name} <span className="badge bg-info text-dark">Namespace: {pod.namespace}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Services</h3>
          <ul className="list-group">
            {filterItems(services).map(service => (
              <li className="list-group-item" key={service.name}>
                {service.name} <span className="badge bg-info text-dark">Namespace: {service.namespace}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Deployments</h3>
          <ul className="list-group">
            {filterItems(deployments).map(deployment => (
              <li className="list-group-item" key={deployment.name}>
                {deployment.name} <span className="badge bg-info text-dark">Namespace: {deployment.namespace}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;