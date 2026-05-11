const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkRecentSubmissions() {
  try {
    const { rows } = await db.query(`
      SELECT s.*, u.name as user_name, q.title as quiz_title 
      FROM submissions s 
      JOIN users u ON s.user_id = u.id 
      JOIN quizzes q ON s.quiz_id = q.id 
      WHERE s.submitted_at > NOW() - INTERVAL '10 minutes'
    `);
    console.log('Recent Submissions (last 10m):', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRecentSubmissions();
