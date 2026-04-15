const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.post('/quizzes', adminController.createQuiz);
router.post('/matches', adminController.addMatch);

module.exports = router;
