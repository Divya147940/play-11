const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/balance', verifyToken, walletController.getBalance);
router.get('/transactions', verifyToken, walletController.getTransactions);
router.post('/add-money', verifyToken, walletController.addMoney);
router.post('/withdraw', verifyToken, walletController.withdrawMoney);

module.exports = router;
