const { db } = require('../config/db');

exports.getSetting = async (req, res) => {
  const { key } = req.params;
  try {
    const { rows } = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, value: rows[0].value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateSetting = async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.query(`
      INSERT INTO settings (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = $2
    `, [key, value]);
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
