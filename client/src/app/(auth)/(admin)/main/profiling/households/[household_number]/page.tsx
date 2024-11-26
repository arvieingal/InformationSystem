"use client";
import React, { useState, useEffect } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import { dummyHouseholds } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type Household = {
    resident_id: number;
    given_name: string;
    family_name: string;
    relationship: string;
    sitio_purok: string;
    gender: string;
    household_number: any;
    middle_name: string;
    extension: string;
    civil_status: string;
    birthdate: string;
    age: number;
    highest_educational_attainment: string;
    occupation: string;
    monthly_income: any;
    block_number: any;
    lot_number: any;
    barangay: string;
    city: string;
    birthplace: string;
    religion: string;
    sectoral: string;
    is_registered_voter: "Yes" | "No";
    is_business_owner: "Yes" | "No";
    is_household_head: "Yes" | "No";
    status: string;
};

type FormData = {
    household_number: string;
    lot_number: string;
    block_number: string;
    sitio_purok: string;
    barangay: string;
    city: string;
    family_name: string;
    middle_name: string;
    given_name: string;
    extension: string;
    gender: string;
    relationship: string;
    civil_status: string;
    birthdate: string;
    is_registered_voter: string;
    religion: string;
    sectoral: string;
    birthplace: string;
    is_business_owner: string;
    is_household_head: string;
    highest_educational_attainment: string; // Added
    occupation: string;
    monthly_income: any;
    status: string; // Added
};


