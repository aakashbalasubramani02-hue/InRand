const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/otp');
const { generateToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user (generates OTP)
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    if (!name || (!email && !phone) || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email: email || 'nonexistent' }, { phone: phone || 'nonexistent' }],
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

    // Upsert PendingUser
    const identifierCondition = email ? { email } : { phone };
    await PendingUser.findOneAndUpdate(
      identifierCondition,
      {
        name,
        email: email || undefined,
        phone: phone || undefined,
        password: hashedPassword,
        role,
        otpCode,
        otpExpiry
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Log OTP for local testing
    console.log(`[OTP] Created for ${email || phone}: ${otpCode}`);

    // Send email
    if (email) {
      try {
        await sendEmail({
          email,
          subject: 'InRand - OTP Verification',
          message: `Your OTP for InRand is ${otpCode}. It is valid for 2 minutes.`,
        });
      } catch (err) {
        console.error('Email send failed', err);
      }
    }

    res.status(201).json({
      message: 'User registered. Please verify your OTP.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  const { identifier, otp } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!pendingUser) {
      // Check if they are already verified in User collection
      const existingUser = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
      });
      if (existingUser) {
        return res.status(400).json({ message: 'User already verified' });
      }
      return res.status(404).json({ message: 'Registration not found or expired' });
    }

    if (pendingUser.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > pendingUser.otpExpiry) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Create the actual user
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone,
      password: pendingUser.password,
      role: pendingUser.role,
      isVerified: true
    });

    // Delete pending user
    await PendingUser.deleteOne({ _id: pendingUser._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
const resendOtp = async (req, res) => {
  const { identifier } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!pendingUser) {
      const existingUser = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
      });
      if (existingUser) {
         return res.status(400).json({ message: 'User already verified' });
      }
      return res.status(404).json({ message: 'Registration not found' });
    }

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    pendingUser.otpCode = otpCode;
    pendingUser.otpExpiry = otpExpiry;
    await pendingUser.save();

    console.log(`[OTP] Resent for ${identifier}: ${otpCode}`);

    if (pendingUser.email) {
      try {
        await sendEmail({
          email: pendingUser.email,
          subject: 'InRand - New OTP Verification',
          message: `Your new OTP for InRand is ${otpCode}. It is valid for 2 minutes.`,
        });
      } catch (err) {
        console.error('Email send failed', err);
      }
    }

    res.status(200).json({ message: 'OTP resent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Access denied. You are registered as a ${user.role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first', unverified: true });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, verifyOtp, resendOtp, login };
