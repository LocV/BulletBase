import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './Firearms.css';

const Firearms = () => {
  const { currentUser } = useAuth();
  const [firearms, setFirearms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load firearms from Firestore
  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, skipping firearms query');
      setIsLoading(false);
      return;
    }

    console.log('Setting up firearms query for user:', currentUser.uid);
    setIsLoading(true);

    const q = query(
      collection(db, 'firearms'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Firearms query snapshot received, size:', querySnapshot.size);
      const firearmsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Processing firearm document:', doc.id, data);
        firearmsList.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to date string
          purchaseDate: data.purchaseDate || null,
          lastCleaned: data.lastCleaned || null,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : null
        });
      });
      
      // Sort by createdAt descending (most recent first)
      firearmsList.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      console.log('Processed firearms:', firearmsList);
      setFirearms(firearmsList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading firearms:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="firearms-container">
      {/* Header */}
      <header className="firearms-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Firearms</h1>
            <p className="page-description">Manage your firearm collection</p>
          </div>
          <div className="header-actions">
            <Link to="/add-firearm" className="btn btn-primary">Add Firearm</Link>
            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="firearms-main">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading firearms...</p>
          </div>
        ) : firearms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔫</div>
            <h2>No firearms found</h2>
            <p>Start building your firearm collection by adding your first firearm.</p>
            <Link to="/add-firearm" className="btn btn-primary">Add Your First Firearm</Link>
          </div>
        ) : (
          <div className="firearms-grid">
            {firearms.map(firearm => (
              <div key={firearm.id} className="firearm-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{firearm.name}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: firearm.status === 'Active' ? '#6bcf7f' : '#a0a0a0' }}
                    >
                      {firearm.status}
                    </span>
                  </div>
                  <Link to={`/edit-firearm/${firearm.id}`} className="btn btn-edit">
                    Edit
                  </Link>
                </div>
                <div className="card-content">
                  <div className="firearm-details">
                    <div className="detail-row">
                      <span className="label">Make/Model:</span>
                      <span className="value">{firearm.make} {firearm.model}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Caliber:</span>
                      <span className="value">{firearm.caliber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Barrel:</span>
                      <span className="value">{firearm.barrelLength} ({firearm.twist})</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Action:</span>
                      <span className="value">{firearm.action}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Stock:</span>
                      <span className="value">{firearm.stock}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Scope:</span>
                      <span className="value">{firearm.scope}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Serial Number:</span>
                      <span className="value">{firearm.serialNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Purchase Date:</span>
                      <span className="value">{formatDate(firearm.purchaseDate)}</span>
                    </div>
                  </div>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value">{firearm.roundCount || 0}</span>
                      <span className="stat-label">Round Count</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{formatDate(firearm.lastCleaned)}</span>
                      <span className="stat-label">Last Cleaned</span>
                    </div>
                  </div>
                  {firearm.notes && (
                    <div className="card-notes">
                      <h4>Notes:</h4>
                      <p>{firearm.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Firearms;
