const { db } = require('../server/_src/config/db');

async function checkSubmissions() {
  try {
    const { rows } = await db.query('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 5');
    console.log('Latest Submissions:', JSON.stringify(rows, null, 2));
    
    const { rows: quizzes } = await db.query('SELECT id, title FROM quizzes LIMIT 5');
    console.log('Quizzes:', JSON.stringify(quizzes, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSubmissions();
