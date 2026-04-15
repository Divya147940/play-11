const { db } = require('../config/db');

const getAllMatches = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM matches ORDER BY start_time ASC");
    res.json({ success: true, matches: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMatchQuizzes = async (req, res) => {
  const { id } = req.params;
  try {
    // In our schema, quizzes might be linked to matches or categories.
    // For now, let's assume we find a quiz where category_id related to the match or find one with match-specific title.
    // Ideally, quizzes table should have match_id.
    // Since it doesn't, let's look for match-1 -> quiz-g1 logic or dynamic search.
    const { rows } = await db.query("SELECT * FROM quizzes WHERE zone_id = 'game-zone' AND (title ILIKE $1 OR id = $2)", [`%${id}%`, `quiz-${id}`]);
    const quiz = rows[0];
    if (!quiz) return res.status(404).json({ error: 'Quiz not found for this match' });
    
    const { rows: questions } = await db.query("SELECT * FROM questions WHERE quiz_id = $1 ORDER BY sort_order ASC", [quiz.id]);
    
    res.json({ success: true, quiz, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query("SELECT * FROM matches WHERE id = $1", [id]);
    const match = rows[0];
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
