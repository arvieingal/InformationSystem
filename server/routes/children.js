const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming you have a Sequelize model set up

// GET /api/children - Fetch all children
router.get('/children', async (req, res) => {
  try {
    const children = await db.Child.findAll(); // Ensure the model name is correct
    console.log("Fetched children:", children); // Log the fetched data
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "An error occurred while fetching children data." });
  }
});

// GET /api/children/:id - Fetch a child by ID
router.get('/children/:id', async (req, res) => {
  try {
    const child = await db.Children.findByPk(req.params.id); 
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ error: "Child not found." });
    }
  } catch (error) {
    console.error("Error fetching child by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching child data." });
  }
});

module.exports = router; 