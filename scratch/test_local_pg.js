const { Client } = require('pg');

const passwords = ['postgres', 'admin', 'root', 'password', '123', ''];
const user = 'postgres';
const host = 'localhost';
const database = 'postgres'; // or neondb or play11

async function tryConnect(password) {
  const client = new Client({
    host,
    port: 5432,
    user,
    password,
    database,
  });
  try {
    await client.connect();
    console.log(`Success! Password: "${password}"`);
    // Try to see what databases exist
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('Databases:', res.rows.map(r => r.datname));
    await client.end();
    return true;
  } catch (err) {
    console.log(`Failed with password "${password}":`, err.message);
    return false;
  }
}

async function main() {
  for (const pw of passwords) {
    if (await tryConnect(pw)) {
      break;
    }
  }
}

main();
