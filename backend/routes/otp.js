const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controller/otpController");
const {
  otpResetPassword,
  checkEmail,
} = require("../controller/userController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/users/check-email/:email", checkEmail);
router.post("/reset-password", otpResetPassword);

module.exports = router;
