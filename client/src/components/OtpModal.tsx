'use client'
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
}

export default function OtpModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        setMessage("OTP sent successfully");
      } else {
        setMessage(`Failed to send OTP: ${result.message || "Unknown error"}`);
        console.error("OTP sending failed:", result);
      }
    } catch (error) {
      setMessage("An error occurred while sending OTP.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg">
            <div className="flex items-end justify-center">
              <Image src="/svg/logo.svg" width={92} height={61} alt="" />
            </div>
            <div className="flex items-center justify-center flex-col pt-[1rem]">
              <h2 className="text-[30px] font-medium">Forgot Password?</h2>
              <p className="text-[12px]">
                No worries, we’ll send you reset instruction.
              </p>
            </div>
            <div className="px-[2rem] mt-[2rem]">
              <h1 className="text-[15px]">Email</h1>
              <input
                type="email"
                id="email"
                className="border py-2 mt-2 w-full border-[#C8C8C8] rounded-[5px] outline-none placeholder:text-gray-500 px-[1rem]"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="w-full mt-4 px-[2rem]">
              <button
                className="bg-[#24968B] w-full text-white  py-2 rounded-[5px]"
                type="submit"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
              {message && <p className="mt-4 text-center">{message}</p>}
            </div>
            <div className="flex items-center justify-center mt-[2rem]">
              <Image src="/svg/arrow.svg" width={20} height={20} alt="Back Icon" />
              <Link href="/login">
                <p className="ml-2 text-[#777777] cursor-pointer">
                  Back to log in
                </p>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
