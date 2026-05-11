const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixAdmin() {
  console.log('🔄 Starting Admin Fix Script...');
  
  try {
    // 1. Test Connection
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', res.rows[0].now);

    // 2. Drop and Create Admin Table
    console.log('🔄 Recreating admins table...');
    await pool.query(`
      DROP TABLE IF EXISTS admins CASCADE;
      CREATE TABLE admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Admins table created.');

    // 3. Hash Password and Insert Admin
    const hashedPassword = await bcrypt.hash('123', 10);
    await pool.query(
      "INSERT INTO admins (id, username, password) VALUES ($1, $2, $3)",
      ['admin-1', 'admin', hashedPassword]
    );
    console.log('✅ Admin user created (username: admin, password: 123)');

    // 4. Verify
    const { rows } = await pool.query('SELECT username FROM admins');
    console.log('📊 Current Admins in DB:', rows.map(r => r.username));

  } catch (err) {
    console.error('❌ Error during fix:', err);
  } finally {
    await pool.end();
    console.log('✨ Script finished.');
  }
}

fixAdmin();
