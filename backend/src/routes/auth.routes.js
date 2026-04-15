const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/update-profile', authController.updateProfile);
router.get('/history', authController.getUserHistory);

// Mock logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Mock user endpoint
router.get('/me', (req, res) => {
  res.json({ success: true, user: { mobile: '0000000000' } });
});

module.exports = router;
