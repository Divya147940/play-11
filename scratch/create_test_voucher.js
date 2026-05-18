const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Delete existing test vouchers if any
    await pool.query("DELETE FROM vouchers WHERE code = 'NEWVOUCHER'");
    
    // Insert new voucher
    await pool.query(`
      INSERT INTO vouchers (id, title, code, discount_text, amount, type, color, expiry_days, status) 
      VALUES ('v-test-1', 'TESTING VOUCHER', 'NEWVOUCHER', '₹10 Cash', 10, 'cash', '#10b981', 30, 'active')
    `);
    
    console.log("✅ Brand new voucher 'NEWVOUCHER' successfully created!");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
