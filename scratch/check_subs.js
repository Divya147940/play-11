const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows: subs } = await pool.query('SELECT s.*, q.title FROM submissions s JOIN quizzes q ON s.quiz_id = q.id ORDER BY s.submitted_at DESC LIMIT 5');
    console.log('Recent Submissions:');
    console.log(JSON.stringify(subs, null, 2));

    const { rows: txs } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5');
    console.log('Recent Transactions:');
    console.log(JSON.stringify(txs, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
