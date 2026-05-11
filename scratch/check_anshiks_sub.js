const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkSpecificSubmission() {
  try {
    const userId = '374e7b5f-9bc5-485f-a418-c754d3c3d680'; // anshiks
    const quizId = '5880e881-0554-4aba-8fdf-7bd5e3055b31';
    
    const { rows } = await db.query("SELECT * FROM submissions WHERE user_id = $1 AND quiz_id = $2", [userId, quizId]);
    console.log('Submission found:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSpecificSubmission();
