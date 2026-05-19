// Centralized constants to prevent secret mismatch issues
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretplay11token';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-only-ultra-secret-key-123';

module.exports = {
  JWT_SECRET,
  ADMIN_JWT_SECRET
};
