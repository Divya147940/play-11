require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addWinningTx() {
  try {
    const userId = 'admin-1';
    const transId = 'win_' + Date.now();
    
    // Add a real winning transaction
    await pool.query(
      "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [transId, userId, 'IPL Quiz Final Battle', 500, 'credit', 'win', 'success']
    );
    
    // Also update balance
    await pool.query("UPDATE users SET coins = coins + 500 WHERE id = $1", [userId]);
    
    console.log('Successfully added a WINNING transaction for admin-1');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addWinningTx();
