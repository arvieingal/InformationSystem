"use client";

import Image from 'next/image';
import { formatDate } from './formatDate';
import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/PersonModal";
import SweetAlert from "@/components/SweetAlert";
import Pagination from "@/components/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Child as ChildTableChild } from "@/components/ChildTable";
import DataTable from "react-data-table-component";
import api from '@/lib/axios';

export interface Resident {
  resident_id: number;
  family_name: string;
  given_name: string;
  middle_name: string;
  extension: string;
  gender: string;
  birthplace: string;
  birthdate: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  age: number;
  children: Child[];
}

export interface Child {
  resident_id: number;
  full_name: string;
  sex: string;
  age: number;
  birthdate: string;
  address: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  place_of_birth: string;
  height_cm: number;
  weight_kg: number;
  weight_for_length: number;
  child_id: number;
  height_at_birth: number;
  weight_at_birth: number;
  height_age_z: number;
  nutritional_status: string;
  height_age_Z: number;
  weight_age_Z: number;
  weight_height_Z: number;
  measurement_date: string;
  status: string;
}

interface TableProps {
  children: Child[];
  onSort: (key: keyof Child) => void;
  sortConfig: { key: keyof Child; direction: string } | null;
  onEdit: (child: Child) => void;
  onArchive: (child: Child) => void;
  onRowClick: (child: Child) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

type ChildData = {
  full_name: string;
  child_id: number;
  age: number;
  sex: string;
  address: string;
  birthplace: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  birthdate: string;
  weight_for_length: number | null;
  height_at_birth: number | null;
  weight_at_birth: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  height_age_z: number | null;
  weight_age_z: number | null;
  weight_height_z: number | null;
  measurement_date: string | null;
  nutritional_status: string | null;
  status: string | null;
};

const ChildTable: React.FC<TableProps> = ({ children, onSort, sortConfig, onEdit, onArchive, onRowClick, userRole }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [childrens, setChildrens] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const [archivedChildren, setArchivedChildren] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<{ archived: boolean }>({ archived: false });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch active children
  const fetchChildren = async () => {
    try {
      const response = await api.get("/api/children");
      setChildrens(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      setError("Failed to fetch children data.");
    }
  };

  // Fetch archived (inactive) children
  const fetchChildrenInactive = async () => {
    try {
      const response = await api.get("/api/children/inactive");
      if (response.data) {
        setChildrens(response.data); // This updates the state with inactive children
      }
    } catch (error) {
      console.error("Error fetching inactive children:", error);
      setError("Failed to fetch inactive children data.");
    }
  };


  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const response = filterCriteria.archived
          ? await api.get("/api/children/inactive")
          : await api.get("/api/children");
        setChildrens(response.data);
      } catch (error) {
        console.error("Error fetching children:", error);
        setError("Failed to fetch children data.");
      }
    };

    fetchChildrenData();

