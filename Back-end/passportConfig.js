const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import user schema

// Serialize user into session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user out of session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// Facebook OAuth strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ facebookId: profile.id });
  if (!user) {
    user = new User({
      facebookId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    });
    await user.save();
  }
  done(null, user);
}));

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    });
    await user.save();
  }
  done(null, user);
}));

// JWT Token creation helper function
exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};
