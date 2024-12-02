const Renter = require("../models/renter");

const rentOwnerController = {
  getAllRenter: async (req, res) => {
    try {
      const renter = await Renter.findAllRenter();
      if (renter.length > 0) {
        res.status(200).json(renter);
      } else {
        res.status(404).json({ message: "No renter found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving users",
        error: error.message,
      });
    }
  },

  insertRenter: async (req, res) => {
    try {
      const renterData = req.body;

      console.log(renterData)

      const result = await Renter.insertRenter(renterData);

      if (result && result.affectedRows > 0) {
        res.status(200).json({ message: "Renter added successfully", result });
      } else {
        res.status(400).json({ message: "Failed to add Renter" });
      }
    } catch (error) {
      console.error("Error in insertRenter controller:", error);
      res.status(500).json({
        message: "Internal server error while adding Renter",
        error: error.message,
      });
    }
  },

  updateRenter: async (req, res) => {
    try {
      const renterData = req.body;

      const result = await Renter.updateRenter(renterData);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Renter updated successfully", result });
      } else {
        res
          .status(400)
          .json({ message: "Renter not found or no changes made" });
      }
    } catch (error) {
      console.error("Error in updateRenter controller:", error);
      res.status(500).json({
        message: "Internal server error while updating Renter",
        error: error.message,
      });
    }
  },

  archiveRenter: async (req, res) => {
    try {
      const renterData = req.body;

      const result = await Renter.archiveRenter(renterData);

      if (result && result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Renter updated successfully", result });
      } else {
        res
          .status(404)
          .json({ message: "Renter not found or no changes made" });
      }
    } catch (error) {
      console.error("Error in updateRenter controller:", error);
      res.status(500).json({
        message: "Internal server error while updating Renter",
        error: error.message,
      });
    }
  },
};

module.exports = rentOwnerController;
