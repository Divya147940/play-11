require('dotenv').config();
const { pool } = require('./_src/config/db');

async function checkAdmin() {
  try {
    const res = await pool.query('SELECT * FROM admins');
    console.log('Admins found:', res.rows);
  } catch (err) {
    console.error('Error checking admins:', err.message);
    if (err.message.includes('relation "admins" does not exist')) {
        console.log('Table "admins" does not exist. Initializing...');
        const { initDB } = require('./_src/config/db');
        await initDB();
        const res2 = await pool.query('SELECT * FROM admins');
        console.log('Admins found after init:', res2.rows);
    }
  } finally {
    process.exit();
  }
}

checkAdmin();
