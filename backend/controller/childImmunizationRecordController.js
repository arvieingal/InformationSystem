const ChildImmunizationRecord = require("../models/childImmunizationRecord");

const childImmunizationRecordController = {
  getAllChildImmunizationRecord: async (req, res) => {
    try {
      const childImmunization =
        await ChildImmunizationRecord.findAllChildImmunizationRecord();
      if (childImmunization.length > 0) {
        res.status(200).json(childImmunization);
      } else {
        res
          .status(404)
          .json({ message: "No childImmunization found in the database" });
      }
    } catch (error) {
      console.error("Error in getChildImmunizationRecord controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving childImmunization",
        error: error.message,
      });
    }
  },
};

module.exports = childImmunizationRecordController;
