const User = require("../models/user");
const bcrypt = require("bcrypt");

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
  },


  
  changePassword: async (req, res) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      const user = await User.findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(userId, hashedPassword);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in changePassword controller:", error);
      res.status(500).json({
        message: "Internal server error while changing password",
        error: error.message,
      });
    }
  },

  checkEmail: async (req, res) => {
    try {
      const email = req.params.email;

      const user = await User.findUserByEmail(email);
      res.status(200).json({
        exists: !!user,
        message: user ? "Email found" : "Email not found",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  otpResetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const updated = await User.otpUpdatePassword(email, password);

      if (updated) {
        res
          .status(200)
          .json({ success: true, message: "Password reset successfully" });
      } else {
        res.status(400).json({ error: "Failed to reset password" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await User.deleteUser(userId);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error in deleteUser controller:", error);
      res.status(500).json({
        message: "Internal server error while deleting user",
        error: error.message,
      });
    }
  },

  verifyPassword: async (req, res) => {
    try {
      const userId = req.user ? req.user.id : null;
      console.log("User ID:", userId);

      const { currentPassword } = req.body;
      const user = await User.findUserById(userId);
      console.log("User found:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      res.status(200).json({ message: "Password verified" });
    } catch (error) {
      console.error("Error in verifyPassword controller:", error);
      res.status(500).json({
        message: "Internal server error while verifying password",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
