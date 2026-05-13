require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function checkOrphans() {
  try {
    const { rows: orphans } = await db.query(`
      SELECT s.id, s.quiz_id, s.submitted_at 
      FROM submissions s
      LEFT JOIN quizzes q ON s.quiz_id = q.id
      WHERE q.id IS NULL
    `);
    console.log('Orphaned submissions (no matching quiz):', orphans);

    const { rows: allSubs } = await db.query('SELECT COUNT(*) as count FROM submissions');
    console.log('Total submissions:', allSubs[0].count);

    const { rows: userSubs } = await db.query('SELECT user_id, COUNT(*) FROM submissions GROUP BY user_id');
    console.log('Submissions per user:', userSubs);

  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

checkOrphans();
