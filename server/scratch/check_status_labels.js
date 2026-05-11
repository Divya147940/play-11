require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkStatusLabels() {
  try {
    const { rows } = await pool.query(`
      SELECT title, open_at, close_at,
      CASE 
        WHEN open_at > CURRENT_TIMESTAMP + interval '1 minute' THEN 'UPCOMING'
        WHEN close_at < CURRENT_TIMESTAMP - interval '1 minute' THEN 'CLOSED'
        ELSE 'LIVE'
      END as status_label
      FROM quizzes 
      WHERE status = 'active'
      ORDER BY open_at DESC LIMIT 10
    `);
    console.log(JSON.stringify(rows, null, 2));
    const now = await pool.query('SELECT CURRENT_TIMESTAMP');
    console.log('\nDB Now:', now.rows[0].current_timestamp);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkStatusLabels();
