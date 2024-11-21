const Charts = require("../models/charts");

const chartController = {
  getAllGender: async (req, res) => {
    try {
      const gender = await Charts.CountGender();
      if (gender.length > 0) {
        res.status(200).json(gender);
      } else {
        res.status(404).json({ message: "No gender found in the database" });
      }
    } catch (error) {
      console.error("Error in gender controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving gender",
        error: error.message,
      });
    }
  },

  getAllRegisteredVoter: async (req, res) => {
    try {
      const registeredVoter = await Charts.CountRegisteredVoter();
      if (registeredVoter.length > 0) {
        res.status(200).json(registeredVoter);
      } else {
        res
          .status(404)
          .json({ message: "No registered voter found in the database" });
      }
    } catch (error) {
      console.error("Error in registered voter controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving registered voter",
        error: error.message,
      });
    }
  },

  getAllAgeGroup: async (req, res) => {
    try {
      const ageGroup = await Charts.CountAllAgeGroup();
      if (ageGroup.length > 0) {
        res.status(200).json(ageGroup);
      } else {
        res.status(404).json({ message: "No age group found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving age group",
        error: error.message,
      });
    }
  },

  getAllPurokPopulation: async (req, res) => {
    try {
      const purokPopulation = await Charts.CountPurokPopulation();
      if (purokPopulation.length > 0) {
        res.status(200).json(purokPopulation);
      } else {
        res.status(404).json({ message: "No purok population found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving purok population",
        error: error.message,
      });
    }
  },
};

module.exports = chartController;
