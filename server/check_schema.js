require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    console.log('Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name).join(', '));

    console.log('\nChecking users columns...');
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('Users Columns:', columns.rows.map(r => r.column_name).join(', '));

    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
