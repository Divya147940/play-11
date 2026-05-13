require('dotenv').config({ path: './server/.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  const client = await pool.connect();
  try {
    const { rows: users } = await client.query('SELECT id, mobile, name FROM users LIMIT 5');
    console.log('Users:', users);

    const { rows: subs } = await client.query('SELECT id, user_id, quiz_id, submitted_at FROM submissions ORDER BY submitted_at DESC LIMIT 5');
    console.log('Recent Submissions:', subs);

    if (subs.length > 0) {
       const lastUserId = subs[0].user_id;
       const { rows: userHistory } = await client.query('SELECT COUNT(*) FROM submissions WHERE user_id = $1', [lastUserId]);
       console.log(`Submissions for user ${lastUserId}:`, userHistory[0].count);
    }
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

checkData();
