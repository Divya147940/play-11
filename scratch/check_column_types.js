const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/play11';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes' AND column_name IN ('open_at', 'close_at')
    `);
    console.log(res.rows);
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await client.end();
  }
}

main();
