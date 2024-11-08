import React from "react";
import Image from "next/image";

interface Props {
  onSearch: () => void;
}

const ProfilingSearchBar = ({ onSearch }: Props) => {
  return (
    <div className="h-[11%] px-16">
      <div className="w-full flex h-[50%]">
        <div className="flex bg-white h-full items-center w-[80%] rounded-l-[5px]">
          <Image
            src={"/svg/guidance_search.svg"}
            alt="Search"
            height={100}
            width={100}
            className="w-4 h-4 mx-6"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone number"
            className="w-full h-full text-[14px] px-4"
          />
        </div>
        <div className="flex bg-white h-full justify-between items-center w-[12%] border-[1px] px-4">
          <Image
            src={"/svg/filter-outline.svg"}
            alt="Filter"
            height={100}
            width={100}
            className="h-4 w-4"
          />
          <p className="text-[14px]">Filter</p>
          <Image
            src={"/svg/right_arrow.svg"}
            alt="Filter"
            height={100}
            width={100}
            className="h-3 w-3"
          />
        </div>
        <div className="h-full flex justify-center items-center w-[4%]">
          <Image
            src={"/svg/box_box.svg"}
            alt="Box"
            height={100}
            width={100}
            className="h-6 w-6"
          />
        </div>
        <div className="flex bg-white h-full items-center justify-center w-[4%] rounded-r-[5px]">
          <Image
            src={"/svg/burger.svg"}
            alt="Burger"
            height={100}
            width={100}
            className="h-5 w-5"
          />
        </div>
      </div>
      <div className="h-[50%] text-[12px] flex items-center">
        <p className="text-[#799DAD]">
          Displaying <span className="font-semibold">1 - 8</span> of{" "}
          <span className="font-semibold">15000</span> in total
        </p>
      </div>
    </div>
  );
};

export default ProfilingSearchBar;
