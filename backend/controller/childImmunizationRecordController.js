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

  updateChildImmunizationRecord: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await ChildImmunizationRecord.updateRecord(
        id,
        updatedData
      );
      if (result) {
        res.status(200).json({ message: "Record updated successfully" });
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error("Error updating record:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  filterChildImmunizationRecord: async (req, res) => {
    try {
      const { sex, status, vaccine_type, doses } = req.query;
      console.log("Received Query:", { sex, status, vaccine_type, doses });

      const results = await ChildImmunizationRecord.filterImmunizationRecords({
        sex,
        status,
        vaccine_type,
        doses,
      });

      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching immunization records:", error);
      res.status(500).send("Server Error");
    }
  },

  archiveRecord: async (req, res) => {
    try {
      const immunizationData = req.body;

      const result = await ChildImmunizationRecord.archiveRecord(
        immunizationData
      );

      if (result && result.affectedRows > 0) {
        res.status(200).json({ message: "Child updated successfully", result });
      } else {
        res.status(404).json({ message: "Child not found or no changes made" });
      }
    } catch (error) {
      console.error("Error in Immunization controller:", error);
      res.status(500).json({
        message: "Internal server error while updating Child",
        error: error.message,
      });
    }
  },

  fetchAllVaccinated: async (req, res) => {
    try {
      const vaccinatedCount = await ChildImmunizationRecord.getAllVaccinated();
      if (vaccinatedCount.length > 0) {
        res.status(200).json(vaccinatedCount);
      } else {
        res
          .status(404)
          .json({ message: "No vaccinatedCount found in the database" });
      }
    } catch (error) {
      console.error("Error in getvaccinatedCountRecord controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving vaccinatedCount",
        error: error.message,
      });
    }
  },
};

module.exports = childImmunizationRecordController;
