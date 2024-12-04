'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Pagination from './Pagination';
import api from '@/lib/axios';
import { formatDate } from './formatDate';

type NutritionalStatusHistory = {
    nutri_history_id: number; // Primary Key
    child_id: number; // Foreign Key Candidate
    full_name: string;
    age: number | null; // Age in years, nullable
    sex: "Male" | "Female";
    birthdate: string; // ISO date string (YYYY-MM-DD)
    place_of_birth: string;
    height_at_birth: number | null; // Nullable, in cm
    weight_at_birth: number | null; // Nullable, in kg
    height_cm: number | null; // Nullable, in cm
    weight_kg: number | null; // Nullable, in kg
    height_age_Z: number | null; // Nullable, Z-score
    weight_age_Z: number | null; // Nullable, Z-score
    measurement_date: string | null; // Nullable, ISO date string
    nutritional_status: string | null; // Nullable, e.g., "Normal", "Underweight", etc.
    status: "Active" | "Inactive"; // Enum for status
    created_at: string; // ISO timestamp string
    updated_at: string; // ISO timestamp string
}

interface TableProps {
    children: NutritionalStatusHistory[];
    onSort: (key: keyof NutritionalStatusHistory) => void;
    sortConfig: { key: keyof NutritionalStatusHistory; direction: string } | null;
    onEdit: (child: NutritionalStatusHistory) => void;
    onArchive: (child: NutritionalStatusHistory) => void;
    onRowClick: (child: NutritionalStatusHistory) => void;
}

export default function NutritionalStatusHistory() {
    const [childrenHistory, setChildrenHistory] = useState<NutritionalStatusHistory[]>([])

    useEffect(() => {
        const fetchNutritionalStatusHistory = async () => {
            try {
                const response = await api.get('/api/nutritional-status-history');
                setChildrenHistory(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        };

        fetchNutritionalStatusHistory();
    }, []);

    // const filteredChildren = React.useMemo(() => {
    //     if (!searchQuery) return childrens;
    //     const query = searchQuery.toLowerCase();

    //     return childrens.filter((child) => {
    //         if (child.sex.toLowerCase() === query) {
    //             return true;
    //         }

    //         return Object.entries(child).some(([key, value]) => {
    //             if (value === null || value === undefined) return false;
    //             const stringValue = value.toString().toLowerCase();

    //             if (stringValue.includes(query)) return true;

    //             if (key === 'birthdate' || key === 'measurement_date') {
    //                 const date = new Date(value);
    //                 const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
    //                 return monthName.includes(query);
    //             }

    //             return false;
    //         });
    //     });
    // }, [childrens, searchQuery]);

    const HEADER = [
        'id', 'full name', 'age', 'sex', 'birthdate', 'place_of_birth', 'height_at_birth', 'weight_at_birth', 'heightCm', 'weightKg', 'height_age_Z', 'weight_age_Z', 'measurement date', 'nutritional status'
    ]

    return (
        <>
            <div className="h-[10%]">
                <div className='w-full flex flex-row items-center justify-between gap-4'>
                    <div className="w-full">
                        {/* <SearchBar onSearch={handleSearch} /> */}
                    </div>
                </div>
            </div>
            <div className='h-[90%]'>
                <div className='bg-white h-[90%] rounded-[5px] overflow-y-auto'>
                    <table className="w-full border-collapse text-[14px] ">
                        <thead className='text-center'>
                            <tr className='sticky top-0 bg-white shadow-gray-300 shadow-sm'>
                                {HEADER.map((item, index) => (
                                    <th key={index} className="py-1 font-semibold px-3 whitespace-pre-wrap text-center">{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {childrenHistory.map((child) => (
                                <tr key={child.child_id} className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="py-2 px-6 text-left">{child.nutri_history_id}</td>
                                    <td className="py-2 px-6 text-left">{child.full_name}</td>
                                    <td className="py-2 px-6 text-left">{child.age}</td>
                                    <td className="py-2 px-6 text-left">{child.sex}</td>
                                    <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                                    <td className="py-2 px-6 text-left">{child.place_of_birth}</td>
                                    <td className="py-2 px-6 text-left">{child.height_at_birth}</td>
                                    <td className="py-2 px-6 text-left">{child.weight_at_birth}</td>
                                    <td className="py-2 px-6 text-left">{child.height_cm}</td>
                                    <td className="py-2 px-6 text-left">{child.weight_kg}</td>
                                    <td className="py-2 px-6 text-left">{child.height_age_Z}</td>
                                    <td className="py-2 px-6 text-left">{child.weight_age_Z}</td>
                                    <td className="py-2 px-6 text-left">{formatDate(child.measurement_date)}</td>
                                    <td className="py-2 px-6 text-left">{child.nutritional_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='h-[10%]'>
                    {/* <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredChildren.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                /> */}
                </div>
            </div>
        </>
    )
}
