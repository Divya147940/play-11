const { db } = require('../config/db');

const getAllMatches = (req, res) => {
  try {
    const matches = db.prepare("SELECT * FROM matches ORDER BY start_time ASC").all();
    res.json({ success: true, matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMatchQuizzes = (req, res) => {
  const { id } = req.params;
  // Let's assume matches map to quizzes via title or via a bridge table, 
  // but for mock purposes we'll return all game zone quizzes.
  try {
    const quizzes = db.prepare("SELECT * FROM quizzes WHERE zone_id = 'game-zone' AND status = 'active'").all();
    res.json({ success: true, quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMatchById = (req, res) => {
  const { id } = req.params;
  try {
    const match = db.prepare("SELECT * FROM matches WHERE id = ?").get(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json({ success: true, match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllMatches,
  getMatchQuizzes,
  getMatchById
};
