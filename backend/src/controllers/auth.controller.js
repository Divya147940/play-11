const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretplay11token';

const sendOtp = (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }

  const otpCode = '123456'; // Fixed OTP for mock testing
  const otpReference = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

  try {
    const stmt = db.prepare('INSERT INTO otp_requests (id, mobile, otp_reference, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)');
    stmt.run(uuidv4(), mobile, otpReference, otpCode, expiresAt);

    res.json({ success: true, message: 'OTP sent successfully', otp_reference: otpReference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOtp = (req, res) => {
  const { mobile, otp_code } = req.body;

  if (!mobile || !otp_code) {
    return res.status(400).json({ error: 'Mobile and OTP required' });
  }

  try {
    // Check if OTP matches
    const otpRecord = db.prepare('SELECT * FROM otp_requests WHERE mobile = ? AND otp_code = ? AND verified = 0 ORDER BY expires_at DESC LIMIT 1').get(mobile, otp_code);

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Verify OTP
    db.prepare('UPDATE otp_requests SET verified = 1 WHERE id = ?').run(otpRecord.id);

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile);

    // Create user if not exists
    if (!user) {
      const userId = uuidv4();
      db.prepare('INSERT INTO users (id, mobile) VALUES (?, ?)').run(userId, mobile);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    }

    // Create Session Token
    const token = jwt.sign({ userId: user.id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};
