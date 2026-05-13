const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { verifyToken, optionalToken } = require('../middleware/auth.middleware');

router.get('/', optionalToken, quizController.getAllQuizzes);
router.get('/leaderboard', optionalToken, quizController.getGlobalLeaderboard);
router.get('/joined', verifyToken, quizController.getJoinedQuizzes);
router.get('/category/:categoryId', quizController.getQuizzesByCategory);
router.get('/zone/:zoneId', optionalToken, quizController.getQuizzesByZone);
router.get('/:id', optionalToken, quizController.getQuizById);
router.get('/:id/questions', quizController.getQuizQuestions);
router.post('/:id/submit', verifyToken, quizController.submitQuiz);
router.get('/:quizId/results', optionalToken, quizController.getResults);
router.get('/:quizId/leaderboard', quizController.getLeaderboard);

module.exports = router;
