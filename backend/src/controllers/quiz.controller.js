const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getQuizzesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const { rows } = await db.query("SELECT * FROM quizzes WHERE category_id = $1 AND status = 'active'", [categoryId]);
    res.json({ success: true, quizzes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query("SELECT * FROM quizzes WHERE id = $1", [id]);
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
    const { rows } = await db.query("SELECT id, quiz_id, type, question_text, sort_order FROM questions WHERE quiz_id = $1 ORDER BY sort_order ASC", [id]);
    res.json({ success: true, questions: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { answers, mobile } = req.body; 

  try {
    // 1. Fetch the user
    const { rows: userRows } = await db.query('SELECT id FROM users WHERE mobile = $1', [mobile]);
    const userId = userRows.length > 0 ? userRows[0].id : 'anonymous';

    // 2. Fetch the questions and their correct answers
    const { rows: questions } = await db.query(`
      SELECT q.*, ca.answer_value 
      FROM questions q
      LEFT JOIN correct_answers ca ON q.id = ca.question_id
      WHERE q.quiz_id = $1
    `, [id]);
    
    // 3. Fetch Quiz details for marks
    const { rows: quizRows } = await db.query('SELECT marks_per_q FROM quizzes WHERE id = $1', [id]);
    const marksPerQ = quizRows[0]?.marks_per_q || 2;
    const negativeMarks = 0.5;

    let totalQuestions = questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCount = 0;
    
    const subId = uuidv4();
    
    for (const q of questions) {
      const selectedValue = answers[q.id];
      if (selectedValue !== undefined && selectedValue !== null) {
        attemptedCount++;
        const isCorrect = String(selectedValue) === String(q.answer_value);
        if (isCorrect) {
          correctCount++;
        } else {
          wrongCount++;
        }
        
        await db.query('INSERT INTO submission_answers (id, submission_id, question_id, selected_value, is_correct) VALUES ($1, $2, $3, $4, $5)',
          [uuidv4(), subId, q.id, String(selectedValue), isCorrect ? 1 : 0]);
      }
    }

    const score = (correctCount * marksPerQ) - (wrongCount * negativeMarks);
    
    await db.query('INSERT INTO submissions (id, user_id, quiz_id, status, total_score, correct_count, wrong_count, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)',
      [subId, userId, id, 'completed', score, correctCount, wrongCount]);

    res.json({ 
      success: true, 
      result: {
        total: totalQuestions,
        correct: correctCount,
        wrong: wrongCount,
        score: score
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResults = async (req, res) => {
  const { quizId } = req.params;
  const { userId } = req.query;
  try {
    const { rows } = await db.query("SELECT * FROM submissions WHERE quiz_id = $1 AND user_id = $2 ORDER BY started_at DESC LIMIT 1", [quizId, userId]);
    res.json({ success: true, result: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  const { quizId } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT s.total_score, u.name, u.mobile 
      FROM submissions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.quiz_id = $1 
      ORDER BY s.total_score DESC LIMIT 10
    `, [quizId]);
    res.json({ success: true, leaderboard: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getQuizzesByCategory,
  getQuizById,
  getQuizQuestions,
  submitQuiz,
  getResults,
  getLeaderboard
};
