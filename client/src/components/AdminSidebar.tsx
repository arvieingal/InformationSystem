"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import SweetAlert from "./SweetAlert";
import { signOut } from "next-auth/react";

const AdminSidebar = () => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const router = useRouter(); 

  const handleImageClick = (imageName: string, route: string) => {
    setClickedImage(imageName);
    router.push(route); 
  };
  const handleSignOut = async () => {
    const confirmed = await SweetAlert.showConfirm("Are you sure you want to sign out?");
    if (confirmed) {
      await signOut();
      router.push("/");
    }
  };
  return (
    <div className="w-[6%] flex h-screen flex-col py-[2rem]">
      <div className="w-full flex items-center justify-center">
        <Image
          src="/svg/logo.svg"
          width={100}
          height={100}
          alt="Logo"
          className="w-[80px] h-[80px]"
      />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-[30px] items-center justify-center h-full">
        <Image
            src="/svg/home.svg"
            width={50}
            height={50}
            alt="Location"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "location" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("location", "/landing")} 
          />

          <Image
            src="/svg/people.svg"
            width={50}
            height={50}
            alt="People"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "people" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("people", "/dashboard")}
          />

          <Image
            src="/svg/people2.svg"
            width={50}
            height={50}
            alt="People2"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "people2" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("people2", "/add-resident")}
          />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/svg/logout.svg"
            width={50}
            height={50}
            alt="Logout"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "logout" ? "filter-green" : ""}`}
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
