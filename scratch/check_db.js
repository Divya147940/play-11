const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkSubmissions() {
  try {
    const { rows } = await db.query('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 10');
    console.log('Recent Submissions:', JSON.stringify(rows, null, 2));
    
    const { rows: quizzes } = await db.query('SELECT id, title, zone_id FROM quizzes WHERE status = \'active\'');
    console.log('Active Quizzes:', JSON.stringify(quizzes, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSubmissions();
