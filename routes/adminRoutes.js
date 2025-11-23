const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', adminController.login);

router.get('/dashboard', authMiddleware, adminController.getDashboardData);
router.put('/keys/:id', authMiddleware, adminController.updateApiKey);

module.exports = router;