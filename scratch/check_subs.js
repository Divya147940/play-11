require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function checkSubmissions() {
  try {
    const { rows: subs } = await db.query(`
      SELECT s.*, q.title 
      FROM submissions s
      LEFT JOIN quizzes q ON s.quiz_id = q.id
      ORDER BY s.submitted_at DESC
      LIMIT 5
    `);
    console.log('Recent submissions:', subs);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

checkSubmissions();
