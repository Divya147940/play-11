require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function reset() {
  try {
    const res = await pool.query("DELETE FROM submissions WHERE quiz_id = 'bcf1973d-1a70-4133-9613-3807e3f8371c'");
    console.log('Successfully Deleted Submissions:', res.rowCount);
    
    // Also reset the winner just in case
    await pool.query("UPDATE quizzes SET status = 'active', winner_id = NULL WHERE id = 'bcf1973d-1a70-4133-9613-3807e3f8371c'");
    console.log('Quiz Status Reset to Active');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reset();
