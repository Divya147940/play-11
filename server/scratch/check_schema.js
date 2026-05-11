const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

async function checkSchema() {
  try {
    const { rows } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes'
    `);
    console.log(JSON.stringify(rows, null, 2));
    
    const { rows: timeRows } = await pool.query(`SELECT CURRENT_TIMESTAMP as now`);
    console.log("Current DB Time:", timeRows[0].now);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
