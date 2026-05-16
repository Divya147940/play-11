const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanQuizzes() {
  console.log('🔄 Starting Quiz Cleanup Script...');
  
  try {
    // 1. Delete quizzes with title 'Anything'
    console.log('🔄 Removing "Anything" quizzes...');
    const delRes = await pool.query("DELETE FROM quizzes WHERE title ILIKE '%Anything%'");
    console.log(`✅ Removed ${delRes.rowCount} quizzes.`);

    // 2. Ensure Study Zone has the correct initial quizzes if it's empty
    const { rows: studyQuizzes } = await pool.query("SELECT COUNT(*) as count FROM quizzes WHERE zone_id = 'study-zone'");
    if (parseInt(studyQuizzes[0].count) === 0) {
      console.log('🔄 Seeding default Study Arena quiz...');
      // Insert a real quiz to replace the dummy ones
      await pool.query(`
        INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, status, marks_per_q, entry_type, open_at, close_at)
        VALUES ('ssc-mock-1', 'study-zone', 'cat-1', 'SSC CGL Tier 1 Mock', 'Full syllabus mock test', 10, 10, 'active', 2, 'free', NOW(), NOW() + INTERVAL '7 days')
      `);
      console.log('✅ Default study quiz seeded.');
    }

  } catch (err) {
    console.error('❌ Error during cleanup:', err);
  } finally {
    await pool.end();
    console.log('✨ Cleanup finished.');
  }
}

cleanQuizzes();
