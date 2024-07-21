import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS file

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [services, setServices] = useState([]);
  const [sortKeyPods, setSortKeyPods] = useState('namespace');
  const [sortKeyDeployments, setSortKeyDeployments] = useState('namespace');
  const [sortKeyServices, setSortKeyServices] = useState('namespace');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nodeResponse = await fetch('http://localhost:8080/api/nodes');
        const nodeData = await nodeResponse.json();
        setNodes(nodeData);

        const podResponse = await fetch('http://localhost:8080/api/pods');
        const podData = await podResponse.json();
        setPods(podData);

        const deploymentResponse = await fetch('http://localhost:8080/api/deployments');
        const deploymentData = await deploymentResponse.json();
        setDeployments(deploymentData);

        const serviceResponse = await fetch('http://localhost:8080/api/services');
        const serviceData = await serviceResponse.json();
        setServices(serviceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sortItems = (items, key) => {
    return [...items].sort((a, b) => a[key].localeCompare(b[key]));
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Kubernetes Resources</h1>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h2>Nodes</h2>
            </div>
            <ul className="list-group list-group-flush">
              {nodes.map(node => (
                <li className="list-group-item" key={node.name}>
                  {node.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2>Pods</h2>
              <div className="btn-group" role="group">
                <button className="btn btn-outline-primary" onClick={() => setSortKeyPods('namespace')}>Sort by Namespace</button>
                <button className="btn btn-outline-secondary" onClick={() => setSortKeyPods('name')}>Sort by Name</button>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              {sortItems(pods, sortKeyPods).map(pod => (
                <li className="list-group-item" key={pod.name}>
                  {pod.name} <span className="badge bg-info text-dark">Namespace: {pod.namespace}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2>Deployments</h2>
              <div className="btn-group" role="group">
                <button className="btn btn-outline-primary" onClick={() => setSortKeyDeployments('namespace')}>Sort by Namespace</button>
                <button className="btn btn-outline-secondary" onClick={() => setSortKeyDeployments('name')}>Sort by Name</button>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              {sortItems(deployments, sortKeyDeployments).map(deployment => (
                <li className="list-group-item" key={deployment.name}>
                  {deployment.name} <span className="badge bg-info text-dark">Namespace: {deployment.namespace}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2>Services</h2>
              <div className="btn-group" role="group">
                <button className="btn btn-outline-primary" onClick={() => setSortKeyServices('namespace')}>Sort by Namespace</button>
                <button className="btn btn-outline-secondary" onClick={() => setSortKeyServices('name')}>Sort by Name</button>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              {sortItems(services, sortKeyServices).map(service => (
                <li className="list-group-item" key={service.name}>
                  {service.name} <span className="badge bg-info text-dark">Namespace: {service.namespace}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
