const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false
  },
  otpCode: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  businessName: {
    type: String
  },
  serviceArea: {
    type: String
  },
  experienceYears: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
