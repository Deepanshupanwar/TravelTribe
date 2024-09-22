const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
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
    done(err, null);
  }
});

/* Google OAuth strategy*/
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:4000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  console.log("google O auth called in passport config", profile._json.picture);
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      profile_picture:profile._json.picture
    });
    await user.save();
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







// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ['id', 'displayName', 'emails']
// }, async (accessToken, refreshToken, profile, done) => {
//   let user = await User.findOne({ facebookId: profile.id });
//   if (!user) {
//     user = new User({
//       facebookId: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value
//     });
//     await user.save();
//   }
//   done(null, user);
// }));
