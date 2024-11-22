const express = require("express");
const router = express.Router();
const purokController = require("../controller/purokController");

router.get("/purok", purokController.getAllPurok);
router.get(
  "/purok-population-by-table",
  purokController.getAllPurokPopulationByTable
);
router.get("/sectoral-by-purok", purokController.getAllSectoralByPurok);

module.exports = router;
