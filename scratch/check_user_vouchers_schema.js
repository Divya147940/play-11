const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const { rows } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_vouchers'
    `);
    console.log("--- user_vouchers COLUMNS ---");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
