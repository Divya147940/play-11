const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function openAllQuizzes() {
  try {
    const { rowCount } = await db.query(`
      UPDATE quizzes 
      SET open_at = NOW() - INTERVAL '1 hour', 
          close_at = NOW() + INTERVAL '24 hours'
      WHERE zone_id = 'sport-zone'
    `);
    console.log(`Updated ${rowCount} quizzes to be OPEN.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

openAllQuizzes();
