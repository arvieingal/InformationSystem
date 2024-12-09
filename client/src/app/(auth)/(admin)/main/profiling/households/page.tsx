"use client";
import React, { useState, useEffect, useMemo } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import { dummyHouseholds } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { Resident } from "@/types/profilingTypes";
import debounce from "lodash.debounce";
import SweetAlert from "@/components/SweetAlert";

const Households = () => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Resident>();

  const [clickedRow, setClickedRow] = useState<number | null>(null);

  const [isSearching, setIsSearching] = useState(false);

  const [households, setHouseholds] = useState<Resident[]>([]);

  const [householdHeads, setHouseholdHeads] = useState<Resident[]>([]);
  const [addResidentModal, setAddResidentModal] = useState(false);
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
    is_household_head: "Yes",
    status: "Active",
  });

  const [filteredData, setFilteredData] = useState<Resident[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Resident;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setFilteredData(isSearching ? households : householdHeads);
  }, [households, householdHeads, isSearching]);

  console.log(householdHeads);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/household-head");
        console.log("Fetched Households:", response.data);
        setHouseholdHeads(response.data);
      } catch (error) {
        console.error("Error fetching households:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  const onSubmit: SubmitHandler<Resident> = async (data) => {
    const confirm = await SweetAlert.showConfirm('Are you sure all the information are correct?')

    if (confirm) {
      try {
        const formData: Resident = {
          ...data,
          other_relationship: data.other_relationship || "",
          household_number: Number(data.household_number),
          age: data.age || null,
          lot_number: Number(data.lot_number),
          block_number: Number(data.block_number),
          sitio_purok: data.sitio_purok || "",
          highest_educational_attainment:
            data.highest_educational_attainment || "",
          occupation: data.occupation || "",
          monthly_income: data.monthly_income || null,
          status: "Active",
          barangay: data?.barangay || "",
          city: data?.city || "",
          birthplace: data.birthplace || "",
          is_business_owner: data.is_business_owner || "No",
          religion: data.religion || "",
          sectoral: data.sectoral || "",
          other_sectoral: data.other_sectoral || "",
          is_registered_voter: data.is_registered_voter || "No",
          is_household_head: "Yes",
        };

        console.log("Submitting Form Data:", formData);

        const response = await api.post("/api/insert-household-head", formData);

        console.log("Submission success:", response.data);
        await SweetAlert.showSuccess(
          'Household Head added Successfully'
        ).then(() => {
          window.location.reload();
        });
        setAddResidentModal(false);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  const handleSearch = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setHouseholds(householdHeads); // Reset if search term is empty
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);

      const response = await api.get(
        `/api/resident/search?term=${searchTerm.trim()}`
      );
      console.log("Search Results:", response.data);

      if (response.data.length === 0) {
        setHouseholds([]);
      } else {
        setHouseholds(response.data); // Update households with search results
      }
    } catch (error) {
      console.error("Error searching residents:", error);
      setHouseholds([]); // Clear state on error
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleRowClick = async (householdNumber: number | null) => {
    setClickedRow(householdNumber);
    router.push(`/main/profiling/households/${householdNumber}`);
  };

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/resident");
        setHouseholds(response.data);
      } catch (error) {
        console.error("Error fetching households:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  const handleFilterClick = async (criteria: string, value?: string) => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = {};
      if (criteria === "maleData") params.gender = "Male";
      if (criteria === "femaleData") params.gender = "Female";
      if (criteria === "archivedData") params.status = "Inactive";
      if (criteria === "isBusinessOwner" && value)
        params.is_business_owner = value;

      setHouseholds([]); // Clear previous data to avoid appending

      const response = await api.get("/api/filter-resident", { params });
      console.log("Filtered Data Length:", response.data.length);

      // If no filtered data, reset households to empty
      if (response.data.length === 0) {
        setHouseholds([]);
      } else {
        setHouseholds(response.data); // Update households state
      }

      setIsSearching(true); // Enable searching mode
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setHouseholds([]); // Clear state on error
      setIsSearching(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof Resident | null = null) => {
    if (!key) {
      setSortConfig(null);
    } else {
      let direction: "ascending" | "descending" = "ascending";
      if (sortConfig?.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    }
  };

  const HEADERS = [
    { label: "Household Number", key: "household_number" },
    {
      label: isSearching ? "Household" : "Household Head",
      key: "given_name",
    },
    { label: "Purok", key: "sitio_purok" },
    { label: "BUSINESS OWNER", key: "is_business_owner" },
  ];

  const displayData = isSearching ? households : householdHeads;

  const sortedData = useMemo(() => {
    let dataToSort = displayData;

    if (!sortConfig) return dataToSort;

    return [...dataToSort].sort((a, b) => {
      const { key, direction } = sortConfig;

      if (typeof a[key] === "string") {
        const comparison = a[key].localeCompare(b[key] as string);
        return direction === "ascending" ? comparison : -comparison;
      }
      if (typeof a[key] === "number" && typeof b[key] === "number") {
        return direction === "ascending"
          ? Number(a[key]) - Number(b[key])
          : Number(b[key]) - Number(a[key]);
      }
      return 0;
    });
  }, [displayData, sortConfig]);

  const resetData = () => {
    setHouseholds(householdHeads);
    setIsSearching(false);
  };

  return (
    <div className="h-full w-full" onClick={() => handleSort(null)}>
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar
        onSearch={handleSearch}
        setAddResidentModal={() => setAddResidentModal(true)}
        isResident={true}
        handleFilterClick={handleFilterClick}
        resetData={resetData}
      />

      <div className="h-[69%] px-32 pb-2" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead className="text-center">
              <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm  z-10">
                {HEADERS.map(({ label, key }) => (
                  <th
                    key={key}
                    className="py-4 px-20 text-left font-semibold text-[16px] cursor-pointer"
                    onClick={() => handleSort(key as keyof Resident)}
                  >
                    {label}
                    {sortConfig?.key === key && (
                      <span>
                        {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={HEADERS.length}>
                    <div className="flex justify-center items-center w-full h-full pt-16">
                      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : sortedData.length > 0 ? (
              <tbody>
                {sortedData.map((item) => (
                  <tr
                    key={item.household_number}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(item.household_number)}
                  >
                    <td className="py-2 text-left px-20">
                      {item.household_number}
                    </td>
                    <td className="py-2 text-left px-20">
                      {item.given_name} {item.middle_name} {item.family_name}{" "}
                      {item.extension}
                    </td>
                    <td className="py-2 text-left px-20">{item.sitio_purok}</td>
                    <td className="py-2 text-left px-20">
                      <p
                        className={`${item.is_business_owner === "Yes"
                          ? "bg-[#007F73] text-white"
                          : "bg-[#A4A4A4]"
                          } rounded-[4px] py-1 w-20 inline-block text-center`}
                      >
                        {item.is_business_owner}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={HEADERS.length}
                    className="py-10 text-center text-gray-500"
                  >
                    {isSearching
                      ? "No residents found. Try adjusting your search."
                      : "No household heads available."}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      {addResidentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20">
          <div className="bg-white w-[60%] p-14 rounded-[10px] shadow-lg relative">
            <div className="flex flex-col">
              <div>
                <Image
                  src={"/svg/add-logo.svg"}
                  alt="people"
                  width={100}
                  height={100}
                  className="w-12 h-12"
                />
                <button
                  onClick={() => {
                    setAddResidentModal(false);
                  }}
                >
                  <Image
                    src={"/svg/x-logo.svg"}
                    alt="close"
                    width={100}
                    height={100}
                    className="w-5 h-5 absolute right-4 top-4"
                  />
                </button>
              </div>
              <span className="text-[24px] font-semibold pt-3">Create new Household Head</span>
              <span className="text-[14px] text-[#545454]">Enter new Household&apos;s info</span>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)} className="pt-5 text-[14px]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="">
                    Family Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("family_name", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Middle Name</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("middle_name", { required: false })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("given_name", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Suffix</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("extension", { required: false })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Household Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("household_number", {
                      required: true,
                      validate: (value) => {
                        const exists = householdHeads.some(
                          (householdHead) =>
                            householdHead.household_number === Number(value) &&
                            householdHead.is_household_head === "Yes"
                        );
                        return !exists || "Household number is already taken";
                      },
                    })}
                  />
                  {errors.household_number && (
                    <span className="text-red-500">
                      {errors.household_number.message}
                    </span>
                  )}{" "}
                  {/* Display error message */}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Block Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("block_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Lot Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("lot_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Gender<span className="text-red-500">*</span>
                  </label>
                  <div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        {...register("gender", { required: true })}
                        value="Female"
                        className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="mr-3">Female</span>
                      <input
                        type="radio"
                        {...register("gender", { required: true })}
                        value="Male"
                        className="border-[#969696] mr-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="mr-3">Male</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Relationship<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("relationship", {
                      validate: (value) =>
                        !value && !residentData.relationship
                          ? "This field is required"
                          : true, // Ensure validation only when the field is empty
                    })}
                    value={residentData.relationship || ""}
                    onChange={(e) => {
                      const value = e.target.value as
                        | ""
                        | "Husband"
                        | "Wife"
                        | "Son"
                        | "Daughter"
                        | "Grandmother"
                        | "Grandfather"
                        | "Son in law"
                        | "Daughter in law"
                        | "Others";
                      setResidentData((prev) => ({
                        ...prev,
                        relationship: value,
                        other_relationship:
                          value === "Others" ? "" : prev.other_relationship,
                      }));
                    }}
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
                    <label htmlFor="">
                      Specify Other Relationship
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("other_relationship", {
                        validate: (value) =>
                          !value && !residentData.other_relationship
                            ? "This field is required"
                            : true, // Validate only if there's no existing data
                      })}
                      value={residentData.other_relationship || ""}
                      onChange={(e) =>
                        setResidentData((prev) => ({
                          ...prev,
                          other_relationship: e.target.value,
                        }))
                      }
                      required={residentData.other_relationship === "Others"}
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <label htmlFor="">
                    Civil Status<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("civil_status", { required: true })}
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
                  <label htmlFor="">
                    Birthdate<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("birthdate", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Sitio<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("sitio_purok", { required: true })}
                  >
                    <option value=""></option>
                    <option value="Abellana">Abellana</option>
                    <option value="City Central">City Central</option>
                    <option value="Kalinao">Kalinao</option>
                    <option value="Lubi">Lubi</option>
                    <option value="Mabuhay">Mabuhay</option>
                    <option value="Nangka">Nangka</option>
                    <option value="Regla">Regla</option>
                    <option value="San Antonio">San Antonio</option>
                    <option value="San Roque">San Roque</option>
                    <option value="San Vicente">San Vicente</option>
                    <option value="Sta. Cruz">Sta. Cruz</option>
                    <option value="Sto. Nino 1">Sto. Nino 1</option>
                    <option value="Sto. Nino 2">Sto. Nino 2</option>
                    <option value="Sto. Nino 3">Sto. Nino 3</option>
                    <option value="Zapatera">Zapatera</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Barangay<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("barangay", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("city", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Birthplace<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("birthplace", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Registered Voter?<span className="text-red-500">*</span>
                  </label>
                  <div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        {...register("is_registered_voter", { required: true })}
                        value="Yes"
                        className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="mr-3">Yes</span>
                      <input
                        type="radio"
                        {...register("is_registered_voter", { required: true })}
                        value="No"
                        className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="mr-3">No</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Religion<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("religion", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Highest Educational Attainment</label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("highest_educational_attainment", {
                      required: false,
                    })}
                  >
                    <option value=""></option>
                    <option value="Elementary Level">Elementary Level</option>
                    <option value="Elementary Graduate">
                      Elementary Graduate
                    </option>
                    <option value="High School Level">High School Level</option>
                    <option value="High School Graduate">
                      High School Graduate
                    </option>
                    <option value="College Level">College Level</option>
                    <option value="College Graduate">College Graduate</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Work</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("occupation", { required: false })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Monthly Income (PHP)</label>
                  <input
                    type="number"
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("monthly_income", { required: false })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Sectoral<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                    {...register("sectoral", { required: true })}
                    onChange={(e) => {
                      const value = e.target.value as
                        | ""
                        | "Others"
                        | "LGBT"
                        | "PWD"
                        | "Senior Citizen"
                        | "Solo Parent"
                        | "Habal - Habal"
                        | "Erpat";
                      setResidentData((prev) => ({
                        ...prev,
                        sectoral: value,
                        other_sectoral:
                          value === "Others" ? "" : prev.other_sectoral,
                      }));
                    }}
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
                    <label htmlFor="">
                      Specify Other Sectoral
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("other_sectoral", {
                        validate: (value) =>
                          !value && !residentData.other_sectoral
                            ? "This field is required"
                            : true,
                      })}
                      required={residentData.sectoral === "Others"}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center font-semibold pt-16">
                <button
                  type="submit"
                  className={`bg-[#338A80] text-white rounded-[5px] py-2 w-[40%] text-[18px]`}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Households;
