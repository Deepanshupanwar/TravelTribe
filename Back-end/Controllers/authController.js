const jwt = require("jsonwebtoken");
const User = require("../Models/UserTraveller");
const { generateToken } = require("../Config/passportConfig");

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists!" });

  const user = new User({ username, email, password });
  await user.save();

  const token = generateToken(user);
  res.cookie("jwt", token, { httpOnly: true });
  res.status(201).json({ message: "User registered successfully", user });
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  /* THIS BELOW IS NEEDED TO BE CHANGED THE AUNTHEICATION FUCNTION !!! PASSWROD CHECKER */
  if (!user || !((await user.password) === password)) {    //!(await user.comparePassword(password))
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(user);
  res.cookie("jwt", token, { httpOnly: true });
  res.status(200).json({ message: "Logged in successfully", user });
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  console.log("inside googlecallback auth controller ");
  console.log(req.user);
  const token = generateToken(req.user);
  res.cookie("jwt", token, { httpOnly: true });
  res.redirect("http://localhost:4000/home"); // Redirect to the dashboard or homepage
};

// Logout
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
};

// Facebook OAuth callback
// exports.facebookCallback = async (req, res) => {
//   const token = generateToken(req.user);
//   res.cookie('jwt', token, { httpOnly: true });
//   res.redirect('/dashboard'); // Redirect to the dashboard or homepage
// };
