const express = require("express");
const router = express.Router();
const residentController = require("../controller/residentController");

router.get("/resident", residentController.getAllResident);
router.get("/household-head", residentController.getHouseholdHead);
router.post(
  "/insert-household-member",
  residentController.insertHouseholdMember
);
router.post("/insert-household-head", residentController.insertHouseholdHead);
router.put(
  "/update-household-member",
  residentController.updateHouseholdMember
);
router.put(
  "/archive-household-member",
  residentController.archiveHouseholdMember
);
router.get("/resident/search", residentController.searchResidents);
router.get("/filter-resident", residentController.filterResidentsRecord);

module.exports = router;
