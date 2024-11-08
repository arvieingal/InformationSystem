"use client";
import React, { useState } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import Image from "next/image";

const Renters = () => {
  const dummyRenters = [
    {
      id: 1,
      householdOwner: "John Doe",
      renterName: "John Doe",
      civilStatus: "Married", // Added field
      sex: "Male", // Added field
      birthdate: "1985-05-15", // Added field
      monthsYearsOfStay: "5 years", // Added field
      work: "Engineer", // Added field
    },
    {
      id: 2,
      householdOwner: "Maria Santos",
      renterName: "John Doe",
      civilStatus: "Single", // Added field
      sex: "Female", // Added field
      birthdate: "1990-08-22", // Added field
      monthsYearsOfStay: "2 years", // Added field
      work: "Teacher", // Added field
    },
    {
      id: 3,
      householdOwner: "Pedro Garcia",
      renterName: "John Doe",
      civilStatus: "Married", // Added field
      sex: "Male", // Added field
      birthdate: "1980-12-01", // Added field
      monthsYearsOfStay: "10 years", // Added field
      work: "Businessman", // Added field
    },
    {
      id: 4,
      householdOwner: "Ana Reyes",
      renterName: "John Doe",
      civilStatus: "Widowed", // Added field
      sex: "Female", // Added field
      birthdate: "1975-03-30", // Added field
      monthsYearsOfStay: "3 years", // Added field
      work: "Nurse", // Added field
    },
    {
      id: 5,
      householdOwner: "Miguel Cruz",
      renterName: "John Doe",
      civilStatus: "Married", // Added field
      sex: "Male", // Added field
      birthdate: "1995-07-19", // Added field
      monthsYearsOfStay: "1 year", // Added field
      work: "Chef", // Added field
    },
  ];

  const onSearch = () => {};
  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <div className="h-[63%] px-16 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b">
                <th className="text-center py-5 px-3 font-semibold">ID</th>
                <th className="text-left py-5 font-semibold">
                  HOUSEHOLD OWNER
                </th>
                <th className="text-left py-5 font-semibold">RENTER NAME</th>
                <th className="text-left py-5 font-semibold">CIVIL STATUS</th>
                <th className="text-left py-5 font-semibold">SEX</th>
                <th className="text-left py-5 font-semibold">BIRTHDATE</th>
                <th className="text-left py-5 font-semibold">
                  MONTHS/YEARS OF STAY
                </th>
                <th className="text-left py-5 font-semibold">WORK</th>
              </tr>
            </thead>
            <tbody>
              {dummyRenters.map((renter) => (
                <tr key={renter.id} className="border-b hover:bg-gray-50">
                  <td className="text-center py-2">{renter.id}</td>
                  <td className="text-left py-2">{renter.householdOwner}</td>
                  <td className="text-left py-2">{renter.renterName}</td>
                  <td className="text-left py-2">{renter.civilStatus}</td>
                  <td className="text-left py-2">{renter.sex}</td>
                  <td className="text-left py-2">{renter.birthdate}</td>
                  <td className="text-left py-2">{renter.monthsYearsOfStay}</td>
                  <td className="text-left py-2">{renter.work}</td>
                  <td className="text-right py-2 flex items-center">
                    <Image
                      src={"/svg/edit_pencil.svg"}
                      alt="Edit"
                      height={100}
                      width={100}
                      className="w-5 h-5 mr-2 cursor-pointer"
                    />
                    <Image
                      src={"/svg/archive.svg"}
                      alt="Archive"
                      height={100}
                      width={100}
                      className="w-6 h-6 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Renters;
