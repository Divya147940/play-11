const { db } = require('../config/db');

const getStudyCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM categories WHERE status = 'active' AND zone_id = 'study-zone' ORDER BY sort_order ASC");
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGameCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM categories WHERE status = 'active' AND zone_id = 'game-zone' ORDER BY sort_order ASC");
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudyCategories,
  getGameCategories
};
