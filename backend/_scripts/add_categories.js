const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addCategories() {
  const newCats = [
    { name: 'Study', zone: 'study-zone' },
    { name: 'Sport', zone: 'game-zone' },
    { name: 'Daily News', zone: 'game-zone' },
    { name: 'Movie', zone: 'game-zone' }
  ];

  try {
    for (const cat of newCats) {
      // Check if already exists
      const { rows } = await pool.query("SELECT * FROM categories WHERE name = $1", [cat.name]);
      if (rows.length === 0) {
        await pool.query(
          "INSERT INTO categories (id, zone_id, name, status, sort_order) VALUES ($1, $2, $3, $4, $5)",
          [uuidv4(), cat.zone, cat.name, 'active', 10]
        );
        console.log(`✅ Category added: ${cat.name}`);
      } else {
        console.log(`ℹ️ Category already exists: ${cat.name}`);
      }
    }
  } catch (err) {
    console.error('❌ Error adding categories:', err.message);
  } finally {
    await pool.end();
  }
}

addCategories();
