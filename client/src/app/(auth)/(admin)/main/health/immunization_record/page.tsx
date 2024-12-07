'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImmunizationTable from '@/components/ImmunizationTable';
import Modal from '@/components/PersonModal';
import SweetAlert from '@/components/SweetAlert';
import SearchBar from '@/components/SearchBar';
import PersonModal from '@/components/PersonModal';
import { Immunization } from '@/types/Immunization';
import { formatDate } from '@/components/formatDate';
import debounce from 'lodash.debounce';
import api from '@/lib/axios';
import { useSession } from 'next-auth/react';

const ImmunizationRecord: React.FC = () => {
  const router = useRouter();
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [filteredImmunizations, setFilteredImmunizations] = useState<Immunization[]>([]);
  console.log('filteredImmunizations', filteredImmunizations)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Immunization;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isVaccineTypeHovered, setIsVaccineTypeHovered] = useState(false);
  const [isDosesHovered, setIsDosesHovered] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedImmunization, setSelectedImmunization] = useState<Immunization | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");

  const addModalRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const fetchImmunizations = async () => {
    try {
      const response = await api.get('/api/child-immunization-record');
      const data = response.data;
      setImmunizations(data);
    } catch (error) {
      console.error("Error fetching immunization data:", error);
    }
  };

  useEffect(() => {
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

  const handleSort = (key: keyof Immunization | null = null) => {
    if (!key) {
      setSortConfig(null);
    } else {
      let direction: "ascending" | "descending" = "ascending";
      if (sortConfig?.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    }
  };

  const filteredAndSortedImmunizations = useMemo(() => {

    const immunizationsToUse = filteredImmunizations.length > 0 || searchQuery !== ""
      ? filteredImmunizations
      : immunizations;

    if (immunizationsToUse.length === 0) return [];

    const safeSortConfig = sortConfig || { key: "child_immunization_id", direction: "ascending" };

    if (!safeSortConfig.key) return immunizationsToUse;

    return [...immunizationsToUse].sort((a, b) => {
      const key = safeSortConfig.key;
      if (a[key] === null || b[key] === null) return 0;
      if (a[key] < b[key]) return safeSortConfig.direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return safeSortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [immunizations, filteredImmunizations, sortConfig, searchQuery]);

  const debouncedHandleSearch = debounce((searchQuery: string) => {
    const filtered = immunizations.filter((immunization) =>
      Object.values(immunization)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredImmunizations(filtered);
  }, 300);

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    debouncedHandleSearch(searchQuery);
  };

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, []);

  const handleViewDetails = (immunization: Immunization) => {
    setSelectedImmunization(immunization);
    setIsViewModalOpen(true);
  };

  const handleFilterClick = async (criteria: string, value?: string) => {
    try {
      const params: { [key: string]: string } = {};
      if (criteria === "boyData") params.sex = "Male";
      if (criteria === "girlData") params.sex = "Female";
      if (criteria === "archivedData") params.status = "Inactive";
      if (criteria === "vaccineType" && value) params.vaccine_type = value;
      if (criteria === "doses" && value) params.doses = value;

      const response = await api.get("/api/filter-child-immunization-record", {
        params,
      });

      console.log('length', response.data.length)

      if (response.data.length === 0) {
        setFilteredImmunizations([]);
      } else {
        setFilteredImmunizations(response.data);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setFilteredImmunizations([]);
    }
  };

  console.log("Filtered:", filteredAndSortedImmunizations); // Should be []
  // console.log("Passed to Table:", filteredAndSortedImmunizations.length > 0 ? filteredAndSortedImmunizations : []); // Should be []  

  return (
    <div className='h-full' onClick={() => handleSort(null)}>
      <div className="h-[10%] pt-[1rem] px-[1.5rem]">
        <div className='w-full flex flex-row items-center justify-between gap-4'>
          <div className="w-full">
            <input
              type="text"
              placeholder="Search .............."
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full outline-none"
            />
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
              src="/svg/report.svg"
              alt="Nutritional Status"
              width={30}
              height={50}
              onClick={() => router.push('/main/health/immuniReport')}
            />
          </button>
        </div>
        {isFilterDropdownOpen && (
          <div className="absolute right-[2rem] mt-[1%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("boyData")}
              >
                Filter by Boy
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("girlData")}
              >
                Filter by Girl
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilterClick("archivedData")}
              >
                Filter by Archived
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                onMouseEnter={() => setIsDosesHovered(true)}
                onMouseLeave={() => setIsDosesHovered(false)}
              >
                Filter by Doses
                {isDosesHovered && (
                  <div className="absolute right-full top-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-20">
                    <ul className="py-1">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "First dose")}
                      >
                        First dose
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "Second dose")}
                      >
                        Second dose
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "Third dose")}
                      >
                        Third dose
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "Fourth dose")}
                      >
                        Fourth dose
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "Fifth dose")}
                      >
                        Fifth dose
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("doses", "Others")}
                      >
                        Others
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                onMouseEnter={() => setIsVaccineTypeHovered(true)}
                onMouseLeave={() => setIsVaccineTypeHovered(false)}
              >
                Filter by Vaccine Type
                {isVaccineTypeHovered && (
                  <div className="absolute right-full top-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-20">
                    <ul className="py-1">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("vaccineType", "BCG Vaccine")}
                      >
                        BCG Vaccine
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleFilterClick("vaccineType", "Hepatitis B Vaccine")
                        }
                      >
                        Hepatitis B Vaccine
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleFilterClick(
                            "vaccineType",
                            "Pentavalent Vaccine (DPT-Hep B-HIB)"
                          )
                        }
                      >
                        Pentavalent Vaccine (DPT-Hep B-HIB)
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleFilterClick("vaccineType", "Inactivated Polio Vaccine (IPV)")
                        }
                      >
                        Inactivated Polio Vaccine (IPV)
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleFilterClick(
                            "vaccineType",
                            "Pneumococcal Conjugate Vaccine (PCV)"
                          )
                        }
                      >
                        Pneumococcal Conjugate Vaccine (PCV)
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleFilterClick(
                            "vaccineType",
                            "Measles, Mumps, Rubella Vaccine (MMR)"
                          )
                        }
                      >
                        Measles, Mumps, Rubella Vaccine (MMR)
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("vaccineType", "Vitamin A")}
                      >
                        Vitamin A
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("vaccineType", "Deworming")}
                      >
                        Deworming
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("vaccineType", "Dental Check-up")}
                      >
                        Dental Check-up
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFilterClick("vaccineType", "Others")}
                      >
                        Others
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="w-full h-[90%]">
        <div className='h-[90%]' onClick={(e) => e.stopPropagation()}>
          <ImmunizationTable
            immunizations={filteredAndSortedImmunizations}
            onSort={handleSort}
            sortConfig={sortConfig as { key: keyof Immunization; direction: string } | null}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {isViewModalOpen && selectedImmunization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 relative rounded-lg shadow-xl w-[45%] mx-auto bg-white">
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 text-2xl transition-transform transform hover:scale-110"
              onClick={() => setIsViewModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Child Immunization Record</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="col-span-1">
                <p className="font-semibold text-gray-600">Child's Name:</p>
                <span className="block text-gray-800">{selectedImmunization.full_name || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Date of Birth:</p>
                <span className="block text-gray-800">{formatDate(selectedImmunization.birthdate) || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Address:</p>
                <span className="block text-gray-800">{selectedImmunization.address || ''}</span>
              </div>
              <div className="col-span-1">
                <p className="font-semibold text-gray-600">Mother's Name:</p>
                <span className="block text-gray-800">{selectedImmunization.mother_name || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Father's Name:</p>
                <span className="block text-gray-800">{selectedImmunization.father_name || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Birth Height:</p>
                <span className="block text-gray-800">{selectedImmunization.height_at_birth || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Birth Weight:</p>
                <span className="block text-gray-800">{selectedImmunization.weight_at_birth || ''}</span>
              </div>
              <div className="col-span-1">
                <p className="font-semibold text-gray-600">Sex:</p>
                <span className="block text-gray-800">{selectedImmunization.sex || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Health Center:</p>
                <span className="block text-gray-800">{selectedImmunization.health_center || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Barangay:</p>
                <span className="block text-gray-800">{selectedImmunization.barangay || ''}</span>
                <p className="font-semibold text-gray-600 mt-4">Family Number:</p>
                <span className="block text-gray-800">{selectedImmunization.household_number || ''}</span>
              </div>
            </div>
            <table className="w-full mt-8 border border-gray-300 rounded-lg border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-4 text-left">Vaccine</th>
                  <th className="border border-gray-300 p-4 text-left">Doses</th>
                  <th className="border border-gray-300 p-4 text-left">Vaccination Date</th>
                  <th className="border border-gray-300 p-4 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 p-4">{selectedImmunization.vaccine_type || ''}</td>
                  <td className="border border-gray-300 p-4">
                    {selectedImmunization.doses ? selectedImmunization.doses.toString() : ''}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedImmunization.date_vaccinated ? formatDate(selectedImmunization.date_vaccinated.toString()) : ''}
                  </td>
                  <td className="border border-gray-300 p-4">{selectedImmunization.remarks || ''}</td>
                </tr>
              </tbody>
            </table>
            <div className='flex justify-center mt-8'>
              <button
                className="bg-[#007F73] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#005f57] transition-colors"
                onClick={() => setIsViewModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmunizationRecord;

