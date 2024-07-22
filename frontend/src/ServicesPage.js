import React, { useState, useEffect } from 'react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [sortKey, setSortKey] = useState('namespace');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError("Error fetching services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const sortItems = (items, key) => {
    return [...items].sort((a, b) => a[key].localeCompare(b[key]));
  };

  return (
    <div>
      <h2>Services</h2>
      <div className="btn-group mb-4" role="group">
        <button className="btn btn-outline-primary" onClick={() => setSortKey('namespace')}>Sort by Namespace</button>
        <button className="btn btn-outline-secondary" onClick={() => setSortKey('name')}>Sort by Name</button>
      </div>
      {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group list-group-flush">
        {sortItems(services, sortKey).map(service => (
          <li className="list-group-item" key={service.name}>
            {service.name} <span className="badge bg-info text-dark">Namespace: {service.namespace}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServicesPage;
