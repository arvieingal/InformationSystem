const express = require("express");
const router = express.Router();
const renterController = require("../controller/renterController");

router.get("/renter", renterController.getAllRenter);
router.post("/insert-renter", renterController.insertRenter);
router.put("/update-renter", renterController.updateRenter);
router.put("/archive-renter", renterController.archiveRenter);
router.get("/renter/search", renterController.searchRenters);
router.get("/filter-renter", renterController.filterRentersRecord);

module.exports = router;
