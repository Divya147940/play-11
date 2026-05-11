const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/:key', settingsController.getSetting);
router.post('/update', verifyToken, settingsController.updateSetting);

module.exports = router;
