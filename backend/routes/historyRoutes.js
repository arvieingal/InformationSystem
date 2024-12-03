const express = require("express");
const router = express.Router();
const historyController = require("../controller/historyController");

router.get(
  "/nutritional-status-history",
  historyController.getAllNutritionalStatusHistory
);
router.get(
  "/immunization-record-history",
  historyController.getAllImmunizationRecordHistory
);

module.exports = router;
