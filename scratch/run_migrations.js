const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log("Triggering vouchers column check and manual migration...");
    await pool.query(`
      ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
    `);
    
    const { rows } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vouchers'
    `);
    console.log("--- vouchers COLUMNS ---");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error("Migration/Check Error:", err);
  } finally {
    pool.end();
  }
}

run();
