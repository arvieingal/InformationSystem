"use client";
import React, { useState, useEffect } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";

const Households = () => {
  const dummyHouseholds = [
    {
      id: 1,
      householdHead: "John Doe",
      purok: "Purok 1",
      isBusinessOwner: "Yes",
    },
    {
      id: 2,
      householdHead: "Maria Santos",
      purok: "Purok 3",
      isBusinessOwner: "No",
    },
    {
      id: 3,
      householdHead: "Pedro Garcia",
      purok: "Purok 2",
      isBusinessOwner: "Yes",
    },
    {
      id: 4,
      householdHead: "Ana Reyes",
      purok: "Purok 1",
      isBusinessOwner: "No",
    },
    {
      id: 5,
      householdHead: "Miguel Cruz",
      purok: "Purok 4",
      isBusinessOwner: "Yes",
    },
  ];

  const onSearch = () => {};
  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <div className="h-[63%] px-32 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b">
                <th className="text-center py-5 font-semibold">
                  Household Number
                </th>
                <th className="text-left py-5 font-semibold">Household Head</th>
                <th className="text-left py-5 font-semibold">Purok</th>
                <th className="text-center py-5 font-semibold">
                  BUSINESS OWNER
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyHouseholds.map((household) => (
                <tr key={household.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 text-center">{household.id}</td>
                  <td className="py-2">{household.householdHead}</td>
                  <td className="py-2">{household.purok}</td>
                  <td className="py-2 text-center">
                    <p
                      className={`${
                        household.isBusinessOwner === "Yes"
                          ? "bg-[#007F73] text-white"
                          : "bg-[#A4A4A4]"
                      } rounded-[4px] py-1 w-20 inline-block`}
                    >
                      {household.isBusinessOwner}
                    </p>
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

export default Households;
