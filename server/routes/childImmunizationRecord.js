const express = require("express");
const router = express.Router();
const { childImmunizationRecord } = require("../models");

router.get("/childImmunizationRecords", async (req, res) => {
  try {
    const records = await childImmunizationRecord.findAll();
    res.status(201).json(records);
  } catch (error) {
    console.error("Error fetching child immunization records:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching child immunization data.",
      });
  }
});

module.exports = router;
