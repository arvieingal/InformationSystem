"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import SweetAlert from "./SweetAlert";

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
      console.log("User signed out");
      await SweetAlert.showSuccess("You have successfully signed out.");
      router.push("/login");
    }
  };
  return (
    <div className="w-[10%] flex h-screen flex-col">
      <Image
        src="/logo.svg"
        width={500}
        height={500}
        alt="Logo"
        className="w-full"
      />
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-[30px] items-center justify-center h-full">
          <Image
            src="/people.svg"
            width={50}
            height={50}
            alt="People"
            className={clickedImage === "people" ? "filter-green" : ""}
            onClick={() => handleImageClick("people", "/dashboard")} // Redirect to /people page
          />

          <Image
            src="/people2.svg"
            width={50}
            height={50}
            alt="People2"
            className={clickedImage === "people2" ? "filter-green" : ""}
            onClick={() => handleImageClick("people2", "/AddResidents")}
          />

          <Image
            src="/location.svg"
            width={50}
            height={50}
            alt="Location"
            className={clickedImage === "location" ? "filter-green" : ""}
            onClick={() => handleImageClick("location", "/location")} 
          />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/logout.svg"
            width={50}
            height={50}
            alt="Logout"
            className={clickedImage === "logout" ? "filter-green" : ""}
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
