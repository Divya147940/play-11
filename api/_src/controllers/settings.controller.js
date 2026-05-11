const { db } = require('../config/db');

const getSetting = async (req, res) => {
  const { key } = req.params;
  try {
    const { rows } = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
    if (rows.length > 0) {
      res.json({ success: true, key, value: rows[0].value });
    } else {
      res.json({ success: false, error: 'Setting not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSetting = async (req, res) => {
  const { key, value } = req.body;
  // Note: Usually you'd check if the user is an admin here.
  // Assuming the middleware verifyToken handles basic auth.
  try {
    await db.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP',
      [key, value]
    );
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSetting,
  updateSetting
};
