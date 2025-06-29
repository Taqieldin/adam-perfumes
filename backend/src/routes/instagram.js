const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

// @route   GET /api/instagram/posts
router.get('/posts', instagramController.getLatestPosts);

module.exports = router;
