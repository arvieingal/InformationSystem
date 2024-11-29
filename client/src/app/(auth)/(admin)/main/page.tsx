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
          Barangay Resident Profiling and Health Records
        </p>
      </div>
      <div className="flex items-center justify-center w-full gap-14 pb-16 mt-16 flex-col md:flex-row">
        <div>
          <button
            className="w-[300px] h-[200px] md:w-[470px] md:h-[280px] bg-white rounded-lg flex items-center justify-center shadow-md shadow-gray-500 cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-100 hover:shadow-lg"
            onClick={handleResidentClick}
          >
            <Image
              src="/svg/profiling.svg"
              alt="resident"
              width={534}
              height={304}
              priority
            />
          </button>
          <p className="md:text-[20px] text-[14px] text-center mt-12 font-semibold ">
            Resident Profiling with Analytics
          </p>
        </div>
        <div>
          <button
            className="md:w-[470px] md:h-[280px] w-[300px] h-[200px] bg-white rounded-lg flex items-center justify-center shadow-md shadow-gray-500 cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-100 hover:shadow-lg"
            onClick={handleHealthClick}
          >
            <Image
              src="/svg/health2.svg"
              alt="resident"
              width={230}
              height={204}
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
