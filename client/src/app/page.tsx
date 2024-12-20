"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import OtpModal from "@/components/OtpModal";

const Login = () => {
  const router = useRouter();

  const [username, setusername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [emailPlaceholderVisible, setEmailPlaceholderVisible] =
    useState<boolean>(true);
  const [passwordPlaceholderVisible, setPasswordPlaceholderVisible] =
    useState<boolean>(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [fieldError, setFieldError] = useState<{
    username: boolean;
    password: boolean;
  }>({ username: false, password: false });

  useEffect(() => {
    setIsCheckboxChecked(!!localStorage.getItem("rememberedPassword"));
  }, []);

  useEffect(() => {
    setPassword(localStorage.getItem("rememberedPassword") || "");
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFieldError({ username: !username, password: !password });

    if (!username || !password) {
      setError("Please fill out all fields.");
      return;
    }
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password.");
      } else {
        router.push("/main");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsEmailModalOpen(true);
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

  const handleCheckboxChange = (checked: boolean) => {
    setIsCheckboxChecked(checked);
    if (checked) {
      // Save password to local storage
      localStorage.setItem("rememberedPassword", password);
    } else {
      // Remove password from local storage
      localStorage.removeItem("rememberedPassword");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex 2xl:flex 2xl:flex-row  flex-row justify-center sm:flex sm:flex-col sm:px-20  lg:px-0 2xl:px-0 lg:flex lg:flex-row sm:items-center sm:justify-center ">
        <div className="hidden  items-center justify-center w-[70%] md:hidden lg:block ">
          <Image
            className="h-screen w-full object-cover rounded-l-[5px]"
            src="/svg/login2.svg"
            width={1000}
            height={800}
            alt="Login Image"
          />
        </div>

        <div className="w-[30%] flex flex-col items-center px-0  ">
          <div className="mt-[-5rem]">
            <Image
              className="mt-[2rem]"
              src="/svg/logo.svg"
              width={92}
              height={91}
              alt="Logo"
            />
          </div>

          <div className="flex items-center justify-center flex-col mb-[2rem]">
            <p className="font-semibold text-[34px] 2xl:text-[40px]">
              Welcome!
            </p>
            <p className="text-[13px] 2xl:text-[16px]">
              Please enter your details
            </p>
          </div>

          <div className="flex items-center justify-center w-full sm:px-[0px] md:px-[0px] lg:px-[60px] xl:px-[50px] 2xl:px-[70px]">
            <form
              onSubmit={handleEmailLogin}
              className=" w-full space-y-4 mt-[3rem]"
            >
              <div
                className={`relative text-[#000000] h-[50px]  ${
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
                  className="w-full border-b border-[#000000] focus:outline-none text placeholder:text-[#696969]  2xl:text-[16px] text-[16px] md:text-[14px] py-4 text-[#000000]"
                  placeholder={emailPlaceholderVisible ? "Username" : ""}
                />
              </div>

              <div className="relative mt-[1rem]">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordPlaceholderVisible(false)}
                  onBlur={() => setPasswordPlaceholderVisible(password === "")}
                  className="w-full border-b border-[#000000] focus:outline-none placeholder:text-[#696969] 2xl:text-[16px] text-[16px] md:text-[14px] py-4 bg-[#FCFCFC] mt-8"
                  placeholder={passwordPlaceholderVisible ? "Password" : ""}
                />
                <span
                  className="absolute right-2 top-[3.5rem] transform -translate-y-1/2"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <Image
                    className="md:w-[8] cursor-pointer"
                    src={
                      passwordVisible ? "/svg/visible.svg" : "/svg/hidden.svg"
                    }
                    width={18}
                    height={18}
                    alt={passwordVisible ? "Hide" : "Show"}
                  />
                </span>
              </div>

              {submitted && error && (
                <div className="text-[#FC1616] text-[12px]">{error}</div>
              )}

              <div className="w-full flex items-center justify-between text-[12px] pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="text-[#4285F4] rounded"
                    checked={isCheckboxChecked}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                  />
                  <label className="ml-2 2xl:text-[14px] text-[12px]">
                    Remember my password
                  </label>
                </div>
                <div
                  className="cursor-pointer text-[#6C6C6C] 2xl:text-[14px] text-[12px]"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </div>
              </div>

              <div className="w-full pt-[6rem] flex justify-center">
                <button
                  type="submit"
                  className={`w-[96%] h-[45px] rounded-[5px] text-white ${
                    username && password ? "bg-[#24968B]" : "bg-gray-400"
                  }`}
                  disabled={!username || !password}
                >
                  <span className="text-[18px] flex items-center justify-center">
                    LOG IN
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <OtpModal
        isEmailModalOpen={isEmailModalOpen}
        setIsEmailModalOpen={setIsEmailModalOpen}
      />
    </div>
  );
};

export default Login;
