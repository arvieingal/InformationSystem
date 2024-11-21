const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpStore = {};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    const info = await transporter.sendMail({
      from: {
        name: "NodeMailer",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Test Email for Capstone OTP",
      text: `Your OTP is ${otp}`,
      html: `<div><p>Your OTP is ${otp}</p></div>`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/send-otp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (otpStore[email] === otp) {
      delete otpStore[email];
      return res.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  } catch (error) {
    console.error("Error in POST /api/verify-otp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

module.exports = { sendOtp, verifyOtp };
