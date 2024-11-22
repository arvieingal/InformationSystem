const Resident = require("../models/resident");

const residentController = {
  getAllResident: async (req, res) => {
    try {
      const resident = await Resident.findAllResident();
      if (resident.length > 0) {
        res.status(200).json(resident);
      } else {
        res.status(404).json({ message: "No resident found in the database" });
      }
    } catch (error) {
      console.error("Error in resident controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving resident",
        error: error.message,
      });
    }
  },

  getHouseholdHead: async (req, res) => {
    try {
      const householdHead = await Resident.findHouseHoldHead();
      if (householdHead.length > 0) {
        res.status(200).json(householdHead);
      } else {
        res
          .status(404)
          .json({ message: "No household head found in the database" });
      }
    } catch (error) {
      console.error("Error in household head controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving household head",
        error: error.message,
      });
    }
  },
};

module.exports = residentController;
