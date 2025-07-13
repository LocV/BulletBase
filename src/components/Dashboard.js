import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loadDevelopments, setLoadDevelopments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load data from Firestore
  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, skipping load development query');
      setIsLoading(false);
      return;
    }

    console.log('Setting up load development query for user:', currentUser.uid);
    setIsLoading(true);

    const q = query(
      collection(db, 'loadDevelopment'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Query snapshot received, size:', querySnapshot.size);
      const loads = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Processing document:', doc.id, data);
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
      
      console.log('Processed loads:', loads);
      setLoadDevelopments(loads);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading load developments:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Mock data for shooting sessions
  const [shootingSessions] = useState([
    {
      id: 1,
      date: "2025-01-05",
      location: "Thunder Valley Range",
      weather: "65°F, 5mph Wind",
      rounds: 30,
      cartridge: ".308 Winchester",
      load: ".308 Win - Match Load",
      avgGroup: "0.52 MOA",
      bestGroup: "0.47 MOA",
      velocity: "2650 fps avg",
      notes: "Perfect conditions. Rifle zeroed at 100 yards, tested load variations."
    },
    {
      id: 2,
      date: "2025-01-03",
      location: "Oak Hill Shooting Club",
      weather: "42°F, 12mph Wind",
      rounds: 25,
      cartridge: "6.5 Creedmoor",
      load: "6.5 Creedmoor - Hunting Load",
      avgGroup: "0.78 MOA",
      bestGroup: "0.68 MOA",
      velocity: "2720 fps avg",
      notes: "Windy conditions affected groups. Need to retest in calmer weather."
    },
    {
      id: 3,
      date: "2024-12-30",
      location: "Desert Precision Range",
      weather: "58°F, 3mph Wind",
      rounds: 40,
      cartridge: ".223 Remington",
      load: ".223 Rem - Varmint Load",
      avgGroup: "0.41 MOA",
      bestGroup: "0.34 MOA",
      velocity: "3240 fps avg",
      notes: "Exceptional day. Multiple sub-MOA groups. Load development complete."
    },
    {
      id: 4,
      date: "2024-12-28",
      location: "Mountain View Range",
      weather: "38°F, 8mph Wind",
      rounds: 35,
      cartridge: ".308 Winchester",
      load: ".308 Win - Match Load",
      avgGroup: "0.61 MOA",
      bestGroup: "0.49 MOA",
      velocity: "2645 fps avg",
      notes: "Cold bore shots consistent. Rifle performing well in cold weather."
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete': return '#6bcf7f';
      case 'In Progress': return '#ffd93d';
      case 'Testing': return '#ff9f43';
      default: return '#a0a0a0';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>BulletBaseAI Dashboard</h1>
            {currentUser && (
              <p className="user-welcome">Welcome back, {currentUser.displayName || currentUser.email}</p>
            )}
          </div>
          <div className="header-actions">
            <Link to="/load/new" className="btn btn-primary">+ New Load Development</Link>
            <Link to="/session/new" className="btn btn-secondary">+ New Session</Link>
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Overview */}
        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Loads</h3>
            <div className="stat-number">{loadDevelopments.length}</div>
            <div className="stat-label">Active developments</div>
          </div>
          <div className="stat-card">
            <h3>Recent Sessions</h3>
            <div className="stat-number">{shootingSessions.length}</div>
            <div className="stat-label">This month</div>
          </div>
          <div className="stat-card">
            <h3>Best Group</h3>
            <div className="stat-number">0.34"</div>
            <div className="stat-label">MOA achieved</div>
          </div>
          <div className="stat-card">
            <h3>Rounds Fired</h3>
            <div className="stat-number">{shootingSessions.reduce((sum, session) => sum + session.rounds, 0)}</div>
            <div className="stat-label">Total recorded</div>
          </div>
        </section>

        {/* Load Developments */}
        <section className="content-section">
          <div className="section-header">
            <h2>Load Developments</h2>
            <Link to="/loads" className="view-all-link">View All →</Link>
          </div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
              Loading load developments...
            </div>
          ) : loadDevelopments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
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
                      <span className="value highlight">{load.bestGroup}</span>
                    </div>
                  </div>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value">{load.sessions}</span>
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
        </section>

        {/* Shooting Sessions */}
        <section className="content-section">
          <div className="section-header">
            <h2>Recent Shooting Sessions</h2>
            <Link to="/sessions" className="view-all-link">View All →</Link>
          </div>
          <div className="sessions-list">
            {shootingSessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-date">
                    <h4>{formatDate(session.date)}</h4>
                    <span className="location">{session.location}</span>
                  </div>
                  <div className="session-summary">
                    <span className="rounds-count">{session.rounds} rounds</span>
                    <span className="cartridge-info">{session.cartridge}</span>
                  </div>
                </div>
                <div className="session-content">
                  <div className="session-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Load:</span>
                        <span className="value">{session.load}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Weather:</span>
                        <span className="value">{session.weather}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Avg Group:</span>
                        <span className="value">{session.avgGroup}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Best Group:</span>
                        <span className="value highlight">{session.bestGroup}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Velocity:</span>
                        <span className="value">{session.velocity}</span>
                      </div>
                    </div>
                  </div>
                  {session.notes && (
                    <div className="session-notes">
                      <p>{session.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Admin Link */}
      <footer className="dashboard-footer">
        <Link to="/admin" className="admin-link">Admin Panel</Link>
      </footer>
    </div>
  );
};

export default Dashboard;
