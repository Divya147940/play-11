const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.use(verifyAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.post('/upload-quiz', adminController.uploadQuiz);
router.post('/quizzes', adminController.createQuiz);
router.get('/quizzes/stats', adminController.getQuizzesWithStats);
router.get('/quizzes/:id/participants', adminController.getQuizParticipants);
router.get('/submissions/:id/review', adminController.getSubmissionReviewAdmin);
router.post('/quizzes/:id/declare-winner', adminController.declareWinner);
router.get('/quizzes/:id/questions', adminController.getAdminQuizQuestions);
router.delete('/quizzes/:id', adminController.deleteQuiz);
router.put('/quizzes/:id', adminController.updateQuiz);
router.post('/matches', adminController.addMatch);
router.patch('/matches/:id', adminController.updateMatch);
router.delete('/matches/:id', adminController.deleteMatch);
router.get('/transactions/pending', adminController.getPendingTransactions);
router.post('/transactions/:id/approve', adminController.approveTransaction);
router.post('/transactions/:id/reject', adminController.rejectTransaction);

// Voucher management
router.get('/vouchers', adminController.getVouchersAdmin);
router.post('/vouchers', adminController.createVoucherAdmin);
router.delete('/vouchers/:id', adminController.deleteVoucherAdmin);
router.patch('/vouchers/:id/status', adminController.toggleVoucherStatusAdmin);

module.exports = router;

