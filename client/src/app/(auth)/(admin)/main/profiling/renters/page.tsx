"use client";
import React, { useEffect, useState } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import Image from "next/image";
import { dummyRenters } from "@/constants/tableDummyData";
import api from "@/lib/axios";

type RentOwner = {
  rent_number: number,
  rent_owner: string,
}

const Renters = () => {
  const [rentOwner, setRentOwner] = useState<RentOwner[]>([]);

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const response = await api.get("/api/rent-owner");
        setRentOwner(response.data);
      } catch (error) {
        console.error("Error fetching renters:", error);
      }
    };
    fetchRenters();
  }, []);

  const onSearch = () => { };
  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <div className="h-[63%] px-64 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white z-10 shadow-gray-300 shadow-sm">
                <th className="py-5 px-3 font-semibold  w-1/2">ID</th>
                <th className="py-5 px-3 font-semibold  w-1/2">
                  HOUSEHOLD OWNER
                </th>
              </tr>
            </thead>
            <tbody>
              {rentOwner.map((rentOwner) => (
                <tr key={rentOwner.rent_number} className="border-b hover:bg-gray-50">
                  <td className="text-center py-2">{rentOwner.rent_number}</td>
                  <td className="text-center py-2">{rentOwner.rent_owner}</td>
                  {/* <td className="text-center py-2 flex items-center">
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
                  </td> */}
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
