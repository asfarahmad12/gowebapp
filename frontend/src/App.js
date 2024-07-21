import React, { useState, useEffect } from 'react';
import './App.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [nodes, setNodes] = useState([]);
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [services, setServices] = useState([]);

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

  return (
    <div className="container">
      <h1 className="text-center my-4">Kubernetes Resources</h1>

      <div className="row">
        <div className="col-md-6">
          <h2>Nodes</h2>
          <ul className="list-group">
            {nodes.map(node => (
              <li className="list-group-item" key={node.name}>{node.name}</li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Pods</h2>
          <ul className="list-group">
            {pods.map(pod => (
              <li className="list-group-item" key={pod.name}>
                {pod.name} <span className="badge bg-info text-dark">Namespace: {pod.namespace}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-md-6">
          <h2>Deployments</h2>
          <ul className="list-group">
            {deployments.map(deployment => (
              <li className="list-group-item" key={deployment.name}>
                {deployment.name} <span className="badge bg-info text-dark">Namespace: {deployment.namespace}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h2>Services</h2>
          <ul className="list-group">
            {services.map(service => (
              <li className="list-group-item" key={service.name}>
                {service.name} <span className="badge bg-info text-dark">Namespace: {service.namespace}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
