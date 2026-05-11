const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/update-profile', verifyToken, authController.updateProfile);
router.get('/history', verifyToken, authController.getUserHistory);
router.get('/submission/:id/review', verifyToken, authController.getSubmissionReview);

// Mock logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Mock user endpoint
router.get('/me', (req, res) => {
  res.json({ success: true, user: { mobile: '0000000000' } });
});

module.exports = router;
