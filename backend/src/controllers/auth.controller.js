const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase-admin');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretplay11token';

const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }

  const otpCode = '123456'; // Fixed OTP for mock testing
  const otpReference = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

  try {
    await db.query(
      'INSERT INTO otp_requests (id, mobile, otp_reference, otp_code, expires_at) VALUES ($1, $2, $3, $4, $5)',
      [uuidv4(), mobile, otpReference, otpCode, expiresAt]
    );

    res.json({ success: true, message: 'OTP sent successfully', otp_reference: otpReference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOtp = async (req, res) => {
  const { mobile, otp_code, firebaseToken } = req.body;

  try {
    let verifiedMobile = null;

    if (firebaseToken) {
      // Verify Firebase Token
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      // Firebase phone numbers are in E.164 format (e.g., +919999999999)
      const phoneFromToken = decodedToken.phone_number;
      if (!phoneFromToken) {
        return res.status(400).json({ error: 'Token does not contain a phone number' });
      }
      
      // Extract 10 digits for local comparison (assuming +91)
      verifiedMobile = phoneFromToken.replace('+91', '').slice(-10);
    } else if (mobile && otp_code) {
      // Legacy / Mock OTP Check
      const { rows: otpRows } = await db.query(
        'SELECT * FROM otp_requests WHERE mobile = $1 AND otp_code = $2 AND verified = 0 ORDER BY expires_at DESC LIMIT 1',
        [mobile, otp_code]
      );
      
      const otpRecord = otpRows[0];
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      await db.query('UPDATE otp_requests SET verified = 1 WHERE id = $1', [otpRecord.id]);
      verifiedMobile = mobile;
    } else {
      return res.status(400).json({ error: 'Verification credentials missing' });
    }

    if (!verifiedMobile) {
      return res.status(400).json({ error: 'Mobile verification failed' });
    }

    // Check if user exists
    const { rows: userRows } = await db.query('SELECT * FROM users WHERE mobile = $1', [verifiedMobile]);
    let user = userRows[0];
    let isNewUser = false;

    // Create user if not exists
    if (!user) {
      const userId = uuidv4();
      await db.query('INSERT INTO users (id, mobile) VALUES ($1, $2)', [userId, mobile]);
      const { rows: newUserRows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      user = newUserRows[0];
      isNewUser = true;
    } else {
      // If user exists but name is missing, we consider them "new" for profile completion purposes
      if (!user.name) isNewUser = true;
    }

    // Create Session Token
    const token = jwt.sign({ userId: user.id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user, isNewUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  const { name, mobile } = req.body;
  
  if (!mobile || !name) {
    return res.status(400).json({ error: 'Name and mobile are required' });
  }

  try {
    await db.query('UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE mobile = $2', [name, mobile]);
    const { rows } = await db.query('SELECT * FROM users WHERE mobile = $1', [mobile]);
    
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserHistory = async (req, res) => {
  const { mobile } = req.query; // For now using query, better to use userId from token
  
  if (!mobile) {
    return res.status(400).json({ error: 'Mobile required' });
  }

  try {
    const { rows } = await db.query(`
      SELECT s.*, q.title, q.zone_id 
      FROM submissions s 
      JOIN quizzes q ON s.quiz_id = q.id 
      JOIN users u ON s.user_id = u.id 
      WHERE u.mobile = $1 
      ORDER BY s.submitted_at DESC
    `, [mobile]);
    
    res.json({ success: true, history: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  getUserHistory
};
