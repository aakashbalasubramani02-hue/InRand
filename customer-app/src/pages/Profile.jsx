import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.put('/users/me', formData);
      setMessage('success');
    } catch {
      setMessage('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const nameInitial = (formData.name || user?.name || '?').charAt(0).toUpperCase();

  return (
    <div className="page-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{nameInitial}</div>
          <h2>{formData.name || 'Your Profile'}</h2>
          <span>Customer · InRand</span>
        </div>
        <div className="profile-body">
          {message === 'success' && <div className="success-msg">✅ Profile updated successfully!</div>}
          {message === 'error' && <div className="error-msg">Failed to update profile. Please try again.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
