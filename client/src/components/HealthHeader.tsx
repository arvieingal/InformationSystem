
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SweetAlert from "./SweetAlert";
import { signOut, useSession } from "next-auth/react";


const HealthHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });
  console.log("session", session);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    const confirmed = await SweetAlert.showConfirm("Are you sure you want to sign out?");
    if (confirmed) {
      await signOut();
      router.push("/");
    }
  };

  return (
    <div className="h-full w-full pt-4">
      <div className="flex items-center justify-between px-6 md:px-[3rem] background-image rounded-xl md:rounded-3xl mx-4 md:mx-4 h-full">
        <div>
          <p className="text-inter font-semibold text-[14px] md:text-[30px] text-black">
            Community Health
          </p>
        </div>
        <div>
          <div className="text-[12px] md:text-[16px] cursor-pointer flex items-center justify-center py-1 px-3 rounded-md bg-[#007F73] text-white" onClick={toggleDropdown}>
            <p>{session?.user?.username}</p>
            <Image src="/svg/down-arrow.svg" width={20} height={20} alt="down-arrow" className="w-3 ml-2 text-white" />
          </div>
          {showDropdown && (
            <div className="bg-white z-50 absolute top-[75px] right-0 rounded-lg shadow-lg p-4 px-4">
              <p className="font-semibold flex items-center justify-center">
                Hi, {session?.user?.username}!
              </p>
              <p className="text-sm flex items-center justify-center">
                {session?.user?.email}
              </p>
              <div className="flex gap-[1px] mt-4 text-white text-[9px]">
                <button className="bg-[#007F73] px-4 py-2 rounded-l-xl">
                  Manage Account
                </button>
                <button
                  className="bg-[#007F73] px-4 py-2 rounded-r-xl flex items-center"
                  onClick={handleSignOut}
                >
                  <Image alt="signout" src="/svg/signout-icon.svg" width={100} height={100} className="w-3 mr-2" />
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

export default HealthHeader;