const HouseholdMembers = ({ params }: { params: { household_number: string } }) => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const householdNumber = params.household_number;

    const [households, setHouseholds] = useState<Household[]>([]);
    const [householdHead, setHouseholdHead] = useState<Household[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Household[]>([]);

    const [selectedResident, setSelectedResident] = useState<Household | null>(null);
    const [infoResident, setInfoResident] = useState<Household | null>(null);

    const [isInfoModal, setIsInfoModal] = useState(false)
    const [addResidentModal, setAddResidentModal] = useState(false)
    const [editResidentModal, setEditResidentModal] = useState(false)

    const [residentData, setResidentData] = useState({
        household_number: "",
        lot_number: "",
        block_number: "",
        sitio_purok: "",
        barangay: "",
        city: "",
        family_name: "",
        middle_name: "",
        given_name: "",
        extension: "",
        gender: "",
        relationship: "",
        civil_status: "",
        birthdate: "",
        is_registered_voter: "",
        religion: "",
        highest_educational_attainment: "",
        occupation: "",
        monthly_income: "",
        sectoral: "",
        birthplace: "",
        is_business_owner: "",
        is_household_head: "",
        status: "",
    });

    useEffect(() => {
        if (editResidentModal || isInfoModal) {
            setResidentData({
                highest_educational_attainment: selectedResident?.highest_educational_attainment || "",
                occupation: selectedResident?.occupation || "",
                monthly_income: selectedResident?.monthly_income || "",
                household_number: selectedResident?.household_number || "",
                lot_number: selectedResident?.lot_number || "",
                block_number: selectedResident?.block_number || "",
                sitio_purok: selectedResident?.sitio_purok || "",
                barangay: selectedResident?.barangay || "",
                city: selectedResident?.city || "",
                family_name: selectedResident?.family_name || "",
                middle_name: selectedResident?.middle_name || "",
                given_name: selectedResident?.given_name || "",
                extension: selectedResident?.extension || "",
                gender: selectedResident?.gender || "",
                relationship: selectedResident?.relationship || "",
                civil_status: selectedResident?.civil_status || "",
                birthdate: selectedResident?.birthdate || "",
                is_registered_voter: selectedResident?.is_registered_voter || "",
                religion: selectedResident?.religion || "",
                sectoral: selectedResident?.sectoral || "",
                birthplace: selectedResident?.birthplace || "",
                is_business_owner: selectedResident?.is_business_owner || "No",
                is_household_head: selectedResident?.is_household_head || "No",
                status: selectedResident?.status || "Active",
            });
        } else if (addResidentModal) {
            setResidentData({
                household_number: selectedResident?.household_number || "",
                lot_number: selectedResident?.lot_number || "",
                block_number: selectedResident?.block_number || "",
                sitio_purok: selectedResident?.sitio_purok || "",
                barangay: selectedResident?.barangay || "",
                city: selectedResident?.city || "",
                family_name: selectedResident?.family_name || "",
                middle_name: selectedResident?.middle_name || "",
                given_name: selectedResident?.given_name || "",
                extension: selectedResident?.extension || "",
                gender: selectedResident?.gender || "",
                relationship: selectedResident?.relationship || "",
                civil_status: selectedResident?.civil_status || "",
                birthdate: selectedResident?.birthdate || "",
                is_registered_voter: selectedResident?.is_registered_voter || "",
                religion: selectedResident?.religion || "",
                highest_educational_attainment: selectedResident?.highest_educational_attainment || "",
                occupation: selectedResident?.occupation || "",
                monthly_income: selectedResident?.monthly_income || "",
                sectoral: selectedResident?.sectoral || "",
                birthplace: selectedResident?.birthplace || "", // Added
                is_business_owner: selectedResident?.is_business_owner || "No", // Added
                is_household_head: selectedResident?.is_household_head || "No", // Added
                status: selectedResident?.status || "Active",
            });
        }
    }, [addResidentModal, editResidentModal, isInfoModal, selectedResident]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setResidentData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const response = await api.get('/api/resident');
                setHouseholds(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        };

        fetchHouseholds();
    }, []);

    useEffect(() => {
        const fetchHouseholdHead = async () => {
            try {
                const response = await api.get('/api/household-head');
                setHouseholdHead(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        };

        fetchHouseholdHead();
    }, []);

    useEffect(() => {
        if (householdNumber) {
            const members = households.filter(h => h.household_number === Number(householdNumber));
            setFilteredMembers(members);
        }
    }, [households, householdNumber]);

    const onEditResident = (resident: Household) => {
        setSelectedResident(resident);
        setEditResidentModal(true);
    };

    const onResidentClick = (resident: Household) => {
        setInfoResident(resident);
        setIsInfoModal(true);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const household = householdHead.find(head => head.household_number === Number(householdNumber));
            if (!household) {
                console.error("Household not found for household_number:", householdNumber);
                return;
            }

            const formData: FormData = {
                ...data,
                household_number: householdNumber,
                lot_number: household?.lot_number || "",
                block_number: household?.block_number || "",
                sitio_purok: household?.sitio_purok || "",
                highest_educational_attainment: data.highest_educational_attainment || "",
                occupation: data.occupation || "",
                monthly_income: data.monthly_income || null,
                status: "Active",
                // Ensure all required fields are included
                barangay: household?.barangay || "",   // Make sure this is added
                city: household?.city || "",           // Make sure this is added
                birthplace: data.birthplace || "",     // Ensure this value exists in formData
                is_business_owner: data.is_business_owner || "No",  // Make sure this is added
                is_household_head: data.is_household_head || "No", // Make sure this is added
                religion: data.religion || "",         // Ensure this is included
                sectoral: data.sectoral || "",         // Ensure this is included
                is_registered_voter: data.is_registered_voter || "No",  // Ensure this is included
            };

            // Log the formData to verify the values
            console.log("Submitting Form Data:", formData);

            // Send the data to the backend
            const response = await api.post('/api/insert-household-member', formData);

            console.log("Submission success:", response.data);
            setAddResidentModal(false);
            setEditResidentModal(false);
            setIsInfoModal(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };


    const onSearch = () => { };

    const HEADER = [
        "Name", "Relationship", "Purok", "Gender", "Birthday\n(MM/DD/YYYY)", "Age"
    ]
    return (
        <div className="h-full w-full">
            <div className="h-full px-32 pb-2">
                <div className="h-[25%] flex justify-center items-center relative">
                    <div className="bg-[#007F73] text-white text-center py-1 px-10 rounded-[10px]">
                        <div className="text-[28px]">{filteredMembers[0]?.sitio_purok}, {filteredMembers[0]?.barangay}, {filteredMembers[0]?.city}</div>
                        <div className="text-[16px] text-[#C5C5C5]">Household Number: {householdNumber}</div>
                    </div>
                    <button className="bg-white absolute bottom-2 right-0 rounded-[5px] px-4 py-2" onClick={() => setAddResidentModal(true)}>
                        <div className="flex justify-center items-center font-semibold"><Image src={'/svg/add-household.svg'} alt="add-household" width={100} height={100} className="w-5 h-5 mr-3" />Add</div>
                    </button>
                </div>
                <div className="bg-white h-[65%] rounded-[10px] overflow-y-auto">
                    <table className="w-full border-collapse text-[14px]">
                        <thead>
                            <tr className="sticky top-0 bg-white z-1 shadow-gray-300 shadow-sm">
                                {HEADER.map((item, index) => (
                                    <th key={index} className="py-1 font-semibold px-3 whitespace-pre-wrap text-center">{item}</th>
                                ))}
                                <th className="py-1 font-semibold px-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((household: Household) => (
                                <tr key={household.resident_id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-3 text-center" onClick={() => onResidentClick(household)}>{household.given_name} {household.middle_name} {household.family_name}</td>
                                    <td className="py-2 px-3 text-center">{household.relationship}</td>
                                    <td className="py-2 px-3 text-center">{household.sitio_purok}</td>
                                    <td className="py-2 px-3 text-center">{household.gender}</td>
                                    <td className="py-2 px-3 text-center">{household.birthdate}</td>
                                    <td className="py-2 px-3 text-center">{household.age}</td>
                                    <td className="text-center py-2 flex items-center">
                                        <button onClick={() => onEditResident(household)}>
                                            <Image
                                                src={"/svg/edit_pencil.svg"}
                                                alt="Edit"
                                                height={100}
                                                width={100}
                                                className="w-5 h-5 mr-2 cursor-pointer"
                                            />
                                        </button>
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
            {(addResidentModal || editResidentModal || isInfoModal) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white w-[80%] p-4 rounded-[10px] shadow-lg">
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <Image src={'/svg/people-resident.svg'} alt="people" width={100} height={100} className="w-6 h-6" />
                                <button onClick={() => { setAddResidentModal(false); setEditResidentModal(false); setIsInfoModal(false); }}>
                                    <Image src={'/svg/x-logo.svg'} alt="close" width={100} height={100} className="w-5 h-5" />
                                </button>
                            </div>
                            <span>Household Member Information</span>
                            <span>{addResidentModal ? "Add" : editResidentModal ? "Update" : "View"} household member&apos;s info</span>
                            <span>Household number: {householdNumber}</span>
                            {editResidentModal &&
                                <>
                                    <span>Lot number: {selectedResident?.lot_number}</span>
                                    <span>Block number: {selectedResident?.block_number}</span>
                                </>}
                            <span>Head of the Household: {householdHead.filter(head => head.household_number === Number(householdNumber)).map(head => `${head.given_name} ${head.middle_name} ${head.family_name}`).join(", ")}</span>
                        </div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="">Family Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("family_name", { required: true })}
                                        value={residentData.family_name}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Middle Name</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("middle_name", { required: false })}
                                        value={residentData.middle_name}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">First Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("given_name", { required: true })}
                                        value={residentData.given_name}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Suffix</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("extension", { required: false })}
                                        value={residentData.extension}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Gender<span className="text-red-500">*</span></label>
                                    <div>
                                        <input
                                            type="radio"
                                            {...register("gender", { required: true })}
                                            value="Female"
                                            className="border-[#969696]"
                                            checked={residentData.gender === "Female"}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                            required
                                        />
                                        Female
                                        <input
                                            type="radio"
                                            {...register("gender", { required: true })}
                                            value="Male"
                                            className="border-[#969696]"
                                            checked={residentData.gender === "Male"}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                        />
                                        Male
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Relationship<span className="text-red-500">*</span></label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("relationship", { required: true })}
                                        value={residentData.relationship}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="Husband">Husband</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Grandmother">Grandmother</option>
                                        <option value="Grandfather">Grandfather</option>
                                        <option value="Son in law">Son in law</option>
                                        <option value="Daughter in law">Daughter in law</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Civil Status<span className="text-red-500">*</span></label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("civil_status", { required: true })}
                                        value={residentData.civil_status}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="Married">Married</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Single">Single</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Birthdate<span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("birthdate", { required: true })}
                                        value={residentData.birthdate}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Birthplace<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("birthplace", { required: true })}
                                        value={residentData.birthplace}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Registered Voter?<span className="text-red-500">*</span></label>
                                    <div>
                                        <input
                                            type="radio"
                                            {...register("is_registered_voter", { required: true })}
                                            value="Yes"
                                            className="border-[#969696]"
                                            checked={residentData.is_registered_voter === "Yes"}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                            required
                                        />
                                        Yes
                                        <input
                                            type="radio"
                                            {...register("is_registered_voter", { required: true })}
                                            value="No"
                                            className="border-[#969696]"
                                            checked={residentData.is_registered_voter === "No"}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                            required
                                        />
                                        No
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Religion<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("religion", { required: true })}
                                        value={residentData.religion}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Highest Educational Attainment</label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("highest_educational_attainment", { required: false })}
                                        value={residentData.highest_educational_attainment}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    >
                                        <option value=""></option>
                                        <option value="Elementary Level">Elementary Level</option>
                                        <option value="Elementary Graduate">Elementary Graduate</option>
                                        <option value="High School Level">High School Level</option>
                                        <option value="High School Graduate">High School Graduate</option>
                                        <option value="College Level">College Level</option>
                                        <option value="College Graduate">College Graduate</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Work</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("occupation", { required: false })}
                                        value={residentData.occupation}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Monthly Income (PHP)</label>
                                    <input
                                        type="number"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("monthly_income", { required: false })}
                                        value={residentData.monthly_income}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Sectoral<span className="text-red-500">*</span></label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("sectoral", { required: true })}
                                        value={residentData.sectoral}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    >
                                        <option value=""></option>
                                        <option value="LGBT">LGBT</option>
                                        <option value="PWD">PWD</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                        <option value="Solo Parent">Solo Parent</option>
                                        <option value="Habal - habal">Habal - habal</option>
                                        <option value="Erpat">Erpat</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                {editResidentModal &&
                                    <div className="flex flex-col">
                                        <label htmlFor="">Status</label>
                                        <input
                                            type="text"
                                            className="border-[#969696] border-[1px] rounded-[5px]"
                                            {...register("status", { required: true })}
                                            value={residentData.status}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                        />
                                    </div>}
                            </div>
                            {addResidentModal &&
                                <div className="flex justify-center items-center font-semibold pt-16">
                                    <button className={`bg-[#338A80] text-white rounded-[5px] py-1 w-[50%] ${isInfoModal ? "hidden" : ""}`}>
                                        Add
                                    </button>
                                </div>
                            }
                            {isInfoModal ? null : (
                                !addResidentModal && (
                                    <div className="grid grid-cols-2 gap-2 font-semibold pt-16">
                                        <>
                                            <button className="border-[1px] border-[#969696] rounded-[5px] py-1" type="button">Archive</button>
                                            <button className={`bg-[#338A80] text-white rounded-[5px] py-1 ${isInfoModal ? "hidden" : ""}`}>
                                                Update
                                            </button>
                                        </>
                                    </div>
                                )
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseholdMembers;
