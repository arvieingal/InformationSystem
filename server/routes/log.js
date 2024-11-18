const express = require('express');
const router = express.Router();
const { Log, User } = require('../models');

// Get all logs with user information
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [{
        model: User,
        attributes: ['username'] 
      }]
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;