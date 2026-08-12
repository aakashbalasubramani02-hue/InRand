import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        let pending = 0, active = 0, completed = 0;
        data.forEach(b => {
          if (b.status === 'pending') pending++;
          else if (b.status === 'completed') completed++;
          else if (b.status !== 'cancelled') active++;
        });
        setStats({ pending, active, completed });
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Customer';

  return (
    <div className="page-content">
      <div className="dashboard-welcome">
        <h2>Good day, {firstName}! 👋</h2>
        <p>Here's a summary of your borewell drilling requests.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div>
            <h3>Pending</h3>
            <p>{loading ? '–' : stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">🔨</div>
          <div>
            <h3>Active</h3>
            <p>{loading ? '–' : stats.active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div>
            <h3>Completed</h3>
            <p>{loading ? '–' : stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-cta">
        <div className="empty-state-icon">💧</div>
        <h3>Need a borewell drilled?</h3>
        <p>Submit a drilling request and a verified contractor will be assigned to your location.</p>
        <Link to="/book-drilling" className="btn btn-primary">
          + Book Drilling Service
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
