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
import { Resident } from "@/types/profilingTypes";
import { useSession } from "next-auth/react";

const HouseholdMembers = ({ params }: { params: { household_number: string } }) => {
    const router = useRouter()
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Resident>();

    const [loading, setLoading] = useState(true);

    const householdNumber = params.household_number;

    const [households, setHouseholds] = useState<Resident[]>([]);
    const [householdHead, setHouseholdHead] = useState<Resident[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Resident[]>([]);

    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

    const [isInfoModal, setIsInfoModal] = useState(false)
    const [addResidentModal, setAddResidentModal] = useState(false)
    const [editResidentModal, setEditResidentModal] = useState(false)

    const [residentData, setResidentData] = useState<Resident>({
        resident_id: null,
        household_number: null,
        lot_number: null,
        block_number: null,
        sitio_purok: "",
        barangay: "",
        city: "",
        family_name: "",
        middle_name: "",
        given_name: "",
        extension: "",
        gender: "",
        relationship: "",
        other_relationship: "",
        civil_status: "",
        birthdate: "",
        age: null,
        highest_educational_attainment: "",
        occupation: "",
        monthly_income: null,
        sectoral: "",
        other_sectoral: "",
        birthplace: "",
        religion: "",
        is_registered_voter: "",
        is_business_owner: "",
        is_household_head: "",
        status: "Active",
    });

    useEffect(() => {
        if (addResidentModal) {
            setResidentData({
                resident_id: null,
                household_number: null,
                lot_number: null,
                block_number: null,
                sitio_purok: "",
                barangay: "",
                city: "",
                family_name: "",
                middle_name: "",
                given_name: "",
                extension: "",
                gender: "",
                relationship: "",
                other_relationship: "",
                civil_status: "",
                birthdate: "",
                age: null,
                highest_educational_attainment: "",
                occupation: "",
                monthly_income: null,
                sectoral: "",
                other_sectoral: "",
                birthplace: "",
                religion: "",
                is_registered_voter: "",
                is_business_owner: "",
                is_household_head: "",
                status: "Active",
            });
        } else if (selectedResident) {
            setResidentData({
                ...residentData,
                ...selectedResident,
                monthly_income: selectedResident.monthly_income || null,
                age: selectedResident.age ?? null,
                status: selectedResident.status === "Active" || selectedResident.status === "Inactive"
                    ? selectedResident.status
                    : "Active",
            });
        }
    }, [editResidentModal, isInfoModal, addResidentModal, selectedResident]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setResidentData((prev) => ({
            ...prev,
            [name]: name === "monthly_income" ? parseFloat(value) || "" : value,
        }));
    };

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                setLoading(true)
                const response = await api.get('/api/resident');
                setHouseholds(response.data);
            } catch (error) {
                console.error("Error fetching households:", error);
            } finally {
                setLoading(false)
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

    const onEditResident = (resident: Resident) => {
        setSelectedResident(resident);
        setEditResidentModal(true);
    };

    const onResidentClick = (resident: Resident) => {
        setSelectedResident(resident);
        setIsInfoModal(true);
    };

    const onSubmit: SubmitHandler<Resident> = async (data) => {
        try {
            const household = householdHead.find(head => head.household_number === Number(householdNumber));
            if (!household) {
                console.error("Household not found for household_number:", householdNumber);
                return;
            }

            const formData: Resident = editResidentModal
                ? {
                    ...residentData,
                    other_relationship: residentData.relationship === 'Others' ? residentData.other_relationship || "" : "",
                    household_number: Number(householdNumber),
                    age: residentData.age || null,
                    lot_number: Number(residentData.lot_number),
                    block_number: residentData.block_number || null,
                    sitio_purok: residentData.sitio_purok || "",
                    highest_educational_attainment: residentData.highest_educational_attainment || "",
                    occupation: residentData.occupation || "",
                    monthly_income: residentData.monthly_income || null,
                    status: "Active",
                    barangay: residentData.barangay || "",
                    city: residentData.city || "",
                    birthplace: residentData.birthplace || "",
                    is_business_owner: residentData.is_business_owner || "No",
                    is_household_head: residentData.is_household_head || "No",
                    religion: residentData.religion || "",
                    sectoral: residentData.sectoral || "",
                    other_sectoral: residentData.sectoral === "Others" ? residentData.other_sectoral || "" : "",
                    is_registered_voter: residentData.is_registered_voter || "No",
                }
                : {
                    ...data,
                    other_relationship: data.relationship === 'Others' ? data.other_relationship || "" : "",
                    household_number: Number(householdNumber),
                    age: household.age || null,
                    lot_number: Number(household?.lot_number),
                    block_number: household?.block_number,
                    sitio_purok: household?.sitio_purok || "",
                    highest_educational_attainment: data.highest_educational_attainment || "",
                    occupation: data.occupation || "",
                    monthly_income: data.monthly_income || null,
                    status: "Active",
                    barangay: household?.barangay || "",
                    city: household?.city || "",
                    birthplace: data.birthplace || "",
                    is_business_owner: data.is_business_owner || "No",
                    is_household_head: data.is_household_head || "No",
                    religion: data.religion || "",
                    sectoral: data.sectoral || "",
                    other_sectoral: data.sectoral === "Others" ? data.other_sectoral || "" : "",
                    is_registered_voter: data.is_registered_voter || "No",
                };

            console.log("Submitting Form Data:", formData);

            const endpoint = selectedResident?.resident_id
                ? '/api/update-household-member'
                : '/api/insert-household-member';

            const method = selectedResident?.resident_id ? 'put' : 'post';

            const response = await api[method](endpoint, formData);

            console.log("Submission success:", response.data);
            setAddResidentModal(false);
            setEditResidentModal(false);
            setIsInfoModal(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const handleArchiveResident = async () => {
        try {
            const response = await api.put('/api/archive-household-member', { resident_id: selectedResident?.resident_id });

            if (response.status === 200) {
                alert('Resident archived successfully!');
            } else {
                alert('Failed to archive resident.');
            }
        } catch (error) {
            console.error('Error archiving resident:', error);
            alert('An error occurred while archiving the resident.');
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
                        {loading ? (
                            <tbody className="relative">
                                <tr>
                                    <td colSpan={4}>
                                        <div className="absolute inset-0 flex justify-center items-center min-h-[400px]">
                                            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {filteredMembers.map((household: Resident) => (
                                    <tr key={household.resident_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onResidentClick(household)}>
                                        <td className="py-2 px-3 text-center">{household.given_name} {household.middle_name} {household.family_name} {household.extension}</td>
                                        <td className="py-2 px-3 text-center">{household.relationship === 'Others' ? household.other_relationship : household.relationship}</td>
                                        <td className="py-2 px-3 text-center">{household.sitio_purok}</td>
                                        <td className="py-2 px-3 text-center">{household.gender}</td>
                                        <td className="py-2 px-3 text-center">{household.birthdate}</td>
                                        <td className="py-2 px-3 text-center">{household.age}</td>
                                        <td className="text-center py-2 flex items-center">
                                            {session?.user.role === "Admin" && (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); onEditResident(household) }}>
                                                        <Image
                                                            src={"/svg/edit_pencil.svg"}
                                                            alt="Edit"
                                                            height={100}
                                                            width={100}
                                                            className="w-5 h-5 mr-2 cursor-pointer"
                                                        />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleArchiveResident() }}>
                                                        <Image
                                                            src="/svg/archive.svg"
                                                            alt="Archive"
                                                            height={100}
                                                            width={100}
                                                            className="w-6 h-6 cursor-pointer"
                                                        />
                                                    </button>
                                                </>
                                            )}

                                            {session?.user.role === "Editor" && (
                                                <button onClick={(e) => { e.stopPropagation(); onEditResident(household) }}>
                                                    <Image
                                                        src={"/svg/edit_pencil.svg"}
                                                        alt="Edit"
                                                        height={100}
                                                        width={100}
                                                        className="w-5 h-5 mr-2 cursor-pointer"
                                                    />
                                                </button>
                                            )}

                                            {/* If the role is "Viewer", nothing will be rendered */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
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
                            <span>Head of the Household: {householdHead.filter(head => head.household_number === Number(householdNumber)).map(head => `${head.given_name || ''} ${head.middle_name || ''} ${head.family_name || ''} ${head.extension || ''}`.trim()).join(", ")}</span>
                        </div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="">Family Name{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("family_name", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.family_name) ? "This field is required" : true // Validate only if there's no existing data
                                        })}
                                        value={residentData.family_name || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Middle Name</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("middle_name", { required: false })}
                                        value={residentData.middle_name || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">First Name{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("given_name", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.given_name) ? "This field is required" : true // Validate only if there's no existing data
                                        })}
                                        value={residentData.given_name || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Suffix</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("extension", { required: false })}
                                        value={residentData.extension || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Gender{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <div>
                                        {isInfoModal ? (
                                            <span>{residentData.gender || "N/A"}</span>
                                        ) : (
                                            <>
                                                <input
                                                    type="radio"
                                                    {...register("gender", {
                                                        validate: (value) => !isInfoModal && (!value && !residentData.gender) ? "This field is required" : true
                                                    })}
                                                    value="Female"
                                                    className="border-[#969696]"
                                                    checked={residentData.gender === "Female"}
                                                    onChange={handleChange}
                                                    disabled={isInfoModal}
                                                />
                                                Female
                                                <input
                                                    type="radio"
                                                    {...register("gender", {
                                                        validate: (value) => !isInfoModal && (!value && !residentData.gender) ? "This field is required" : true
                                                    })}
                                                    value="Male"
                                                    className="border-[#969696]"
                                                    checked={residentData.gender === "Male"}
                                                    onChange={handleChange}
                                                    disabled={isInfoModal}
                                                />
                                                Male
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Relationship{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("relationship", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.relationship) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.relationship || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
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
                                {residentData.relationship === "Others" && (
                                    <div className="flex flex-col">
                                        <label htmlFor="">Specify Other Relationship{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                        <input
                                            type="text"
                                            className="border-[#969696] border-[1px] rounded-[5px]"
                                            {...register("other_relationship", {
                                                validate: (value) => !isInfoModal && (!value && !residentData.other_relationship) ? "This field is required" : true // Validate only if there's no existing data
                                            })}
                                            value={residentData.other_relationship || ""}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                            required={residentData.other_relationship === "Others"}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <label htmlFor="">Civil Status{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("civil_status", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.civil_status) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.civil_status || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    >
                                        <option value=""></option>
                                        <option value="Married">Married</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Single">Single</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Birthdate{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <input
                                        type="date"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("birthdate", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.birthdate) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.birthdate || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Birthplace{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("birthplace", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.birthplace) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.birthplace || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Registered Voter?{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <div>
                                        {isInfoModal ? ( // Conditional rendering based on isInfoModal
                                            <span>{residentData.is_registered_voter || "N/A"}</span> // Display registered voter status or "N/A" if not set
                                        ) : (
                                            <>
                                                <input
                                                    type="radio"
                                                    {...register("is_registered_voter", {
                                                        validate: (value) => !isInfoModal && (!value && !residentData.is_registered_voter) ? "This field is required" : true
                                                    })}
                                                    value="Yes"
                                                    className="border-[#969696]"
                                                    checked={residentData.is_registered_voter === "Yes"}
                                                    onChange={handleChange}
                                                    disabled={isInfoModal}
                                                />
                                                Yes
                                                <input
                                                    type="radio"
                                                    {...register("is_registered_voter", {
                                                        validate: (value) => !isInfoModal && (!value && !residentData.is_registered_voter) ? "This field is required" : true
                                                    })}
                                                    value="No"
                                                    className="border-[#969696]"
                                                    checked={residentData.is_registered_voter === "No"}
                                                    onChange={handleChange}
                                                    disabled={isInfoModal}
                                                />
                                                No
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Religion{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <input
                                        type="text"
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("religion", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.religion) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.religion || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Highest Educational Attainment</label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("highest_educational_attainment", { required: false })}
                                        value={residentData.highest_educational_attainment || ""}
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
                                        value={residentData.occupation || ""}
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
                                        value={residentData.monthly_income !== null ? residentData.monthly_income : ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="">Sectoral{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                    <select
                                        className="border-[#969696] border-[1px] rounded-[5px]"
                                        {...register("sectoral", {
                                            validate: (value) => !isInfoModal && (!value && !residentData.sectoral) ? "This field is required" : true // Ensure validation only when the field is empty
                                        })}
                                        value={residentData.sectoral || ""}
                                        onChange={handleChange}
                                        disabled={isInfoModal}
                                    >
                                        <option value=""></option>
                                        <option value="LGBT">LGBT</option>
                                        <option value="PWD">PWD</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                        <option value="Solo Parent">Solo Parent</option>
                                        <option value="Habal - Habal">Habal - Habal</option>
                                        <option value="Erpat">Erpat</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                {residentData.sectoral === "Others" && (
                                    <div className="flex flex-col">
                                        <label htmlFor="">Specify Other Sectoral{!isInfoModal && <span className="text-red-500">*</span>}</label>
                                        <input
                                            type="text"
                                            className="border-[#969696] border-[1px] rounded-[5px]"
                                            {...register("other_sectoral", {
                                                validate: (value) => !isInfoModal && (!value && !residentData.other_sectoral) ? "This field is required" : true // Validate only if there's no existing data
                                            })}
                                            value={residentData.other_sectoral || ""}
                                            onChange={handleChange}
                                            disabled={isInfoModal}
                                            required={residentData.sectoral === "Others"}
                                        />
                                    </div>
                                )}
                            </div>
                            {isInfoModal ? null :
                                <div className="flex justify-center items-center font-semibold pt-16">
                                    <button type="submit" className={`bg-[#338A80] text-white rounded-[5px] py-1 w-[50%] ${isInfoModal ? "hidden" : ""}`}>
                                        {addResidentModal ? 'Add' : 'Update'}
                                    </button>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HouseholdMembers;
