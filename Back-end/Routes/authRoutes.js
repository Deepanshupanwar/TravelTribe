const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout
    // , facebookCallback
    , googleCallback 
} = require('../Controllers/authController');

// Local Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// OAuth Routes
// router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), facebookCallback);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

module.exports = router;
