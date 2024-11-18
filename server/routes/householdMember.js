const express = require("express");
const router = express.Router();
const { HouseholdMember } = require("../models");

// Create a new household member
router.post("/household-member", async (req, res) => {
  try {
    const householdMember = await HouseholdMember.create(req.body);
    res.status(201).json(householdMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all household member
router.get("/household-member", async (req, res) => {
  try {
    const householdMember = await HouseholdMember.findAll();
    res.status(200).json(householdMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;