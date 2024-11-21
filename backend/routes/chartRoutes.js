const express = require("express");
const router = express.Router();
const chartController = require("../controller/chartController");

router.get("/gender", chartController.getAllGender);
router.get("/registered-voter", chartController.getAllRegisteredVoter);
router.get("/age-group", chartController.getAllAgeGroup);
router.get("/purok-population", chartController.getAllPurokPopulation);

module.exports = router;
