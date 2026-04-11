const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');

router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.get('/:id/quizzes', matchController.getMatchQuizzes);

module.exports = router;
