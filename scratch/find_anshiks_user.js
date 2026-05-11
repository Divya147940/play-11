const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function findAnshiksUser() {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE name ILIKE '%anshiks%' OR email ILIKE '%anshiks%'");
    console.log('Anshiks User:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findAnshiksUser();
