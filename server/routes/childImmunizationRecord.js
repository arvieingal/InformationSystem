const express = require("express");
const router = express.Router();
const { ChildImmunizationRecord, Child, HouseholdMember } = require("../models");

router.get("/childImmunizationRecord", async (req, res) => {
  try {
    const records = await ChildImmunizationRecord.findAll({
      include: [
        {
          model: Child,
          as: "child",
          include: [
            {
              model: HouseholdMember,
              as: "householdMember",
              attributes: ["family_name", "given_name", "middle_name", "extension", "gender", "birthdate"],
            },
          ],
        },
      ],
    });

    if (records.length === 0) {
      console.log("No records found.");
    } else {
      records.forEach((record) => {
        console.log(
          record.child.householdMember.last_name,
          record.child.householdMember.first_name,
          record.child.householdMember.middle_name
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