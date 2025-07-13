import React from 'react';
import { Link } from 'react-router-dom';
import PopulateData from './PopulateData';
import PopulateFactoryLoads from './PopulateFactoryLoads';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>Admin Panel</h1>
        <p>Administrative tools and data management</p>
      </header>

      <main className="admin-main">
        <div className="admin-section">
          <h2>Data Population Tools</h2>
          <p>Use these tools to populate your database with sample data for testing and development.</p>
          
          <div className="admin-tools">
            <PopulateData />
            <PopulateFactoryLoads />
          </div>
        </div>

        <div className="admin-section">
          <h2>Database Information</h2>
          <div className="info-card">
            <h3>Collections</h3>
            <ul>
              <li><strong>loadDevelopment:</strong> User-created load development projects</li>
              <li><strong>factoryLoad:</strong> Factory ammunition specifications</li>
              <li><strong>users:</strong> User account information</li>
            </ul>
          </div>
        </div>

        <div className="admin-section">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-card">
              <h4>Firebase Connection</h4>
              <span className="status-indicator online">Online</span>
            </div>
            <div className="status-card">
              <h4>Authentication</h4>
              <span className="status-indicator online">Active</span>
            </div>
            <div className="status-card">
              <h4>Firestore</h4>
              <span className="status-indicator online">Connected</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
