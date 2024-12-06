import React, { useState } from "react";
import Image from "next/image";

interface Props {
  onSearch: (searchTerm: string) => void;
  setAddResidentModal: () => void;
  filterDropdown: (filter: string) => void;
  isResident?: boolean;
}

const ProfilingSearchBar = ({
  onSearch,
  setAddResidentModal,
  isResident = false,
  filterDropdown,
}: Props) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
    filterDropdown(filter);
    console.log("Selected filter:", filter);
  };

  const residentName = isResident ? "Household" : "Renter";

  return (
    <div className="h-[11%] px-16">
      <div className="w-full flex h-[50%]">
        <div className="flex bg-white h-full items-center w-[84%] rounded-l-[5px]">
          <Image
            src={"/svg/guidance_search.svg"}
            alt="Search"
            height={100}
            width={100}
            className="w-4 h-4 mx-6"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={`Search by ${residentName} name`}
            className="w-full h-full text-[14px] px-4"
          />
        </div>
        <button
          className="flex bg-white h-full justify-between items-center w-[12%] border-[1px] px-4 cursor-pointer"
          onClick={() => setFilterVisible(!filterVisible)}
        >
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
        </button>
        {filterVisible && (
          <div className="absolute bg-white border rounded shadow-lg">
            <div
              onClick={() => handleFilterSelect("Gender")}
              className="hover:bg-[#007F73] hover:text-white cursor-pointer"
            >
              Filter by Gender
            </div>
            <div
              onClick={() => handleFilterSelect("Option 2")}
              className="hover:bg-[#007F73] hover:text-white cursor-pointer"
            >
              Option 2
            </div>
            <div
              onClick={() => handleFilterSelect("Option 3")}
              className="hover:bg-[#007F73] hover:text-white cursor-pointer"
            >
              Option 3
            </div>
          </div>
        )}
        <button
          className="flex bg-white h-full items-center justify-center w-[4%] rounded-r-[5px]"
          onClick={() => setAddResidentModal()}
        >
          <Image
            src={"/svg/add-household.svg"}
            alt="Burger"
            height={100}
            width={100}
            className="h-8 w-8 cursor-pointer"
          />
        </button>
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
