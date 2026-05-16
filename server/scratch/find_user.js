require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function findAndCredit() {
  try {
    // 1. Find the user who submitted a quiz in the last 15 minutes
    const subRes = await pool.query("SELECT user_id FROM submissions WHERE submitted_at > NOW() - INTERVAL '1 hour' ORDER BY submitted_at DESC LIMIT 1");
    
    if (subRes.rows.length === 0) {
      console.log('No recent quiz submissions found.');
      process.exit(0);
    }
    
    const userId = subRes.rows[0].user_id;
    console.log('Found Active User ID:', userId);
    
    // 2. Credit this user specifically
    const res = await pool.query("UPDATE users SET coins = coins + 2000 WHERE id = $1 RETURNING coins", [userId]);
    
    // 3. Add transaction
    const transId = 'trans_final_' + Date.now();
    await pool.query(
      "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [transId, userId, 'Tournament Winnings (Confirmed)', 2000, 'credit', 'win', 'success']
    );
    
    console.log(`Successfully Credited ₹2000 to Active User: ${userId}`);
    console.log('New Balance:', res.rows[0].coins);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findAndCredit();
