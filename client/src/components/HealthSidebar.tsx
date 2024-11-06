'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SweetAlert from './SweetAlert';
import { signOut } from 'next-auth/react';

const HealthSidebar = () => {
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
            src={clickedImage === "home" ? "/svg/active_home.svg" : "/svg/home.svg"}
            width={50}
            height={50}
            alt="Home"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "home" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("home", "/main/health")}
          />

          <Image
            src={clickedImage === "nutritional_status" ? "/svg/active_status.svg" : "/svg/health_nutritionalstatus.svg"}
            width={50}
            height={50}
            alt="Nutritional Status"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "nutritional_status" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("nutritional_status", "/main/health/nutritional_status")}
          />

          <Image
            src={clickedImage === "immunization_record" ? "/svg/active_immunization.svg" : "/svg/health_immunization.svg"}
            width={50}
            height={50}
            alt="Immunization Record"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "immunization_record" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("immunization_record", "/main/health/immunization_record")}
          />

          <Image
            src={clickedImage === "settings" ? "/svg/active_settings.svg" : "/svg/health_settings.svg"}
            width={50}
            height={50}
            alt="Settings"
            className={`w-[30px] h-[30px] cursor-pointer ${clickedImage === "settings" ? "filter-green" : ""}`}
            onClick={() => handleImageClick("settings", "/main/health/settings")}
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

export default HealthSidebar;