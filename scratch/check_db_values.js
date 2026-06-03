const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/play11';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, title, open_at, close_at FROM quizzes');
    console.log('Quizzes raw DB values:');
    res.rows.forEach(r => {
      console.log(`- ${r.title}: open_at=${r.open_at}, close_at=${r.close_at}`);
    });
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await client.end();
  }
}

main();
