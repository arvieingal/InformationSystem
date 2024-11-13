const express = require("express");
const router = express.Router();
const { childImmunizationRecord, vaccineDose } = require("../models");

router.get("/childImmunizationRecords", async (req, res) => {
  try {
    // Fetch child immunization records with associated vaccine doses
    const records = await childImmunizationRecord.findAll({
      include: {
        model: vaccineDose, // Include vaccineDose model
        as: 'vaccineDoses', // Optional: Alias for the relationship if you have defined one in the models
      },
    });

    res.status(201).json(records);
  } catch (error) {
    console.error("Error fetching child immunization records:", error);
    res.status(500).json({
      error: "An error occurred while fetching child immunization data.",
    });
  }
});

module.exports = router;