    // Optional: Periodic refresh
    const intervalId = setInterval(() => {
      fetchChildrenData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [filterCriteria.archived]);



  const handleSort = (key: keyof Child) => {
    onSort(key);
  };

  const handleRowClick = (child: Child) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredChildren = React.useMemo(() => {
    if (!searchQuery) return childrens;
    const query = searchQuery.toLowerCase();

    return childrens.filter((child) => {
      if (child.sex.toLowerCase() === query) {
        return true;
      }

      return Object.entries(child).some(([key, value]) => {
        if (value === null || value === undefined) return false;
        const stringValue = value.toString().toLowerCase();

        if (stringValue.includes(query)) return true;

        if (key === 'birthdate' || key === 'measurement_date') {
          const date = new Date(value);
          const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
          return monthName.includes(query);
        }

        return false;
      });
    });
  }, [childrens, searchQuery]);

  // const sortedChildren = React.useMemo(() => {
  //   if (sortConfig && sortConfig.key) {
  //     return [...filteredChildren].sort((a, b) => {
  //       const key = sortConfig.key as keyof typeof a;
  //       const aValue = a[key];
  //       const bValue = b[key];

  //       if (aValue === undefined || bValue === undefined) {
  //         return 0;
  //       }

  //       if (aValue !== null && bValue !== null && aValue < bValue) {
  //         return sortConfig.direction === "ascending" ? -1 : 1;
  //       }
  //       if (aValue !== null && bValue !== null && aValue > bValue) {
  //         return sortConfig.direction === "ascending" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return filteredChildren;
  // }, [filteredChildren, sortConfig]);

  // const paginatedChildren = React.useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return sortedChildren.slice(startIndex, endIndex);
  // }, [sortedChildren, currentPage]);


  const sortedChildren = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...filteredChildren].sort((a, b) => {
        const key = sortConfig.key as keyof typeof a;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        if (aValue !== null && bValue !== null && aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue !== null && bValue !== null && aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredChildren;
  }, [filteredChildren, sortConfig]);

  const paginatedChildren = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedChildren.slice(startIndex, endIndex);
  }, [sortedChildren, currentPage]);

  const handleEditClick = (child: Child) => {
    if (userRole === 'admin' || userRole === 'editor') {
      onEdit(child);
    }
  };

  const handleArchiveClick = async (child: Child) => {
    if (userRole === 'admin') {
      console.log("Archiving child:", child);
      if (!child.child_id) {
        console.error("Child ID is undefined");
        return;
      }

      try {
        const confirmArchive = await SweetAlert.showConfirm(
          `<p>Are you sure you want to archive this child with ID: <span class="font-bold">${child.child_id}</span>?</p>`
        );

        if (confirmArchive) {
          setIsLoading(true); // Start loading

          const response = await fetch(
            `http://localhost:3001/api/children/${child.child_id}/archive`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setIsLoading(false); // Stop loading

          if (response.ok) {
            console.log("Child archived successfully:", child.child_id);
            setArchivedChildren((prevArchived) => [
              ...prevArchived,
              child.child_id,
            ]);

            setChildrens((prevChildren) =>
              prevChildren.map((c) =>
                c.child_id === child.child_id ? { ...c, status: "archived" } : c
              )
            );

            onArchive(child);

            await SweetAlert.showSuccess(
              `<p>You successfully archived child with ID: <span class="font-bold">${child.child_id}</span>.</p>`
            );
          } else {
            console.error("Failed to archive child. Response status:", response.status);
            await SweetAlert.showError('Failed to archive child.');
          }
        }
      } catch (error) {
        setIsLoading(false); // Ensure loading stops on error
        console.error("Error archiving child:", error);
        await SweetAlert.showError('An error occurred while archiving the child.');
      }
    }
  };

  const handleFilterChange = (key: string, value: boolean | string) => {
    if (key === "archived") {
      setFilterCriteria((prev) => ({ ...prev, archived: !prev.archived }));
    } else if (key === "gender") {
      const filteredChildren = childrens.filter(
        (child) => child.sex.toLowerCase() === value.toString().toLowerCase()
      );
      setChildrens(filteredChildren);
    }
  };



  return (
    <div className="w-full h-full px-[1.5rem]">
      <div className="w-full h-[10%] flex items-center justify-between  ">
        <input
          type="text"
          placeholder="Search .............."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none"
        />
        <div className="flex items-center space-x-4 ml-4 ">
          <Image
            src="/svg/filter.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="cursor-pointer"
          />
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline"
            onClick={() => router.push("/main/health/nutriReport")}
          >
            <Image
              src="/svg/report.svg"
              alt="Nutritional Status"
              width={30}
              height={50}
            />
          </button>
        </div>
      </div>
      {isFilterDropdownOpen && (
        <div className="absolute right-[1rem] bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFilterChange("gender", "male")}
            >
              Filter by Male
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFilterChange("gender", "female")}
            >
              Filter by Female
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                handleFilterChange("archived", !filterCriteria.archived)
              }
            >
              {filterCriteria.archived ? "Show Active" : "Show Archived"}
            </li>
          </ul>
        </div>
      )}
      <div className='h-[90%]'>
        <div className='bg-white h-[90%] rounded-[5px] overflow-y-auto mt-[1rem]'>
          <table className="w-full border-collapse text-[14px] ">
            <thead className='text-center'>
              <tr className='sticky top-0 bg-white shadow-gray-300 shadow-sm'>
                {['id', 'name', 'age', 'sex', 'birthdate', 'weightKg', 'heightCm', 'nutritionalStatus', 'measurement date'].map((key) => (
                  <th
                    key={key}
                    className="py-2 px-6 text-left font-semibold text-[16px]"
                    onClick={() => handleSort(key as keyof Child)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    {sortConfig?.key === key && (
                      <span>
                        {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="py-4 pr-6 text-left font-semibold text-[16px]">Option</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedChildren.map((child) => (
                <tr key={child.child_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick(child as unknown as Child)}>
                  <td className="py-2 px-6 text-left">{child.child_id}</td>
                  <td className="py-2 px-6 text-left">{child.full_name}</td>
                  <td className="py-2 px-6 text-left">{child.age}</td>
                  <td className="py-2 px-6 text-left">{child.sex}</td>
                  <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                  <td className="py-2 px-6 text-left">{child.weight_kg}</td>
                  <td className="py-2 px-6 text-left">{child.height_cm}</td>
                  <td className="py-2 px-6 text-left">{child.nutritional_status}</td>
                  <td className="py-2 px-6 text-left">{formatDate(child.measurement_date)}</td>
                  <td className="py-2 pr-6 text-left flex items-center">
                    <Image
                      src="/svg/edit.svg"
                      alt="Edit"
                      height={100}
                      width={100}
                      className="w-5 h-5 mr-2 cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (userRole === 'admin' || userRole === 'editor') {
                          handleEditClick(child as unknown as Child);
                        } else {
                          await SweetAlert.showError("You do not have permission to edit this child.");
                        }
                      }}
                    />
                    <Image
                      src="/svg/archive.svg"
                      alt="Archive"
                      height={100}
                      width={100}
                      className="w-6 h-6 cursor-pointer"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (userRole === 'admin') {
                          handleArchiveClick(child as unknown as Child);
                        } else {
                          await SweetAlert.showError("You do not have permission to archive.");
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='h-[10%]'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredChildren.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default ChildTable;

