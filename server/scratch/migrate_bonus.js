require('dotenv').config();
const { pool } = require('../_src/config/db');

async function migrate() {
  try {
    console.log('Running migrations...');
    
    // 1. Add referral columns to users
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
    `);
    console.log('User table updated.');

    // 2. Initialize settings for bonus
    const settings = [
      { key: 'welcome_bonus', value: '100', description: 'Bonus amount for new registrations' },
      { key: 'referral_referrer_bonus', value: '50', description: 'Bonus for the person who invites' },
      { key: 'referral_referee_bonus', value: '25', description: 'Bonus for the person who joins via referral' }
    ];

    for (const s of settings) {
      await pool.query(`
        INSERT INTO settings (key, value, description) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (key) DO NOTHING
      `, [s.key, s.value, s.description]);
    }
    console.log('Settings seeded.');

    // 3. Generate referral codes for existing users who don't have one
    const { rows: users } = await pool.query("SELECT id FROM users WHERE referral_code IS NULL");
    for (const user of users) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await pool.query("UPDATE users SET referral_code = $1 WHERE id = $2", [code, user.id]);
    }
    console.log(`Generated referral codes for ${users.length} users.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
