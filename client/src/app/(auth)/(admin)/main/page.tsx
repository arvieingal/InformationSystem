"use client";
import AdminHeader from "@/components/AdminHeader";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logNavigation } from '@/utils/logNavigation';

export default function page() {
  const router = useRouter();

  const handleResidentClick = () => {
    logNavigation('Navigated to Resident Profiling');
    router.push("/main/profiling");
  };

  const handleHealthClick = () => {
    logNavigation('Navigated to Health');
    router.push("/main/health");
  };

  return (
    <div className="bg-[#E7EEF4] w-full h-screen">
      <div className="w-full h-[10vh]">
        <AdminHeader />
      </div>

      <div className="w-full mt-20 mb-20">
        <p className="text-[#06C46C] text-[24px] md:text-[32px] font-semibold text-center">
        Luz Profiling and Health Information System
        </p>
      </div>
      <div className="flex items-center justify-center w-full gap-14 pb-16 mt-16 flex-col md:flex-row">
        <div>
          <button
            className="w-[300px] h-[200px] md:w-[470px] md:h-[280px] bg-white rounded-lg flex items-center justify-center shadow-md shadow-gray-500 cursor-pointer"
            onClick={handleResidentClick}
          >
            <Image
              src="/svg/resident.svg"
              alt="resident"
              width={534}
              height={304}
              priority
            />
          </button>
          <p className="md:text-[20px] text-[14px] text-center mt-12 font-semibold">
            Resident Profiling with Analytics
          </p>
        </div>
        <div>
          <button
            className="md:w-[470px] md:h-[280px] w-[300px] h-[200px] bg-white rounded-lg flex items-center justify-center shadow-md shadow-gray-500 cursor-pointer"
            onClick={handleHealthClick}
          >
            <Image
              src="/svg/pre_school.svg"
              alt="resident"
              width={534}
              height={304}
              priority
            />
          </button>
          <p className="md:text-[20px] text-[14px] text-center mt-12 font-semibold">
            Nutritional Status and Immunization Records
          </p>
        </div>
      </div>
    </div>
  );
}
