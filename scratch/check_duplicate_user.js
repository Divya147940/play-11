const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const dupId = 'e356504c-0883-43ab-b76e-a59313f6a741';
    
    const txs = await pool.query("SELECT COUNT(*) FROM transactions WHERE user_id = $1", [dupId]);
    const subs = await pool.query("SELECT COUNT(*) FROM submissions WHERE user_id = $1", [dupId]);
    
    console.log(`Duplicate User ${dupId} has:`);
    console.log(`- Transactions count: ${txs.rows[0].count}`);
    console.log(`- Submissions count: ${subs.rows[0].count}`);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
