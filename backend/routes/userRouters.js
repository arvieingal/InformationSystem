const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/users", userController.getAllUser);
router.post("/users", userController.addUser);
router.put("/users/:id", userController.updateUser);
router.post("/users/change-password", userController.changePassword);

module.exports = router;
