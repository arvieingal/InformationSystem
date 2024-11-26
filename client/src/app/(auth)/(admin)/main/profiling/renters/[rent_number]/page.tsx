"use client";
import React, { useState, useEffect } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import { dummyHouseholds } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Renter = {
    renter_id: number;
    rent_number: number;
    family_name: string;
    given_name: string;
    middle_name: string;
    extension: string;
    civil_status: string;
    gender: string;
    birthdate: string;
    months_year_of_stay: number;
    work: string;
    sitio_purok: string;
};


const HouseholdMembers = ({ params }: { params: { rent_number: string } }) => {
    const router = useRouter()
    const rentNumber = params.rent_number;

    const [renters, setRenters] = useState<Renter[]>([]);
    const [filteredRenters, setFilteredRenters] = useState<Renter[]>([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const response = await api.get('/api/renter');
                setRenters(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        };

        fetchHouseholds();
    }, []);

    useEffect(() => {
        if (rentNumber) {
            const members = renters.filter(h => h.rent_number === Number(rentNumber));
            setFilteredRenters(members);
        }
    }, [renters, rentNumber]);

    const onSearch = () => { };

    const HEADER = [
        "RENTER NAME", "CIVIL STATUS", "SEX", "BIRTHDATE", "MONTHS/YEARS OF\nSTAY", "WORK"
    ]
    return (
        <div className="h-full w-full">
            <div className="h-full px-32 pb-2">
                <div className="h-[25%] flex justify-center items-center relative">
                    <div className="bg-[#007F73] text-white text-center py-3 px-10 rounded-[10px]">
                        <div className="text-[20px]">Rent Number: {rentNumber}</div>
                    </div>
                    <div className="bg-white absolute bottom-2 right-0 rounded-[5px] px-4 py-2">
                        <div className="flex justify-center items-center font-semibold"><Image src={'/svg/add-household.svg'} alt="add-household" width={100} height={100} className="w-5 h-5 mr-3" />Add</div>
                    </div>
                </div>
                <div className="bg-white h-[65%] rounded-[10px] overflow-y-auto">
                    <table className="w-full border-collapse text-[14px]">
                        <thead>
                            <tr className="sticky top-0 bg-white z-10 shadow-gray-300 shadow-sm">
                                {HEADER.map((item, index) => (
                                    <th key={index} className="py-1 font-semibold px-3 whitespace-pre-wrap text-center">{item}</th>
                                ))}
                                <th className="py-1 font-semibold px-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRenters.map((renter) => (
                                <tr key={renter.renter_id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-3 text-center">{renter.given_name} {renter.middle_name} {renter.family_name} {renter.extension}</td>
                                    <td className="py-2 px-3 text-center">{renter.civil_status}</td>
                                    <td className="py-2 px-3 text-center">{renter.gender}</td>
                                    <td className="py-2 px-3 text-center">{renter.birthdate}</td>
                                    <td className="py-2 px-3 text-center">{renter.months_year_of_stay}</td>
                                    <td className="py-2 px-3 text-center">{renter.work}</td>
                                    <td className="text-center py-2 flex items-center">
                                        <Image
                                            src={"/svg/edit_pencil.svg"}
                                            alt="Edit"
                                            height={100}
                                            width={100}
                                            className="w-5 h-5 mr-2 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="h-[10%] flex justify-center items-center text-white text-[20px]">
                    <button className="bg-[#007F73] flex justify-center items-center px-4 py-1 rounded-[5px]" onClick={() => router.back()}><Image src={'/svg/left-arrow-white.svg'} alt="arrow" width={100} height={100} className="h-5 w-5 mr-2" />Back</button>
                </div>
            </div>
        </div>
    );
};

export default HouseholdMembers;
