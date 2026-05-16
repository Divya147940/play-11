require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateSchema() {
  try {
    await pool.query("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS reference_id TEXT");
    
    // Also update existing win transactions to point to a valid quiz (for testing)
    // Quiz ID: bcf1973d-1a70-4133-9613-3807e3f8371c (IPL Qui)
    await pool.query("UPDATE transactions SET reference_id = 'bcf1973d-1a70-4133-9613-3807e3f8371c' WHERE category = 'win'");
    
    console.log('Database Schema Updated Successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateSchema();
