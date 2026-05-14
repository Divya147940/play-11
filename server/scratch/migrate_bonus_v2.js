require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('Running migrations...');
    
    // Add columns
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE");
    await pool.query("ALTER TABLE settings ADD COLUMN IF NOT EXISTS description TEXT");
    console.log('Tables updated.');

    const settings = [
      { key: 'welcome_bonus', value: '100', description: 'Bonus for new users' },
      { key: 'referral_referrer_bonus', value: '50', description: 'Bonus for inviter' },
      { key: 'referral_referee_bonus', value: '25', description: 'Bonus for invited user' }
    ];

    for (const s of settings) {
      await pool.query(`
        INSERT INTO settings (key, value, description) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (key) DO UPDATE SET value = $2, description = $3
      `, [s.key, s.value, s.description]);
    }
    console.log('Settings updated.');

    const { rows: users } = await pool.query("SELECT id FROM users WHERE referral_code IS NULL");
    for (const user of users) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      try {
        await pool.query("UPDATE users SET referral_code = $1 WHERE id = $2", [code, user.id]);
      } catch (e) {}
    }
    console.log('Referral codes generated.');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
