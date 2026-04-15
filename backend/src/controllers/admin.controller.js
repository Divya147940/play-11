const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getDashboardStats = async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT COUNT(*) as count FROM users");
    const { rows: quizzes } = await db.query("SELECT COUNT(*) as count FROM quizzes WHERE status = 'active'");
    const { rows: matches } = await db.query("SELECT COUNT(*) as count FROM matches WHERE status != 'completed'");
    const { rows: submissions } = await db.query("SELECT COUNT(*) as count FROM submissions");

    const userCount = parseInt(users[0].count);
    const quizCount = parseInt(quizzes[0].count);
    const matchCount = parseInt(matches[0].count);
    const submissionCount = parseInt(submissions[0].count);

    const { rows: recentActivity } = await db.query(`
      SELECT s.id, u.name, u.mobile, u.status as user_status, s.started_at, s.total_score 
      FROM submissions s 
      LEFT JOIN users u ON s.user_id = u.id 
      ORDER BY s.started_at DESC LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        users: userCount,
        quizzes: quizCount,
        matches: matchCount,
        submissions: submissionCount
      },
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'blocked'
  try {
    await db.query("UPDATE users SET status = $1 WHERE id = $2", [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createQuiz = async (req, res) => {
  const { zone_id, category_id, title, description, total_questions, timer_minutes, open_at, close_at, marks_per_q } = req.body;
  const id = uuidv4();
  try {
    await db.query(
      "INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, open_at, close_at, status, marks_per_q) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [id, zone_id, category_id, title, description, total_questions, timer_minutes, open_at, close_at, 'active', marks_per_q]
    );
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMatch = async (req, res) => {
  const { sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue } = req.body;
  const id = uuidv4();
  try {
    await db.query(
      "INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, 'upcoming']
    );
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  createQuiz,
  addMatch
};
