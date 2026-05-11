
require('dotenv').config({ path: './server/.env' });
const { db } = require('../server/_src/config/db');

async function enforceUniqueSubmissions() {
  try {
    console.log("Enforcing unique submissions...");

    // 1. Find duplicates
    const { rows: duplicates } = await db.query(`
      SELECT user_id, quiz_id, count(*) 
      FROM submissions 
      GROUP BY user_id, quiz_id 
      HAVING count(*) > 1
    `);

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} sets of duplicate submissions. Cleaning up...`);
      for (const dup of duplicates) {
        // Keep the most recent submission, delete the rest
        await db.query(`
          DELETE FROM submissions 
          WHERE id IN (
            SELECT id FROM (
              SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, quiz_id ORDER BY submitted_at DESC) as rn
              FROM submissions
              WHERE user_id = $1 AND quiz_id = $2
            ) t
            WHERE t.rn > 1
          )
        `, [dup.user_id, dup.quiz_id]);
      }
      console.log("Cleanup complete.");
    } else {
      console.log("No duplicates found.");
    }

    // 2. Add Unique Constraint
    console.log("Adding UNIQUE constraint to submissions(user_id, quiz_id)...");
    try {
      await db.query('ALTER TABLE submissions ADD CONSTRAINT unique_user_quiz_submission UNIQUE (user_id, quiz_id)');
      console.log("✅ Unique constraint added successfully.");
    } catch (err) {
      if (err.code === '42P16') {
        console.log("Constraint already exists.");
      } else {
        throw err;
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

enforceUniqueSubmissions();
