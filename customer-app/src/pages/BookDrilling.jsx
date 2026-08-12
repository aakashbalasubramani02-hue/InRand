import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookDrilling = () => {
  const [formData, setFormData] = useState({
    fullAddress: '', city: '', state: '', pincode: '',
    landType: 'residential', preferredDate: '', estimatedDepth: '', notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', formData);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="book-form-container">
        <div className="book-form-header">
          <h2>📍 Book Drilling Service</h2>
          <p>Fill in your location and requirements below to submit a request.</p>
        </div>
        <div className="book-form-body">
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Address</label>
              <input type="text" value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} placeholder="House No., Street, Village / Area" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Jaipur" required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="e.g. Rajasthan" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="e.g. 302001" required />
              </div>
              <div className="form-group">
                <label>Land Type</label>
                <select value={formData.landType} onChange={e => setFormData({...formData, landType: e.target.value})}>
                  <option value="residential">🏠 Residential</option>
                  <option value="agricultural">🌾 Agricultural</option>
                  <option value="commercial">🏢 Commercial</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Date</label>
                <input type="date" value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Estimated Depth (feet) <span style={{color:'#6b7280', fontWeight:400}}>optional</span></label>
                <input type="number" value={formData.estimatedDepth} onChange={e => setFormData({...formData, estimatedDepth: e.target.value})} placeholder="e.g. 300" />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes <span style={{color:'#6b7280', fontWeight:400}}>optional</span></label>
              <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Any special instructions or details about your site..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚀 Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDrilling;
