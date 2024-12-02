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
import debounce from 'lodash.debounce';
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
  const [filterCriteria, setFilterCriteria] = useState<string | null>(null);

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
    other_doses:'',
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

  const handleSearch = React.useCallback(
    debounce((query: string) => {
      if (query.trim() === '') {
        // If the search query is empty, reset to the original immunizations
        fetchImmunizations(); // Assuming fetchImmunizations is accessible here
        return;
      }

      const lowerCaseQuery = query.toLowerCase();
      const filteredImmunizations = immunizations.filter((immunization) => {
        const fullName = immunization.full_name ? immunization.full_name.toLowerCase() : '';
        const vaccineType = immunization.vaccine_type ? immunization.vaccine_type.toLowerCase() : '';
        const healthCenter = immunization.health_center ? immunization.health_center.toLowerCase() : '';
        const remarks = immunization.remarks ? immunization.remarks.toLowerCase() : '';
        const dateVaccinated = immunization.date_vaccinated ? formatDate(immunization.date_vaccinated.toString()).toLowerCase() : '';

        return (
          fullName.includes(lowerCaseQuery) ||
          vaccineType.includes(lowerCaseQuery) ||
          (immunization.doses ? immunization.doses.toString().includes(lowerCaseQuery) : false) ||
          dateVaccinated.includes(lowerCaseQuery) ||
          healthCenter.includes(lowerCaseQuery) ||
          remarks.includes(lowerCaseQuery)
        );
      });
      setImmunizations(filteredImmunizations);
    }, 300), // Adjust the debounce delay as needed
    [immunizations]
  );

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

  const handleFilterClick = (criteria: string) => {
    setFilterCriteria(criteria);
  };

  // Define desiredVaccineTypes, desiredDoses, and desiredMonths at the top of the component
  const desiredVaccineTypes = ['Polio', 'DPT', 'Measles']; // Replace with actual vaccine types
  const desiredDoses = ['1', '2', '3']; // Replace with actual dose numbers
  const desiredMonths = [0, 1, 2]; // Replace with actual months

  const filteredImmunizations = React.useMemo(() => {
    if (!filterCriteria) return immunizations;

    return immunizations.filter((immunization) => {
      switch (filterCriteria) {
        case 'vaccineType':
          return desiredVaccineTypes.includes(immunization.vaccine_type);
        case 'doseNumber':
          return immunization.doses != null && desiredDoses.includes(immunization.doses.toString());
        case 'scheduledDate':
          const vaccinatedDate = new Date(immunization.date_vaccinated);
          if (isNaN(vaccinatedDate.getTime())) {
            return false; // Handle invalid date
          }
          const vaccinatedMonth = vaccinatedDate.getMonth();
          return desiredMonths.includes(vaccinatedMonth);
        case 'healthCenter':
          return immunization.health_center === 'Barangay Luz';
        default:
          return true;
      }
    });
  }, [immunizations, filterCriteria]);

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
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterClick('vaccineType')}>Filter by Vaccine Type</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterClick('doseNumber')}>Filter by Dose Number</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterClick('scheduledDate')}>Filter by Scheduled Date</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterClick('healthCenter')}>Filter by Health Center</li>
            </ul>
          </div>
        )}
      </div>

      <div className="w-full h-[90%]">
        <div className='h-[90%]'>
          <ImmunizationTable
            immunizations={filteredImmunizations as Immunization[]}
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
            totalPages={Math.ceil(filteredImmunizations.length / itemsPerPage)}
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
              className="absolute top-[-4.7rem] right-[-3.4rem] text-gray-500 hover:text-gray-700 p-4 text-[4rem] "
              onClick={() => setIsViewModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold">Child Immunization Record</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <p>Child's Name: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{`${selectedImmunization.full_name}`}</span></p>
                <p>Date of Birth: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{formatDate(selectedImmunization.birthdate)}</span></p>
                <p>Place of Birth: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{formatDate(selectedImmunization.birthdate)}</span></p>
                <p>Address: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.address}</span></p>
              </div>
              <div className="col-span-1">
                <p>Mother's Name: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.mother_name}</span></p>
                <p>Father's Name: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right truncate">{selectedImmunization.father_name}</span></p>
                <p>Birth Height: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.height_at_birth}</span></p>
                <p>Birth Weight: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.weight_at_birth}</span></p>
              </div>
              <div className="col-span-1">
                <p>Sex: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.sex}</span></p>
                <p>Health Center: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.health_center}</span></p>
                <p>Barangay: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.barangay}</span></p>
                <p>Family Number: <span className="inline-block w-full md:w-48 border-b-2 border-gray-400 text-right">{selectedImmunization.household_number}</span></p>
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
                  <td className="border border-gray-300 p-2">{selectedImmunization.vaccine_type}</td>
                  <td className="border border-gray-300 p-2">
                    {selectedImmunization.doses ? selectedImmunization.doses.toString() : ''}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {selectedImmunization.date_vaccinated ? formatDate(selectedImmunization.date_vaccinated.toString()) : ''}
                  </td>
                  <td className="border border-gray-300 p-2">{selectedImmunization.remarks}</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
            <div className='flex justify-center'>
            <button
              className="mt-4 bg-[#007F73] text-white px-4 py-2 rounded items-center justify-center flex"
              onClick={() => setIsViewModalOpen(false)}
            >
              OK
            </button>
            </div>
          </div>
        </PersonModal>
      )}
    </div>
  );
};

export default ImmunizationRecord;

