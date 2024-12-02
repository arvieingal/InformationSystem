'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import SweetAlert from './SweetAlert';
import { signOut } from 'next-auth/react';

const HealthSidebar = () => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === "/main") {
      setClickedImage("home");
    } else if (pathname === "/main/health") {
      setClickedImage("health_dashboard");
    } else if (pathname === "/main/health/nutritional_status") {
      setClickedImage("nutrition");
    } else if (pathname === "/main/health/immunization_record") {
      setClickedImage("immunization_record");
    } else if (pathname === "/main/health/settings") {
      setClickedImage("settings");
    }
  }, [pathname]);

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
          {[
            { name: "home", route: "/main", activeIcon: "/svg/active_home.svg", defaultIcon: "/svg/home.svg" },
            { name: "health_dashboard", route: "/main/health", activeIcon: "/svg/active_dashboard.svg", defaultIcon: "/svg/health_dashboard.svg" },
            { name: "nutritional_status", route: "/main/health/nutritional_status", activeIcon: "/svg/active_nutritional_status.svg", defaultIcon: "/svg/nutritional_status.svg" },
            { name: "immunization_record", route: "/main/health/immunization_record", activeIcon: "/svg/active_immunization_record.svg", defaultIcon: "/svg/immunization_record.svg" },
            { name: "child_history", route: "/main/health/child_history", activeIcon: "/svg/active_child_history.svg", defaultIcon: "/svg/child_history.svg" },
          ].map(({ name, route, activeIcon, defaultIcon }) => (
            <div
              key={name}
              className="group w-[30px] h-[30px] cursor-pointer"
              onClick={() => handleImageClick(name, route)}
            >
              <Image
                src={clickedImage === name ? activeIcon : defaultIcon}
                width={30}
                height={30}
                alt={name}
                className={`w-[30px] h-[30px] absolute group-hover:hidden ${clickedImage === name ? "filter-green" : ""}`}
              />
              <Image
                src={activeIcon}
                width={30}
                height={30}
                alt={`${name}-hover`}
                className="hidden group-hover:block w-[30px] h-[30px]"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
        </div>
      </div>
    </div>
  );
};

export default HealthSidebar;
