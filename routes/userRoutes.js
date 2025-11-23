const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/generate-key', userController.generateKey);

router.post('/save-user', userController.saveUserData);

module.exports = router;