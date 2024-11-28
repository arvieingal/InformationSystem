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
  heightAgeZ: number;
  nutritional_status: string;
  heightAtAgeZ: number;
  weightAtAgeZ: number;
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
  heightAgeZ: number | null;
  weightAgeZ: number | null;
  weightHeightZ: number | null;
  measurement_date: string | null;
  nutritional_status: string | null;
  status: string | null;
};

const ChildTable: React.FC<TableProps> = ({ children, onSort, sortConfig, onEdit, onArchive, onRowClick }) => {
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

  const fetchChildren = async () => {
    try {
      const response = await api.get("/api/children");
      setChildrens(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      setError("Failed to fetch children data.");
    }
  };

  useEffect(() => {
    fetchChildren();

    const intervalId = setInterval(() => {
      fetchChildren();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

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
      console.log(`Checking child: ${child.full_name}, sex: ${child.sex}`);

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

  const handleArchiveClick = async (child: Child) => {
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
        const response = await fetch(
          `http://localhost:3001/api/children/${child.child_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "Archive",
            }),
          }
        );

        if (response.ok) {
          console.log("Child archived successfully:", child.child_id);
          setArchivedChildren((prevArchived) => [
            ...prevArchived,
            child.child_id,
          ]);

          setChildrens((prevChildren) =>
            prevChildren.map((c) =>
              c.child_id === child.child_id ? { ...c, status: "Archive" } : c
            )
          );

          onArchive(child);

          await SweetAlert.showSuccess(
            `<p>You successfully archived child with ID: <span class="font-bold">${child.child_id}</span>.</p>`
          );
        } else {
          console.error("Failed to archive child. Response status:", response.status);
        }
      }
    } catch (error) {
      console.error("Error archiving child:", error);
    }
  };

  const handleEditClick = (child: Child) => {
    onEdit(child);
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    console.log(`Filtering by ${key} with value: ${value}`);

    setFilterCriteria((prev) => ({ ...prev, [key]: value }));

    const filteredChildren = childrens.filter((child) => {
      switch (key) {
        case "age":
          return parseFloat(child.age.toString()) === parseFloat(value.toString());
        case "gender":
          return child.sex.toLowerCase() === value.toString().toLowerCase();
        case "birthdate":
          const birthMonth = new Date(child.birthdate).getMonth() + 1; // getMonth() is zero-based
          return birthMonth === parseInt(value.toString());
        case "nutritionalStatus":
          return child.nutritional_status.toLowerCase() === value.toString().toLowerCase();
        case "archived":
          return child.status.toLowerCase() === (value ? "archive" : "active");
        default:
          return true;
      }
    });

    console.log("Filtered children:", filteredChildren);
    setChildrens(filteredChildren);
  };

  return (
    <div className="w-full h-full px-[1.5rem]">
      <div className="w-full h-[10%] flex items-center justify-between pb-4">
        <input
          type="text"
          placeholder="Search .............."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none"
        />
        <div className="flex items-center space-x-4 ml-4">
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
              onClick={() => handleFilterChange("age", "specificAge")}
            >
              Filter by Age
            </li>
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
              onClick={() => handleFilterChange("birthdate", "specificDate")}
            >
              Filter by Birthdate
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFilterChange("height", "specificHeight")}
            >
              Filter by Height
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFilterChange("weight", "specificWeight")}
            >
              Filter by Weight
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFilterChange("nutritionalStatus", "Normal")}
            >
              Filter by Nutritional Status
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                setFilterCriteria((prev) => ({ ...prev, archived: !prev.archived }))
              }
            >
              {filterCriteria.archived ? "Show Active" : "Show Archived"}
            </li>
          </ul>
        </div>
      )}
      <div className='h-[90%]'>
        <div className='bg-white h-[90%] rounded-[5px] overflow-y-auto'>
          <table className="w-full border-collapse text-[14px]">
            <thead className='text-[#6C6C6C] text-center'>
              <tr className='sticky top-0 bg-white shadow-gray-300 shadow-sm'>
                {['id', 'name', 'age', 'sex', 'birthdate', 'weightKg', 'heightCm', 'nutritionalStatus', 'measurement date'].map((key) => (
                  <th
                    key={key}
                    className="py-2 px-6 text-left font-semibold"
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
                <th className="py-4 pr-6 text-left font-semibold">Option</th>
              </tr>
            </thead>
            <tbody>
              {paginatedChildren.map((child) => (
                <tr key={child.child_id} className="border-b hover:bg-gray-50" onClick={() => onRowClick(child as unknown as Child)}>
                  <td className="py-2 px-6 text-left">{child.child_id}</td>
                  <td className="py-2 px-6 text-left">{child.full_name}</td>
                  <td className="py-2 px-6 text-left">{child.age}</td>
                  <td className="py-2 px-6 text-left">{child.sex}</td>
                  <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                  <td className="py-2 px-6 text-left">{child.weight_kg}</td>
                  <td className="py-2 px-6 text-left">{child.height_cm}</td>
                  <td className="py-2 px-6 text-left">{child.nutritional_status}</td>
                  <td className="py-2 px-6 text-left">{formatDate(child.measurement_date)}</td>
                  <td className="py-2 pr-6 text-left flex justify-center items-center">
                    <Image
                      src={"/svg/edit_pencil.svg"}
                      alt="Edit"
                      height={100}
                      width={100}
                      className="w-5 h-5 mr-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(child as unknown as Child);
                      }}
                    />
                    <Image
                      src={"/svg/archive.svg"}
                      alt="Archive"
                      height={100}
                      width={100}
                      className="w-6 h-6 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveClick(child as unknown as Child);
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
    </div>
  );
};

export default ChildTable;

