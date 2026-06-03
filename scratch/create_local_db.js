const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to postgres database.');
    
    // Check if play11 database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'play11'");
    if (res.rows.length === 0) {
      console.log('Creating database play11...');
      // CREATE DATABASE cannot run inside a transaction block, so we execute it directly
      await client.query('CREATE DATABASE play11');
      console.log('Database play11 created successfully!');
    } else {
      console.log('Database play11 already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

main();
