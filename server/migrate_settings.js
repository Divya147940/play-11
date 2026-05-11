require('dotenv').config();
const { pool } = require('./_src/config/db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    
    // Insert default banners if not exists
    await pool.query(`
      INSERT INTO settings (key, value)
      VALUES 
        ('home_banner_url', ''),
        ('quiz_room_banner_url', '')
      ON CONFLICT (key) DO NOTHING
    `);

    console.log("Settings table created successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit();
  }
}
migrate();
