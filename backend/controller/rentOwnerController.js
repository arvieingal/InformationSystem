const RentOwner = require("../models/rentOwner");

const rentOwnerController = {
  getAllResident: async (req, res) => {
    try {
      const renterOwner = await RentOwner.findAllRentOwner();
      if (renterOwner.length > 0) {
        res.status(200).json(renterOwner);
      } else {
        res.status(404).json({ message: "No renterOwner found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving renterOwner",
        error: error.message,
      });
    }
  },
};

module.exports = rentOwnerController;
