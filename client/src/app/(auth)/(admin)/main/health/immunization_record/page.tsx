'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImmunizationTable from '@/components/ImmunizationTable';
import Modal from '@/components/PersonModal';
import SweetAlert from '@/components/SweetAlert';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

interface Immunization {
  id: number;
  fullName: string;
  ageMonths: number;
  vaccineType: string;
  doseNumber: number;
  sex: string;
  scheduledDate: string;
  administeredBy: string;
  sideEffects: string;
  location: string;
}

const ImmunizationRecord: React.FC = () => {
  const router = useRouter();
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Immunization; direction: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchImmunizations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/immunizations');
        if (response.ok) {
          const data: Immunization[] = await response.json();
          setImmunizations(data);
        } else {
          console.error("Failed to fetch immunization data.");
        }
      } catch (error) {
        console.error("Error fetching immunization data:", error);
      }
    };

    fetchImmunizations();
  }, []);

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

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem]">
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
            onClick={() => setIsAddModalOpen(true)}
          />
        </button>
        {isFilterDropdownOpen && (
          <div className="absolute right-[1rem] mt-[40%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
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
          immunizations={paginatedImmunizations}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={() => {/* handle edit logic here */}}
          onArchive={() => {/* handle archive logic here */}}
          onRowClick={() => {/* handle row click logic here */}}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(immunizations.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ImmunizationRecord;
