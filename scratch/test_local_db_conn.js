const { Client } = require('pg');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/play11';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  console.log('Connecting to local play11 database...');
  try {
    await client.connect();
    console.log('Connected successfully!');
    // Check if there are tables
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in play11:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

main();
