require('dotenv').config({ path: './server/.env' });
const { db } = require('../api/_src/config/db');

async function checkSchema() {
  try {
    const tables = ['quizzes', 'questions', 'question_options', 'correct_answers'];
    for (const table of tables) {
      const { rows } = await db.query(`
        SELECT column_name, is_nullable, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.log(`Table: ${table.toUpperCase()}`);
      console.table(rows);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
