require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function check() {
  try {
    const { rows: quizzes } = await db.query("SELECT id, title, open_at, close_at FROM quizzes WHERE title ILIKE '%IPL%'");
    console.log('Quizzes found:', quizzes);

    if (quizzes.length > 0) {
      const quizId = quizzes[0].id;
      const { rows: questions } = await db.query(`
        SELECT q.id, ca.answer_value 
        FROM questions q
        LEFT JOIN correct_answers ca ON q.id = ca.question_id
        WHERE q.quiz_id = $1
      `, [quizId]);
      console.log(`Questions for ${quizId}:`, questions.length);
      
      const { rows: subAnswers } = await db.query("SELECT * FROM information_schema.columns WHERE table_name = 'submission_answers'");
      console.log('submission_answers columns:', subAnswers.map(c => c.column_name));

      const { rows: submissionsCols } = await db.query("SELECT * FROM information_schema.columns WHERE table_name = 'submissions'");
      console.log('submissions columns:', submissionsCols.map(c => c.column_name));
    }
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

check();
