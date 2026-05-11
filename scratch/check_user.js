const { Pool } = require('pg');
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function checkUser() {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE id = '374e7b5f-9bc5-485f-a418-c754d3c3d680'");
    console.log('User:', JSON.stringify(rows, null, 2));
    
    const { rows: allUsers } = await db.query("SELECT id, name, phone FROM users ORDER BY created_at DESC LIMIT 5");
    console.log('Recent Users:', JSON.stringify(allUsers, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser();
