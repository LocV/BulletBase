import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="welcome-container">
      <h1 className="app-title">BulletBaseAI</h1>
      <div className="subtitle">Precision Shot Tracking & Load Development</div>
      
      <div className="description">
        <p>
          Welcome to BulletBaseAI - your comprehensive solution for tracking shots and optimizing your shooting performance. 
          Whether you're developing custom loads or tracking manufactured ammunition, our platform provides the tools you need 
          to analyze patterns, improve accuracy, and maintain detailed records of your shooting sessions.
        </p>
        
        <div className="features">
          <div className="feature-item">
            <h3>🎯 Shot Tracking</h3>
            <p>Record and analyze every shot with detailed ballistic data</p>
          </div>
          
          <div className="feature-item">
            <h3>⚗️ Load Development</h3>
            <p>Optimize your handloads with systematic testing and data analysis</p>
          </div>
          
          <div className="feature-item">
            <h3>📊 Ammunition Tracking</h3>
            <p>Monitor performance across different ammunition types and manufacturers</p>
          </div>
        </div>
        
        <div className="cta-section">
          <Link to="/signup" className="cta-button">Get Started</Link>
          <Link to="/login" className="cta-button secondary">Login</Link>
          <button className="cta-button secondary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
