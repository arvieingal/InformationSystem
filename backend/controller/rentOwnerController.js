const RentOwner = require("../models/rentOwner");

const rentOwnerController = {
  getAllResident: async (req, res) => {
    try {
      const users = await RentOwner.findAllRentOwner();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "No users found in the database" });
      }
    } catch (error) {
      console.error("Error in getAllUser controller:", error);
      res.status(500).json({
        message: "Internal server error while retrieving users",
        error: error.message,
      });
    }
  },
};

module.exports = rentOwnerController;
