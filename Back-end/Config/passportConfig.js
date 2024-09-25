const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../Models/UserTraveller');

// Serialize user into session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user out of session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Use async/await
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

/* Google OAuth strategy*/
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:4000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // console.log("google O auth called in passport config", profile._json.picture);
  const [user, user2] = await Promise.all([
    User.findOne({ googleId: profile.id }),
    User.findOne({ email: profile.emails[0].value })
  ]);
  if (!user && !user2) {
    user = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      profile_picture: profile._json.picture
    });
    await user.save();
  }
  else if (!user && user2) {
    // if google auth do no exist and normal register exist put google ID into the register document along with other details
    // also if picture value is empty add it from google auth

    user2.googleId = profile.id;
    if (!user2.profile_picture) {
      user2.profile_picture = profile._json.picture;
    }
    await user2.save();
    user = user2;
  }
  done(null, user);
}));

// JWT Token creation helper function
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};
