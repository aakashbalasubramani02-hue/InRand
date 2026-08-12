import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  if (!identifier) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(identifier, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">✉️</div>
          <h2>Verify Your Account</h2>
          <p className="auth-sub">
            Enter the 6-digit OTP sent to<br />
            <strong style={{ color: '#0B72B9' }}>{identifier}</strong>
          </p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              maxLength="6"
              style={{ fontSize: '1.5rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: '700' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Verifying...' : '✅ Verify & Continue'}
          </button>
        </form>
        <div className="text-center" style={{ marginTop: 14 }}>
          <Link to="/login" style={{ color: '#6b7280' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
