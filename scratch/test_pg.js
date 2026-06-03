const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  console.log('Connecting to Postgres via node pg...');
  try {
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT COUNT(*) FROM quizzes');
    console.log('Quizzes count:', res.rows[0].count);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

main();
