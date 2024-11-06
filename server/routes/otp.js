const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("this is the email user", process.env.EMAIL_USER);
console.log("this is the email pass", process.env.EMAIL_PASS);

const otpStore = {};
// Send OTP route
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("this is the otp", otp);

    // TODO: Replace this with a proper storage solution (e.g., Redis, database)
    otpStore[email] = otp;

    const info = await transporter.sendMail({
      from: {
        name: "NodeMailer",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Test Email for Capstone OTP",
      text: `Your OTP is ${otp}`,
      html: `<div>
        <p>Your OTP is ${otp}</p>
      </div>`,
    });

    console.log("this is the info", info);

    // TODO: Implement OTP expiration logic

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Error in POST /api/send-otp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required"
        });
      }
  
      console.log("Stored OTP:", otpStore[email]); // Debug log
      console.log("Received OTP:", otp); // Debug log
  
      if (otpStore[email] === otp) {
        delete otpStore[email];
        return res.json({
          success: true,
          message: "OTP verified successfully"
        });
      }
  
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
  
    } catch (error) {
      console.error("Error in POST /api/verify-otp:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify OTP"
      });
    }
  });

module.exports = router;