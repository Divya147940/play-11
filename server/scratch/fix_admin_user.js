require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixAdminUser() {
  try {
    // 1. Create a real user record for 'admin-1'
    await pool.query(`
      INSERT INTO users (id, mobile, name, coins) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET coins = users.coins + 2000
    `, ['admin-1', '0000000000', 'Admin User', 2000]);
    
    // 2. Add a transaction record for 'admin-1'
    const transId = 'trans_admin_' + Date.now();
    await pool.query(
      "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [transId, 'admin-1', 'Admin Test Credit', 2000, 'credit', 'bonus', 'success']
    );
    
    console.log('Successfully created/updated real User record for admin-1 and credited ₹2000');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAdminUser();
