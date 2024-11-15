const express = require("express");
const router = express.Router();
const { FamilyMember } = require("../models");

// Create a new household member
router.post("/household-member", async (req, res) => {
  try {
    const member = await FamilyMember.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all household member
router.get("/household-member", async (req, res) => {
  try {
    const member = await FamilyMember.findAll();
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;