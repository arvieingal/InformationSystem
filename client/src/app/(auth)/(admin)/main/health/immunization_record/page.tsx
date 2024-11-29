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
import { Immunization } from '@/types/Immunization';
import { formatDate } from '@/components/formatDate';
import api from '@/lib/axios';

const ImmunizationRecord: React.FC = () => {
  const router = useRouter();
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Immunization; direction: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedImmunization, setSelectedImmunization] = useState<Immunization | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const itemsPerPage = 15;

  const addModalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    given_name: '',
    family_name: '',
    middle_name: '',
    extension: '',
    birthdate: '',
    birthplace: '',
    address: '',
    vaccine_type: '',
    doses: '',
    date_vaccinated: '',
    remarks: '',
    mother_name: '',
    father_name: '',
    heightAtBirth: '',
    weightAtBirth: '',
    sex: '',
    health_center: '',
    barangay: '',
    family_number: '',
  });

  useEffect(() => {
    const fetchImmunizations = async () => {
      try {
        const response = await api.get('/api/child-immunization-record');

        const data = response.data;
        setImmunizations(data);
      } catch (error) {
        console.error("Error fetching immunization data:", error);
      }
    };

    fetchImmunizations();
  }, []);

  console.log(immunizations, 'tada tada')

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/childImmunizationRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data successfully added to the database');
        setIsAddModalOpen(false);
      } else {
        console.error('Failed to add data to the database');
      }
    } catch (error) {
      console.error('Error adding data to the database:', error);
    }
  };

  const handleViewDetails = (immunization: Immunization) => {
    setSelectedImmunization(immunization);
    setIsViewModalOpen(true);
  };

  return (
    <div className='h-full'>
      <div className="h-[10%] pt-[1rem] pr-[3rem]">
        <div className='w-full flex flex-row items-center justify-between gap-4'>
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
        </div>
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

      <div className="w-full h-[90%]">
        <div className='h-[90%]'>
          <ImmunizationTable
            immunizations={paginatedImmunizations as Immunization[]}
            onSort={handleSort as (key: keyof Immunization) => void}
            sortConfig={sortConfig as { key: keyof Immunization; direction: string } | null}
            onEdit={() => {/* handle edit logic here */ }}
            onArchive={() => {/* handle archive logic here */ }}
            onRowClick={handleRowClick}
            onViewDetails={handleViewDetails}
          />
        </div>
        <div className='h-[10]'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(immunizations.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>


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
                    name="given_name"
                    value={formData.given_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Last Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Middle Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Suffix:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="extension"
                    value={formData.extension}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Date of Birth:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="birthdate"
                    value={formatDate(formData.birthdate)}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Place of Birth:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="birthplace"
                    value={formData.birthplace}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Address:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Mother's Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Father's Name:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Birth Height (cm):</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="heightAtBirth"
                    value={formData.heightAtBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Birth Weight (kg):</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="weightAtBirth"
                    value={formData.weightAtBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Sex:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Health Center:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="health_center"
                    value={formData.health_center}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Barangay:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Family Number:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    name="family_number"
                    value={formData.family_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </PersonModal>
      )}

      {isViewModalOpen && selectedImmunization && (
        <PersonModal onClose={() => setIsViewModalOpen(false)}>
          <div className="p-4 relative">
            <button
              className="absolute top-[-4.7rem] right-[-3.4rem] text-gray-500 hover:text-gray-700 p-4 text-[4rem]"
              onClick={() => setIsViewModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold">Child Immunization Record</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <p>Child's Name: {`${selectedImmunization.full_name}`}</p>
                <p>Mother's Name: {selectedImmunization.mother_name}</p>
                <p>Sex: {selectedImmunization.sex}</p>
              </div>
              <div>
                <p>Date of Birth: {selectedImmunization.birthdate}</p>
                <p>Father's Name: {selectedImmunization.father_name}</p>
                <p>Health Center: {selectedImmunization.health_center}</p>
              </div>
              <div>
                {/* <p>Place of Birth: {selectedImmunization.}</p> */}
                <p>Birth Height: {selectedImmunization.height_at_birth}</p>
                <p>Barangay: {selectedImmunization.address}</p>
              </div>
              <div>
                <p>Address: {selectedImmunization.address}</p>
                <p>Birth Weight: {selectedImmunization.weight_at_birth}</p>
                <p>Family Number: {selectedImmunization.household_number}</p>
              </div>
            </div>
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Bakuna</th>
                  <th className="border border-gray-300 p-2">Doses</th>
                  <th className="border border-gray-300 p-2">Petsa ng Bakuna</th>
                  <th className="border border-gray-300 p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row, replace with actual data */}
                <tr>
                  <td className="border border-gray-300 p-2">Example Vaccine</td>
                  <td className="border border-gray-300 p-2">1</td>
                  <td className="border border-gray-300 p-2">2023-01-01</td>
                  <td className="border border-gray-300 p-2">No remarks</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
            <button
              className="mt-4 bg-[#007F73] text-white px-4 py-2 rounded "
              onClick={() => setIsViewModalOpen(false)}
            >
              OK
            </button>
          </div>
        </PersonModal>
      )}
    </div>
  );
};

export default ImmunizationRecord;

