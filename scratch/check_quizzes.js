const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const { rows: quizzes } = await pool.query(
      "SELECT id, zone_id, category_id, title, status, open_at, close_at FROM quizzes ORDER BY open_at DESC LIMIT 10"
    );
    console.log("--- QUIZZES IN DATABASE ---");
    console.log(JSON.stringify(quizzes, null, 2));
    
    const { rows: categories } = await pool.query(
      "SELECT id, zone_id, name FROM categories"
    );
    console.log("\n--- CATEGORIES IN DATABASE ---");
    console.log(JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

check();
