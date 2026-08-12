import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.phone) {
      setError('Please provide an email or phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(formData);
      navigate('/verify-otp', { state: { identifier: formData.email || formData.phone } });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">💧</div>
          <h2>Create Account</h2>
          <p className="auth-sub">Join InRand as a customer and book drilling services</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Rahul Sharma" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765..." />
            </div>
          </div>
          <div className="form-group">
            <label>Password <span style={{color: '#6b7280', fontWeight: 400}}>(min 6 chars)</span></label>
            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Create a secure password" required minLength="6" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>
        <div className="text-center">
          Already have an account? <Link to="/login">Sign in →</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
