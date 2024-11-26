"use client";
import React, { useState, useEffect } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import { dummyHouseholds } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type Household = {
  household_number: number;
  family_name: string;
  given_name: string;
  middle_name: string;
  sitio_purok: string;
  is_business_owner: string;
};

const Households = () => {
  const router = useRouter()

  const [households, setHouseholds] = useState<Household[]>([]);
  console.log(households)

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await api.get('/api/household-head');
        setHouseholds(response.data);
      } catch (error) {
        console.error("Error fetching households:", error);
      }
    };

    fetchHouseholds();
  }, []);

  const onSearch = () => { };
  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <div className="h-[66%] px-32 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white z-10 shadow-gray-300 shadow-sm">
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
              {households.map((household) => (
                <tr key={household.household_number} className="border-b hover:bg-gray-50" onClick={() => router.push(`/main/profiling/households/${household.household_number}`)}>
                  <td className="py-2 text-center">{household.household_number}</td>
                  <td className="py-2 cursor-pointer">
                    {household.given_name} {household.middle_name} {household.family_name}
                  </td>
                  <td className="py-2">{household.sitio_purok}</td>
                  <td className="py-2 text-center">
                    <p
                      className={`${household.is_business_owner === "Yes"
                        ? "bg-[#007F73] text-white"
                        : "bg-[#A4A4A4]"
                        } rounded-[4px] py-1 w-20 inline-block`}
                    >
                      {household.is_business_owner}
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
