const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkAnswersTable() {
  try {
    const { rows } = await db.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'submission_answers'");
    console.log('Submission Answers Table:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAnswersTable();
