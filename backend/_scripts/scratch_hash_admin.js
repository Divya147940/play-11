const { pool } = require('./_src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function hashAdmin() {
  try {
    const hash = await bcrypt.hash('123', 10);
    console.log('New Hash:', hash);
    await pool.query("UPDATE admins SET password = $1 WHERE username = 'admin'", [hash]);
    console.log('Admin password hashed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

hashAdmin();
