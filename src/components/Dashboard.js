import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock data for load developments
  const [loadDevelopments] = useState([
    {
      id: 1,
      name: ".308 Win - Match Load",
      cartridge: ".308 Winchester",
      bullet: "175gr Sierra MatchKing",
      powder: "Varget 43.5gr",
      primer: "CCI BR2",
      brass: "Lapua",
      status: "In Progress",
      sessions: 4,
      bestGroup: "0.47 MOA",
      lastTested: "2025-01-05",
      notes: "Showing excellent consistency. Need to test at 600 yards."
    },
    {
      id: 2,
      name: "6.5 Creedmoor - Hunting Load",
      cartridge: "6.5 Creedmoor",
      bullet: "140gr Nosler AccuBond",
      powder: "H4350 41.2gr",
      primer: "Federal 210M",
      brass: "Hornady",
      status: "Testing",
      sessions: 2,
      bestGroup: "0.68 MOA",
      lastTested: "2025-01-03",
      notes: "Good velocity, testing different seating depths."
    },
    {
      id: 3,
      name: ".223 Rem - Varmint Load",
      cartridge: ".223 Remington",
      bullet: "55gr Hornady V-MAX",
      powder: "CFE 223 25.8gr",
      primer: "CCI 400",
      brass: "Winchester",
      status: "Complete",
      sessions: 6,
      bestGroup: "0.34 MOA",
      lastTested: "2024-12-28",
      notes: "Excellent accuracy achieved. Load finalized for prairie dogs."
    }
  ]);

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
            <button className="btn btn-secondary">+ New Session</button>
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
    </div>
  );
};

export default Dashboard;
