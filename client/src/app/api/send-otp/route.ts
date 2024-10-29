import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("this is the user",process.env.EMAIL_USER);
console.log("this is the pass",process.env.EMAIL_PASS);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("this is the otp",otp)

    // TODO: Replace this with a proper storage solution (e.g., Redis, database)
    const otpStore: Record<string, string> = {};
    otpStore[email] = otp;

    const info = await transporter.sendMail({
      from: {
        name: "NodeMailer",
        address: 'Test',
      },
      to: email,
      subject: "Test Email for Capstone OTP",
      text: `Your OTP is ${otp}`,
      html: `<div>
        <p>Your OTP is ${otp}</p>
      </div>`,
    });

    console.log("this is the info",info);

    // TODO: Implement OTP expiration logic

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/send-otp:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
