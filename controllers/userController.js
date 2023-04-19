const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// * GENERATE TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// * REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be more than 6 characters');
  }

  // Check if user email already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('Email is already in use');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
  });

  if (user) {
    const { _id, name, email } = user;
    res.status(201).json({
      _id,
      name,
      email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// * LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password');
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('User not found, please signup');
  }

  // User exists, check if password is correct
  const correctPassword = await bcrypt.compare(password, user.password);

  // Generate Token
  const token = generateToken(user._id);

  if (correctPassword) {
    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: 'none',
      secure: true,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
};
