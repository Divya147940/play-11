const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await db.query('SELECT coins, points, bonus FROM users WHERE id = $1', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, balance: rows[0] });
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await db.query(
      'SELECT id, title, amount, type, category, status, created_at, reference_id FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );

    res.json({ success: true, transactions: rows });
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.addMoney = async (req, res) => {
  const { pool } = require('../config/db');
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    await client.query('BEGIN');

    // In a real app, you'd verify payment gateway response here
    // For now, we'll just mock the success

    // For manual mode, we create a pending transaction first
    const txId = `tx-${uuidv4().substring(0, 8)}`;
    await client.query(
      'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [txId, userId, 'Deposit Request (Manual)', amount, 'credit', 'deposit', 'pending']
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Money added successfully', transactionId: txId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Add Money Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
};

exports.withdrawMoney = async (req, res) => {
  const { pool } = require('../config/db');
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { amount, upiId, qrCode } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (!upiId && !qrCode) {
      return res.status(400).json({ success: false, message: 'UPI ID or QR Code is required' });
    }

    await client.query('BEGIN');

    // Check balance
    const { rows } = await client.query('SELECT coins FROM users WHERE id = $1', [userId]);
    if (rows.length === 0 || rows[0].coins < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct balance
    await client.query('UPDATE users SET coins = coins - $1 WHERE id = $2', [amount, userId]);

    // Record transaction as pending (real withdrawals are manual/delayed)
    const txId = `tx-${uuidv4().substring(0, 8)}`;
    await client.query(
      'INSERT INTO transactions (id, user_id, title, amount, type, category, status, upi_id, qr_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [txId, userId, 'Withdrawal Request', -amount, 'debit', 'withdraw', 'pending', upiId || null, qrCode || null]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Withdrawal request submitted successfully', transactionId: txId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Withdraw Money Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
};
