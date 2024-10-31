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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
        setError('Invalid username or password.');
      } else {
        router.push('/landing');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
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
    <div className="w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="hidden md:flex items-center justify-center w-[80%] md:w-[94%] 2xl:w-[150%]">
          <Image
            className="h-screen w-full object-cover rounded-l-[5px]"
            src="/img/register.png"
            width={1000}
            height={800}
            alt="Login Image"
          />
        </div>

        <div className="w-[35%] flex flex-col items-center justify-center mb-[8%]">
          <div className="flex items-center justify-center">
            <Image src="/svg/logo.svg" width={92} height={91} alt="Logo" />
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

              <div
                className={`relative text-[#000000] h-[50px] ${submitted && fieldError.username ? "border-red-500" : ""
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
                    src={passwordVisible ? "/svg/visible.svg" : "/svg/visible.svg"}
                    width={18}
                    height={18}
                    alt={passwordVisible ? "Hide" : "Show"}
                  />
                </span>
              </div>

              <div className="mb-[-30px] mt-[20px]">
                {submitted && error && (
                  <span className="text-[#FC1616] text-[14px]">{error}</span>
                )}
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
      <OtpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Login;
