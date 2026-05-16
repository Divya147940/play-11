require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixPrize() {
  try {
    const res = await pool.query("UPDATE quizzes SET prize_amount = 200 WHERE id = 'bcf1973d-1a70-4133-9613-3807e3f8371c' RETURNING prize_amount");
    console.log('Successfully Updated Prize Amount:', res.rows[0].prize_amount);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixPrize();
