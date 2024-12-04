'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Pagination from './Pagination';
import api from '@/lib/axios';
import { formatDate } from './formatDate';
import SearchBar from './SearchBar';

type NutritionalStatusHistory = {
    nutri_history_id: number; 
    child_id: number; 
    full_name: string;
    age: number | null; 
    sex: "Male" | "Female";
    birthdate: string; 
    place_of_birth: string;
    height_at_birth: number | null; 
    weight_at_birth: number | null; 
    height_cm: number | null;
    weight_kg: number | null; 
    height_age_Z: number | null; 
    weight_age_Z: number | null; 
    measurement_date: string | null; 
    nutritional_status: string | null; 
    status: "Active" | "Inactive";
    created_at: string; 
    updated_at: string; 
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
    const [childrenHistory, setChildrenHistory] = useState<NutritionalStatusHistory[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const filteredChildren = React.useMemo(() => {
        if (!searchQuery) return childrenHistory;
        const query = searchQuery.toLowerCase();

        return childrenHistory.filter((child) => 
            child.full_name.toLowerCase().includes(query)
        );
    }, [childrenHistory, searchQuery]);

    console.log(filteredChildren);

    const HEADER = [
        'Childs Name', 'Birthdate', 'Age', 'Sex', 'Height (cm)', 'Weight (kg)', 'Measurement Date', 'Nutritional Status', 'Status'
    ]

    function handleSearch(query: string): void {
        setSearchQuery(query);
    }

    return (
        <>
            <div className="h-[10%]">
                <div className='w-full flex flex-row items-center justify-between gap-4'>
                    <div className="w-full">
                        <SearchBar onSearch={handleSearch} />
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
                            {filteredChildren.map((child) => (
                                <tr key={child.child_id} className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="py-2 px-6 text-left hidden">{child.nutri_history_id}</td>
                                    <td className="py-2 px-6 text-left">{child.full_name}</td>
                                    <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                                    <td className="py-2 px-6 text-left">{child.age}</td>
                                    <td className="py-2 px-6 text-left">{child.sex}</td>
                                    <td className="py-2 px-6 text-left">{child.height_cm}</td>
                                    <td className="py-2 px-6 text-left">{child.weight_kg}</td>
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
