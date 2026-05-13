require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function testHistory() {
  const userId = '374e7b5f-9bc5-485f-a418-c754d3c3d680'; // anshiks
  try {
    const query = `
      SELECT s.*, q.title, q.zone_id, q.winner_id as quiz_winner_id, q.prize_amount, 
             COALESCE(u.name, 'Admin Declared') as winner_name,
             CASE WHEN s.user_id = q.winner_id THEN q.prize_amount ELSE 0 END as display_won_amount,
             (
               SELECT COUNT(*) + 1
               FROM submissions s2
               WHERE s2.quiz_id = s.quiz_id 
               AND s2.total_score > s.total_score
             ) as leaderboard_rank
      FROM submissions s 
      LEFT JOIN quizzes q ON s.quiz_id = q.id 
      LEFT JOIN users u ON q.winner_id = u.id
      WHERE s.user_id = $1 
      ORDER BY s.submitted_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    console.log('History Rows:', rows.length);
    rows.forEach((r, i) => {
      console.log(`${i+1}. QuizID: ${r.quiz_id}, Title: ${r.title}, SubmittedAt: ${r.submitted_at}`);
    });
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    process.exit();
  }
}

testHistory();
