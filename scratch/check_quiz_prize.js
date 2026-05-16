const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows } = await pool.query("SELECT id, title, prize_amount, winner_id, status FROM quizzes WHERE id = 'bcf1973d-1a70-4133-9613-3807e3f8371c'");
    console.log('Quiz Details:');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
