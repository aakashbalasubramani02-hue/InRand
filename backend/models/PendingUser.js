const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true,
    unique: true
  },
  phone: {
    type: String,
    sparse: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'owner'],
    required: true
  },
  otpCode: {
    type: String,
    required: true
  },
  otpExpiry: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
