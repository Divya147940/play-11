const { db } = require('../config/db');

const getStudyCategories = (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories WHERE status = 'active' AND zone_id = 'study-zone' ORDER BY sort_order ASC").all();
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGameCategories = (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories WHERE status = 'active' AND zone_id = 'game-zone' ORDER BY sort_order ASC").all();
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudyCategories,
  getGameCategories
};
