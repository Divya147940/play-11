require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
  try {
    const voucherCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vouchers'
    `);
    console.log('Vouchers Table Columns:');
    voucherCols.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    const userVoucherCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_vouchers'
    `);
    console.log('\nUser Vouchers Table Columns:');
    userVoucherCols.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkSchema();
