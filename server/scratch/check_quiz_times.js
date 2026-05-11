require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkQuizzes() {
  try {
    const { rows } = await pool.query('SELECT id, title, open_at, close_at, timer_minutes FROM quizzes ORDER BY open_at DESC LIMIT 10');
    console.log(JSON.stringify(rows, null, 2));
    console.log('\nCurrent Server Time:', new Date().toISOString());
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkQuizzes();
