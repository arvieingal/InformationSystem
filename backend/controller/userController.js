const User = require("../models/user");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const users = await User.findAllUser();
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
  addUser: async (req, res) => {
    try {
      const newUser = await User.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error in addUser controller:", error);
      res.status(500).json({
        message: "Internal server error while adding user",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.updateUser(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in updateUser controller:", error);
      res.status(500).json({
        message: "Internal server error while updating user",
        error: error.message,
      });
    }
  }
};

module.exports = userController;
