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
router.get(
  "/filter-child-immunization-record",
  childImmunizationRecordController.filterChildImmunizationRecord
);
router.put(
  "/archive-immunization-record",
  childImmunizationRecordController.archiveRecord
);


module.exports = router;
