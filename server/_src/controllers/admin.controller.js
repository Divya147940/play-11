const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, ADMIN_JWT_SECRET } = require('../config/constants');

const getDashboardStats = async (req, res) => {
  try {
    const [usersRes, quizzesRes, matchesRes, submissionsRes] = await Promise.all([
      db.query("SELECT COUNT(*) as count FROM users"),
      db.query("SELECT COUNT(*) as count FROM quizzes WHERE status = 'active'"),
      db.query("SELECT COUNT(*) as count FROM matches WHERE status != 'completed'"),
      db.query("SELECT COUNT(*) as count FROM submissions")
    ]);

    const userCount = parseInt(usersRes.rows[0].count);
    const quizCount = parseInt(quizzesRes.rows[0].count);
    const matchCount = parseInt(matchesRes.rows[0].count);
    const submissionCount = parseInt(submissionsRes.rows[0].count);

    const { rows: recentActivity } = await db.query(`
      SELECT s.id, u.name, u.mobile, u.status as user_status, s.submitted_at, s.total_score 
      FROM submissions s 
      LEFT JOIN users u ON s.user_id = u.id 
      ORDER BY s.submitted_at DESC LIMIT 5
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  try {
    const { rows } = await db.query("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
    const { rows: countRows } = await db.query("SELECT COUNT(*) FROM users");
    
    res.json({ 
      success: true, 
      users: rows,
      pagination: {
        page,
        limit,
        total: parseInt(countRows[0].count)
      }
    });
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
  const { 
    zone_id, category_id, match_id, title, hindiTitle, description, hindiDescription, 
    total_questions, timer_minutes, entry_amount, prize_amount,
    open_at, close_at, marks_per_q, banner_url, questions 
  } = req.body;
  
  const quizId = uuidv4();
  
  try {
    await db.query('BEGIN');
    
    // 1. Insert Quiz
    await db.query(
      "INSERT INTO quizzes (id, zone_id, category_id, match_id, title, hindi_title, description, hindi_description, total_questions, timer_minutes, entry_amount, prize_amount, open_at, close_at, status, marks_per_q, banner_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
      [quizId, zone_id, category_id, match_id || null, title, hindiTitle || null, description, hindiDescription || null, total_questions, timer_minutes, entry_amount || 0, prize_amount || 0, open_at, close_at, 'active', marks_per_q || 2, banner_url || null]
    );

    if (questions && Array.isArray(questions)) {
      const questionValues = [];
      const optionValues = [];
      const correctAnswerValues = [];

      questions.forEach((q, qIdx) => {
        const qId = uuidv4();
        
        // Prepare Question values
        questionValues.push(qId, quizId, q.text, q.hindiText || null, marks_per_q || 2, qIdx);

        // Prepare Option values
        if (q.options && Array.isArray(q.options)) {
          q.options.forEach((opt, oIdx) => {
            const optId = uuidv4();
            const text = typeof opt === 'string' ? opt : opt.text;
            const hindiText = typeof opt === 'string' ? null : opt.hindiText;
            optionValues.push(optId, qId, text, hindiText, oIdx.toString());
          });
        }

        // Prepare Correct Answer values
        correctAnswerValues.push(uuidv4(), qId, q.correctOptionIndex.toString());
      });

      // 2. Batch Insert Questions
      if (questionValues.length > 0) {
        let qQuery = "INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, marks, sort_order) VALUES ";
        const qPlaceholders = [];
        for (let i = 0; i < questions.length; i++) {
          qPlaceholders.push(`($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`);
        }
        await db.query(qQuery + qPlaceholders.join(', '), questionValues);
      }

      // 3. Batch Insert Options
      if (optionValues.length > 0) {
        let oQuery = "INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value) VALUES ";
        const oPlaceholders = [];
        for (let i = 0; i < optionValues.length / 5; i++) {
          oPlaceholders.push(`($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`);
        }
        await db.query(oQuery + oPlaceholders.join(', '), optionValues);
      }

      // 4. Batch Insert Correct Answers
      if (correctAnswerValues.length > 0) {
        let aQuery = "INSERT INTO correct_answers (id, question_id, answer_value) VALUES ";
        const aPlaceholders = [];
        for (let i = 0; i < correctAnswerValues.length / 3; i++) {
          aPlaceholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
        }
        await db.query(aQuery + aPlaceholders.join(', '), correctAnswerValues);
      }
    }

    await db.query('COMMIT');
    res.json({ success: true, id: quizId });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Quiz Creation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const uploadQuiz = createQuiz; // Reuse the same logic

const getQuizzesWithStats = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT q.*, 
             u.name as winner_name,
             COUNT(s.id) as participants_count
      FROM quizzes q 
      LEFT JOIN submissions s ON q.id = s.quiz_id
      LEFT JOIN users u ON q.winner_id = u.id
      GROUP BY q.id, u.name
      ORDER BY q.open_at DESC
    `);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizParticipants = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT s.*, u.name, u.mobile, u.status as user_status, q.total_questions
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      JOIN quizzes q ON s.quiz_id = q.id
      WHERE s.quiz_id = $1
      ORDER BY s.total_score DESC, s.submitted_at ASC
    `, [id]);
    res.json({ success: true, participants: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const declareWinner = async (req, res) => {
  const { id } = req.params; // quiz_id
  const { winner_id } = req.body;
  try {
    // Verify winner participated
    const { rows: participation } = await db.query("SELECT id FROM submissions WHERE quiz_id = $1 AND user_id = $2", [id, winner_id]);
    if (participation.length === 0) {
      return res.status(400).json({ error: 'This user did not participate in the quiz and cannot be declared winner.' });
    }

    await db.query('BEGIN');
    
    // 1. Get Prize Amount
    const { rows: quizRows } = await db.query("SELECT prize_amount FROM quizzes WHERE id = $1", [id]);
    const prizeAmount = quizRows[0]?.prize_amount || 0;

    // 2. Mark Winner in Quiz
    await db.query("UPDATE quizzes SET winner_id = $1, status = 'completed' WHERE id = $2", [winner_id, id]);

    // 3. Add Prize to User Balance and update submission
    if (prizeAmount > 0) {
      await db.query("UPDATE users SET coins = coins + $1 WHERE id = $2", [prizeAmount, winner_id]);
      await db.query("UPDATE submissions SET won_amount = $1 WHERE quiz_id = $2 AND user_id = $3", [prizeAmount, id, winner_id]);
      
      // 4. Record Transaction
      const txId = `tx-${uuidv4().substring(0, 8)}`;
      await db.query(
        'INSERT INTO transactions (id, user_id, title, amount, type, category, status, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [txId, winner_id, `Quiz Won: ${(quizRows[0]?.title || 'Contest')}`, prizeAmount, 'credit', 'win', 'success', id]
      );
    }

    await db.query('COMMIT');
    res.json({ success: true, message: `Winner declared and reward of ₹${prizeAmount} added to user wallet.` });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};


const updateMatch = async (req, res) => {
  const { id } = req.params;
  const { 
    sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue,
    hindi_team_a, hindi_team_b, hindi_venue, status, score_a, score_b 
  } = req.body;
  try {
    await db.query(`
      UPDATE matches SET 
        sport_type = COALESCE($1, sport_type),
        team_a = COALESCE($2, team_a),
        team_b = COALESCE($3, team_b),
        team_a_logo = COALESCE($4, team_a_logo),
        team_b_logo = COALESCE($5, team_b_logo),
        start_time = COALESCE($6, start_time),
        venue = COALESCE($7, venue),
        hindi_team_a = COALESCE($8, hindi_team_a),
        hindi_team_b = COALESCE($9, hindi_team_b),
        hindi_venue = COALESCE($10, hindi_venue),
        status = COALESCE($11, status),
        score_a = COALESCE($12, score_a),
        score_b = COALESCE($13, score_b)
      WHERE id = $14
    `, [sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, hindi_team_a, hindi_team_b, hindi_venue, status, score_a, score_b, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMatch = async (req, res) => {
  const { 
    sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue,
    hindi_team_a, hindi_team_b, hindi_venue 
  } = req.body;
  const id = uuidv4();
  try {
    await db.query(
      "INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, hindi_team_a, hindi_team_b, hindi_venue, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      [id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, hindi_team_a || null, hindi_team_b || null, hindi_venue || null, 'upcoming']
    );
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  let { identifier, password } = req.body;
  if (identifier) identifier = identifier.trim();
  
  try {
    const { rows } = await db.query(
      "SELECT * FROM admins WHERE LOWER(username) = LOWER($1)",
      [identifier]
    );
    if (rows.length > 0) {
      const adminUser = rows[0];
      const isMatch = await bcrypt.compare(password, adminUser.password);
      
      if (isMatch) {
        const token = jwt.sign(
          { userId: adminUser.id, role: 'admin' }, 
          ADMIN_JWT_SECRET, 
          { expiresIn: '24h' }
        );
        res.json({
          success: true,
          token: token,
          admin: { id: adminUser.id, username: adminUser.username }
        });
      } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    // Due to ON DELETE CASCADE, this will also delete questions, options, etc.
    await db.query("DELETE FROM quizzes WHERE id = $1", [id]);
    res.json({ success: true, message: 'Quiz and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminQuizQuestions = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT q.id, q.quiz_id, q.question_text, q.hindi_question_text, q.marks,
      (
        SELECT json_agg(json_build_object(
          'id', qo.id,
          'text', qo.option_text,
          'hindiText', qo.hindi_option_text,
          'value', qo.option_value
        ) ORDER BY qo.option_value ASC)
        FROM question_options qo
        WHERE qo.question_id = q.id
      ) as options,
      (
        SELECT answer_value FROM correct_answers ca WHERE ca.question_id = q.id LIMIT 1
      ) as correct_answer
      FROM questions q
      WHERE q.quiz_id = $1
      ORDER BY q.sort_order ASC, q.id ASC
    `, [id]);
    res.json({ success: true, questions: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { 
    zone_id, category_id, match_id, title, hindiTitle, description, hindiDescription, 
    total_questions, timer_minutes, entry_amount, prize_amount,
    open_at, close_at, marks_per_q, banner_url, questions 
  } = req.body;
  
  try {
    await db.query('BEGIN');
    
    // 1. Update Quiz metadata
    await db.query(
      `UPDATE quizzes SET 
        zone_id = $1, category_id = $2, match_id = $3, title = $4, hindi_title = $5, 
        description = $6, hindi_description = $7, total_questions = $8, timer_minutes = $9, 
        entry_amount = $10, prize_amount = $11, open_at = $12, close_at = $13, marks_per_q = $14, banner_url = $15
      WHERE id = $16`,
      [zone_id, category_id, match_id || null, title, hindiTitle || null, description, hindiDescription || null, total_questions, timer_minutes, entry_amount || 0, prize_amount || 0, open_at, close_at, marks_per_q || 2, banner_url || null, id]
    );

    if (questions && Array.isArray(questions)) {
      // 2. Delete existing questions (options and correct answers will be deleted via CASCADE)
      await db.query("DELETE FROM questions WHERE quiz_id = $1", [id]);

      // 3. Re-insert all questions/options (copied logic from createQuiz)
      const questionValues = [];
      const optionValues = [];
      const correctAnswerValues = [];

      questions.forEach((q, qIdx) => {
        const qId = uuidv4();
        questionValues.push(qId, id, q.text, q.hindiText || null, marks_per_q || 2, qIdx);

        if (q.options && Array.isArray(q.options)) {
          q.options.forEach((opt, oIdx) => {
            const optId = uuidv4();
            const text = typeof opt === 'string' ? opt : opt.text;
            const hindiText = typeof opt === 'string' ? null : opt.hindiText;
            optionValues.push(optId, qId, text, hindiText, oIdx.toString());
          });
        }

        correctAnswerValues.push(uuidv4(), qId, q.correctOptionIndex.toString());
      });

      if (questionValues.length > 0) {
        let qQuery = "INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, marks, sort_order) VALUES ";
        const qPlaceholders = [];
        for (let i = 0; i < questions.length; i++) {
          qPlaceholders.push(`($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`);
        }
        await db.query(qQuery + qPlaceholders.join(', '), questionValues);
      }

      if (optionValues.length > 0) {
        let oQuery = "INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value) VALUES ";
        const oPlaceholders = [];
        for (let i = 0; i < optionValues.length / 5; i++) {
          oPlaceholders.push(`($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`);
        }
        await db.query(oQuery + oPlaceholders.join(', '), optionValues);
      }

      if (correctAnswerValues.length > 0) {
        let aQuery = "INSERT INTO correct_answers (id, question_id, answer_value) VALUES ";
        const aPlaceholders = [];
        for (let i = 0; i < correctAnswerValues.length / 3; i++) {
          aPlaceholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
        }
        await db.query(aQuery + aPlaceholders.join(', '), correctAnswerValues);
      }
    }
    
    await db.query('COMMIT');
    res.json({ success: true, message: 'Quiz updated successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Quiz Update Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMatch = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM matches WHERE id = $1", [id]);
    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubmissionReviewAdmin = async (req, res) => {
  const { id } = req.params; // submission_id
  try {
    const { rows: subRows } = await db.query(
      'SELECT s.*, q.title FROM submissions s JOIN quizzes q ON s.quiz_id = q.id WHERE s.id = $1',
      [id]
    );

    const submission = subRows[0];
    const quizId = submission.quiz_id;

    const { rows: answers } = await db.query(`
      SELECT 
        q.id as question_id, q.question_text, q.hindi_question_text,
        sa.selected_value, sa.is_correct,
        (SELECT answer_value FROM correct_answers ca WHERE ca.question_id = q.id LIMIT 1) as correct_value,
        (SELECT json_agg(json_build_object('text', qo.option_text, 'value', qo.option_value)) 
         FROM question_options qo WHERE qo.question_id = q.id) as options
      FROM questions q
      LEFT JOIN submission_answers sa ON q.id = sa.question_id AND sa.submission_id = $1
      WHERE q.quiz_id = $2
      ORDER BY q.sort_order ASC, q.id ASC
    `, [id, quizId]);

    res.json({ success: true, submission, answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  uploadQuiz,
  createQuiz,
  getQuizzesWithStats,
  getQuizParticipants,
  getSubmissionReviewAdmin,
  declareWinner,
  updateMatch,
  addMatch,
  deleteQuiz,
  deleteMatch,
  updateQuiz,
  getAdminQuizQuestions,
  login
};
