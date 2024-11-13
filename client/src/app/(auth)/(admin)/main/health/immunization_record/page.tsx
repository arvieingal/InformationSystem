'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImmunizationTable from '@/components/ImmunizationTable';
import Modal from '@/components/PersonModal';
import SweetAlert from '@/components/SweetAlert';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import PersonModal from '@/components/PersonModal';

interface VaccineDose {
  administered_by: string;
  sideEffects: string;
  location: string;
  vaccine_type: string;
  dose_description: string;
  scheduled_date: string;
  administered_date: string;
}

interface Immunization {
  record_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  date_of_birth: string;
  place_of_birth: string;
  address: string;
  mother_name: string;
  father_name: string;
  birth_height: number;
  birth_weight: number;
  sex: string;
  health_center: string;
  barangay: string;
  family_number: string;
  
  // Related vaccineDose records (can be an array)
  vaccineDoses: VaccineDose[];
}

const ImmunizationRecord: React.FC = () => {
  const router = useRouter();
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Immunization; direction: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedImmunization, setSelectedImmunization] = useState<Immunization | null>(null);
  const itemsPerPage = 15;

  const addModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImmunizations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/childImmunizationRecords');
  
        if (response.ok) {
          const data = await response.json();
          setImmunizations(data);
          console.log("data:", data);
        } else {
          console.error("Failed to fetch immunization data.");
        }
      } catch (error) {
        console.error("Error fetching immunization data:", error);
      }
    };
  
    fetchImmunizations();
  }, []);

  const handleClickOutsideAddModal = (event: MouseEvent) => {
    if (addModalRef.current && !addModalRef.current.contains(event.target as Node)) {
      setIsAddModalOpen(false);
    }
  };

  useEffect(() => {
    if (isAddModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideAddModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideAddModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAddModal);
    };
  }, [isAddModalOpen]);

  function handleSort(key: keyof Immunization) {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const sortedImmunizations = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...immunizations].sort((a, b) => {
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
    return immunizations;
  }, [immunizations, sortConfig]);

  const paginatedImmunizations = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedImmunizations.slice(startIndex, endIndex);
  }, [sortedImmunizations, currentPage]);

  const handleSearch = (query: string) => {
    // Implement search logic here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddModalOpen = (immunization: Immunization) => {
    setSelectedImmunization(immunization);
    setIsAddModalOpen(true);
  };

  const handleRowClick = (immunization: Immunization) => {
    setSelectedImmunization(immunization);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] mt-[2rem]">
       
      </div>
      
      <div className="w-full flex flex-row pr-[3rem] items-center justify-between gap-4">
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
            onClick={() => {
              const selectedImmunization = paginatedImmunizations[0]; // Example: Select the first immunization
              handleAddModalOpen(selectedImmunization);
            }}
          />
            <Image
            src="/svg/report.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
            onClick={() => router.push('/main/health/immuniReport')}
          />
        </button>
        {isFilterDropdownOpen && (
          <div className="absolute right-[1rem] mt-[16%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Age</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Sex</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Vaccine Type</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Dose Number</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Scheduled Date</li>
              {/* Add more filter options as needed */}
            </ul>
          </div>
        )}
      </div>

      <div className="w-full mt-[1rem]">
        <ImmunizationTable
          immunizations={paginatedImmunizations as Immunization[]}
          onSort={handleSort as (key: keyof Immunization) => void}
          sortConfig={sortConfig as { key: keyof Immunization; direction: string } | null}
          onEdit={() => {/* handle edit logic here */}}
          onArchive={() => {/* handle archive logic here */}}
          onRowClick={handleRowClick}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(immunizations.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />

      {isAddModalOpen && selectedImmunization && (
        <PersonModal onClose={() => setIsAddModalOpen(false)}>
          <div ref={addModalRef} className="relative p-4">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold">Add Immunization Record</h2>
            <div className="grid grid-cols-4 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.first_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Last Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.last_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Middle Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.middle_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Suffix:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.suffix}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Date of Birth:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.date_of_birth}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Place of Birth:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.place_of_birth}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Address:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.address}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Mother's Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.mother_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Father's Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.father_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Birth Height (cm):</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.birth_height}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Birth Weight (kg):</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.birth_weight}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Sex:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.sex}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Health Center:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.health_center}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Barangay:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.barangay}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Family Number:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedImmunization.family_number}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </PersonModal>
      )}
    </>
  );
};

export default ImmunizationRecord;

