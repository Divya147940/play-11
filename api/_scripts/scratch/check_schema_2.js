const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    for (let table of ['question_options', 'correct_answers']) {
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.log(`Columns for ${table}:`, columns.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
