const { db } = require('../config/db');

const getDashboardStats = (req, res) => {
  try {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    const quizCount = db.prepare("SELECT COUNT(*) as count FROM quizzes WHERE status = 'active'").get().count;
    const matchCount = db.prepare("SELECT COUNT(*) as count FROM matches WHERE status != 'completed'").get().count;
    const submissionCount = db.prepare("SELECT COUNT(*) as count FROM submissions").get().count;

    // Get recent 5 submissions with user info
    const recentActivity = db.prepare(`
      SELECT s.id, u.name, u.mobile, u.status as user_status, s.started_at, s.total_score 
      FROM submissions s 
      LEFT JOIN users u ON s.user_id = u.id 
      ORDER BY s.started_at DESC LIMIT 5
    `).all();

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

module.exports = {
  getDashboardStats
};
