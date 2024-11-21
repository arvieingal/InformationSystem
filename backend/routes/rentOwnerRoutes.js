const express = require("express");
const router = express.Router();
const rentOwnerController = require("../controller/rentOwnerController");

router.get("/rent-owner", rentOwnerController.getAllResident);

module.exports = router;
