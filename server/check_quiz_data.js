require('dotenv').config();
const { db } = require('./_src/config/db');

async function checkData() {
  try {
    const { rows: questions } = await db.query(`
      SELECT q.id, q.question_text, 
             (SELECT json_agg(qo.option_text ORDER BY qo.option_value) FROM question_options qo WHERE qo.question_id = q.id) as options,
             (SELECT answer_value FROM correct_answers ca WHERE ca.question_id = q.id) as correct_val
      FROM questions q 
      ORDER BY q.id DESC 
      LIMIT 10
    `);
    console.log(JSON.stringify(questions, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
