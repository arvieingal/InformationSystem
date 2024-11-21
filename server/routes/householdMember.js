const express = require("express");
const router = express.Router();
const { HouseholdMember } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

// Create a new household member
router.post("/household-member", async (req, res) => {
  try {
    const householdMember = await HouseholdMember.create(req.body);
    res.status(201).json(householdMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all household members who are 6 years old and below
router.get("/household-member", async (req, res) => {
  try {
    const sixYearsAgo = moment().subtract(6, 'years').toDate();
    const householdMembers = await HouseholdMember.findAll({
      where: {
        birthdate: {
          [Op.gte]: sixYearsAgo
        }
      }
    });
    res.status(200).json(householdMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;