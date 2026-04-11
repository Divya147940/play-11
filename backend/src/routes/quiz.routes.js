const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

router.get('/category/:categoryId', quizController.getQuizzesByCategory);
router.get('/:id', quizController.getQuizById);
router.get('/:id/questions', quizController.getQuizQuestions);
router.post('/:id/submit', quizController.submitQuiz);

module.exports = router;
