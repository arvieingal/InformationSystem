"use client";

import Image from 'next/image';
import { formatDate } from './formatDate';

import React, { useState, useEffect, useRef } from "react";
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
  household_id: any;
  family_name: string;
  given_name: string;
  middle_name: string;
  extension: string;
  gender: string;
  birthdate: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  birthplace: string;
  age: number;
  children: Child[]; // Add children as an array of Child
}

export interface Child {
  household_id: any;
  age: any;
  birthdate: any;
  gender: any;
  extension: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  birthplace: string;
  family_name: string;
  middle_name: string;
  given_name: string;
  child_id: number;
  heightAtBirth: string;
  weightAtBirth: number;
  heightCm: number;
  weightKg: number;
  nutritionalStatus: string;
  heightAgeZ: number;
  weightAgeZ: number;
  heightAtAgeZ: number;
  weightAtAgeZ: number;
  measurementDate: string;
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

// ... existing code ...
type ChildData = {
  child_id: number;
  full_name: string;
  age: number;
  sex: string;
  birthdate: string;
  height_at_birth: number | null;
  weight_at_birth: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  height_age_Z: number | null;
  weight_age_Z: number | null;
  weight_height_Z: number | null;
  measurement_date: string | null;
  nutritional_status: string | null;
  status: string | null;
};


const ChildTable: React.FC<TableProps> = ({ children, onSort, sortConfig, onEdit, onArchive, onRowClick }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [childrens, setChildrens] = useState<ChildData[]>([]);


  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await api.get("/api/children");
        setChildrens(response.data);
      } catch (error) {
        console.error("Error fetching renters:", error);
      }
    };

    fetchChildren();
  }, []);

  // useEffect(() => {
  //   if (residents.length > 0) {
  //     const fetchChildren = async (household_id: number) => {
  //       try {
  //         const response = await fetch(`http://localhost:3001/api/children/household/${household_id}`);
  //         if (response.ok) {
  //           const data = await response.json();
  //           const childrenData = Array.isArray(data) ? data : [];
  //           setResidents(prevResidents =>
  //             prevResidents.map(resident =>
  //               resident.household_id === household_id
  //                 ? { ...resident, children: childrenData }
  //                 : resident
  //             )
  //           );
  //         } else {
  //           throw new Error("Failed to fetch children data.");
  //         }
  //       } catch (error: any) {
  //         setError(error.message);
  //       }
  //     };

  //     residents.forEach(resident => {
  //       fetchChildren(resident.household_id);
  //     });
  //   }
  // }, [residents]);

  const handleSort = (key: keyof Child) => {
    onSort(key);
  };

  const handleRowClick = (resident: Resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full px-[1.5rem]">
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'age(months)', 'sex', 'birthdate', 'heightCm', 'weightKg', 'nutritionalStatus'].map((key) => (
              <th
                key={key}
                className="border border-gray-600 bg-gray-300 py-2 cursor-pointer"
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
            <th className="border border-gray-600 bg-gray-300 py-2">Option</th>
          </tr>
        </thead>
        <tbody className="text-center">
        {childrens.map((chilren) => (
                <tr key={chilren.child_id} className="border-b hover:bg-gray-50">
                  <td className="text-center py-2">{chilren.child_id}</td>
                  <td className="text-center py-2">{chilren.full_name}</td>
                  <td className="text-center py-2">{chilren.age}</td>
                  <td className="text-center py-2">{chilren.sex}</td>
                  <td className="text-center py-2">{chilren.birthdate}</td>
                  <td className="text-center py-2">{chilren.height_cm}</td>
                  <td className="text-center py-2">{chilren.weight_kg}</td>
                  <td className="text-center py-2">{chilren.nutritional_status}</td>
                  <td className="text-center py-2 flex items-center">
                    <Image
                      src={"/svg/edit_pencil.svg"}
                      alt="Edit"
                      height={100}
                      width={100}
                      className="w-5 h-5 mr-2 cursor-pointer"
                    />
                    <Image
                      src={"/svg/archive.svg"}
                      alt="Archive"
                      height={100}
                      width={100}
                      className="w-6 h-6 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};



export default ChildTable;


// export default ChildTable; 