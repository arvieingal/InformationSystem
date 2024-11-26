const express = require('express');
const router = express.Router();
const logController = require('../controller/logController');

router.post('/user-actions', logController.logUserAction);
router.get('/logs', logController.getLogs);

module.exports = router; 