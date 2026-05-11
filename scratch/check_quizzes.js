require('dotenv').config({ path: './server/.env' });
const { db } = require('../api/_src/config/db');

async function check() {
  try {
    const { rows: quizzes } = await db.query(`
      SELECT q.id, q.title, q.zone_id, q.status, c.name as category_name, q.created_at
      FROM quizzes q
      LEFT JOIN categories c ON q.category_id = c.id
      ORDER BY q.created_at DESC
    `);
    console.log('ALL QUIZZES:', JSON.stringify(quizzes, null, 2));
    
    const { rows: categories } = await db.query("SELECT id, name, zone_id FROM categories");
    console.log('CATEGORIES:', JSON.stringify(categories, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
