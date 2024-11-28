const express = require("express");
const router = express.Router();
const childImmunizationRecordController = require("../controller/childImmunizationRecordController");

// router.post('/records', childImmunizationRecordController.createRecord);
// router.get('/records', childImmunizationRecordController.getRecords);
// router.get('/records/:id', childImmunizationRecordController.getRecordById);
router.get(
  "/child-immunization-record",
  childImmunizationRecordController.getAllChildImmunizationRecord
);

module.exports = router;
