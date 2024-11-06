const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming you have a Sequelize model set up

// GET /api/children - Fetch all children
router.get('/children', async (req, res) => {
  try {
    const children = await db.Children.findAll(); // Fetch all children from the database
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
});

module.exports = router; 