"use client";

import Image from 'next/image';
import { formatDate } from './formatDate';
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/PersonModal";
import SweetAlert from "@/components/SweetAlert";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Child as ChildTableChild } from "@/components/ChildTable";
import DataTable from "react-data-table-component";
import api from '@/lib/axios';
// src/types/Child.ts
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
  sex: any;
  age: any;
  birthdate: any;
  address: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  place_of_birth: string;
  height_cm: any;
  weight_kg: any;
  weight_for_length: any;
  child_id: number;
  height_at_birth: string;
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
  const [childrens, setChildrens] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const [archivedChildren, setArchivedChildren] = useState<number[]>([]);

  // Function to fetch updated children data
  const fetchChildren = async () => {
    try {
      const response = await api.get("/api/children");
      setChildrens(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  useEffect(() => {
    fetchChildren(); // Initial fetch

    // Set up an interval to fetch data every 30 seconds
    const intervalId = setInterval(() => {
      fetchChildren();
    }, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (key: keyof Child) => {
    onSort(key);
  };

  const handleRowClick = (child: ChildData) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedChildren = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...childrens].sort((a, b) => {
        const key = sortConfig.key as keyof typeof a;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) {
          return 0; // Handle undefined values by treating them as equal
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
    return childrens;
  }, [childrens, sortConfig]);

  const paginatedChildren = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedChildren.slice(startIndex, endIndex);
  }, [sortedChildren, currentPage]);

  const handleArchiveClick = async (child: Child) => {
    const confirmArchive = await SweetAlert.showConfirm(
      `<p>Are you sure you want to archive this child with ID: <span class="font-bold">${child.child_id}</span>?</p>`
    );
    if (confirmArchive) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/children/${child.child_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Archive" }),
          }
        );

        if (response.ok) {
          setArchivedChildren((prevArchived) => [
            ...prevArchived,
            child.child_id,
          ]);
          onArchive(child); // Call the onArchive prop function
        } else {
          console.error("Failed to archive child.");
        }
      } catch (error) {
        console.error("Error archiving child:", error);
      }
    }
  };

  const handleEditClick = (child: Child) => {
    onEdit(child);
  };

  return (
    <div className="w-full px-[1.5rem]">
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'age', 'sex', 'birthdate', 'weightKg', 'heightCm', 'nutritionalStatus', 'measurement date'].map((key) => (
              <th
                key={key}
                className="border border-black bg-gray-300 py-2 cursor-pointer"
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
            <th className="border border-black bg-gray-300 py-2">Option</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {paginatedChildren.map((child) => (
            <tr key={child.child_id} className="border-b hover:bg-gray-50" onClick={() => onRowClick(child as unknown as Child)}>
              <td className="text-center border border-black py-2">{child.child_id}</td>
              <td className="text-center border border-black py-2">{child.full_name}</td>
              <td className="text-center border border-black py-2">{child.age}</td>
              <td className="text-center border border-black py-2">{child.sex}</td>
              <td className="text-center border border-black py-2">{formatDate(child.birthdate)}</td>
              <td className="text-center border border-black py-2">{child.weight_kg}</td>
              <td className="text-center border border-black py-2">{child.height_cm}</td>
              <td className="text-center border border-black py-2">{child.nutritional_status}</td>
              <td className="text-center border border-black py-2">{formatDate(child.measurement_date)}</td>
              <td className="text-center justify-center py-2 flex items-center border border-black">
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
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(childrens.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ChildTable;

