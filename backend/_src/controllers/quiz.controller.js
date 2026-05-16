const { db, pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getQuizzesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT q.*, 
      COALESCE(NULLIF(q.banner_url, ''), (SELECT value FROM settings WHERE key = 'quiz_room_banner_url' LIMIT 1), (SELECT value FROM settings WHERE key = 'home_banner_url' LIMIT 1)) as effective_banner_url
      FROM quizzes q 
      WHERE q.category_id = $1 AND q.status = 'active'
    `, [categoryId]);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuizzesByZone = async (req, res) => {
  const { zoneId } = req.params;
  try {
    const userId = req.user ? req.user.userId : null;
    const { rows } = await db.query(`
      SELECT q.*, 
      COALESCE(NULLIF(q.banner_url, ''), (SELECT value FROM settings WHERE key = 'quiz_room_banner_url' LIMIT 1), (SELECT value FROM settings WHERE key = 'home_banner_url' LIMIT 1)) as effective_banner_url,
      CASE 
        WHEN q.open_at > CURRENT_TIMESTAMP THEN 'UPCOMING'
        WHEN q.close_at < CURRENT_TIMESTAMP THEN 'CLOSED'
        ELSE 'LIVE'
      END as status_label,
      CASE 
        WHEN s.id IS NOT NULL THEN true 
        ELSE false 
      END as is_submitted,
      s.submitted_at
      FROM quizzes q
      LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = $2
      WHERE q.zone_id = $1 
      AND q.status = 'active'
      ORDER BY q.open_at ASC
    `, [zoneId, userId]);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const { rows } = await db.query(`
      SELECT q.*, 
      COALESCE(NULLIF(q.banner_url, ''), (SELECT value FROM settings WHERE key = 'quiz_room_banner_url' LIMIT 1), (SELECT value FROM settings WHERE key = 'home_banner_url' LIMIT 1)) as effective_banner_url,
      CASE 
        WHEN q.open_at > CURRENT_TIMESTAMP + interval '1 minute' THEN 'UPCOMING'
        WHEN q.close_at < CURRENT_TIMESTAMP - interval '1 minute' THEN 'CLOSED'
        ELSE 'LIVE'
      END as status_label,
      CASE 
        WHEN s.id IS NOT NULL THEN true 
        ELSE false 
      END as is_submitted,
      s.submitted_at
      FROM quizzes q
      LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = $1
      WHERE q.status = 'active'
      ORDER BY q.open_at ASC
    `, [userId]);
    console.log(`Fetched ${rows.length} active quizzes for user ${userId}`);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getJoinedQuizzes = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { rows } = await db.query(`
      SELECT q.*, 
      COALESCE(q.banner_url, (SELECT value FROM settings WHERE key = 'home_banner_url' LIMIT 1)) as effective_banner_url,
      'CLOSED' as status_label, true as is_submitted, s.total_score, s.submitted_at
      FROM quizzes q
      JOIN submissions s ON q.id = s.quiz_id
      WHERE s.user_id = $1
      ORDER BY s.submitted_at DESC
    `, [userId]);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuizById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.userId : req.headers['x-guest-id'];
  try {
    const { rows } = await db.query(`
      SELECT q.*, 
      COALESCE(NULLIF(q.banner_url, ''), (SELECT value FROM settings WHERE key = 'quiz_room_banner_url' LIMIT 1), (SELECT value FROM settings WHERE key = 'home_banner_url' LIMIT 1)) as effective_banner_url,
      u.name as winner_name,
      CASE 
        WHEN s.id IS NOT NULL THEN true 
        ELSE false 
      END as is_submitted,
      s.submitted_at
      FROM quizzes q 
      LEFT JOIN users u ON q.winner_id = u.id 
      LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = $2
      WHERE q.id = $1
    `, [id, userId]);
    const quiz = rows[0];
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuizQuestions = async (req, res) => {
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
      ) as options
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

const submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { answers, time_taken } = req.body; 
  
  // Support both logged in users and guests
  const userId = req.user ? req.user.userId : req.headers['x-guest-id'];
  
  if (!userId) {
    return res.status(401).json({ success: false, error: 'User identification missing. Please refresh or login.' });
  }

  console.log(`[DEBUG] Submitting quiz ${id} for user: ${userId}`);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check if user already submitted this quiz
    const { rows: existingSub } = await client.query('SELECT id FROM submissions WHERE user_id = $1 AND quiz_id = $2', [userId, id]);
    if (existingSub.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'You have already submitted this quiz.' });
    }

    // 2. Fetch the questions and their correct answers
    const { rows: questions } = await client.query(`
      SELECT q.*, ca.answer_value 
      FROM questions q
      LEFT JOIN correct_answers ca ON q.id = ca.question_id
      WHERE q.quiz_id = $1
    `, [id]);
    
    // 3. Fetch Quiz details for marks and timing
    const { rows: quizRows } = await client.query('SELECT marks_per_q, negative_marks, open_at, close_at FROM quizzes WHERE id = $1', [id]);
    const quiz = quizRows[0];
    
    if (!quiz) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    const now = new Date();
    if (new Date(quiz.open_at) > now) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'This quiz has not opened yet.' });
    }
    if (new Date(quiz.close_at) < now) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'This quiz has already closed.' });
    }

    const marksPerQ = quiz.marks_per_q || 2;
    const negativeMarks = parseFloat(quiz.negative_marks || 0.5);

    let totalQuestions = questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    
    // Calculate score and counts
    console.log(`[SUBMISSION_DEBUG] Answers received:`, JSON.stringify(answers));
    
    questions.forEach(q => {
      const selectedValue = answers[q.id];
      const correctValue = q.answer_value;
      
      console.log(`[SUBMISSION_DEBUG] QID: ${q.id} | Selected: ${selectedValue} | Correct: ${correctValue}`);
      
      if (selectedValue !== undefined && selectedValue !== null) {
        const isCorrect = String(selectedValue) === String(correctValue);
        if (isCorrect) correctCount++;
        else wrongCount++;
      }
    });

    const score = (correctCount * marksPerQ) - (wrongCount * negativeMarks);
    const subId = uuidv4();
    
    // 4. INSERT main submission record FIRST (Parent)
    await client.query('INSERT INTO submissions (id, user_id, quiz_id, status, total_score, correct_count, wrong_count, time_taken, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)',
      [subId, userId, id, 'completed', score, correctCount, wrongCount, time_taken || null]);

    // 5. INSERT individual answers (Children)
    const submissionAnswersPromises = questions.map(q => {
      const selectedValue = answers[q.id];
      if (selectedValue !== undefined && selectedValue !== null) {
        const isCorrect = String(selectedValue) === String(q.answer_value);
        return client.query('INSERT INTO submission_answers (id, submission_id, question_id, selected_value, is_correct) VALUES ($1, $2, $3, $4, $5)',
          [uuidv4(), subId, q.id, String(selectedValue), isCorrect ? 1 : 0]);
      }
      return Promise.resolve();
    });

    await Promise.all(submissionAnswersPromises);

    // 6. Calculate Rank
    const { rows: rankRows } = await client.query(`
      SELECT COUNT(*) + 1 as rank
      FROM submissions
      WHERE quiz_id = $1 AND total_score > $2
    `, [id, score]);

    await client.query('COMMIT');

    res.json({ 
      success: true, 
      submission: {
        id: subId,
        total_score: score,
        correct_count: correctCount,
        wrong_count: wrongCount,
        rank: rankRows[0].rank
      },
      result: {
        total: totalQuestions,
        correct: correctCount,
        wrong: wrongCount,
        score: score
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submission Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, error: 'You have already submitted this quiz.' });
    }
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message,
      detail: error.detail,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    client.release();
  }
};

const getResults = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user ? req.user.userId : req.headers['x-guest-id'];
  if (!userId) return res.status(401).json({ error: 'Identification required' });
  try {
    // 1. Fetch submission with user's rank
    const { rows: results } = await db.query(`
      SELECT s.*, 
      (
        SELECT COUNT(*) + 1
        FROM submissions s2
        WHERE s2.quiz_id = s.quiz_id 
        AND s2.total_score > s.total_score
      ) as rank
      FROM submissions s 
      WHERE s.quiz_id = $1 AND s.user_id = $2 
      ORDER BY s.submitted_at DESC LIMIT 1
    `, [quizId, userId]);
    
    if (results.length === 0) return res.status(404).json({ error: 'No result found' });

    // 2. Fetch quiz and winner name
    const { rows: quizRows } = await db.query(`
      SELECT q.title, q.status, q.total_questions, u.name as winner_name
      FROM quizzes q
      LEFT JOIN users u ON q.winner_id = u.id
      WHERE q.id = $1
    `, [quizId]);

    res.json({ success: true, result: results[0], quiz: quizRows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user?.userId;
  try {
    // 1. Get Top 10 for specific quiz
    const { rows: leaderboard } = await db.query(`
      SELECT s.total_score, 
             COALESCE(u.name, 'Guest (' || LEFT(s.user_id, 8) || ')') as name, 
             u.id as user_id
      FROM submissions s 
      LEFT JOIN users u ON s.user_id = u.id 
      WHERE s.quiz_id = $1 
      ORDER BY s.total_score DESC, s.submitted_at ASC LIMIT 10
    `, [quizId]);

    // 2. Get Current User Rank (if logged in)
    let userRank = null;
    if (userId) {
      const { rows: rankRows } = await db.query(`
        SELECT s.total_score,
        (
          SELECT COUNT(*) + 1
          FROM submissions s2
          WHERE s2.quiz_id = s.quiz_id 
          AND s2.total_score > s.total_score
        ) as rank
        FROM submissions s 
        WHERE s.quiz_id = $1 AND s.user_id = $2 
        ORDER BY s.submitted_at DESC LIMIT 1
      `, [quizId, userId]);
      if (rankRows.length > 0) userRank = rankRows[0];
    }

    res.json({ success: true, leaderboard, userRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGlobalLeaderboard = async (req, res) => {
  const userId = req.user?.userId;
  try {
    // Top 50 players by total accumulated score across all quizzes
    const { rows: leaderboard } = await db.query(`
      SELECT 
        s.user_id,
        COALESCE(u.name, 'Guest (' || LEFT(s.user_id, 8) || ')') as name,
        SUM(s.total_score) as total_score,
        COUNT(s.id) as quizzes_played,
        MAX(s.total_score) as best_score
      FROM submissions s
      LEFT JOIN users u ON s.user_id = u.id
      GROUP BY s.user_id, u.name
      ORDER BY total_score DESC, quizzes_played DESC
      LIMIT 50
    `);

    // Current user's global rank
    let userRank = null;
    if (userId) {
      const { rows: rankRows } = await db.query(`
        SELECT 
          SUM(s.total_score) as total_score,
          COUNT(s.id) as quizzes_played,
          (
            SELECT COUNT(*) + 1 FROM (
              SELECT user_id, SUM(total_score) as ts
              FROM submissions GROUP BY user_id
            ) ranked
            WHERE ranked.ts > (
              SELECT COALESCE(SUM(total_score), 0) FROM submissions WHERE user_id = $1
            )
          ) as rank
        FROM submissions s
        WHERE s.user_id = $1
      `, [userId]);
      if (rankRows.length > 0 && rankRows[0].total_score) {
        userRank = rankRows[0];
      }
    }

    res.json({ success: true, leaderboard, userRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getQuizzesByCategory,
  getQuizzesByZone,
  getAllQuizzes,
  getJoinedQuizzes,
  getQuizById,
  getQuizQuestions,
  submitQuiz,
  getResults,
  getLeaderboard,
  getGlobalLeaderboard
};
