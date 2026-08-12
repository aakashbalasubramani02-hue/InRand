import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.unverified) {
        navigate('/verify-otp', { state: { identifier } });
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">💧</div>
          <h2>Welcome back</h2>
          <p className="auth-sub">Sign in to your InRand customer account</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Phone Number</label>
            <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Enter your email or phone" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>
        <div className="text-center">
          Don't have an account? <Link to="/signup">Create one →</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
