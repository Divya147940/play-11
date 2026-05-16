const { db } = require('../config/db');

const getStudyCategories = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT c.*, COUNT(q.id) as quiz_count
      FROM categories c
      LEFT JOIN quizzes q ON c.id = q.category_id AND q.status = 'active'
      WHERE c.status = 'active' AND c.zone_id = 'study-zone'
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `);
    res.set('Cache-Control', 'public, max-age=60, s-maxage=600');
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGameCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM categories WHERE status = 'active' AND zone_id = 'game-zone' ORDER BY sort_order ASC");
    res.set('Cache-Control', 'public, max-age=60, s-maxage=600');
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM categories WHERE status = 'active' ORDER BY zone_id, sort_order ASC");
    res.set('Cache-Control', 'public, max-age=60, s-maxage=600');
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudyCategories,
  getGameCategories,
  getAllCategories
};
