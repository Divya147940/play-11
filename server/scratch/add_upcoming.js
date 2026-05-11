const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

async function addUpcoming() {
  try {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const end = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    await pool.query(`
      INSERT INTO quizzes (id, title, status, open_at, close_at, zone_id, category_id, total_questions, entry_amount, reward_text) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET open_at = EXCLUDED.open_at, close_at = EXCLUDED.close_at
    `, ['upcoming-sample-1', 'Upcoming Mega Quiz', 'active', future, end, 'sport-zone', 'sports', 15, 20, '₹1000 Pool']);
    console.log('Inserted/Updated upcoming quiz');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

addUpcoming();
