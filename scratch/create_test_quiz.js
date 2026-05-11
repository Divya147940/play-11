require('dotenv').config({ path: './server/.env' });
const { db } = require('../api/_src/config/db');
const { v4: uuidv4 } = require('uuid');

async function createTestQuiz() {
  const quizId = uuidv4();
  const qId = uuidv4();
  try {
    await db.query('BEGIN');
    
    await db.query(
      "INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, entry_amount, open_at, close_at, status, marks_per_q) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      [quizId, 'movie-zone', '1925aafc-09fc-426b-b3f1-c8105183ea0d', 'Direct DB Test Movie Quiz', 'Created via script', 1, 8, 0, new Date(), new Date(Date.now() + 3600000), 'active', 2]
    );

    await db.query(
      "INSERT INTO questions (id, quiz_id, question_text, marks) VALUES ($1, $2, $3, $4)",
      [qId, quizId, 'Is this working?', 2]
    );

    await db.query(
      "INSERT INTO question_options (id, question_id, option_text, option_value) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
      [uuidv4(), qId, 'Yes', '0', uuidv4(), qId, 'No', '1']
    );

    await db.query(
      "INSERT INTO correct_answers (id, question_id, answer_value) VALUES ($1, $2, $3)",
      [uuidv4(), qId, '0']
    );

    await db.query('COMMIT');
    console.log('Quiz created successfully with ID:', quizId);
    process.exit(0);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    process.exit(1);
  }
}

createTestQuiz();
