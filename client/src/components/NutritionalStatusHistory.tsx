'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination'; // Assume this is a separate component
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
    height_diff: number | null;
    weight_kg: number | null;
    weight_diff: number | null;
    height_age_Z: number | null;
    weight_age_Z: number | null;
    measurement_date: string | null;
    nutritional_status: string | null;
    status: "Active" | "Inactive";
    created_at: string;
    updated_at: string;
}

export default function NutritionalStatusRecord() {
    const router = useRouter();
    const [nutriHistory, setNutriHistory] = useState<NutritionalStatusHistory[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<NutritionalStatusHistory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof NutritionalStatusHistory; direction: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        const fetchNutritionalStatusHistory = async () => {
            try {
                const response = await api.get('/api/nutritional-status-history');
                setNutriHistory(response.data);
                setFilteredHistory(response.data);
            } catch (error) {
                console.error("Error fetching nutritional records:", error);
            }
        };

        fetchNutritionalStatusHistory();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = nutriHistory.filter(item =>
            item.full_name.toLowerCase().includes(term.toLowerCase()) ||
            item.nutritional_status?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredHistory(filtered);
    };

    const handleSort = (key: keyof NutritionalStatusHistory) => {
        let direction = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedHistory = [...filteredHistory].sort((a, b) => {
            const aValue = a[key] ?? '';
            const bValue = b[key] ?? '';

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const lowerA = aValue.toLowerCase();
                const lowerB = bValue.toLowerCase();
                return direction === 'ascending' ? lowerA.localeCompare(lowerB) : lowerB.localeCompare(lowerA);
            }

            if (key === 'measurement_date') {
                const dateA = aValue ? new Date(aValue) : new Date(0);
                const dateB = bValue ? new Date(bValue) : new Date(0);
                return direction === 'ascending' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }

            return direction === 'ascending' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        setFilteredHistory(sortedHistory);
        setSortConfig({ key, direction });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const HEADER = [
        { label: 'Childs Name', key: 'full_name' },
        { label: 'Birthdate', key: 'birthdate' },
        { label: 'Age', key: 'age' },
        { label: 'Sex', key: 'sex' },
        { label: 'Height (cm)', key: 'height_cm' },
        { label: 'Height diff', key: 'height_diff' },
        { label: 'Weight (kg)', key: 'weight_kg' },
        { label: 'Weight diff', key: 'weight_diff' },
        { label: 'Measurement Date', key: 'measurement_date' },
        { label: 'Nutritional Status', key: 'nutritional_status' },
        { label: 'Status', key: 'status' },
    ];

    return (
        <>
            <div className="h-[10%] flex flex-row items-center justify-center">
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className='h-[90%]'>
                <div className='bg-white h-[90%] rounded-[5px] overflow-y-auto'>
                    <table className="w-full border-collapse text-[14px]">
                        <thead className="text-center">
                            <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm">
                                {HEADER.map((header, index) => (
                                    <th
                                        key={index}
                                        className="py-4 px-6 text-left font-semibold text-[16px] cursor-pointer"
                                        onClick={() => handleSort(header.key as keyof NutritionalStatusHistory)}
                                    >
                                        {header.label}
                                        {sortConfig?.key === header.key && (
                                            <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={HEADER.length} className="py-4 px-6 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.nutri_history_id} className="border-b hover:bg-gray-50 cursor-pointer">
                                        <td className="py-2 px-6 text-left">{item.full_name}</td>
                                        <td className="py-2 px-6 text-left">{formatDate(item.birthdate)}</td>
                                        <td className="py-2 px-6 text-left">{item.age}</td>
                                        <td className="py-2 px-6 text-left">{item.sex}</td>
                                        <td className="py-2 px-6 text-left">{item.height_cm}</td>
                                        <td className="py-2 px-6 text-left">{item.height_diff}</td>
                                        <td className="py-2 px-6 text-left">{item.weight_kg}</td>
                                        <td className="py-2 px-6 text-left">{item.weight_diff}</td>
                                        <td className="py-2 px-6 text-left">{formatDate(item.measurement_date)}</td>
                                        <td className="py-2 px-6 text-left">{item.nutritional_status}</td>
                                        <td className="py-2 px-6 text-left">{item.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='h-[10%]'>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </>
    );
}
