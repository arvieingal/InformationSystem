const express = require("express");
const router = express.Router();
const { childImmunizationRecord, Child } = require("../models");

router.get("/childImmunizationRecords", async (req, res) => {
  try {
    const records = await childImmunizationRecord.findAll({
      include: [
        {
          model: Child,
          as: "child",
          attributes: ["last_name", "first_name", "middle_name", "suffix", "sex", "dateOfBirth"],
        },
      ],
    });

    if (records.length === 0) {
      console.log("No records found.");
    } else {
      records.forEach((record) => {
        console.log(
          record.child.last_name,
          record.child.first_name,
          record.child.middle_name
        );
      });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching child immunization records:", error);
    res.status(500).json({
      error: "An error occurred while fetching child immunization data.",
    });
  }
});

module.exports = router;