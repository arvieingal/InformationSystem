"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import Link  from 'next/link';

const Register = () => {
const [emailOrMobile, setEmailOrMobile] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [confirmPassword, setconfirmPassword] = useState<string>("");
const [error, setError] = useState<string | null>(null);
const [submitted, setSubmitted] = useState<boolean>(false);
const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
const [emailPlaceholderVisible, setEmailPlaceholderVisible] = useState<boolean>(true);
const [passwordPlaceholderVisible, setPasswordPlaceholderVisible] = useState<boolean>(true);
const [confirmPasswordPlaceholderVisible, setconfirmPasswordPlaceholderVisible] = useState<boolean>(true);
const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
const [checkboxError, setCheckboxError] = useState(false);

const [fieldError, setFieldError] = useState<{
    emailOrMobile: boolean;
    password: boolean;
  }>({ emailOrMobile: false, password: false });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFieldError({ emailOrMobile: !emailOrMobile, password: !password });

    if (!emailOrMobile || !password) {
      setError("Please fill out all fields.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);
    const isMobile = /^[0-9]{10,15}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      setError("Invalid email or mobile number format.");
      return;
    }
  };
  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/auth/google`;
    } catch (error) {
      console.error("Error initiating Google authentication:", error);
      alert("An error occurred while initiating Google authentication");
    }
  };

  const handleFieldChange = (
    setFieldValue: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    fieldType: "emailOrMobile" | "password"
  ) => {
    setFieldValue(value);
    setFieldError((prevErrors) => ({
      ...prevErrors,
      [fieldType]: false,
    }));

    if (fieldType === "emailOrMobile") {
      setError(null);

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isMobile = /^[0-9]{10,15}$/.test(value);

      if (!isEmail && !isMobile) {
        setError("Invalid email or mobile number format.");
      }
    }
  };
  return (
    <div className="w-full h-screen flex overflow-auto scrollbar-hidden items-center justify-center bg-[#FCFCFC] ">
    <div className="w-full flex flex-row sm:flex-col items-center justify-center h-screen  border-[#CCCCCC]  ">
      <div className="w-[80%]  md:w-[94%] 2xl:w-[250%]">
        <Image
          className="h-screen w-full  object-cover rounded-l-[5px]"
          src="/img/register.png"
          width={1000}
          height={800}
          alt="Login Image"
        />
      </div>
      <div className=" w-[35%] mb-[2%] ">
         <div className='flex items-center justify-center '>
         <Image
         src="/svg/logo.svg"
         width={92}
         height={91}
         alt="Logo"
    />
         </div>
         <div className='flex items-center justify-center flex-col'>
           <p className='font-semibold text-[40px]'>Welcome!</p>
           <p>Please enter your details</p>
         </div>
          <div className="justify-center items-center flex flex-col w-full  sm:px-[0px] md:px-[50px]  lg:px-[60px] xl:px-[50px] 2xl:px-[70px] ">
            <form onSubmit={handleEmailLogin} className="space-y-8 w-full xl:space-y-8 mt-[3rem]">
              <div className="mb-[-30px] mt-[20px]">
              {submitted && error && (
                <span className="text-[#FC1616] text-[14px] ">
                  {error}
                </span>
              )}
              </div>
             
              <div
                className={`relative text-[#000000] h-[50px] ${
                  submitted && fieldError.emailOrMobile ? "border-red-500 " : ""
                }`}
              >
                <input
                  type="email"
                  value={emailOrMobile}
                  onChange={(e) =>
                    handleFieldChange(
                      setEmailOrMobile,
                      e.target.value,
                      "emailOrMobile"
                    )
                  }
                  onFocus={() => setEmailPlaceholderVisible(false)}
                  onBlur={() =>
                    setEmailPlaceholderVisible(emailOrMobile === "")
                  }
                  className="w-full border-b border-[#000000] focus:outline-none text placeholder-custom text-[16px] md:text-[14px] py-6 xl:text-[14px]  text-[#000000]"
                  placeholder={emailPlaceholderVisible ? "Email " : ""}
                /> 
              </div>
              <div className="relative py-[1rem] h-[60px] ">
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
                  className="absolute right-2 top-[2rem] transform -translate-y-1/2 cursor-pointer  "
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <Image
                    className="md:w-[8] pt-4 "
                    src={passwordVisible ? "/svg/visible.svg" : "/svg/visible.svg"}
                    width={18}
                    height={18}
                    alt={passwordVisible ? "Hide" : "Show"}
                  />
                </span>
                </div>
                <div className="relative py-[1rem] ">
                <input
                  value={confirmPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setconfirmPasswordPlaceholderVisible(false)}
                  onBlur={() => setconfirmPasswordPlaceholderVisible(confirmPassword === "")}
                  className="w-full border-b border-[#000000] focus:outline-none pb-3 placeholder-custom text-[16px] md:text-[14px] xl:text-[14px] py-6 text bg-[#FCFCFC]"
                  placeholder={confirmPasswordPlaceholderVisible ? "Confirm Password" : ""}
                />
                <span
                  className="absolute right-2 top-[2rem] transform -translate-y-1/2 cursor-pointer  "
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <Image
                    className="md:w-[8] pt-4 "
                    src={passwordVisible ? "/svg/visible.svg" : "/svg/visible.svg"}
                    width={18}
                    height={18}
                    alt={passwordVisible ? "Hide" : "Show"}
                  />
                </span>

                <div className="flex items-center justify-center gap-4 mt-[1rem] ">
                <input
                  type="checkbox"
                  className="2xl:h-[20px] 2xl:w-[10px] xl:h-[25px] xl:w-[25px] lg:h-[20px] lg:w-[20px] md:h-[20px] md:w-[20px] text-[#4285F4] border-gray-300 rounded mt-[1rem]"
                  checked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                />
                <label className="block  text-[#343433] text-[12px] lg:w-[30rem] w-[35rem] pt-4  md:w-[25rem] ">
                  Remember your password?
                </label>
              </div>
              {checkboxError && (
                <p className="text-red-500 text-[12px] mt-4">
                  You must agree to the terms and conditions.
                </p>
              )}
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full  h-[46px] text-[16px] bg-[#24968B] text-white rounded-[25px] font-semibold md:truncate 2xl:truncate"
                >
                  <span className="text-[20px] flex items-center justify-center ">
                    Sign up
                  </span>
                </button>
            <div className='flex items-center justify-center mt-[1rem]'>
            <p className='text-[12px]'>Have an account?  <Link href="/login">
                <span className='text-[#13A1F0] cursor-pointer'>Log in</span>
              </Link></p>
            </div>
              </div>
              </form>
          </div>
          <div className='flex items-center justify-center'>
          <p className='text-[12px] text-center px-[7rem] pt-[4rem]'>
              By signing up to create an account, I accept the 
              <Link href="/terms">
                <span className='text-[#13A1F0] cursor-pointer'> Terms and Privacy Policy</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register
