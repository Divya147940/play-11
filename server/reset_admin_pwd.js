require('dotenv').config();
const { pool } = require('./_src/config/db');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    const hashedPassword = await bcrypt.hash('123', 10);
    await pool.query('UPDATE admins SET password = $1 WHERE username = $2', [hashedPassword, 'admin']);
    console.log('Admin password reset to 123');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
reset();
