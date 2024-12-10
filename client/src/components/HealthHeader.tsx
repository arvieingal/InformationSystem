"use client";
import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import SweetAlert from "./SweetAlert";
import { signOut, useSession } from "next-auth/react";

const HealthHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const isAdmin = session?.user?.role === "Admin";

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  const handleSignOut = async () => {
    const confirmed = await SweetAlert.showConfirm(
      "Are you sure you want to sign out?"
    );
    if (confirmed) {
      await signOut();
      router.push("/");
    }
  };

  const getHeaderText = () => {
    const path = pathname || "";
    if (path.includes("nutritional_status")) {
      return "Nutritional Status";
    } else if (path.includes("immunization_record")) {
      return "Immunization Record";
    } else if (path.includes("nutritional_status_history")) {
      return "Nutritional Status History";
    } else if (path.includes("immunization_record_history")) {
      return "Immunization Record History";
    }
    return "Health Dashboard";
  };

  function handleChangePassword(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="h-full w-full pt-4">
      <div className="flex items-center justify-between px-6 md:px-[3rem] background-image rounded-xl md:rounded-3xl mx-4 md:mx-4 h-full">
        <div>
          <p className="text-inter font-semibold text-[14px] md:text-[30px] text-black">
            {getHeaderText()}
          </p>
        </div>
        <div className="relative">
          <button
            className="text-[12px] md:text-[16px] cursor-pointer flex items-center justify-center py-1 px-3 rounded-md bg-[#007F73] text-white hover:bg-[#005f5a] transition duration-300"
            onClick={toggleDropdown}
          >
            <p>{session?.user?.username}</p>
            <Image
              src="/svg/down-arrow.svg"
              width={20}
              height={20}
              alt="down-arrow"
              className="w-3 ml-2 text-white"
            />
          </button>
          {showDropdown && (
            <div className="bg-white z-50 absolute top-full mt-2 right-[-2rem] rounded-lg shadow-lg p-4 w-48">
              <p className="font-semibold text-center">
                Hi, {session?.user?.username}!
              </p>
              <p className="text-sm text-center">{session?.user?.email}</p>
              <div className="flex flex-col gap-2 mt-4 text-white text-[9px]">
                {isAdmin ? (
                  <button
                    className="bg-[#007F73] px-4 py-2 rounded-xl hover:bg-[#005f5a] transition duration-300 text-[12px]"
                    onClick={() => router.push("/main/settings")}
                  >
                    Manage Account
                  </button>
                ) : (
                  <button
                    className="bg-[#007F73] px-4 py-2 rounded-xl hover:bg-[#005f5a] transition duration-300 text-[12px]"
                    onClick={togglePasswordModal}
                  >
                    Change Password
                  </button>
                )}
                <button
                  className="bg-[#007F73] px-4 py-2 rounded-xl flex items-center justify-center text-[12px] hover:bg-[#005f5a] transition duration-300"
                  onClick={handleSignOut}
                >
                  <Image
                    alt="signout"
                    src="/svg/signout-icon.svg"
                    width={16}
                    height={16}
                    className="w-3 mr-2"
                  />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content relative bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-lg">
            <span
              className="close absolute -top-7 -right-3 cursor-pointer text-gray-700 text-[3rem]"
              onClick={togglePasswordModal}
            >
              &times;
            </span>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="mt-1 block w-full  p-[10px] border border-gray-300 rounded-md shadow-sm focus:ring-green-500 outline-none focus:border-green-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="mt-1 block w-full border p-[10px] border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 block w-full border  p-[10px] border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm outline-none"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#007F73] text-white px-4 py-2 rounded-xl hover:bg-[#005f5a] transition duration-300"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthHeader;
