require('dotenv').config();
const { pool } = require('./_src/config/db');

async function check() {
  try {
    const { rows } = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log(rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
