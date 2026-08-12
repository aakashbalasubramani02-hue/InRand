import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const statusEmoji = { pending: '⏳', accepted: '✅', 'in-progress': '🔨', completed: '🎉', cancelled: '❌' };

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (window.confirm('Cancel this request? This cannot be undone.')) {
      try {
        await api.put(`/bookings/${id}/cancel`);
        navigate('/my-bookings');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel');
      }
    }
  };

  const handlePayment = async () => {
    try {
      await api.put(`/bookings/${id}/pay`);
      setBooking({ ...booking, paymentStatus: 'paid' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  if (loading) return <div className="loading">⏳ Loading booking details...</div>;
  if (error) return <div className="page-content"><div className="error-msg">{error}</div></div>;
  if (!booking) return <div className="page-content"><div className="error-msg">Booking not found.</div></div>;

  return (
    <div className="page-content">
      <div className="detail-card">
        <div className="detail-card-header">
          <div>
            <h3>Booking Details</h3>
            <p style={{color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginTop: 4}}>ID: #{booking._id?.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`badge ${booking.status}`} style={{fontSize: '0.85rem'}}>
            {statusEmoji[booking.status]} {booking.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="detail-card-body">
          <div className="detail-section">
            <h4>📍 Location Details</h4>
            <div className="detail-grid">
              <div className="detail-row">
                <label>Full Address</label>
                <span>{booking.fullAddress}</span>
              </div>
              <div className="detail-row">
                <label>City & State</label>
                <span>{booking.city}, {booking.state}</span>
              </div>
              <div className="detail-row">
                <label>Pincode</label>
                <span>{booking.pincode}</span>
              </div>
              <div className="detail-row">
                <label>Land Type</label>
                <span>{booking.landType.charAt(0).toUpperCase() + booking.landType.slice(1)}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>⚙️ Job Details</h4>
            <div className="detail-grid">
              <div className="detail-row">
                <label>Preferred Date</label>
                <span>{new Date(booking.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="detail-row">
                <label>Estimated Depth</label>
                <span>{booking.estimatedDepth ? `${booking.estimatedDepth} feet` : 'Not specified'}</span>
              </div>
              <div className="detail-row">
                <label>Estimated Cost</label>
                <span>{booking.estimatedCost ? `₹${booking.estimatedCost.toLocaleString()}` : 'To be determined'}</span>
              </div>
              <div className="detail-row">
                <label>Notes</label>
                <span>{booking.notes || 'None'}</span>
              </div>
            </div>
          </div>

          {booking.owner && (
            <div className="detail-section">
              <h4>👷 Assigned Contractor</h4>
              <div className="owner-info-card">
                <div className="owner-avatar">{booking.owner.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <h4>{booking.owner.name}</h4>
                  {booking.owner.businessName && <p>🏢 {booking.owner.businessName}</p>}
                  {booking.owner.phone && <p>📞 {booking.owner.phone}</p>}
                  {booking.owner.email && <p>✉️ {booking.owner.email}</p>}
                  {booking.owner.experienceYears && <p>⭐ {booking.owner.experienceYears} years experience</p>}
                </div>
              </div>
            </div>
          )}

          {booking.status === 'pending' && (
            <div style={{textAlign: 'right'}}>
              <button className="btn btn-danger" onClick={handleCancel}>Cancel Request</button>
            </div>
          )}

          {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
            <div className="detail-section" style={{ textAlign: 'center', marginTop: 30, background: '#f8fafc', padding: 20, borderRadius: 10 }}>
              <h4>💳 Payment Required</h4>
              <p style={{ marginBottom: 15 }}>Please scan the QR code below to pay ₹{booking.estimatedCost || 0} to your contractor.</p>
              <img src="/payment-qr.png" alt="Payment QR Code" style={{ width: 200, height: 200, objectFit: 'contain', margin: '0 auto 20px', display: 'block', borderRadius: 10, border: '1px solid #e5e7eb' }} />
              <button className="btn btn-primary" onClick={handlePayment}>
                ✅ I Have Paid
              </button>
            </div>
          )}

          {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
            <div className="detail-section" style={{ textAlign: 'center', marginTop: 30, background: '#dcfce7', padding: 20, borderRadius: 10, color: '#166534' }}>
              <h4 style={{ margin: 0 }}>🎉 Payment Successful</h4>
              <p style={{ margin: 0, marginTop: 5 }}>Thank you! Your payment has been marked as completed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
