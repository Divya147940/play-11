const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/study', categoryController.getStudyCategories);
router.get('/game', categoryController.getGameCategories);

module.exports = router;
