'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Pagination from './Pagination';
import api from '@/lib/axios';
import { formatDate } from './formatDate';

type ImmunizationRecordHistory = {
    immu_history_id: number; // Primary Key
    child_id: number; // Foreign Key Candidate
    full_name: string;
    birthdate: string; // ISO date string (YYYY-MM-DD)
    age: number | null; // Age in years, nullable
    sex: "Male" | "Female";
    vaccine_type: string | null;
    doses: string | null; // Nullable, in cm
    other_doses: string | null; // Nullable, in kg
    date_vaccinated: string | null; // Nullable, in cm
    remarks: string | null; // Nullable, in kg
    health_center: string | null; // Nullable, Z-score
    status: "Active" | "Inactive"; // Enum for status
    created_at: string; // ISO timestamp string
    updated_at: string; // ISO timestamp string
}

interface TableProps {
    children: ImmunizationRecordHistory[];
    onSort: (key: keyof ImmunizationRecordHistory) => void;
    sortConfig: { key: keyof ImmunizationRecordHistory; direction: string } | null;
    onEdit: (child: ImmunizationRecordHistory) => void;
    onArchive: (child: ImmunizationRecordHistory) => void;
    onRowClick: (child: ImmunizationRecordHistory) => void;
}

export default function ImmunizationRecordHistory() {
    const [childrenHistory, setChildrenHistory] = useState<ImmunizationRecordHistory[]>([])

    useEffect(() => {
        const fetchImmunizationRecordHistory = async () => {
            try {
                const response = await api.get('/api/immunization-record-history');
                setChildrenHistory(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        };

        fetchImmunizationRecordHistory();
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
        'id', 'full name', 'birthdate', 'age', 'sex', 'vaccine_type', 'doses', 'other_doses', 'date_vaccinated', 'remarks', 'health_center'
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
                                    <td className="py-2 px-6 text-left">{child.immu_history_id}</td>
                                    <td className="py-2 px-6 text-left">{child.full_name}</td>
                                    <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                                    <td className="py-2 px-6 text-left">{child.age}</td>
                                    <td className="py-2 px-6 text-left">{child.sex}</td>
                                    <td className="py-2 px-6 text-left">{child.vaccine_type}</td>
                                    <td className="py-2 px-6 text-left">{child.doses}</td>
                                    <td className="py-2 px-6 text-left">{child.other_doses}</td>
                                    <td className="py-2 px-6 text-left">{formatDate(child.date_vaccinated)}</td>
                                    <td className="py-2 px-6 text-left">{child.remarks}</td>
                                    <td className="py-2 px-6 text-left">{child.health_center}</td>
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
