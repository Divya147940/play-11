const { db } = require('../config/db');

const getAllMatches = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT m.*, 
             q.entry_amount, 
             q.reward_text,
             (SELECT COUNT(*) FROM submissions s WHERE s.quiz_id = q.id) as players_count
      FROM matches m
      LEFT JOIN quizzes q ON m.id = q.match_id AND q.status = 'active'
      ORDER BY m.start_time ASC
    `);
    res.set('Cache-Control', 'public, max-age=10, s-maxage=10');
    res.json({ success: true, matches: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMatchQuizzes = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Find the quiz directly linked to this match
    const { rows: quizzes } = await db.query("SELECT * FROM quizzes WHERE match_id = $1 AND status = 'active' LIMIT 1", [id]);
    const quiz = quizzes[0];
    
    if (!quiz) return res.status(404).json({ error: 'No active quiz found for this match' });
    
    // 2. Fetch questions with options using JSON aggregation (reusing logic from quiz controller)
    const { rows: questions } = await db.query(`
      SELECT q.id, q.question_text, q.marks,
      (
        SELECT json_agg(json_build_object(
          'id', qo.id,
          'text', qo.option_text,
          'hindiText', qo.hindi_option_text,
          'value', qo.option_value
        ) ORDER BY qo.option_value ASC)
        FROM question_options qo
        WHERE qo.question_id = q.id
      ) as options
      FROM questions q
      WHERE q.quiz_id = $1
      ORDER BY q.id ASC
    `, [quiz.id]);
    
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
