import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BookingCard from '../components/BookingCard';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="loading">⏳ Loading your bookings...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>My Bookings</h2>
        <p>Track and manage all your borewell drilling requests.</p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '7px 16px',
              borderRadius: 50,
              border: '1.5px solid',
              borderColor: filter === s ? '#0B72B9' : '#e5e7eb',
              background: filter === s ? '#0B72B9' : '#fff',
              color: filter === s ? '#fff' : '#374151',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {s === 'all' ? '🗂 All' : s.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No bookings found</h3>
          <p>
            {filter === 'all'
              ? "You haven't made any drilling requests yet."
              : `No bookings with status "${filter}".`}
          </p>
          {filter === 'all' && (
            <Link to="/book-drilling" className="btn btn-primary" style={{ marginTop: 20 }}>
              + Book Drilling Service
            </Link>
          )}
        </div>
      ) : (
        <div className="booking-list">
          {filtered.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
