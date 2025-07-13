import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './LoadDevelopments.css';

const LoadDevelopments = () => {
  const { currentUser } = useAuth();
  const [loadDevelopments, setLoadDevelopments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'loadDevelopment'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loads = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loads.push({
          id: doc.id,
          ...data,
          // Format bullet and powder for display
          bullet: data.bullet ? `${data.bullet.weight}gr ${data.bullet.type}` : '',
          powder: data.powder ? `${data.powder.type} ${data.powder.weight}gr` : '',
          // Convert Firestore timestamp to date string
          lastTested: data.lastTested ? data.lastTested.toDate().toISOString().split('T')[0] : null,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : null
        });
      });
      // Sort by createdAt descending (most recent first)
      loads.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setLoadDevelopments(loads);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading load developments:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return '#6bcf7f';
      case 'In Progress': return '#ffd93d';
      case 'Testing': return '#ff9f43';
      default: return '#a0a0a0';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not tested';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="load-developments-container">
        <div className="loading">Loading load developments...</div>
      </div>
    );
  }

  return (
    <div className="load-developments-container">
      <header className="load-developments-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>All Load Developments</h1>
        <p>Manage and view all your load development projects</p>
      </header>

      <div className="load-developments-main">
        {loadDevelopments.length === 0 ? (
          <div className="no-loads">
            <p>No load developments found.</p>
            <Link to="/load/new" className="btn btn-primary">Create Your First Load</Link>
          </div>
        ) : (
          <div className="cards-grid">
            {loadDevelopments.map(load => (
              <div key={load.id} className="load-card">
                <div className="card-header">
                  <h3>{load.name}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(load.status) }}
                  >
                    {load.status}
                  </span>
                </div>
                <div className="card-content">
                  <div className="load-details">
                    <div className="detail-row">
                      <span className="label">Cartridge:</span>
                      <span className="value">{load.cartridge}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Bullet:</span>
                      <span className="value">{load.bullet}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Powder:</span>
                      <span className="value">{load.powder}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Best Group:</span>
                      <span className="value highlight">{load.bestGroup || 'Not tested'}</span>
                    </div>
                  </div>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value">{load.sessions || 0}</span>
                      <span className="stat-label">Sessions</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{formatDate(load.lastTested)}</span>
                      <span className="stat-label">Last Tested</span>
                    </div>
                  </div>
                  {load.notes && (
                    <div className="card-notes">
                      <p>{load.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadDevelopments;

