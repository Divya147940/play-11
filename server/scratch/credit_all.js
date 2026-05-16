require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function creditAll() {
  try {
    const res = await pool.query("UPDATE users SET coins = coins + 1000 RETURNING id, coins");
    console.log(`Successfully Credited ₹1000 to ${res.rows.length} users.`);
    
    // Create transaction records for each
    for (const row of res.rows) {
      const transId = 'trans_all_' + Date.now() + '_' + row.id.slice(0, 4);
      await pool.query(
        "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [transId, row.id, 'Global Test Credit', 1000, 'credit', 'bonus', 'success']
      );
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

creditAll();
