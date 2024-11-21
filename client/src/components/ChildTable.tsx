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
// src/types/Child.ts
export interface Resident {
  household_id: number;
  family_name: string;
  given_name: string;
  middle_name: string;
  extension: string;
  gender: string;
  birthdate: string;
  age: number;
  children: Child[]; // Add children as an array of Child
}

export interface Child {
  age: any;
  birthdate: any;
  gender: any;
  extension: string;
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





const ChildTable: React.FC<TableProps> = ({ children, onSort, sortConfig, onEdit, onArchive, onRowClick }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/residents");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setResidents(data);
          } else {
            throw new Error("Fetched residents data is not an array.");
          }
        } else {
          throw new Error("Failed to fetch residents data.");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchResidents();
  }, []);

  useEffect(() => {
    if (residents.length > 0) {
      const fetchChildren = async (household_id: number) => {
        try {
          const response = await fetch(`http://localhost:3001/api/children/household/${household_id}`);
          if (response.ok) {
            const data = await response.json();
            const childrenData = Array.isArray(data) ? data : [];
            setResidents(prevResidents => 
              prevResidents.map(resident => 
                resident.household_id === household_id 
                ? { ...resident, children: childrenData }
                : resident
              )
            );
          } else {
            throw new Error("Failed to fetch children data.");
          }
        } catch (error: any) {
          setError(error.message);
        }
      };

      residents.forEach(resident => {
        fetchChildren(resident.household_id);
      });
    }
  }, [residents]);

  const handleSort = (key: keyof Child) => {
    onSort(key);
  };

  return (
    <div className="w-full px-[1.5rem]">
      <table className="min-w-full border-collapse border border-[#CCCCCC] bg-white text-sm rounded-lg">
        <thead>
          <tr>
            {['id', 'name', 'age', 'sex', 'birthdate', 'heightCm', 'weightKg', 'nutritionalStatus'].map((key) => (
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
          {residents.map((resident, index) => (
            resident.children && resident.children.length > 0 ? (
              resident.children.map((child, childIndex) => (
                <tr key={`${index}-${childIndex}`} onClick={() => onRowClick(child)}>
                  <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer">{resident.household_id}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">
                    {`${resident.given_name || ''} ${resident.family_name || ''} ${resident.middle_name || ''} ${resident.extension || ''}`.trim()}
                  </td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{resident.age}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{resident.gender}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{formatDate(resident.birthdate)}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{child.heightCm}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{child.weightKg}</td>
                  <td className="border border-[#CCCCCC] px-4 py-2">{child.nutritionalStatus}</td>
                  <td className="border py-2 flex flex-row justify-center gap-2">
                    <Image
                      src="/svg/edit.svg"
                      alt="Edit"
                      width={20}
                      height={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(child);
                      }}
                    />
                    <Image
                      src="/svg/archive.svg"
                      alt="Archive"
                      width={20}
                      height={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(child);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr key={index} onClick={() => onRowClick(resident.children?.[0])}>
                <td className="border border-[#CCCCCC] px-4 py-2 cursor-pointer">{resident.household_id}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">
                  {`${resident.given_name || ''} ${resident.family_name || ''} ${resident.middle_name || ''} ${resident.extension || ''}`.trim()}
                </td>
                <td className="border border-[#CCCCCC] px-4 py-2">{resident.age}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">{resident.gender}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">{formatDate(resident.birthdate)}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">{resident.children?.[0]?.heightCm ?? 'N/A'}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">{resident.children?.[0]?.weightKg ?? 'N/A'}</td>
                <td className="border border-[#CCCCCC] px-4 py-2">{resident.children?.[0]?.nutritionalStatus ?? 'N/A'}</td>
                <td className="border py-2 flex flex-row justify-center gap-2">
                  <Image
                    src="/svg/edit.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(resident.children?.[0]);
                    }}
                  />
                  <Image
                    src="/svg/archive.svg"
                    alt="Archive"
                    width={20}
                    height={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(resident.children?.[0]);
                    }}
                  />
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default ChildTable;


// export default ChildTable; 