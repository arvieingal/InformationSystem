const express = require("express");
const router = express.Router();
const childImmunizationRecordController = require("../controller/childImmunizationRecordController");

router.get(
  "/child-immunization-record",
  childImmunizationRecordController.getAllChildImmunizationRecord
);

module.exports = router;
