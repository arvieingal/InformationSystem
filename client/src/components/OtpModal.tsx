"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";

interface OtpModalProps {
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChangePassword?: boolean;
}

interface FormData {
  email: string;
  user_id?: string;
}

export default function OtpModal({
  isEmailModalOpen,
  setIsEmailModalOpen,
  isChangePassword,
}: OtpModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");

  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetPasswordSuccess, setIsResetPasswordSuccess] =
    useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (isOtpModalOpen) {
      setResendTimer(90);
      setCanResend(false);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOtpModalOpen]);

  const handleEmailSubmit = async (data: FormData) => {
    setIsEmailModalOpen(true);
    setLoading(true);
    setMessage("");

    if (!data.email) {
      setMessage("Please input email");
      setLoading(false);
      return;
    }

    try {
      // Check if this is a Change Password operation
      if (isChangePassword) {
        const session = await getSession(); // Assuming you're using next-auth or similar
        if (!session || session.user.email !== data.email) {
          setMessage("The entered email does not match your current email.");
          setLoading(false);
          return;
        }
        // Proceed to OTP logic for logged-in users
        const response = await api.post("/api/send-otp", {
          email: data.email,
        });

        const result = response.data;

        if (result.success) {
          setMessage("OTP sent successfully");
          setIsOtpModalOpen(true);
          setIsEmailModalOpen(false);
        } else {
          setMessage(
            `Failed to send OTP: ${result.message || "Unknown error"}`
          );
          console.error("OTP sending failed:", result);
        }
        setLoading(false);
        return;
      }

      // Forgot Password logic
      const emailResponse = await api.get(
        `/api/users/check-email/${data.email}`
      );
      const checkEmailResponse = emailResponse.data;

      if (!checkEmailResponse.exists) {
        setMessage(
          "This email is not registered. Please check your email or sign up."
        );
        setLoading(false);
        return;
      }

      // If email exists, proceed with OTP
      const response = await api.post("/api/send-otp", {
        email: data.email,
      });

      const result = response.data;

      if (result.success) {
        setMessage("OTP sent successfully");
        setIsOtpModalOpen(true);
        setIsEmailModalOpen(false);
      } else {
        setMessage(`Failed to send OTP: ${result.message || "Unknown error"}`);
        console.error("OTP sending failed:", result);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setResendLoading(true);
    setOtpError("");

    try {
      const email = getValues("email");
      const response = await api.post("/api/send-otp", {
        email: email,
      });

      const result = response.data;
      if (result.success) {
        setMessage("New OTP sent successfully");
        setOtp(["", "", "", ""]);
      } else {
        setOtpError(`Failed to send OTP: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      setOtpError("An error occurred. Please try again later.");
      console.error("Error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setOtpError("Please enter all digits");
      return;
    }

    setLoading(true);
    setOtpError(""); // Clear previous errors

    try {
      const response = await api.post("/api/verify-otp", {
        otp: otpValue,
        email: getValues("email"), // Include email from the form
      });

      if (response.data.success) {
        setMessage("OTP verified successfully");
        setIsPasswordResetModalOpen(true);
        setIsOtpModalOpen(false);
      } else {
        setOtpError(response.data.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", ""]);
      }
    } catch (error: any) {
      setOtpError(
        error.response?.data?.message ||
          "An error occurred while verifying OTP."
      );
      console.error("Error:", error);
      setOtp(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    try {
      const email = getValues("email"); // Use email instead of userId
      const response = await api.post("/api/reset-password", {
        // Change to appropriate endpoint
        email: email,
        password: newPassword,
      });

      if (response.data.success) {
        setMessage("Password reset successfully");
        setIsResetPasswordSuccess(true);
        setIsPasswordResetModalOpen(false);
      }
    } catch (error) {
      setMessage("Failed to reset password");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="h-full">
        <form action="" onSubmit={handleSubmit(handleEmailSubmit)}>
          {isEmailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
              <div className="bg-white w-[533px] p-4 rounded-[10px] shadow-lg">
                <div className="flex items-end justify-center pt-4">
                  <Image src="/svg/logo.svg" width={92} height={61} alt="" />
                </div>
                <div className="flex items-center justify-center flex-col pt-[1rem]">
                  <h2 className="text-[30px] font-medium">
                    {isChangePassword ? "Change Password" : "Forgot Password?"}
                  </h2>
                  <p className="text-[12px]">
                    No worries, we&apos;ll send you reset instruction.
                  </p>
                </div>
                <div className="px-[2rem] mt-[2rem]">
                  <h1 className="text-[15px]">Email</h1>
                  <input
                    type="email"
                    id="email"
                    className={`border py-2 mt-2 w-full rounded-[5px] outline-none placeholder:text-gray-500 px-[1rem] ${
                      errors.email ? "border-red-500" : "border-[#C8C8C8]"
                    }`}
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-red-600">{errors.email.message}</p>
                  )}
                  {message && (
                    <p className="mt-4 text-center text-red-600">{message}</p>
                  )}
                </div>

                <div className="w-full mt-4 px-[2rem]">
                  <button
                    className="bg-[#24968B] w-full text-white  py-2 rounded-[5px]"
                    type="submit"
                  >
                    {loading ? "Sending..." : "Reset Password"}
                  </button>
                </div>
                <div className="pt-[2rem] pb-[3rem]">
                  <p
                    className="ml-2 text-[#777777] cursor-pointer flex items-center justify-center "
                    onClick={() => setIsEmailModalOpen(false)}
                  >
                    <Image
                      src="/svg/arrow.svg"
                      width={20}
                      height={20}
                      alt="Back Icon"
                    />
                    {isChangePassword ? "Back to Settings" : "Back to log in"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
        {isOtpModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <div className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg">
              <div className="flex items-end justify-center">
                <Image src="/svg/logo.svg" width={92} height={61} alt="" />
              </div>
              <div className="flex items-center justify-center flex-col pt-[1rem]">
                <h2 className="text-[30px] font-medium">Password reset</h2>
                <p className="text-[12px] ">
                  We&apos;ll send you reset instructions, check your email!
                </p>
              </div>
              <div className="px-[2rem] mt-[2rem] flex flex-col items-center">
                <div className="flex justify-center gap-9">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      name={`otp-${index}`}
                      type="text"
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      className={`border text-center text-[32px] py-2 w-[80px] h-[80px] rounded-[5px] outline-none ${
                        otpError ? "border-red-500" : "border-[#C8C8C8]"
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm mt-2">{otpError}</p>
                )}
              </div>
              <div className="w-full mt-4 px-[2rem]">
                <button
                  className="bg-[#24968B] w-full text-white py-2 rounded-[5px]"
                  onClick={handleOtpSubmit}
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
                <p className="text-[#A4A4A4] flex items-center justify-center pt-2">
                  Didn&apos;t receive the email?{" "}
                  {canResend ? (
                    <span
                      className="text-[#398EE2] cursor-pointer ml-1"
                      onClick={handleResendOtp}
                    >
                      Click to resend
                    </span>
                  ) : (
                    <span className="text-gray-400 ml-1">
                      Resend in {resendTimer}s
                    </span>
                  )}
                </p>
                <div className="flex items-center justify-center mt-[2rem]">
                  <Image
                    src="/svg/arrow.svg"
                    width={20}
                    height={20}
                    alt="Back Icon"
                  />
                  <Link href={isChangePassword ? "http://localhost:3000/main/settings" : "/"}>
                    <p
                      className="ml-2 text-[#777777] cursor-pointer"
                      onClick={() => setIsOtpModalOpen(false)}
                    >
                      {isChangePassword ? "Back to Settings" : "Back to log in"}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {isPasswordResetModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <div className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg">
              <div className="flex items-end justify-center">
                <Image src="/svg/logo.svg" width={92} height={61} alt="" />
              </div>
              <div className="flex items-center justify-center flex-col pt-[1rem]">
                <h2 className="text-[30px] font-medium">Reset your password</h2>
                <p>We&apos;ll send you reset instructions.</p>
              </div>
              <div className="px-[2rem] mt-[1rem]">
                <h1 className="text-[15px]">New Password</h1>
                <input
                  type="password"
                  className="border py-1 mt-2 w-full b-[#C8C8C8] rounded-[5px] outline-none px-[1rem]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <h1 className="text-[15px] mt-4">Confirm Password</h1>
                <input
                  type="password"
                  className="border py-1 mt-2 w-full b-[#C8C8C8] rounded-[5px] outline-none px-[1rem]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              <div className="w-full mt-4 px-[2rem]">
                <button
                  className="bg-[#24968B] w-full text-white py-1 rounded-[5px]"
                  onClick={handleNewPasswordSubmit}
                >
                  Reset Password
                </button>
                <div className="flex items-center justify-center mt-[2rem]">
                  <Image
                    src="/svg/arrow.svg"
                    width={20}
                    height={20}
                    alt="Back Icon"
                  />
                  <Link href={isChangePassword ? "http://localhost:3000/main/settings" : "/"}>
                    <p
                      className="ml-2 text-[#777777] cursor-pointer"
                      onClick={() => setIsPasswordResetModalOpen(false)}
                    >
                      {isChangePassword ? "Back to Settings" : "Back to log in"}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {isResetPasswordSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <div className="bg-white w-[533px] p-4 rounded-[10px] shadow-lg">
              <div className="flex items-end justify-center">
                <Image src="/svg/logo.svg" width={92} height={61} alt="" />
              </div>
              <div className="flex items-center justify-center flex-col pt-[2rem] gap-4">
                <h2 className="text-[30px] font-medium">All Done!</h2>
                <p>Your password has been successfully reset.</p>
              </div>
              <div className="w-full pt-6 px-[2rem] pb-12">
                <button
                  className="bg-[#24968B] w-full text-white py-2 rounded-[5px]"
                  onClick={() => {
                    if (isChangePassword) {
                      // Sign out from the session
                      signOut(); // Ensure you import signOut from 'next-auth/react'
                    }
                    setIsResetPasswordSuccess(false);
                    router.push("/");
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
