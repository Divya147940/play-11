const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Check if admin-1 user exists in users table
    const { rows } = await pool.query("SELECT * FROM users WHERE id = 'admin-1'");
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO users (id, mobile, name, coins, points, status) 
        VALUES ('admin-1', '9999999999', 'Admin Tester', 100, 0, 'active')
      `);
      console.log("✅ Dummy user record for 'admin-1' successfully created in users table!");
    } else {
      console.log("ℹ️ Dummy user record for 'admin-1' already exists.");
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

run();
