const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/my-vouchers', verifyToken, voucherController.getVouchers);
router.post('/redeem', verifyToken, voucherController.redeemVoucher);

module.exports = router;
