const express = require("express");
const router = express.Router();
const { Family } = require("../models");

// Create a new user
router.post("/families", async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all families
router.get("/families", async (req, res) => {
  try {
    const family = await Family.findAll();
    res.status(200).json(family);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;