"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import router from "next/router";

const Login = () => {
  const [username, setusername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [isAllDoneModalOpen, setIsAllDoneModalOpen] = useState<boolean>(false);
  const [otp, setOTP] = useState<string[]>(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [emailPlaceholderVisible, setEmailPlaceholderVisible] =
    useState<boolean>(true);
  const [passwordPlaceholderVisible, setPasswordPlaceholderVisible] =
    useState<boolean>(true);
  const [
    confirmPasswordPlaceholderVisible,
    setconfirmPasswordPlaceholderVisible,
  ] = useState<boolean>(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [fieldError, setFieldError] = useState<{
    username: boolean;
    password: boolean;
  }>({ username: false, password: false });

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOTPModalOpen(false);
    setIsPasswordModalOpen(false);
    setIsAllDoneModalOpen(false);
  };

  const handleOTPSubmit = () => {
    // Validate OTP
    setIsModalOpen(false);
    setIsOTPModalOpen(true);
  };

  const handleNewPasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsOTPModalOpen(false);
    setIsPasswordModalOpen(false);
    setIsAllDoneModalOpen(true);
  };

  const handleOTPChange = (index: number, value: string) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFieldError({ username: !username, password: !password });

    if (!username || !password) {
      setError("Please fill out all fields.");
      return;
    }
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const isAuthenticated = true;

    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
    }
  };

  const handleForgotPasswordClick = () => {
    setIsModalOpen(true);
  };

  const handleFieldChange = (
    setFieldValue: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    fieldType: "username" | "password"
  ) => {
    setFieldValue(value);
    setFieldError((prevErrors) => ({
      ...prevErrors,
      [fieldType]: false,
    }));

    if (fieldType === "username") {
      setError(null);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-auto scrollbar-hidden items-center justify-center bg-[#FCFCFC]">
      <div className="w-full flex flex-row sm:flex-col items-center justify-center h-screen border-[#CCCCCC]">
        <div className="w-[80%] md:w-[90%] 2xl:w-[150%]">
          <Image
            className="h-screen w-full object-cover rounded-l-[5px]"
            src="/register.png"
            width={1000}
            height={800}
            alt="Login Image"
          />
        </div>

        <div className="w-[35%] flex flex-col items-center justify-center mb-[8%]">
          <div className="flex items-center justify-center">
            <Image src="/logo.svg" width={92} height={91} alt="Logo" />
          </div>

          <div className="flex items-center justify-center flex-col mb-8">
            <p className="font-semibold text-[40px]">Welcome!</p>
            <p>Please enter your details</p>
          </div>

          <div className="flex items-center justify-center w-full sm:px-[0px] md:px-[50px] lg:px-[60px] xl:px-[50px] 2xl:px-[70px]">
            <form
              onSubmit={handleEmailLogin}
              className="space-y-8 w-full xl:space-y-8 mt-[3rem]"
            >
              <div className="mb-[-30px] mt-[20px]">
                {submitted && error && (
                  <span className="text-[#FC1616] text-[14px]">{error}</span>
                )}
              </div>

              <div
                className={`relative text-[#000000] h-[50px] ${
                  submitted && fieldError.username ? "border-red-500" : ""
                }`}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    handleFieldChange(setusername, e.target.value, "username")
                  }
                  onFocus={() => setEmailPlaceholderVisible(false)}
                  onBlur={() => setEmailPlaceholderVisible(username === "")}
                  className="w-full border-b border-[#000000] focus:outline-none text placeholder-custom text-[16px] md:text-[14px] py-6 xl:text-[14px] text-[#000000]"
                  placeholder={emailPlaceholderVisible ? "Username" : ""}
                />
              </div>

              <div className="relative py-[1rem] h-[60px]">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordPlaceholderVisible(false)}
                  onBlur={() => setPasswordPlaceholderVisible(password === "")}
                  className="w-full border-b border-[#000000] focus:outline-none pb-3 placeholder-custom text-[16px] md:text-[14px] xl:text-[14px] py-6 text bg-[#FCFCFC]"
                  placeholder={passwordPlaceholderVisible ? "Password" : ""}
                />
                <span
                  className="absolute right-2 top-[2rem] transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <Image
                    className="md:w-[8] pt-4"
                    src={passwordVisible ? "/visible.svg" : "/visible.svg"}
                    width={18}
                    height={18}
                    alt={passwordVisible ? "Hide" : "Show"}
                  />
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 ">
                <input
                  type="checkbox"
                  className="2xl:h-[25px] 2xl:w-[15px] xl:h-[25px] xl:w-[25px] lg:h-[20px] lg:w-[20px] mt-[2rem] md:h-[20px] md:w-[20px] text-[#4285F4] border-gray-300 rounded "
                  checked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                />
                <label className="block text-[#343433] text-[16px] lg:w-[30rem] w-[35rem] md:w-[25rem] mt-[2rem]">
                  Remember your password?
                </label>
                <div
                  className="flex truncate text-[16px] pr-[4rem] mt-[2rem] cursor-pointer"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </div>
              </div>
              {/* 1st modal open */}
              {isModalOpen && (
                <div className="h-full">
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div
                      ref={modalRef}
                      className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg"
                    >
                      <div className="flex items-end justify-center">
                        <Image src="./logo.svg" width={92} height={61} alt="" />
                      </div>
                      <div className="flex items-center justify-center flex-col pt-[1rem]">
                        <h2 className="text-[30px] font-medium">
                          Forgot Password?
                        </h2>
                        <p className="text-[12px]">
                          No worries, we’ll send you reset instruction.
                        </p>
                      </div>
                      <div className="px-[2rem] mt-[2rem]">
                        <h1 className="text-[15px]">Email</h1>
                        <input
                          type="email"
                          className="border py-2 mt-2 w-full border-[#C8C8C8] rounded-[5px] outline-none placeholder:text-gray-500 px-[1rem]"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="w-full mt-4 px-[2rem]">
                        <button
                          className="bg-[#24968B] w-full text-white  py-2 rounded-[5px]"
                          onClick={handleOTPSubmit}
                        >
                          Reset Password
                        </button>
                      </div>
                      <div className="flex items-center justify-center mt-[2rem]">
                        <Image
                          src="/arrow.svg"
                          width={20}
                          height={20}
                          alt="Back Icon"
                        />
                        <Link href="/login">
                          <p
                            className="ml-2 text-[#777777] cursor-pointer"
                            onClick={closeModal}
                          >
                            Back to log in
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* 2nd modal open */}
              {isOTPModalOpen && (
                <div className="h-full">
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div
                      ref={modalRef}
                      className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg"
                    >
                      <div className="flex items-end justify-center">
                        <Image src="./logo.svg" width={92} height={61} alt="" />
                      </div>
                      <div className="flex items-center justify-center flex-col pt-[1rem]">
                        <h2 className="text-[30px] font-medium">
                          Password reset
                        </h2>
                        <p className="text-[12px] ">
                          We’ll send you reset instructions, check your email!
                        </p>
                      </div>
                      <div className="px-[2rem] mt-[2rem] flex justify-center gap-9">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) =>
                              handleOTPChange(index, e.target.value)
                            }
                            className="border text-center text-[32px] py-2 w-[80px] h-[80px] rounded-[5px] outline-none"
                          />
                        ))}
                      </div>
                      <div className="w-full mt-4 px-[2rem]">
                        <button
                          className="bg-[#24968B] w-full text-white py-2 rounded-[5px]"
                          onClick={() => setIsPasswordModalOpen(true)}
                        >
                          Continue
                        </button>
                        <p className="text-[#A4A4A4] flex items-center justify-center pt-2">
                          Didn’t receive the email?{" "}
                          <Link href={"./"}>
                            {" "}
                            <span className="text-[#398EE2]">
                              Click to resend{" "}
                            </span>
                          </Link>
                        </p>
                        <div className="flex items-center justify-center mt-[2rem]">
                          <Image
                            src="/arrow.svg"
                            width={20}
                            height={20}
                            alt="Back Icon"
                          />
                          <Link href="/login">
                            <p
                              className="ml-2 text-[#777777] cursor-pointer"
                              onClick={closeModal}
                            >
                              Back to log in
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* 3rd Modal open */}
              {isPasswordModalOpen && (
                <div className="h-full">
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div
                      ref={modalRef}
                      className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg"
                    >
                      <div className="flex items-end justify-center">
                        <Image src="./logo.svg" width={92} height={61} alt="" />
                      </div>
                      <div className="flex items-center justify-center flex-col pt-[1rem]">
                        <h2 className="text-[30px] font-medium">
                          Reset your password
                        </h2>
                        <p>We’ll send you reset instructions.</p>
                      </div>
                      <div className="px-[2rem] mt-[1rem]">
                        <h1 className="text-[15px]">New Password</h1>
                        <input
                          type="password"
                          className="border py-1 mt-2 w-full b-[#C8C8C8] rounded-[5px] outline-none placeholder:px-[1rem]"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <h1 className="text-[15px] mt-4">Confirm Password</h1>
                        <input
                          type="password"
                          className="border py-1 mt-2 w-full b-[#C8C8C8] rounded-[5px] outline-none placeholder:px-[1rem]"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
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
                            src="/arrow.svg"
                            width={20}
                            height={20}
                            alt="Back Icon"
                          />
                          <Link href="/login">
                            <p
                              className="ml-2 text-[#777777] cursor-pointer"
                              onClick={closeModal}
                            >
                              Back to log in
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* all done modal */}
              {isAllDoneModalOpen && (
                <div className="h-full">
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div
                      ref={modalRef}
                      className="bg-white w-[533px] h-[471px] p-4 rounded-[10px] shadow-lg"
                    >
                      <div className="flex items-end justify-center">
                        <Image src="./logo.svg" width={92} height={61} alt="" />
                      </div>
                      <div className="flex items-center justify-center flex-col pt-[2rem] gap-4">
                        <h2 className="text-[30px] font-medium">All Done!</h2>
                        <p>Your password has been successfully reset.</p>
                      </div>
                      <p className="flex items-center justify-center pt-[1rem]">
                        Continue as Niknik123?
                      </p>
                      <div className="w-full mt-4 px-[2rem]">
                        <button
                          className="bg-[#24968B] w-full text-white py-2 rounded-[5px]"
                          onClick={closeModal}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full ">
                <button
                  type="submit"
                  className="w-full h-[46px] mt-[2rem] text-[16px] bg-[#24968B] text-white rounded-[25px] font-semibold md:truncate 2xl:truncate"
                >
                  <span className="text-[20px] flex items-center justify-center">
                    Log in
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
