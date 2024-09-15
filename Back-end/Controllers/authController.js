const jwt = require('jsonwebtoken');
const User = require('../Models/UserTraveller');
const { generateToken } = require('../Config/passportConfig');

// Register a new user
exports.register = async (req, res) => {
    // console.log("register working");
    // res.send("hello register");
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists!' });

  const user = new User({ name, email, password });
  await user.save();

  const token = generateToken(user);
  res.cookie('jwt', token, { httpOnly: true });
  res.status(201).json({ message: 'User registered successfully', user });
};

// Login a user
exports.login = async (req, res) => {
    // console.log( " login working ");
    // res.send("u log in ");
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json({ message: 'Logged in successfully', user });
};

// Facebook OAuth callback
// exports.facebookCallback = async (req, res) => {
//   const token = generateToken(req.user);
//   res.cookie('jwt', token, { httpOnly: true });
//   res.redirect('/dashboard'); // Redirect to the dashboard or homepage
// };

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  const token = generateToken(req.user);
  res.cookie('jwt', token, { httpOnly: true });
  res.redirect('/dashboard'); // Redirect to the dashboard or homepage
};

// Logout
exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out successfully' });
};
