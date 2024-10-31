"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SweetAlert from "./SweetAlert";
import { signOut, useSession } from "next-auth/react";


const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  console.log("session",session);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    const confirmed = await SweetAlert.showConfirm("Are you sure you want to sign out?");
    if (confirmed) {
      await signOut();
      await SweetAlert.showSuccess("You have successfully signed out.");
      router.push("/login");
    }
  };

  return (
    <div className="relative h-[90px] md:h-[120px] w-full">
      <div className="absolute inset-0 flex items-center justify-between px-6 md:px-[4rem] background-image rounded-xl md:rounded-3xl mx-4 md:mx-12 mt-8">
        <p className="md:ml-32 ml-0 text-inter font-semibold text-[14px] md:text-[30px] text-black">
          Our Community
        </p>
        <div>
          <p className="text-black font-semibold text-[12px] md:text-[20px] cursor-pointer mr-0 md:mr-12" onClick={toggleDropdown}>{session?.user?.firstname}</p>
          {showDropdown && (
            <div className="absolute top-[10rem] right-0 bg-white rounded-lg shadow-lg p-4 px-4">
              <p className="font-semibold flex items-center justify-center">
                Hi, {session?.user?.firstname}!
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
