const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows: vouchers } = await pool.query(
      "SELECT id, title, code, discount_text, amount, type, status FROM vouchers ORDER BY id DESC LIMIT 10"
    );
    console.log("--- VOUCHERS IN DATABASE ---");
    console.log(JSON.stringify(vouchers, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

check();
