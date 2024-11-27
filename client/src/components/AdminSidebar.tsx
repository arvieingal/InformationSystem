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
          {[
            { name: "home", route: "/main", activeIcon: "/svg/active_home.svg", defaultIcon: "/svg/home.svg" },
            { name: "people", route: "/main/profiling", activeIcon: "/svg/active_people.svg", defaultIcon: "/svg/people.svg" },
            { name: "people2", route: "/main/profiling/add-resident", activeIcon: "/svg/active_people2.svg", defaultIcon: "/svg/people2.svg" },
            { name: "settings", route: "/main/profiling/settings", activeIcon: "/svg/active_settings.svg", defaultIcon: "/svg/settings.svg" },
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
                className={`w-[30px] h-[30px] absolute group-hover:hidden ${
                  clickedImage === name ? "filter-green" : ""
                }`}
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
          <div className="group w-[30px] h-[30px] cursor-pointer" onClick={handleSignOut}>
            <Image
              src="/svg/logout.svg"
              width={30}
              height={30}
              alt="Logout"
              className="absolute group-hover:hidden w-[30px] h-[30px]"
            />
            <Image
              src="/svg/active_logout.svg"
              width={30}
              height={30}
              alt="Logout-hover"
              className="hidden group-hover:block w-[30px] h-[30px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
