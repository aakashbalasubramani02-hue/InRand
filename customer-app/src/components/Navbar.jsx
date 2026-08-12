import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path
      ? { color: 'white', background: 'rgba(255,255,255,0.2)', borderRadius: 8 }
      : {};

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">💧 InRand <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontSize: '1rem' }}>Customer</span></Link>
      </div>
      {user && (
        <div className="links">
          <Link to="/" style={isActive('/')}>Dashboard</Link>
          <Link to="/book-drilling" style={isActive('/book-drilling')}>Book Service</Link>
          <Link to="/my-bookings" style={isActive('/my-bookings')}>My Bookings</Link>
          <Link to="/profile" style={isActive('/profile')}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {!user && (
        <div className="links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
