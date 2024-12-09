import React, { useState } from "react";
import Image from "next/image";

interface Props {
  onSearch: (searchTerm: string) => void;
  setAddResidentModal: () => void;
  isResident?: boolean;
  handleFilterClick: (criteria: string, value?: string) => void;
  resetData: () => void;
}

const ProfilingSearchBar = ({
  onSearch,
  setAddResidentModal,
  isResident = false,
  handleFilterClick,
  resetData,
}: Props) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [isBusinessOwnerHover, setIsBusinessOwnerHover] = useState(false);

  const filterRef = React.useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const residentName = isResident ? "Household" : "Renter";

  const handleFilterToggle = () => {
    setFilterVisible((prev) => {
      if (prev) {
        resetData();
      }
      return !prev;
    });
  };

  return (
    <div className="h-[11%] px-16">
      <div className="w-full flex h-[50%] relative">
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
          onClick={handleFilterToggle}
        >
          <Image
            src={"/svg/filter-outline.svg"}
            alt="Filter"
            height={100}
            width={100}
            className="h-4 w-4"
          />
          <p className="text-[14px]">Filter</p>
          {filterVisible ? <span>▼</span> : <span>►</span>}
        </button>
        {filterVisible && (
          <div
            className="absolute right-[2rem] top-11 bg-white border border-gray-300 rounded-md shadow-lg z-20"
            ref={filterRef}
          >
            <ul className="py-1">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("maleData")}
              >
                Filter by Male
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("femaleData")}
              >
                Filter by Female
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("archivedData")}
              >
                Filter by Archived
              </li>
              {isResident && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                  onMouseEnter={() => setIsBusinessOwnerHover(true)}
                  onMouseLeave={() => setIsBusinessOwnerHover(false)}
                >
                  Filter by Business Owner
                  {isBusinessOwnerHover && (
                    <div className="absolute right-full top-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-20">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleFilterClick("isBusinessOwner", "Yes")
                          }
                        >
                          Yes
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleFilterClick("isBusinessOwner", "No")
                          }
                        >
                          No
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}
            </ul>
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
          {/* Displaying <span className="font-semibold">1 - 8</span> of{" "}
          <span className="font-semibold">15000</span> in total */}
        </p>
      </div>
    </div>
  );
};

export default ProfilingSearchBar;
