const express = require("express");
const router = express.Router();
const residentController = require("../controller/residentController");

router.get("/resident", residentController.getAllResident);
router.get("/household-head", residentController.getHouseholdHead);
router.post("/insert-household-member", residentController.insertHouseholdMember);

module.exports = router;
