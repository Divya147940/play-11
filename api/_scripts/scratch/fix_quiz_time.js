const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function update() {
  try {
    const res = await pool.query(`
      UPDATE quizzes 
      SET open_at = CURRENT_TIMESTAMP - INTERVAL '10 minutes',
          close_at = CURRENT_TIMESTAMP + INTERVAL '10 hours'
      WHERE title = 'Bollywood Blockbuster Trivia'
    `);
    console.log('Quiz updated successfully:', res.rowCount);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

update();
