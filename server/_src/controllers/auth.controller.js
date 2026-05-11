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
  console.log(`🔐 Attempting OTP verification for: ${mobile || 'Firebase Token'}`);

  try {
    let verifiedMobile = null;

    if (firebaseToken) {
      // Verify Firebase Token
      console.log('📡 Verifying Firebase ID Token...');
      
      // ✅ DEVELOPER BYPASS for local testing
      if (firebaseToken.startsWith('MOCK_TOKEN_')) {
        console.log('🛠️ Dev Mode: Internal bypass for Mock Token');
        verifiedMobile = firebaseToken.replace('MOCK_TOKEN_', '');
      } else {
        // Safety check for initialized admin app
        if (!admin.apps || admin.apps.length === 0) {
          console.error('❌ Firebase Admin not initialized correctly.');
          throw new Error('Auth service temporarily unavailable (Firebase Init Error)');
        }

        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        // Firebase phone numbers are in E.164 format (e.g., +919999999999)
        const phoneFromToken = decodedToken.phone_number;
        
        if (!phoneFromToken) {
          console.warn('⚠️ Token verified but no phone number found.');
          return res.status(400).json({ error: 'Token does not contain a phone number' });
        }
        
        // Extract 10 digits for local comparison (assuming +91)
        verifiedMobile = phoneFromToken.replace('+91', '').slice(-10);
      }
      console.log(`✅ Token verified for mobile: ${verifiedMobile}`);
    } else if (mobile && otp_code) {
      // Legacy / Mock OTP Check
      console.log('🧪 Using Mock/Legacy OTP verification...');
      const { rows: otpRows } = await db.query(
        'SELECT * FROM otp_requests WHERE mobile = $1 AND otp_code = $2 AND verified = 0 ORDER BY expires_at DESC LIMIT 1',
        [mobile, otp_code]
      );
      
      const otpRecord = otpRows[0];
      if (!otpRecord) {
        console.warn('❌ Invalid or expired OTP provided.');
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
      
      await db.query('UPDATE otp_requests SET verified = 1 WHERE id = $1', [otpRecord.id]);
      verifiedMobile = mobile;
      console.log('✅ Mock OTP verified.');
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
      console.log(`👤 Creating new user for mobile: ${verifiedMobile}`);
      const userId = uuidv4();
      await db.query('INSERT INTO users (id, mobile) VALUES ($1, $2)', [userId, verifiedMobile]);
      const { rows: newUserRows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      user = newUserRows[0];
      isNewUser = true;
    } else {
      console.log(`🏠 Existing user logged in: ${verifiedMobile}`);
      // If user exists but name is missing, we consider them "new" for profile completion purposes
      if (!user.name) isNewUser = true;
    }

    // Create Session Token
    const token = jwt.sign({ userId: user.id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

    console.log('🎉 Verification complete. Sending session token.');
    res.json({ success: true, token, user, isNewUser });
  } catch (error) {
    console.error('💥 verifyOtp Error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      code: 'AUTH_CONTROLLER_EXCEPTION'
    });
  }
};

const updateProfile = async (req, res) => {
  let { name } = req.body;
  const userId = req.user.userId;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }
  
  if (name.length > 50) {
    return res.status(400).json({ error: 'Name must be less than 50 characters long' });
  }

  name = name.trim();

  try {
    await db.query('UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [name, userId]);
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserHistory = async (req, res) => {
  const userId = req.user.userId;
  
  try {
    // Calculate rank for each submission using a correlated subquery
    const { rows } = await db.query(`
      SELECT s.*, q.title, q.zone_id,
      (
        SELECT COUNT(*) + 1
        FROM submissions s2
        WHERE s2.quiz_id = s.quiz_id 
        AND s2.total_score > s.total_score
      ) as rank
      FROM submissions s 
      JOIN quizzes q ON s.quiz_id = q.id 
      WHERE s.user_id = $1 
      ORDER BY s.submitted_at DESC
    `, [userId]);
    
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
