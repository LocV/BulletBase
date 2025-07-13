import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './NewLoadDevelopment.css';

const NewLoadDevelopment = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cartridge: '',
    bullet: {
      weight: '',
      type: '',
      manufacturer: ''
    },
    powder: {
      type: '',
      weight: ''
    },
    primer: '',
    brass: '',
    notes: '',
    goal: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object updates
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Load name is required';
    }
    if (!formData.cartridge.trim()) {
      newErrors.cartridge = 'Cartridge is required';
    }
    if (!formData.bullet.weight.trim()) {
      newErrors['bullet.weight'] = 'Bullet weight is required';
    }
    if (!formData.bullet.type.trim()) {
      newErrors['bullet.type'] = 'Bullet type is required';
    }
    if (!formData.powder.type.trim()) {
      newErrors['powder.type'] = 'Powder type is required';
    }
    if (!formData.primer.trim()) {
      newErrors.primer = 'Primer is required';
    }
    if (!formData.brass.trim()) {
      newErrors.brass = 'Brass is required';
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
      // Format the data for storage
      const loadData = {
        ...formData,
        userId: currentUser.uid,
        status: 'Planning',
        sessions: 0,
        bestGroup: null,
        createdAt: serverTimestamp(),
        lastTested: null,
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'loadDevelopment'), loadData);
      console.log('Load development created with ID:', docRef.id);
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error creating load development:', error);
      setErrors({ submit: 'Failed to create load development. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="new-load-container">
      <div className="new-load-header">
        <button className="back-button" onClick={handleCancel}>
          ← Back to Dashboard
        </button>
        <h1>Create New Load Development</h1>
        <p>Define the parameters for your new load development project</p>
      </div>

      <div className="new-load-form-container">
        <form onSubmit={handleSubmit} className="new-load-form">
          {/* Basic Information */}
          <section className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Load Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="e.g., .308 Win - Match Load"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cartridge">Cartridge *</label>
              <input
                type="text"
                id="cartridge"
                name="cartridge"
                value={formData.cartridge}
                onChange={handleChange}
                className={errors.cartridge ? 'error' : ''}
                placeholder="e.g., .308 Winchester"
              />
              {errors.cartridge && <span className="error-message">{errors.cartridge}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="goal">Development Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="">Select goal...</option>
                <option value="precision">Precision/Target</option>
                <option value="hunting">Hunting</option>
                <option value="varmint">Varmint</option>
                <option value="competition">Competition</option>
                <option value="plinking">Plinking</option>
              </select>
            </div>
          </section>

          {/* Bullet Information */}
          <section className="form-section">
            <h2>Bullet</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bullet-weight">Weight (grains) *</label>
                <input
                  type="number"
                  id="bullet-weight"
                  name="bullet.weight"
                  value={formData.bullet.weight}
                  onChange={handleChange}
                  className={errors['bullet.weight'] ? 'error' : ''}
                  placeholder="e.g., 175"
                  step="0.1"
                />
                {errors['bullet.weight'] && <span className="error-message">{errors['bullet.weight']}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bullet-manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="bullet-manufacturer"
                  name="bullet.manufacturer"
                  value={formData.bullet.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Sierra, Hornady"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bullet-type">Bullet Type *</label>
              <input
                type="text"
                id="bullet-type"
                name="bullet.type"
                value={formData.bullet.type}
                onChange={handleChange}
                className={errors['bullet.type'] ? 'error' : ''}
                placeholder="e.g., Sierra MatchKing BTHP"
              />
              {errors['bullet.type'] && <span className="error-message">{errors['bullet.type']}</span>}
            </div>
          </section>

          {/* Powder Information */}
          <section className="form-section">
            <h2>Powder</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="powder-type">Powder Type *</label>
                <input
                  type="text"
                  id="powder-type"
                  name="powder.type"
                  value={formData.powder.type}
                  onChange={handleChange}
                  className={errors['powder.type'] ? 'error' : ''}
                  placeholder="e.g., Varget, H4350"
                />
                {errors['powder.type'] && <span className="error-message">{errors['powder.type']}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="powder-weight">Starting Weight (grains)</label>
                <input
                  type="number"
                  id="powder-weight"
                  name="powder.weight"
                  value={formData.powder.weight}
                  onChange={handleChange}
                  placeholder="e.g., 43.5"
                  step="0.1"
                />
              </div>
            </div>
          </section>

          {/* Components */}
          <section className="form-section">
            <h2>Components</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="primer">Primer *</label>
                <input
                  type="text"
                  id="primer"
                  name="primer"
                  value={formData.primer}
                  onChange={handleChange}
                  className={errors.primer ? 'error' : ''}
                  placeholder="e.g., CCI BR2, Federal 210M"
                />
                {errors.primer && <span className="error-message">{errors.primer}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="brass">Brass *</label>
                <input
                  type="text"
                  id="brass"
                  name="brass"
                  value={formData.brass}
                  onChange={handleChange}
                  className={errors.brass ? 'error' : ''}
                  placeholder="e.g., Lapua, Winchester"
                />
                {errors.brass && <span className="error-message">{errors.brass}</span>}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="form-section">
            <h2>Notes</h2>
            
            <div className="form-group">
              <label htmlFor="notes">Development Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional notes about this load development..."
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
              {isSubmitting ? 'Creating...' : 'Create Load Development'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLoadDevelopment;
