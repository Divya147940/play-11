const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

async function checkQuizzes() {
  try {
    const { rows } = await pool.query(`
      SELECT id, title, status, open_at, close_at, zone_id,
      CASE 
        WHEN open_at > CURRENT_TIMESTAMP THEN 'UPCOMING'
        WHEN close_at < CURRENT_TIMESTAMP THEN 'CLOSED'
        ELSE 'LIVE'
      END as status_label
      FROM quizzes
      WHERE status = 'active'
    `);
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkQuizzes();
