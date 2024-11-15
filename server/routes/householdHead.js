const express = require("express");
const router = express.Router();
const { Family } = require("../models");

// Create a new household head
router.post("/household-head", async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all household head
router.get("/household-head", async (req, res) => {
  try {
    const family = await Family.findAll();
    res.status(200).json(family);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
