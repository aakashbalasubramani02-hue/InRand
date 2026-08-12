const Booking = require('../models/Booking');

// @desc    Create a new booking (Customer only)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { fullAddress, city, state, pincode, landType, preferredDate, estimatedDepth, notes } = req.body;

    const booking = new Booking({
      customer: req.user._id,
      fullAddress,
      city,
      state,
      pincode,
      landType,
      preferredDate,
      estimatedDepth,
      notes,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings (Customer only)
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('owner', 'name phone email businessName')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking (Customer only)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending bookings' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available pending bookings (Owner only)
// @route   GET /api/bookings/available
const getAvailableBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending', owner: null })
      .populate('customer', 'name phone city state')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assigned jobs (Owner only)
// @route   GET /api/bookings/assigned
const getAssignedJobs = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('customer', 'name phone email fullAddress city state pincode')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a booking (Owner only)
// @route   PUT /api/bookings/:id/accept
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is no longer available' });
    }

    booking.owner = req.user._id;
    booking.status = 'accepted';
    
    if(req.body.estimatedCost) {
      booking.estimatedCost = req.body.estimatedCost;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job status/cost (Owner only)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }
    
    if (req.body.estimatedCost !== undefined) {
      booking.estimatedCost = req.body.estimatedCost;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID (Either)
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('owner', 'name email phone businessName experienceYears');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ownership check
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isOwner = booking.owner && booking.owner._id.toString() === req.user._id.toString();
    
    // An owner can view it if it's pending (unassigned), or if they own it
    const isAvailableToOwner = req.user.role === 'owner' && booking.status === 'pending';

    if (!isCustomer && !isOwner && !isAvailableToOwner) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark booking as paid (Customer only)
// @route   PUT /api/bookings/:id/pay
const markAsPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only pay for completed bookings' });
    }

    booking.paymentStatus = 'paid';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAvailableBookings,
  getAssignedJobs,
  acceptBooking,
  updateBookingStatus,
  getBookingById,
  markAsPaid
};
