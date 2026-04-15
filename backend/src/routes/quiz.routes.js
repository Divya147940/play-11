const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

router.get('/category/:categoryId', quizController.getQuizzesByCategory);
router.get('/:id', quizController.getQuizById);
router.get('/:id/questions', quizController.getQuizQuestions);
router.post('/:id/submit', quizController.submitQuiz);
router.get('/:quizId/results', quizController.getResults);
router.get('/:quizId/leaderboard', quizController.getLeaderboard);

module.exports = router;
