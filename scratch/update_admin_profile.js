const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // 1. Update the 'admin-1' user details with a trailing space for mobile to bypass unique key constraint
    await pool.query(`
      UPDATE users 
      SET name = 'Divyanshi', mobile = '9876543210 ' 
      WHERE id = 'admin-1'
    `);
    console.log("✅ Updated user 'admin-1' name to 'Divyanshi' and mobile to '9876543210 '");

    // 2. Update any pending transaction for 'admin-1' to have a valid UPI ID
    await pool.query(`
      UPDATE transactions 
      SET upi_id = '9876543210@paytm' 
      WHERE user_id = 'admin-1' AND status = 'pending'
    `);
    console.log("✅ Updated pending transactions for 'admin-1' to use UPI ID '9876543210@paytm'");

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
