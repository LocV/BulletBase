import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './AddFirearm.css';

const EditFirearm = () => {
  const navigate = useNavigate();
  const { firearmId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    caliber: '',
    barrelLength: '',
    twist: '',
    action: '',
    stock: '',
    scope: '',
    serialNumber: '',
    purchaseDate: '',
    roundCount: 0,
    lastCleaned: '',
    notes: '',
    status: 'Active'
  });

  // Fetch firearm data on component mount
  useEffect(() => {
    const fetchFirearmData = async () => {
      if (!currentUser || !firearmId) {
        setError('Invalid firearm or user');
        setFetchingData(false);
        return;
      }

      try {
        const firearmDoc = await getDoc(doc(db, 'firearms', firearmId));
        
        if (!firearmDoc.exists()) {
          setError('Firearm not found');
          setFetchingData(false);
          return;
        }

        const firearmData = firearmDoc.data();
        
        // Check if the firearm belongs to the current user
        if (firearmData.userId !== currentUser.uid) {
          setError('You do not have permission to edit this firearm');
          setFetchingData(false);
          return;
        }

        // Populate form with existing data
        setFormData({
          name: firearmData.name || '',
          make: firearmData.make || '',
          model: firearmData.model || '',
          caliber: firearmData.caliber || '',
          barrelLength: firearmData.barrelLength || '',
          twist: firearmData.twist || '',
          action: firearmData.action || '',
          stock: firearmData.stock || '',
          scope: firearmData.scope || '',
          serialNumber: firearmData.serialNumber || '',
          purchaseDate: firearmData.purchaseDate || '',
          roundCount: firearmData.roundCount || 0,
          lastCleaned: firearmData.lastCleaned || '',
          notes: firearmData.notes || '',
          status: firearmData.status || 'Active'
        });

        setFetchingData(false);
      } catch (error) {
        console.error('Error fetching firearm data:', error);
        setError('Failed to load firearm data');
        setFetchingData(false);
      }
    };

    fetchFirearmData();
  }, [currentUser, firearmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !firearmId) {
      setError('You must be logged in to edit a firearm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare the updated firearm data
      const updatedFirearmData = {
        ...formData,
        roundCount: parseInt(formData.roundCount) || 0,
        updatedAt: serverTimestamp(),
        // Convert date strings to proper format if they exist
        purchaseDate: formData.purchaseDate || null,
        lastCleaned: formData.lastCleaned || null
      };

      // Update the firearm in Firestore
      await updateDoc(doc(db, 'firearms', firearmId), updatedFirearmData);
      
      console.log('Firearm updated successfully');
      
      // Navigate back to firearms page
      navigate('/firearms');
    } catch (error) {
      console.error('Error updating firearm:', error);
      setError('Failed to update firearm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/firearms');
  };

  // Show loading state while fetching data
  if (fetchingData) {
    return (
      <div className="add-firearm-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading firearm data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !fetchingData) {
    return (
      <div className="add-firearm-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/firearms')} className="btn btn-primary">
            Back to Firearms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-firearm-container">
      <div className="add-firearm-header">
        <h1>Edit Firearm</h1>
        <p>Update the details of your firearm below</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-firearm-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Firearm Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Precision Rifle"
              />
            </div>

            <div className="form-group">
              <label htmlFor="make">Make *</label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                required
                placeholder="e.g., Remington"
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                placeholder="e.g., 700 SPS"
              />
            </div>

            <div className="form-group">
              <label htmlFor="caliber">Caliber *</label>
              <input
                type="text"
                id="caliber"
                name="caliber"
                value={formData.caliber}
                onChange={handleInputChange}
                required
                placeholder="e.g., .308 Winchester"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serialNumber">Serial Number</label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                placeholder="e.g., REM123456"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Specifications</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="barrelLength">Barrel Length</label>
              <input
                type="text"
                id="barrelLength"
                name="barrelLength"
                value={formData.barrelLength}
                onChange={handleInputChange}
                placeholder="e.g., 24 inches"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twist">Twist Rate</label>
              <input
                type="text"
                id="twist"
                name="twist"
                value={formData.twist}
                onChange={handleInputChange}
                placeholder="e.g., 1:10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="action">Action Type</label>
              <select
                id="action"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
              >
                <option value="">Select Action</option>
                <option value="Bolt Action">Bolt Action</option>
                <option value="Semi-Auto">Semi-Auto</option>
                <option value="Lever Action">Lever Action</option>
                <option value="Single Shot">Single Shot</option>
                <option value="Pump Action">Pump Action</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Type</label>
              <select
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              >
                <option value="">Select Stock</option>
                <option value="Synthetic">Synthetic</option>
                <option value="Walnut">Walnut</option>
                <option value="Laminated">Laminated</option>
                <option value="Composite">Composite</option>
                <option value="Chassis">Chassis</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="scope">Scope/Optic</label>
              <input
                type="text"
                id="scope"
                name="scope"
                value={formData.scope}
                onChange={handleInputChange}
                placeholder="e.g., Leupold VX-3i 3.5-10x40"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Maintenance</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="roundCount">Round Count</label>
              <input
                type="number"
                id="roundCount"
                name="roundCount"
                value={formData.roundCount}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastCleaned">Last Cleaned</label>
              <input
                type="date"
                id="lastCleaned"
                name="lastCleaned"
                value={formData.lastCleaned}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Notes</h2>
          <div className="form-group full-width">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter any additional notes about this firearm..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating Firearm...' : 'Update Firearm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFirearm;
