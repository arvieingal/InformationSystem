"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SweetAlert from "./SweetAlert";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === "/main") {
      setClickedImage("home");
    } else if (pathname === "/main/profiling") {
      setClickedImage("people");
    } else if (pathname === "/main/profiling/add-resident") {
      setClickedImage("people2");
    } else if (pathname === "/main/profiling/settings") {
      setClickedImage("settings");
    }
    
  }, [pathname]);

  const handleImageClick = (imageName: string, route: string) => {
    setClickedImage(imageName);
    router.push(route);
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
  return (
    <div className="flex flex-col py-[2rem] h-full">
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
            src={
              clickedImage === "home" ? "/svg/active_home.svg" : "/svg/home.svg"
            }
            width={50}
            height={50}
            alt="Home"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() => handleImageClick("home", "/main")}
          />

          <Image
            src={
              clickedImage === "people"
                ? "/svg/active_people.svg"
                : "/svg/people.svg"
            }
            width={50}
            height={50}
            alt="People"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() => handleImageClick("people", "/main/profiling")}
          />

          <Image
            src={
              clickedImage === "people2"
                ? "/svg/active_people2.svg"
                : "/svg/people2.svg"
            }
            width={50}
            height={50}
            alt="People2"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() =>
              handleImageClick("people2", "/main/profiling/add-resident")
            }
          />

          <Image
            src={
              clickedImage === "settings"
                ? "/svg/active_settings.svg"
                : "/svg/settings.svg"
            }
            width={50}
            height={50}
            alt="Settings"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() =>
              handleImageClick("settings", "/main/profiling/settings")
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/svg/logout.svg"
            width={50}
            height={50}
            alt="Logout"
            className={`w-[30px] h-[30px] cursor-pointer ${
              clickedImage === "logout" ? "filter-green" : ""
            }`}
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
