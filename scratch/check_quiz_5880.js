const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkSpecificQuiz() {
  try {
    const id = '5880e881-0554-4aba-8fdf-7bd5e3055b31';
    const { rows: quiz } = await db.query("SELECT * FROM quizzes WHERE id = $1", [id]);
    console.log('Quiz Data:', quiz);
    
    const { rows: questions } = await db.query("SELECT * FROM questions WHERE quiz_id = $1", [id]);
    console.log('Questions Count:', questions.length);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSpecificQuiz();
