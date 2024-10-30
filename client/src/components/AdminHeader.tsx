"use client";
import React, { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";
import SweetAlert from "./SweetAlert";

const MySwal = withReactContent(Swal);

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
    <div className="w-full relative px-4 py-8">
      <Image
        src="/svg/header.svg"
        width={500}
        height={200}
        alt="Picture of the author"
        className="w-full"
      />
      <div className="absolute inset-0 flex items-center justify-between px-[4rem]">
        <p className="text-inter font-semibold text-[35px] text-black">
          Our Community
        </p>
        <div>
          <Image
            src="/svg/profile.svg"
            width={50}
            height={20}
            alt="Profile picture"
            className="cursor-pointer"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="absolute top-[10rem] right-0 bg-white rounded-lg shadow-lg p-4 px-4">
              <p className="font-semibold flex items-center justify-center">
                Hi, Niknik!
              </p>
              <p className="text-sm flex items-center justify-center">
                niknik123@gmail.com
              </p>
              <div className="flex space-x-4 mt-4">
                <button className="bg-yellow-300 px-4 py-2 rounded-lg">
                  Manage Account
                </button>
                <button
                  className="bg-green-400 px-4 py-2 rounded-lg"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
