const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getVouchers = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get active vouchers from master list and join with user status
    const { rows } = await db.query(`
      SELECT v.*, uv.status as user_status, uv.redeemed_at, uv.expires_at as user_expires_at
      FROM vouchers v
      LEFT JOIN user_vouchers uv ON v.id = uv.voucher_id AND uv.user_id = $1
      WHERE v.status = 'active'
    `, [userId]);

    res.json({ success: true, vouchers: rows });
  } catch (error) {
    console.error('Get Vouchers Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.redeemVoucher = async (req, res) => {
  const { pool } = require('../config/db');
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Voucher code is required' });
    }

    await client.query('BEGIN');

    // 1. Find the voucher
    const { rows: voucherRows } = await client.query("SELECT * FROM vouchers WHERE code = $1 AND status = 'active'", [code]);
    if (voucherRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired voucher code' });
    }
    const voucher = voucherRows[0];

    // 2. Check if user already used it
    const { rows: userVoucherRows } = await client.query(
      'SELECT * FROM user_vouchers WHERE user_id = $1 AND voucher_id = $2',
      [userId, voucher.id]
    );

    if (userVoucherRows.length > 0 && userVoucherRows[0].status === 'used') {
      return res.status(400).json({ success: false, message: 'You have already redeemed this voucher' });
    }

    // 3. Apply the reward based on type
    if (voucher.type === 'bonus') {
      await client.query('UPDATE users SET bonus = bonus + $1 WHERE id = $2', [voucher.amount, userId]);
      
      // Record transaction
      const txId = `tx-${uuidv4().substring(0, 8)}`;
      await client.query(
        'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [txId, userId, `Voucher Redeemed: ${voucher.title}`, voucher.amount, 'credit', 'bonus', 'success']
      );
    }

    // 4. Update user_vouchers record
    if (userVoucherRows.length > 0) {
      await client.query(
        "UPDATE user_vouchers SET status = 'used', redeemed_at = CURRENT_TIMESTAMP WHERE id = $1",
        [userVoucherRows[0].id]
      );
    } else {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (voucher.expiry_days || 30));
      
      await client.query(
        'INSERT INTO user_vouchers (id, user_id, voucher_id, status, redeemed_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [uuidv4(), userId, voucher.id, 'used', new Date(), expiresAt]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, message: `Voucher "${voucher.code}" redeemed successfully!` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Redeem Voucher Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
};
