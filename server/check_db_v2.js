require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkSubmissions() {
  try {
    const { rows: submissions } = await pool.query('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 5');
    console.log('--- Recent Submissions ---');
    console.log(JSON.stringify(submissions, null, 2));

    const { rows: counts } = await pool.query('SELECT COUNT(*) FROM submissions');
    console.log('Total submissions:', counts[0].count);

    const { rows: quizzes } = await pool.query('SELECT id, title FROM quizzes');
    console.log('--- All Quizzes ---');
    console.log(JSON.stringify(quizzes, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

checkSubmissions();
