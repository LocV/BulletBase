import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './NewShootingSession.css';

const NewShootingSession = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    sessionName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    weather: {
      temperature: '',
      windSpeed: '',
      windDirection: '',
      humidity: '',
      conditions: ''
    },
    ammunitionType: '', // 'handload' or 'factory'
    selectedAmmunition: '',
    firearm: {
      make: '',
      model: '',
      caliber: '',
      barrelLength: '',
      scope: ''
    },
    notes: ''
  });

  const [loadDevelopments, setLoadDevelopments] = useState([]);
  const [factoryLoads, setFactoryLoads] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user's hand loads
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
          displayName: `${data.name} - ${data.cartridge}`
        });
      });
      setLoadDevelopments(loads);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load factory ammunition
  useEffect(() => {
    const q = query(collection(db, 'factoryLoad'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loads = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loads.push({
          id: doc.id,
          ...data,
          displayName: `${data.manufacturer} ${data.product} - ${data.caliber} ${data.bulletWeight} ${data.bulletType}`
        });
      });
      setFactoryLoads(loads);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sessionName.trim()) {
      newErrors.sessionName = 'Session name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.ammunitionType) {
      newErrors.ammunitionType = 'Please select ammunition type';
    }
    if (!formData.selectedAmmunition) {
      newErrors.selectedAmmunition = 'Please select ammunition';
    }
    if (!formData.firearm.make.trim()) {
      newErrors['firearm.make'] = 'Firearm make is required';
    }
    if (!formData.firearm.model.trim()) {
      newErrors['firearm.model'] = 'Firearm model is required';
    }
    if (!formData.firearm.caliber.trim()) {
      newErrors['firearm.caliber'] = 'Caliber is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get selected ammunition details
      let ammunitionDetails = {};
      if (formData.ammunitionType === 'handload') {
        const selectedLoad = loadDevelopments.find(load => load.id === formData.selectedAmmunition);
        ammunitionDetails = {
          type: 'handload',
          loadDevelopmentId: selectedLoad.id,
          name: selectedLoad.name,
          cartridge: selectedLoad.cartridge,
          bullet: selectedLoad.bullet,
          powder: selectedLoad.powder
        };
      } else {
        const selectedLoad = factoryLoads.find(load => load.id === formData.selectedAmmunition);
        ammunitionDetails = {
          type: 'factory',
          factoryLoadId: selectedLoad.id,
          manufacturer: selectedLoad.manufacturer,
          product: selectedLoad.product,
          caliber: selectedLoad.caliber,
          bulletWeight: selectedLoad.bulletWeight,
          bulletType: selectedLoad.bulletType
        };
      }

      const sessionData = {
        ...formData,
        ammunition: ammunitionDetails,
        userId: currentUser.uid,
        status: 'active',
        shots: [],
        statistics: {
          totalShots: 0,
          averageGroup: null,
          bestGroup: null,
          averageVelocity: null
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'shootingSession'), sessionData);
      console.log('Shooting session created with ID:', docRef.id);
      
      // Navigate to the session logging page
      navigate(`/session/${docRef.id}`);
      
    } catch (error) {
      console.error('Error creating shooting session:', error);
      setErrors({ submit: 'Failed to create shooting session. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const getAmmunitionOptions = () => {
    if (formData.ammunitionType === 'handload') {
      return loadDevelopments;
    } else if (formData.ammunitionType === 'factory') {
      return factoryLoads.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    return [];
  };

  return (
    <div className="new-session-container">
      <div className="new-session-header">
        <button className="back-button" onClick={handleCancel}>
          ← Back to Dashboard
        </button>
        <h1>Start New Shooting Session</h1>
        <p>Set up your shooting session parameters and begin logging shots</p>
      </div>

      <div className="new-session-form-container">
        <form onSubmit={handleSubmit} className="new-session-form">
          {/* Session Information */}
          <section className="form-section">
            <h2>Session Information</h2>
            
            <div className="form-group">
              <label htmlFor="sessionName">Session Name *</label>
              <input
                type="text"
                id="sessionName"
                name="sessionName"
                value={formData.sessionName}
                onChange={handleChange}
                className={errors.sessionName ? 'error' : ''}
                placeholder="e.g., Range Practice - 100 yards"
              />
              {errors.sessionName && <span className="error-message">{errors.sessionName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? 'error' : ''}
                  placeholder="e.g., Thunder Valley Range"
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>
            </div>
          </section>

          {/* Weather Conditions */}
          <section className="form-section">
            <h2>Weather Conditions</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="temperature">Temperature (°F)</label>
                <input
                  type="number"
                  id="temperature"
                  name="weather.temperature"
                  value={formData.weather.temperature}
                  onChange={handleChange}
                  placeholder="e.g., 72"
                />
              </div>

              <div className="form-group">
                <label htmlFor="windSpeed">Wind Speed (mph)</label>
                <input
                  type="number"
                  id="windSpeed"
                  name="weather.windSpeed"
                  value={formData.weather.windSpeed}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="windDirection">Wind Direction</label>
                <select
                  id="windDirection"
                  name="weather.windDirection"
                  value={formData.weather.windDirection}
                  onChange={handleChange}
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="humidity">Humidity (%)</label>
                <input
                  type="number"
                  id="humidity"
                  name="weather.humidity"
                  value={formData.weather.humidity}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="conditions">Conditions</label>
                <select
                  id="conditions"
                  name="weather.conditions"
                  value={formData.weather.conditions}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="Clear">Clear</option>
                  <option value="Partly Cloudy">Partly Cloudy</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Light Rain">Light Rain</option>
                  <option value="Overcast">Overcast</option>
                  <option value="Sunny">Sunny</option>
                </select>
              </div>
            </div>
          </section>

          {/* Ammunition Selection */}
          <section className="form-section">
            <h2>Ammunition</h2>
            
            <div className="form-group">
              <label>Ammunition Type *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ammunitionType"
                    value="handload"
                    checked={formData.ammunitionType === 'handload'}
                    onChange={handleChange}
                  />
                  Hand Load Development
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ammunitionType"
                    value="factory"
                    checked={formData.ammunitionType === 'factory'}
                    onChange={handleChange}
                  />
                  Factory Ammunition
                </label>
              </div>
              {errors.ammunitionType && <span className="error-message">{errors.ammunitionType}</span>}
            </div>

            {formData.ammunitionType && (
              <div className="form-group">
                <label htmlFor="selectedAmmunition">
                  Select {formData.ammunitionType === 'handload' ? 'Load Development' : 'Factory Load'} *
                </label>
                <select
                  id="selectedAmmunition"
                  name="selectedAmmunition"
                  value={formData.selectedAmmunition}
                  onChange={handleChange}
                  className={errors.selectedAmmunition ? 'error' : ''}
                >
                  <option value="">Select ammunition...</option>
                  {getAmmunitionOptions().map(option => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
                {errors.selectedAmmunition && <span className="error-message">{errors.selectedAmmunition}</span>}
              </div>
            )}
          </section>

          {/* Firearm Information */}
          <section className="form-section">
            <h2>Firearm</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firearmMake">Make *</label>
                <input
                  type="text"
                  id="firearmMake"
                  name="firearm.make"
                  value={formData.firearm.make}
                  onChange={handleChange}
                  className={errors['firearm.make'] ? 'error' : ''}
                  placeholder="e.g., Remington, Ruger"
                />
                {errors['firearm.make'] && <span className="error-message">{errors['firearm.make']}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="firearmModel">Model *</label>
                <input
                  type="text"
                  id="firearmModel"
                  name="firearm.model"
                  value={formData.firearm.model}
                  onChange={handleChange}
                  className={errors['firearm.model'] ? 'error' : ''}
                  placeholder="e.g., 700, 10/22"
                />
                {errors['firearm.model'] && <span className="error-message">{errors['firearm.model']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firearmCaliber">Caliber *</label>
                <input
                  type="text"
                  id="firearmCaliber"
                  name="firearm.caliber"
                  value={formData.firearm.caliber}
                  onChange={handleChange}
                  className={errors['firearm.caliber'] ? 'error' : ''}
                  placeholder="e.g., .308 Winchester"
                />
                {errors['firearm.caliber'] && <span className="error-message">{errors['firearm.caliber']}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="barrelLength">Barrel Length</label>
                <input
                  type="text"
                  id="barrelLength"
                  name="firearm.barrelLength"
                  value={formData.firearm.barrelLength}
                  onChange={handleChange}
                  placeholder="e.g., 24 inches"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="scope">Scope/Optics</label>
              <input
                type="text"
                id="scope"
                name="firearm.scope"
                value={formData.firearm.scope}
                onChange={handleChange}
                placeholder="e.g., Leupold VX-3i 3.5-10x40"
              />
            </div>
          </section>

          {/* Notes */}
          <section className="form-section">
            <h2>Session Notes</h2>
            
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional notes about this session..."
              />
            </div>
          </section>

          {/* Submit */}
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Starting Session...' : 'Start Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewShootingSession;
