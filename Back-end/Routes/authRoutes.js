const express = require('express');
const router = express.Router();
const passport = require('passport');
const { requireAuth } = require("../Middlewares/authMiddleware");
const { register, login, logout, googleCallback } = require('../Controllers/authController');
const authController = require("../Controllers/profileEditController");
// Local Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);



// Route to edit profile
router.put("/profile", requireAuth, authController.editProfile);
// Route to delete profile
router.delete("/profile", requireAuth, authController.deleteProfile);

module.exports = router;