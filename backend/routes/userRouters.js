const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authenticateUser = require("../middleware/authMiddleware");
router.get("/users", userController.getAllUser);
router.post("/users", userController.addUser);
router.put("/users/:id", userController.updateUser);
router.post("/users/change-password", userController.changePassword);
router.delete("/users/:id", userController.deleteUser);
router.post("/users/verify-password" ,userController.verifyPassword);

module.exports = router;
