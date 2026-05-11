const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function createIndexes() {
  try {
    console.log('Creating index on submissions(quiz_id)...');
    await db.query("CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id ON submissions(quiz_id)");
    
    console.log('Creating index on submissions(user_id)...');
    await db.query("CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)");
    
    console.log('Creating index on quizzes(zone_id)...');
    await db.query("CREATE INDEX IF NOT EXISTS idx_quizzes_zone_id ON quizzes(zone_id)");
    
    console.log('All indexes created successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createIndexes();
