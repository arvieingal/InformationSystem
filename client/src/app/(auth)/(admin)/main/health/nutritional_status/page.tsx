"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/PersonModal";
import SweetAlert from "@/components/SweetAlert";
import SearchBar from "@/components/SearchBar";
import ChildTable from "@/components/ChildTable";
import Pagination from "@/components/Pagination";

interface Child {
  id: number;
  name: string;
  age: number;
  sex: string;
  birthdate: string;
  heightCm: number;
  weightKg: number;
  nutritionalStatus: string;
  address?: string;
  email?: string;
  purok?: string;
  phoneNumber?: string;
}

const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Child; direction: string } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/children');
        if (response.ok) {
          const data: Child[] = await response.json();
          console.log("Fetched children data:", data);
          setChildren(data);
        } else {
          console.error("Failed to fetch children data.");
        }
      } catch (error) {
        console.error("Error fetching children data:", error);
      }
    };

    fetchChildren();
  }, []);

  const fetchChildById = async (id: number) => {
    try {
      const response = await fetch(`/api/children/${id}`);
      if (response.ok) {
        const data: Child = await response.json();
        setSelectedChild(data);
        setIsModalOpen(true);
      } else {
        console.error("Child not found.");
      }
    } catch (error) {
      console.error("Error fetching child by ID:", error);
    }
  };

  function handleRowClick(child: Child): void {
    fetchChildById(child.id);
  }

  function handleEditClick(child: Child): void {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  }

  async function handleArchiveClick(child: Child): Promise<void> {
    const confirmArchive = await SweetAlert.showConfirm(`Are you sure you want to archive this child with ID: ${child.id}?`);
    if (confirmArchive) {
      console.log(`Child with ID: ${child.id} archived.`);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  function handleSort(key: keyof Child) {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const sortedChildren = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...children].sort((a, b) => {
        const key = sortConfig.key;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) {
          return 0; // Handle undefined values by treating them as equal
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return children;
  }, [children, sortConfig]);

  const paginatedChildren = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedChildren.slice(startIndex, endIndex);
  }, [sortedChildren, currentPage]);

  const handleSearch = (query: string) => {
    // Implement search logic here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] ">
        <div onClick={() => router.push("/main/health/nutritional_status")}>
          <Image
            className="mt-[2rem]"
            src="/svg/immunization_records.svg"
            alt="Nutritional Status"
            width={200}
            height={50}
          />
        </div>
        <div onClick={() => router.push("/main/health/immunization_record")}>
          <Image
            src="/svg/health_image.svg"
            alt="Nutritional Status"
            width={200}
            height={50}
          />
        </div>
      </div>
      <div className="w-full flex flex-row pr-[3rem]  items-center justify-between gap-4 ">
        <div className="w-full pl-2">
        <SearchBar onSearch={handleSearch} />
        </div>
        <button className="flex items-center space-x-2 text-blue-500 hover:underline">
            <Image
              src="/svg/filter.svg"
              alt="Nutritional Status"
              width={30}
              height={50}
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            />
            <Image
              src="/svg/add_nutritional.svg"
              alt="Nutritional Status"
              width={30}
              height={50}
              onClick={() => setIsAddModalOpen(true)}
            />
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute right-[1rem] mt-[40%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Age</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Sex</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Birthdate</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Height</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Weight</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Nutritional Status</li>
                {/* Add more filter options as needed */}
              </ul>
            </div>
          )}

      </div>
      <div className="w-full mt-[1rem] ">
        <ChildTable
          children={paginatedChildren}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={handleEditClick}
          onArchive={handleArchiveClick}
          onRowClick={handleRowClick}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(children.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />

      {isModalOpen && selectedChild && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div ref={modalRef} className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2>Child Details</h2>
            <p>Full Name: {selectedChild.name}</p>
            <p>Birthdate: {selectedChild.birthdate}</p>
            <p>Address: {selectedChild.address}</p>
            <p>Email: {selectedChild.email}</p>
            <p>Age: {selectedChild.age}</p>
            <p>Sex: {selectedChild.sex}</p>
            <p>Purok/Zone: {selectedChild.purok}</p>
            <p>Phone Number: {selectedChild.phoneNumber}</p>
          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedChild && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div ref={modalRef} className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>
            <h2>Update Nutritional Status of the Child</h2>
            <div className="flex flex-row gap-2">
              <div className="w-[30%]">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.name}
                    onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-[30%]">
                <p>Middle Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.name}
                    onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-[30%]">
                <p>Last Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.name}
                    onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <p>Sex:</p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                <label>
                <input
                  type="radio"
                  name="sex"
                  value="male"
                  checked={selectedChild.sex === "male"}
                  onChange={(e) => setSelectedChild({ ...selectedChild, sex: e.target.value })}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="sex"
                  value="female"
                  checked={selectedChild.sex === "female"}
                  onChange={(e) => setSelectedChild({ ...selectedChild, sex: e.target.value })}
                />
                Female
              </label>
              </div>
               </div>
                <div>
                <p>Birthdate:</p>
                <div className="border border-gray-300 rounded-md p-1">
                <input
              type="text"
              value={selectedChild.birthdate}
              onChange={(e) => setSelectedChild({ ...selectedChild, birthdate: e.target.value })}
            />
            </div>
            </div>
             <p>During Birth:</p>
              <label>
              <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.name}
                    onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
                  />
                Male
              </label>
            </div>
            <p>Current :</p>
            <p>Age in Months :</p>
            <p>Weight (kg):</p>
            <p>Height (cm):</p>
            <p>Nutritional Status:</p>
            <p>Weight for Age:</p>
            <p>Length/Height for Age:</p>
            <p>Weight for Length/Height:</p>
            <p>Prepared By:</p>
            <p>Date:</p>
            <p>Checked By:</p>
            <p>Date:</p>
            <button>Cancel</button>
            <button>Save</button>
            <input
              type="text"
              value={selectedChild.address}
              onChange={(e) => setSelectedChild({ ...selectedChild, address: e.target.value })}
            />

            <input
              type="email"
              value={selectedChild.email}
              onChange={(e) => setSelectedChild({ ...selectedChild, email: e.target.value })}
            />
            <input
              type="number"
              value={selectedChild.age}
              onChange={(e) => setSelectedChild({ ...selectedChild, age: parseInt(e.target.value) })}
            />
            <input
              type="text"
              value={selectedChild.purok}
              onChange={(e) => setSelectedChild({ ...selectedChild, purok: e.target.value })}
            />
            <input
              type="tel"
              value={selectedChild.phoneNumber}
              onChange={(e) => setSelectedChild({ ...selectedChild, phoneNumber: e.target.value })}
            />
            <button onClick={() => {/* handle save logic here */}}>Save</button>
          </div>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <div className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>
            <h2>Add Child Details</h2>
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Birthdate" />
            <input type="text" placeholder="Address" />
            <input type="email" placeholder="Email" />
            <input type="number" placeholder="Age" />
            <input type="text" placeholder="Sex" />
            <input type="text" placeholder="Purok/Zone" />
            <input type="tel" placeholder="Phone Number" />
            <button onClick={() => {/* handle save logic here */}}>Save</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NutritionalStatus;
