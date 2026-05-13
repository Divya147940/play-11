require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function checkQuizzes() {
  try {
    const { rows } = await db.query('SELECT id, title FROM quizzes');
    console.log('Total Quizzes:', rows.length);
    console.log('Quizzes:', rows);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

checkQuizzes();
