const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getVouchers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get active vouchers from master list and join with user status
    const { rows } = await db.query(`
      SELECT v.*, uv.status as user_status, uv.expires_at 
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
  const client = await require('../config/db').pool.connect();
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Voucher code is required' });
    }

    await client.query('BEGIN');

    // Check if voucher exists and is active
    const { rows: voucherRows } = await client.query('SELECT * FROM vouchers WHERE code = $1 AND status = \'active\'', [code]);
    if (voucherRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired voucher code' });
    }
    const voucher = voucherRows[0];

    // Check if already redeemed
    const { rows: uvRows } = await client.query(
      'SELECT id FROM user_vouchers WHERE user_id = $1 AND voucher_id = $2 AND status = \'used\'',
      [userId, voucher.id]
    );
    if (uvRows.length \u003e 0) {
      return res.status(400).json({ success: false, message: 'You have already redeemed this voucher' });
    }

    // Apply benefits
    if (voucher.type === 'bonus') {
      await client.query('UPDATE users SET bonus = bonus + $1 WHERE id = $2', [voucher.amount, userId]);
      
      // Record transaction
      const txId = `tx-${uuidv4().substring(0, 8)}`;
      await client.query(
        'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [txId, userId, `Voucher Bonus: ${voucher.title}`, voucher.amount, 'credit', 'bonus', 'success']
      );
    }

    // Mark as used
    const uvId = `uv-${uuidv4().substring(0, 8)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (voucher.expiry_days || 30));

    await client.query(
      'INSERT INTO user_vouchers (id, user_id, voucher_id, status, expires_at, redeemed_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) ON CONFLICT (id) DO UPDATE SET status = \'used\', redeemed_at = CURRENT_TIMESTAMP',
      [uvId, userId, voucher.id, 'used', expiresAt]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Voucher redeemed successfully!', type: voucher.type });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Redeem Voucher Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
};
