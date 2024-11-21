const express = require("express");
const router = express.Router();
const renterController = require("../controller/renterController");

router.get("/renter", renterController.getAllRenter);

module.exports = router;
