require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkNow() {
  try {
    const { rows } = await pool.query("SELECT CURRENT_TIMESTAMP as now_db, now() as now_func, LOCALTIMESTAMP as now_local");
    console.log(JSON.stringify(rows, null, 2));
    console.log('Node Time:', new Date().toISOString());
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkNow();
