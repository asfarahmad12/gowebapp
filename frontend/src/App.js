import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS file

import NodesPage from './NodesPage';
import PodsPage from './PodsPage';
import DeploymentsPage from './DeploymentsPage';
import ServicesPage from './ServicesPage';

const App = () => {
  return (
    <Router>
      <div className="container my-5">
        <h1 className="text-center mb-4">Kubernetes Resources</h1>
        
        <nav>
          <ul className="nav nav-pills mb-4">
            <li className="nav-item">
              <Link className="nav-link" to="/nodes">Nodes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pods">Pods</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/deployments">Deployments</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/nodes" element={<NodesPage />} />
          <Route path="/pods" element={<PodsPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/" element={
            <div className="text-center">
              <p>Please select a category from the navigation menu.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
