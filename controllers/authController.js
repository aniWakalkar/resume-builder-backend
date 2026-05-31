import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { verifyGoogleToken } from '../middleware/googleAuth.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    console.log('Registration attempt:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    console.log('User registered successfully:', email);

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error); // Pass to error middleware
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    console.log('Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('User logged in successfully:', email);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};


// Add this new function for Google login
export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }
    
    // Verify Google token
    const googleUser = await verifyGoogleToken(token);
    
    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: Math.random().toString(36).slice(-16), // Random password for Google users
        isGoogleUser: true,
      });
      console.log('New user created via Google:', googleUser.email);
    }
    
    // Generate JWT token
    const jwtToken = generateToken(user._id);
    
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      token: jwtToken,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    next(error);
  }
};