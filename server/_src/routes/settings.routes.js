const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

router.get('/:key', settingsController.getSetting);
router.post('/update', verifyAdmin, settingsController.updateSetting);

module.exports = router;
