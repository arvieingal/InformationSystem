const History = require("../models/history");

const historyController = {
  getAllNutritionalStatusHistory: async (req, res) => {
    try {
      const children = await History.findAllNutritionalStatusHistory();
      if (children.length > 0) {
        res.status(200).json(children);
      } else {
        res.status(404).json({ message: "No children found in the database" });
      }
    } catch (error) {
      console.error(
        "Error in getAllNutritionalStatusHistory controller:",
        error
      );
      res.status(500).json({
        message: "Internal server error while retrieving children",
        error: error.message,
      });
    }
  },

  getAllImmunizationRecordHistory: async (req, res) => {
    try {
      const children = await History.findAllImmunizationRecordHistory();
      if (children.length > 0) {
        res.status(200).json(children);
      } else {
        res.status(404).json({ message: "No children found in the database" });
      }
    } catch (error) {
      console.error(
        "Error in getAllImmunizationRecordHistory controller:",
        error
      );
      res.status(500).json({
        message: "Internal server error while retrieving children",
        error: error.message,
      });
    }
  },
};

module.exports = historyController;
