const { db } = require('../config/db');

const getQuizzesByCategory = (req, res) => {
  const { categoryId } = req.params;
  try {
    const quizzes = db.prepare("SELECT * FROM quizzes WHERE category_id = ? AND status = 'active'").all(categoryId);
    res.json({ success: true, quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuizById = (req, res) => {
  const { id } = req.params;
  try {
    const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const { v4: uuidv4 } = require('uuid');

const getQuizQuestions = (req, res) => {
  const { id } = req.params;
  try {
    const questions = db.prepare("SELECT id, quiz_id, type, question_text, sort_order FROM questions WHERE quiz_id = ? ORDER BY sort_order ASC").all(id);
    res.json({ success: true, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const submitQuiz = (req, res) => {
  const { id } = req.params;
  const { answers, mobile } = req.body; 

  try {
    // 1. Fetch the user
    const user = db.prepare('SELECT id FROM users WHERE mobile = ?').get(mobile);
    const userId = user ? user.id : 'anonymous';

    // 2. Fetch the questions to calculate score
    const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ?").all(id);
    
    let totalQuestions = questions.length;
    let correctCount = 0;
    
    // For mock evaluation: Let's assume all answers matching '0' or 'A' (index 0) are correct for simplicity, since we didn't add the `correct_answers` table yet.
    // In a real environment, we would join with the correct options.
    const subId = uuidv4();
    
    for (const q of questions) {
      // answers from frontend might be keyed by question index or ID. 
      // Our frontend mapped it by currentIdx (array index 0,1,2). 
      // We will blindly assign a score for demonstration.
      // Mock logic: randomly assign correct or wrong
      const isCorrect = Math.random() > 0.4 ? 1 : 0; 
      if (isCorrect) correctCount++;
      
      db.prepare('INSERT INTO submission_answers (id, submission_id, question_id, selected_value, is_correct) VALUES (?, ?, ?, ?, ?)')
        .run(uuidv4(), subId, q.id, 'mock-val', isCorrect);
    }

    const wrongCount = totalQuestions - correctCount;
    const score = correctCount * 2 - (wrongCount * 0.5); // +2 for right, -0.5 for wrong
    
    db.prepare('INSERT INTO submissions (id, user_id, quiz_id, status, total_score) VALUES (?, ?, ?, ?, ?)')
      .run(subId, userId, id, 'completed', score);

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

module.exports = {
  getQuizzesByCategory,
  getQuizById,
  getQuizQuestions,
  submitQuiz
};
