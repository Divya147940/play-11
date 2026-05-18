const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM transactions WHERE user_id = 'admin-1' ORDER BY created_at DESC"
    );
    console.log("--- TRANSACTIONS FOR ADMIN-1 ---");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

check();
