const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows } = await pool.query('SELECT * FROM admins');
    console.log('Admins in DB:', rows);
  } catch (err) {
    console.error('Error checking DB:', err.message);
  } finally {
    await pool.end();
  }
}

check();
