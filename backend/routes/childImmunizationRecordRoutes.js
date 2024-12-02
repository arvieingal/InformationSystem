const express = require("express");
const router = express.Router();
const childImmunizationRecordController = require("../controller/childImmunizationRecordController");
router.get(
  "/child-immunization-record",
  childImmunizationRecordController.getAllChildImmunizationRecord
);
router.put(
  "/child-immunization-record/:id",
  childImmunizationRecordController.updateChildImmunizationRecord
);

module.exports = router;
