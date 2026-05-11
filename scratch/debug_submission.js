const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function debugSubmission() {
  try {
    const userId = '374e7b5f-9bc5-485f-a418-c754d3c3d680'; // anshiks
    const quizTitle = 'GT vs PBKS Match Quiz';
    
    const { rows: quizzes } = await db.query("SELECT id, title FROM quizzes WHERE title = $1", [quizTitle]);
    console.log('Quizzes found:', quizzes);
    
    for (const quiz of quizzes) {
      const { rows: subs } = await db.query("SELECT * FROM submissions WHERE user_id = $1 AND quiz_id = $2", [userId, quiz.id]);
      console.log(`Submissions for quiz ${quiz.id}:`, subs);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugSubmission();
