const Purok = require("../models/purok");

const purokController = {
  getAllPurok: async (req, res) => {
    try {
      const purok = await Purok.findAllPurok();
      if (purok.length > 0) {
        res.status(200).json(purok);
      } else {
        res.status(404).json({ message: "No purok found in the database" });
      }
    } catch (error) {
      console.error("Error in purok controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving purok",
        error: error.message,
      });
    }
  },

  getAllPurokPopulationByTable: async (req, res) => {
    try {
      const purokPopulationBytable = await Purok.CountPurokPopulationByTable();
      if (purokPopulationBytable.length > 0) {
        res.status(200).json(purokPopulationBytable);
      } else {
        res
          .status(404)
          .json({ message: "No purok population found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving purok population",
        error: error.message,
      });
    }
  },

  getAllSectoralByPurok: async (req, res) => {
    try {
      const sectoralByPurok = await Purok.CountAllSectoralByPurok();
      if (sectoralByPurok.length > 0) {
        res.status(200).json(sectoralByPurok);
      } else {
        res
          .status(404)
          .json({ message: "No purok population found in the database" });
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

module.exports = purokController;
