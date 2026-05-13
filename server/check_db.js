const { db } = require('./_src/config/db');

async function checkSubmissions() {
  try {
    const { rows: submissions } = await db.query('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 5');
    console.log('--- Recent Submissions ---');
    console.log(JSON.stringify(submissions, null, 2));

    const { rows: counts } = await db.query('SELECT COUNT(*) FROM submissions');
    console.log('Total submissions:', counts[0].count);

    const { rows: users } = await db.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('--- Recent Users ---');
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkSubmissions();
