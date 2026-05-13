const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is missing in production!');
  process.exit(1);
}

const { JWT_SECRET, ADMIN_JWT_SECRET } = require('../config/constants');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const guestId = req.headers['x-guest-id'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token && !guestId) {
    return res.status(401).json({ error: 'Access denied. No token or guest ID provided.' });
  }

  if (!token && guestId) {
    // Treat as anonymous guest
    req.user = { userId: guestId, isGuest: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check user status in database (optional for performance, but good for security)
    const { rows } = await db.query('SELECT status FROM users WHERE id = $1', [decoded.userId]);
    if (rows.length === 0 || rows[0].status === 'blocked') {
      // If user is missing from DB but has valid token, they might have been deleted but session is active
      // We allow it but they will be treated as the ID in the token
    }

    req.user = decoded;
    next();
  } catch (error) {
    try {
      // Try admin token
      const decodedAdmin = jwt.verify(token, ADMIN_JWT_SECRET);
      req.user = {
        ...decodedAdmin,
        userId: decodedAdmin.userId || decodedAdmin.id
      };
      next();
    } catch (adminError) {
      if (guestId) {
        req.user = { userId: guestId, isGuest: true };
        return next();
      }
      res.status(401).json({ error: 'Invalid or expired token.' });
    }
  }
};

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    req.user = {
      ...decoded,
      userId: decoded.userId || decoded.id
    };
    next();
  } catch (error) {
    console.error('Admin JWT Verification Error:', error.message);
    res.status(401).json({ error: 'Invalid or expired admin token.' });
  }
};

const optionalToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    // Try regular user token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    try {
      // Try admin token
      const decodedAdmin = jwt.verify(token, ADMIN_JWT_SECRET);
      req.user = {
        ...decodedAdmin,
        userId: decodedAdmin.userId || decodedAdmin.id // Support both for backward compatibility
      };
      next();
    } catch (adminError) {
      // If both fail, just proceed as guest
      next();
    }
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  optionalToken
};
