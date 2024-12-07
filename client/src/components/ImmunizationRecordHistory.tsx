'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Pagination from './Pagination'; // Assume this is a separate component
import api from '@/lib/axios';
import { formatDate } from './formatDate';
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

type ImmunizationRecordHistory = {
    immu_history_id: number;
    child_immunization_id: number;
    full_name: string;
    birthdate: string;
    age: number | null;
    sex: "Male" | "Female";
    vaccine_type: string | null;
    other_vaccine_type: string | null;
    doses: string | null;
    other_doses: string | null;
    date_vaccinated: string | null;
    remarks: string | null;
    health_center: string | null;
    status: "Active" | "Inactive";
    created_at: string;
    updated_at: string;
}

export default function ImmunizationRecordHistory() {
    const router = useRouter()

    const [childrenHistory, setChildrenHistory] = useState<ImmunizationRecordHistory[]>([]);
    const [filteredChildren, setFilteredChildren] = useState<ImmunizationRecordHistory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ImmunizationRecordHistory; direction: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        const fetchImmunizationRecordHistory = async () => {
            try {
                const response = await api.get('/api/immunization-record-history');
                setChildrenHistory(response.data);
                setFilteredChildren(response.data);
            } catch (error) {
                console.error("Error fetching immunization records:", error);
            }
        };

        fetchImmunizationRecordHistory();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = childrenHistory.filter(child =>
            child.full_name.toLowerCase().includes(term.toLowerCase()) ||
            child.vaccine_type?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredChildren(filtered);
    };

    const handleSort = (key: keyof ImmunizationRecordHistory) => {
        let direction: string = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedChildren = [...filteredChildren].sort((a, b) => {
            const aValue = a[key] ?? '';
            const bValue = b[key] ?? '';

            if (key === 'full_name' && typeof aValue === 'string' && typeof bValue === 'string') {
                const lowerA = aValue.toLowerCase();
                const lowerB = bValue.toLowerCase();
                if (lowerA < lowerB) return direction === 'ascending' ? -1 : 1;
                if (lowerA > lowerB) return direction === 'ascending' ? 1 : -1;
                return 0;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const lowerA = aValue.toLowerCase();
                const lowerB = bValue.toLowerCase();
                if (lowerA < lowerB) return direction === 'ascending' ? -1 : 1;
                if (lowerA > lowerB) return direction === 'ascending' ? 1 : -1;
                return 0;
            }

            if (key === 'date_vaccinated') {
                const dateA = aValue ? new Date(aValue) : new Date(0);
                const dateB = bValue ? new Date(bValue) : new Date(0);
                return direction === 'ascending' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }

            if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setFilteredChildren(sortedChildren);
        setSortConfig({ key, direction });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChildren.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const HEADER = [
        { label: 'Child Name', key: 'full_name' },
        { label: 'Birthdate', key: 'birthdate' },
        { label: 'Age', key: 'age' },
        { label: 'Sex', key: 'sex' },
        { label: 'Vaccine Type', key: 'vaccine_type' },
        { label: 'Doses', key: 'doses' },
        { label: 'Date Vaccinated', key: 'date_vaccinated' },
        { label: 'Remarks', key: 'remarks' },
        { label: 'Health Center', key: 'health_center' },
    ];

    return (
        <>
            <div className="h-[10%] flex flex-row items-center justify-center">
                <div className='w-full'>
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
                                    <th
                                        key={index}
                                        className="py-4 px-6 text-left font-semibold text-[16px] cursor-pointer"
                                        onClick={() => handleSort(item.key as keyof ImmunizationRecordHistory)}
                                    >
                                        {item.label}
                                        {sortConfig?.key === item.key && (
                                            <span>
                                                {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                                            </span>
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
                                currentItems.map((child) => (
                                    <tr key={child.immu_history_id} className="border-b hover:bg-gray-50 cursor-pointer">
                                        <td className="py-2 px-6 text-left">{child.full_name}</td>
                                        <td className="py-2 px-6 text-left">{formatDate(child.birthdate)}</td>
                                        <td className="py-2 px-6 text-left">{child.age}</td>
                                        <td className="py-2 px-6 text-left">{child.sex}</td>
                                        <td className="py-2 px-6 text-left">{child.vaccine_type === 'Others' ? child.other_vaccine_type : child.vaccine_type || ""}</td>
                                        <td className="py-2 px-6 text-left">{child.doses === 'Others' ? child.other_doses : child.doses || ""}</td>
                                        <td className="py-2 px-6 text-left">{formatDate(child.date_vaccinated)}</td>
                                        <td className="py-2 px-6 text-left">{child.remarks}</td>
                                        <td className="py-2 px-6 text-left">{child.health_center}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='h-[10%]'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    )
}
