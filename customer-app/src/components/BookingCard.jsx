import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusEmoji = { pending: '⏳', accepted: '✅', 'in-progress': '🔨', completed: '🎉', cancelled: '❌' };

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <div className="booking-card" onClick={() => navigate(`/booking/${booking._id}`)}>
      <h4>📍 {booking.city}, {booking.state}</h4>
      <div className="booking-card-meta">
        <p><strong>Date:</strong> {new Date(booking.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <p><strong>Type:</strong> {booking.landType.charAt(0).toUpperCase() + booking.landType.slice(1)}</p>
        {booking.estimatedCost && <p><strong>Est. Cost:</strong> ₹{booking.estimatedCost.toLocaleString()}</p>}
      </div>
      <span className={`badge ${booking.status}`}>
        {statusEmoji[booking.status]} {booking.status.replace('-', ' ')}
      </span>
    </div>
  );
};

export default BookingCard;
