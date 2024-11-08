"use client";

import React, { useState } from "react";
import Image from "next/image";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";

const Profiling = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div>
      {selectedCard === null && (
        <div className="w-full h-full pt-[5rem]">
          <div className="flex items-center justify-center">
            <Image
              src="/svg/dashboard.svg"
              width={100}
              height={100}
              alt="Logo"
              className="w-[400px] h-[200px]"
            />
          </div>
          <div className="flex flex-col items-center justify-center pt-[3rem]">
            <p className="text-[#06C46C] font-semibold text-[34px]">
              Welcome to Our Community!
            </p>
            <p className="font-semibold text-[14px] pb-[2rem]">
              Get to know us more, browse our residents profiles
            </p>
          </div>
        </div>
      )}
      <CardGrid cards={dashboardCards} />
    </div>
  );
};

export default Profiling;
