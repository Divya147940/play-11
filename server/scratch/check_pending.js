require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPending() {
  try {
    const { rows } = await pool.query("SELECT * FROM transactions WHERE status = 'pending'");
    console.log('PENDING_COUNT:' + rows.length);
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkPending();
