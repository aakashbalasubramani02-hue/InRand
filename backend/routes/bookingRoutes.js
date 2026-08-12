const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAvailableBookings,
  getAssignedJobs,
  acceptBooking,
  updateBookingStatus,
  getBookingById,
  markAsPaid
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer Routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);
router.put('/:id/pay', protect, authorize('customer'), markAsPaid);

// Owner Routes
router.get('/available', protect, authorize('owner'), getAvailableBookings);
router.get('/assigned', protect, authorize('owner'), getAssignedJobs);
router.put('/:id/accept', protect, authorize('owner'), acceptBooking);
router.put('/:id/status', protect, authorize('owner'), updateBookingStatus);

// Common Route
router.get('/:id', protect, getBookingById);

module.exports = router;
