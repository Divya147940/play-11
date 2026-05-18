const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Delete existing
    await pool.query("DELETE FROM vouchers WHERE code = 'TIMERTEST'");
    
    // 29 hours in the future
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 29);
    
    // Insert new voucher with expires_at set
    await pool.query(`
      INSERT INTO vouchers (id, title, code, discount_text, amount, type, color, expiry_days, status, expires_at) 
      VALUES ('v-timer-1', 'FLASH SALE VOUCHER', 'TIMERTEST', '₹50 Cash', 50, 'cash', '#f43f5e', 30, 'active', $1)
    `, [expiresAt]);
    
    console.log("✅ Voucher 'TIMERTEST' successfully created with expires_at set to:", expiresAt);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
