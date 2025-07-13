import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './SessionLogging.css';

const SessionLogging = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shotData, setShotData] = useState({
    distance: '',
    velocity: '',
    groupSize: '',
    notes: '',
    windSpeed: '',
    windDirection: ''
  });
  const [shots, setShots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      if (!currentUser || !sessionId) return;

      try {
        const sessionDoc = await getDoc(doc(db, 'shootingSession', sessionId));
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data();
          if (sessionData.userId === currentUser.uid) {
            setSession({ id: sessionDoc.id, ...sessionData });
            setShots(sessionData.shots || []);
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId, currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShotData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddShot = async () => {
    if (!shotData.distance) {
      alert('Distance is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const newShot = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        distance: parseInt(shotData.distance),
        velocity: shotData.velocity ? parseInt(shotData.velocity) : null,
        groupSize: shotData.groupSize ? parseFloat(shotData.groupSize) : null,
        notes: shotData.notes,
        windSpeed: shotData.windSpeed ? parseInt(shotData.windSpeed) : null,
        windDirection: shotData.windDirection
      };

      // Update session in Firebase
      await updateDoc(doc(db, 'shootingSession', sessionId), {
        shots: arrayUnion(newShot),
        updatedAt: serverTimestamp()
      });

      // Update local state
      setShots(prev => [...prev, newShot]);
      
      // Clear form
      setShotData({
        distance: shotData.distance, // Keep distance for convenience
        velocity: '',
        groupSize: '',
        notes: '',
        windSpeed: '',
        windDirection: ''
      });

    } catch (error) {
      console.error('Error adding shot:', error);
      alert('Failed to add shot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      try {
        await updateDoc(doc(db, 'shootingSession', sessionId), {
          status: 'completed',
          endedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error ending session:', error);
        alert('Failed to end session. Please try again.');
      }
    }
  };

  const calculateStatistics = () => {
    if (shots.length === 0) return null;

    const velocities = shots.filter(shot => shot.velocity).map(shot => shot.velocity);
    const groupSizes = shots.filter(shot => shot.groupSize).map(shot => shot.groupSize);

    return {
      totalShots: shots.length,
      averageVelocity: velocities.length > 0 ? (velocities.reduce((a, b) => a + b, 0) / velocities.length).toFixed(0) : null,
      bestGroup: groupSizes.length > 0 ? Math.min(...groupSizes).toFixed(2) : null,
      averageGroup: groupSizes.length > 0 ? (groupSizes.reduce((a, b) => a + b, 0) / groupSizes.length).toFixed(2) : null
    };
  };

  if (isLoading) {
    return (
      <div className="session-logging-container">
        <div className="loading">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="session-logging-container">
        <div className="error">Session not found.</div>
      </div>
    );
  }

  const stats = calculateStatistics();

  return (
    <div className="session-logging-container">
      <header className="session-header">
        <div className="session-info">
          <h1>{session.sessionName}</h1>
          <div className="session-details">
            <span>{session.location}</span>
            <span>{new Date(session.date).toLocaleDateString()}</span>
            <span>{session.ammunition.type === 'handload' ? session.ammunition.name : `${session.ammunition.manufacturer} ${session.ammunition.product}`}</span>
            <span>{session.firearm.make} {session.firearm.model}</span>
          </div>
        </div>
        <div className="session-actions">
          <button className="btn btn-danger" onClick={handleEndSession}>
            End Session
          </button>
        </div>
      </header>

      <div className="session-main">
        <div className="logging-section">
          <h2>Log Shot</h2>
          <div className="shot-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="distance">Distance (yards) *</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={shotData.distance}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="velocity">Velocity (fps)</label>
                <input
                  type="number"
                  id="velocity"
                  name="velocity"
                  value={shotData.velocity}
                  onChange={handleInputChange}
                  placeholder="e.g., 2650"
                />
              </div>
              <div className="form-group">
                <label htmlFor="groupSize">Group Size (inches)</label>
                <input
                  type="number"
                  id="groupSize"
                  name="groupSize"
                  value={shotData.groupSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.75"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="windSpeed">Wind Speed (mph)</label>
                <input
                  type="number"
                  id="windSpeed"
                  name="windSpeed"
                  value={shotData.windSpeed}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="windDirection">Wind Direction</label>
                <select
                  id="windDirection"
                  name="windDirection"
                  value={shotData.windDirection}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="N">North</option>
                  <option value="NE">Northeast</option>
                  <option value="E">East</option>
                  <option value="SE">Southeast</option>
                  <option value="S">South</option>
                  <option value="SW">Southwest</option>
                  <option value="W">West</option>
                  <option value="NW">Northwest</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Shot Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={shotData.notes}
                onChange={handleInputChange}
                placeholder="Notes about this shot..."
                rows="2"
              />
            </div>

            <button 
              className="btn btn-primary add-shot-btn"
              onClick={handleAddShot}
              disabled={isSubmitting || !shotData.distance}
            >
              {isSubmitting ? 'Adding...' : 'Add Shot'}
            </button>
          </div>
        </div>

        <div className="statistics-section">
          <h2>Session Statistics</h2>
          {stats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.totalShots}</span>
                <span className="stat-label">Total Shots</span>
              </div>
              {stats.averageVelocity && (
                <div className="stat-item">
                  <span className="stat-value">{stats.averageVelocity} fps</span>
                  <span className="stat-label">Avg Velocity</span>
                </div>
              )}
              {stats.bestGroup && (
                <div className="stat-item">
                  <span className="stat-value">{stats.bestGroup}"</span>
                  <span className="stat-label">Best Group</span>
                </div>
              )}
              {stats.averageGroup && (
                <div className="stat-item">
                  <span className="stat-value">{stats.averageGroup}"</span>
                  <span className="stat-label">Avg Group</span>
                </div>
              )}
            </div>
          ) : (
            <p>No shots logged yet.</p>
          )}
        </div>

        <div className="shots-section">
          <h2>Shot Log ({shots.length} shots)</h2>
          <div className="shots-list">
            {shots.length > 0 ? (
              shots.map((shot, index) => (
                <div key={shot.id} className="shot-entry">
                  <div className="shot-header">
                    <span className="shot-number">Shot #{index + 1}</span>
                    <span className="shot-time">{new Date(shot.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="shot-details">
                    <span>{shot.distance} yards</span>
                    {shot.velocity && <span>{shot.velocity} fps</span>}
                    {shot.groupSize && <span>{shot.groupSize}" group</span>}
                    {shot.windSpeed && <span>{shot.windSpeed}mph {shot.windDirection}</span>}
                  </div>
                  {shot.notes && <div className="shot-notes">{shot.notes}</div>}
                </div>
              ))
            ) : (
              <p>No shots logged yet. Add your first shot above!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionLogging;
