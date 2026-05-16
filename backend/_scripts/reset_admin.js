const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetAdmin() {
  try {
    // Delete existing admin with id admin-1 or username admin
    await pool.query("DELETE FROM admins WHERE id = 'admin-1' OR username = 'admin' OR username = 'admin@play11.com'");
    
    // Insert fresh admin
    await pool.query(
      "INSERT INTO admins (id, username, password) VALUES ($1, $2, $3)",
      ['admin-1', 'admin', '123']
    );
    
    console.log('✅ Admin credentials reset to admin / 123');
  } catch (err) {
    console.error('❌ Error resetting admin:', err.message);
  } finally {
    await pool.end();
  }
}

resetAdmin();
