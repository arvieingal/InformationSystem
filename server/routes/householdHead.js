const express = require("express");
const router = express.Router();
const { HouseholdHead } = require("../models");

// Create a new household head
router.post("/household-head", async (req, res) => {
  try {
    const householdHead = await HouseholdHead.create(req.body);
    res.status(201).json(householdHead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all household head
router.get("/household-head", async (req, res) => {
  try {
    const householdHead = await HouseholdHead.findAll();
    res.status(200).json(householdHead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
