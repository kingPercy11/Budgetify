const express = require('express');
const router = express.Router();
const limitController = require('../controllers/limit.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get user limits and spending analysis
router.get('/', authMiddleware.authUser, limitController.getLimits);

// Update user limits
router.put('/update', authMiddleware.authUser, limitController.updateLimits);

// Update specific category limit
router.put('/category', authMiddleware.authUser, limitController.updateCategoryLimit);

// Get spending progress
router.get('/progress', authMiddleware.authUser, limitController.getSpendingProgress);

// Reset all limits
router.delete('/reset', authMiddleware.authUser, limitController.resetLimits);

module.exports = router;
