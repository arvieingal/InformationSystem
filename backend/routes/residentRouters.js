const express = require("express");
const router = express.Router();
const residentController = require("../controller/residentController");

router.get("/resident", residentController.getAllResident);

module.exports = router;
