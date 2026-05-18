const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function testRedeem() {
  const client = await pool.connect();
  try {
    const userId = 'admin-1';
    const code = 'WUYYU';

    console.log(`Simulating voucher redemption of code "${code}" for user "${userId}"...`);
    await client.query('BEGIN');

    // 1. Find the voucher
    const { rows: voucherRows } = await client.query("SELECT * FROM vouchers WHERE code = $1 AND status = 'active'", [code]);
    if (voucherRows.length === 0) {
      console.log('❌ Voucher not found or not active');
      await client.query('ROLLBACK');
      return;
    }
    const voucher = voucherRows[0];
    console.log("Voucher details fetched:", voucher);

    // 2. Check if user already used it
    const { rows: userVoucherRows } = await client.query(
      'SELECT * FROM user_vouchers WHERE user_id = $1 AND voucher_id = $2',
      [userId, voucher.id]
    );
    console.log(`User voucher records found: ${userVoucherRows.length}`);

    if (userVoucherRows.length > 0 && userVoucherRows[0].status === 'used') {
      console.log('❌ Already redeemed');
      await client.query('ROLLBACK');
      return;
    }

    // 3. Apply the reward based on type
    let walletUpdateQuery = '';
    let category = 'bonus';
    
    if (voucher.type === 'cash') {
      walletUpdateQuery = 'UPDATE users SET coins = coins + $1 WHERE id = $2';
      category = 'deposit';
    } else {
      walletUpdateQuery = 'UPDATE users SET bonus = bonus + $1 WHERE id = $2';
      category = 'bonus';
    }

    console.log(`Running update query: ${walletUpdateQuery} with amount ${voucher.amount}`);
    await client.query(walletUpdateQuery, [voucher.amount, userId]);
    
    // Record transaction
    const txId = `tx-${uuidv4().substring(0, 8)}`;
    console.log(`Inserting transaction ${txId}...`);
    
    // Check if references users or what columns are in transactions table
    await client.query(
      'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [txId, userId, `Voucher Redeemed: ${voucher.code}`, voucher.amount, 'credit', category, 'success']
    );

    // 4. Update user_vouchers record
    if (userVoucherRows.length > 0) {
      console.log("Updating existing user_voucher record...");
      await client.query(
        "UPDATE user_vouchers SET status = 'used', redeemed_at = CURRENT_TIMESTAMP WHERE id = $1",
        [userVoucherRows[0].id]
      );
    } else {
      console.log("Inserting new user_voucher record...");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (voucher.expiry_days || 30));
      
      await client.query(
        'INSERT INTO user_vouchers (id, user_id, voucher_id, status, redeemed_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [uuidv4(), userId, voucher.id, 'used', new Date(), expiresAt]
      );
    }

    await client.query('COMMIT');
    console.log("✅ Simulation successful! Transaction committed!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ SIMULATION ERROR:', error);
  } finally {
    client.release();
    pool.end();
  }
}

testRedeem();
