const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

router.get('/logs', async (req, res) => {
  console.log('Received request for logs');
  try {
    const logs = await Log.getAll();
    console.log('Logs fetched:', logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 