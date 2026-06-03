const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/play11';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    const timeRes = await client.query('SELECT NOW()');
    const tzRes = await client.query('SHOW TIMEZONE');
    console.log('Local PG NOW():', timeRes.rows[0].now);
    console.log('Local PG TIMEZONE:', tzRes.rows[0].TimeZone);
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await client.end();
  }
}

main();
