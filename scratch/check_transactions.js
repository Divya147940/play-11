const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const txs = await pool.query("SELECT * FROM transactions WHERE status = 'pending'");
    console.log("--- PENDING TRANSACTIONS ---");
    console.log(txs.rows);

    const users = await pool.query("SELECT id, name, mobile FROM users");
    console.log("--- ALL USERS ---");
    console.log(users.rows);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
