require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function credit() {
  try {
    // 1. Get the first user
    const userRes = await pool.query("SELECT id, name FROM users LIMIT 1");
    if (userRes.rows.length === 0) {
      console.log('No users found to credit.');
      process.exit(0);
    }
    
    const userId = userRes.rows[0].id;
    const userName = userRes.rows[0].name;
    
    // 2. Update coins in users table
    const res = await pool.query("UPDATE users SET coins = coins + 500 WHERE id = $1 RETURNING coins", [userId]);
    
    // 3. Add transaction record (using columns from transactions table)
    // Table schema: id, user_id, title, amount, type, category, status
    const transId = 'trans_' + Date.now();
    await pool.query(
      "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [transId, userId, 'Quiz Winnings (Test)', 500, 'credit', 'win', 'success']
    );
    
    console.log(`Successfully Credited ₹500 to User: ${userName} (${userId})`);
    console.log('New Balance (Coins):', res.rows[0].coins);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

credit();
