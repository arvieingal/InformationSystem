const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/immunizations - Fetch all immunizations
router.get('/immunizations', async (req, res) => {
  try {
    const immunizations = await db.Immunization.findAll();
    res.json(immunizations);
  } catch (error) {
    console.error("Error fetching immunizations:", error);
    res.status(500).json({ error: "An error occurred while fetching immunization data." });
  }
});

// GET /api/immunizations/:id - Fetch an immunization by ID
router.get('/immunizations/:id', async (req, res) => {
  try {
    const immunization = await db.Immunization.findByPk(req.params.id);
    if (immunization) {
      res.json(immunization);
    } else {
      res.status(404).json({ error: "Immunization not found." });
    }
  } catch (error) {
    console.error("Error fetching immunization by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching immunization data." });
  }
});

module.exports = router; 