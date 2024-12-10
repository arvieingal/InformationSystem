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
import { formatDate } from "@/components/formatDate";
import SweetAlert from "@/components/SweetAlert";

const HouseholdMembers = ({
  params,
}: {
  params: { household_number: string };
}) => {
  const router = useRouter();
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

  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );

  const [isInfoModal, setIsInfoModal] = useState(false);
  const [addResidentModal, setAddResidentModal] = useState(false);
  const [editResidentModal, setEditResidentModal] = useState(false);

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
        status:
          selectedResident.status === "Active" ||
          selectedResident.status === "Inactive"
            ? selectedResident.status
            : "Active",
      });
    }
  }, [editResidentModal, isInfoModal, addResidentModal, selectedResident]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setResidentData((prev) => ({
      ...prev,
      [name]: name === "monthly_income" ? parseFloat(value) || "" : value,
    }));
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

  useEffect(() => {
    const fetchHouseholdHead = async () => {
      try {
        const response = await api.get("/api/household-head");
        setHouseholdHead(response.data);
      } catch (error) {
        console.error("Error fetching households:", error);
      }
    };

    fetchHouseholdHead();
  }, []);

  useEffect(() => {
    if (householdNumber) {
      const members = households.filter(
        (h) => h.household_number === Number(householdNumber)
      );
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
    const confirm = await SweetAlert.showConfirm(
      "Are you sure all the information are correct?"
    );

    if (confirm) {
      try {
        const household = householdHead.find(
          (head) => head.household_number === Number(householdNumber)
        );
        if (!household) {
          console.error(
            "Household not found for household_number:",
            householdNumber
          );
          return;
        }

        const formData: Resident = editResidentModal
          ? {
              ...residentData,
              other_relationship:
                residentData.relationship === "Others"
                  ? residentData.other_relationship || ""
                  : "",
              household_number: Number(householdNumber),
              age: residentData.age || null,
              lot_number: Number(residentData.lot_number),
              block_number: residentData.block_number || null,
              sitio_purok: residentData.sitio_purok || "",
              highest_educational_attainment:
                residentData.highest_educational_attainment || "",
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
              other_sectoral:
                residentData.sectoral === "Others"
                  ? residentData.other_sectoral || ""
                  : "",
              is_registered_voter: residentData.is_registered_voter || "No",
            }
          : {
              ...data,
              other_relationship:
                data.relationship === "Others"
                  ? data.other_relationship || ""
                  : "",
              household_number: Number(householdNumber),
              age: household.age || null,
              lot_number: Number(household?.lot_number),
              block_number: household?.block_number,
              sitio_purok: household?.sitio_purok || "",
              highest_educational_attainment:
                data.highest_educational_attainment || "",
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
              other_sectoral:
                data.sectoral === "Others" ? data.other_sectoral || "" : "",
              is_registered_voter: data.is_registered_voter || "No",
            };

        const endpoint = selectedResident?.resident_id
          ? "/api/update-household-member"
          : "/api/insert-household-member";

        const method = selectedResident?.resident_id ? "put" : "post";

        const response = await api[method](endpoint, formData);

        await SweetAlert.showSuccess(
          addResidentModal
            ? "Household Member Added Successfully"
            : "Household Member Edited Successfully"
        ).then(() => {
          window.location.reload();
        });
        setAddResidentModal(false);
        setEditResidentModal(false);
        setIsInfoModal(false);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  const handleArchiveResident = async (household: Resident) => {
    try {
      const response = await api.put("/api/archive-household-member", {
        resident_id: household?.resident_id,
      });

      if (response.status === 200) {
        await SweetAlert.showSuccess(
          "Household Member Archived Successfully"
        ).then(() => {
          window.location.reload();
        });
      } else {
        alert("Failed to archive resident.");
      }
    } catch (error) {
      console.error("Error archiving resident:", error);
      alert("An error occurred while archiving the resident.");
    }
  };

  const HEADER = [
    "Name",
    "Relationship",
    "Purok",
    "Gender",
    "Birthday\n(MM/DD/YYYY)",
    "Age",
  ];
  return (
    <div className="h-full w-full">
      <div className="h-full px-32 pb-2">
        <div className="h-[25%] flex justify-center items-center relative">
          <div className="bg-[#007F73] text-white text-center py-1 px-10 rounded-[10px]">
            <div className="text-[28px]">
              {filteredMembers[0]?.sitio_purok}, {filteredMembers[0]?.barangay},{" "}
              {filteredMembers[0]?.city}
            </div>
            <div className="text-[16px] text-[#C5C5C5]">
              Household Number: {householdNumber}
            </div>
          </div>
          <div className="bg-white absolute bottom-2 right-0 rounded-[5px] px-4 py-2">
            {(session?.user.role === "Admin" ||
              session?.user.role === "Editor") && (
              <button
                onClick={async () => {
                  const confirm = await SweetAlert.showConfirm(
                    "Are you sure you want to add a new member?"
                  );
                  if (confirm) {
                    setAddResidentModal(true);
                  }
                }}
              >
                <div className="flex justify-center items-center font-semibold">
                  <Image
                    src={"/svg/add-household.svg"}
                    alt="add-household"
                    width={100}
                    height={100}
                    className="w-5 h-5 mr-3"
                  />
                  Add
                </div>
              </button>
            )}
          </div>
        </div>
        <div className="bg-white h-[65%] rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white z-1 shadow-gray-300 shadow-sm">
                {HEADER.map((item, index) => (
                  <th
                    key={index}
                    className="py-1 font-semibold px-3 whitespace-pre-wrap text-center"
                  >
                    {item}
                  </th>
                ))}
                {(session?.user.role === "Admin" ||
                  session?.user.role === "Editor") && (
                  <th className="py-1 font-semibold px-3"></th>
                )}
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
                  <tr
                    key={household.resident_id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onResidentClick(household)}
                  >
                    <td className="py-2 px-3 text-center">
                      {household.given_name} {household.middle_name}{" "}
                      {household.family_name} {household.extension}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {household.relationship === "Others"
                        ? household.other_relationship
                        : household.relationship}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {household.sitio_purok}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {household.gender}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {formatDate(household.birthdate)}
                    </td>
                    <td className="py-2 px-3 text-center">{household.age}</td>

                    {session?.user.role === "Admin" && (
                      <td className="text-center py-2 flex items-center">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirm = await SweetAlert.showConfirm(
                              "Are you sure you want to edit this member?"
                            );
                            if (confirm) {
                              onEditResident(household);
                            }
                          }}
                        >
                          <Image
                            src={"/svg/edit_pencil.svg"}
                            alt="Edit"
                            height={100}
                            width={100}
                            className="w-5 h-5 mr-2 cursor-pointer"
                          />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const confirm = await SweetAlert.showConfirm(
                              "Are you sure you want to archive this member?"
                            );
                            if (confirm) {
                              handleArchiveResident(household);
                            }
                          }}
                        >
                          <Image
                            src="/svg/archive.svg"
                            alt="Archive"
                            height={100}
                            width={100}
                            className="w-6 h-6 cursor-pointer"
                          />
                        </button>
                      </td>
                    )}

                    {session?.user.role === "Editor" && (
                      <td className="text-center py-2 flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditResident(household);
                          }}
                        >
                          <Image
                            src={"/svg/edit_pencil.svg"}
                            alt="Edit"
                            height={100}
                            width={100}
                            className="w-5 h-5 mr-2 cursor-pointer"
                          />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="h-[10%] flex justify-center items-center text-white text-[20px]">
          <button
            className="bg-[#007F73] flex justify-center items-center px-4 py-1 rounded-[5px]"
            onClick={() => router.back()}
          >
            <Image
              src={"/svg/left-arrow-white.svg"}
              alt="arrow"
              width={100}
              height={100}
              className="h-5 w-5 mr-2"
            />
            Back
          </button>
        </div>
      </div>
      {(addResidentModal || editResidentModal || isInfoModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[60%] p-14 rounded-[10px] shadow-lg relative text-[14px]">
            <div className="flex flex-col justify-center">
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
                    setIsInfoModal(false);
                    setEditResidentModal(false);
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
              <span className="text-[24px] font-semibold pt-3">
                {addResidentModal
                  ? "Create new Household Head"
                  : "Household Member Information"}
              </span>
              <span className="text-[#545454]">
                {addResidentModal
                  ? "Add"
                  : editResidentModal
                  ? "Update"
                  : "View"}{" "}
                household member&apos;s info
              </span>
              <span className="text-[#545454]">
                Household number:{" "}
                <span className="text-black font-semibold text-[18px]">
                  {householdNumber}
                </span>
              </span>
              <span className="text-[#545454]">
                Lot number:{" "}
                <span className="text-black font-semibold text-[18px]">
                  {selectedResident?.lot_number}
                </span>
              </span>
              <span className="text-[#545454]">
                Block number:{" "}
                <span className="text-black font-semibold text-[18px]">
                  {selectedResident?.block_number}
                </span>
              </span>
              <span className="text-[#545454]">
                Head of the Household:{" "}
                <span className="text-black font-semibold text-[18px]">
                  {householdHead
                    .filter(
                      (head) =>
                        head.household_number === Number(householdNumber)
                    )
                    .map((head) =>
                      `${head.given_name || ""} ${head.middle_name || ""} ${
                        head.family_name || ""
                      } ${head.extension || ""}`.trim()
                    )
                    .join(", ")}
                </span>
              </span>
            </div>
            <form
              action=""
              onSubmit={handleSubmit(onSubmit)}
              className="pt-5 text-[14px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="">
                    Family Name
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.family_name || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("family_name", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.family_name
                            ? "This field is required"
                            : true, // Validate only if there's no existing data
                      })}
                      value={residentData.family_name || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Middle Name</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.middle_name || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("middle_name", { required: false })}
                      value={residentData.middle_name || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    First Name
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.given_name || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("given_name", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.given_name
                            ? "This field is required"
                            : true, // Validate only if there's no existing data
                      })}
                      value={residentData.given_name || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Suffix</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.extension || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("extension", { required: false })}
                      value={residentData.extension || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Gender
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  <div>
                    {isInfoModal ? (
                      <span className="font-semibold text-[18px]">
                        {residentData.gender || "N/A"}
                      </span>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) =>
                              !isInfoModal && !value && !residentData.gender
                                ? "This field is required"
                                : true,
                          })}
                          value="Female"
                          className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                          checked={residentData.gender === "Female"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        <span className="mr-3">Female</span>
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) =>
                              !isInfoModal && !value && !residentData.gender
                                ? "This field is required"
                                : true,
                          })}
                          value="Male"
                          className="border-[#969696] mr-3 w-4 h-4 cursor-pointer"
                          checked={residentData.gender === "Male"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        <span className="mr-3">Male</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Relationship
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.relationship === "Others"
                        ? residentData.other_relationship || "N/A"
                        : residentData.relationship || "N/A"}
                    </span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("relationship", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.relationship
                            ? "This field is required"
                            : true,
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
                  )}
                </div>
                {!isInfoModal && residentData.relationship === "Others" && (
                  <div className="flex flex-col">
                    <label htmlFor="">
                      Specify Other Relationship
                      {!isInfoModal && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("other_relationship", {
                        validate: (value) =>
                          !isInfoModal &&
                          !value &&
                          !residentData.other_relationship
                            ? "This field is required"
                            : true,
                      })}
                      value={residentData.other_relationship || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                      required={residentData.relationship === "Others"}
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <label htmlFor="">
                    Civil Status
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.civil_status || "N/A"}
                    </span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("civil_status", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.civil_status
                            ? "This field is required"
                            : true,
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
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Birthdate
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {formatDate(residentData.birthdate) || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="date"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("birthdate", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.birthdate
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={residentData.birthdate || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Birthplace
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.birthplace || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("birthplace", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.birthplace
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={residentData.birthplace || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Registered Voter?
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  <div>
                    {isInfoModal ? ( // Conditional rendering based on isInfoModal
                      <span className="font-semibold text-[18px]">
                        {residentData.is_registered_voter || "N/A"}
                      </span> // Display registered voter status or "N/A" if not set
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="radio"
                          {...register("is_registered_voter", {
                            validate: (value) =>
                              !isInfoModal &&
                              !value &&
                              !residentData.is_registered_voter
                                ? "This field is required"
                                : true,
                          })}
                          value="Yes"
                          className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                          checked={residentData.is_registered_voter === "Yes"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        <span className="mr-3">Yes</span>
                        <input
                          type="radio"
                          {...register("is_registered_voter", {
                            validate: (value) =>
                              !isInfoModal &&
                              !value &&
                              !residentData.is_registered_voter
                                ? "This field is required"
                                : true,
                          })}
                          value="No"
                          className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                          checked={residentData.is_registered_voter === "No"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        <span className="mr-3">No</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Religion
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.religion}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("religion", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.religion
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={residentData.religion || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Highest Educational Attainment</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.highest_educational_attainment || "N/A"}
                    </span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("highest_educational_attainment", {
                        required: false,
                      })}
                      value={residentData.highest_educational_attainment || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    >
                      <option value=""></option>
                      <option value="Elementary Level">Elementary Level</option>
                      <option value="Elementary Graduate">
                        Elementary Graduate
                      </option>
                      <option value="High School Level">
                        High School Level
                      </option>
                      <option value="High School Graduate">
                        High School Graduate
                      </option>
                      <option value="College Level">College Level</option>
                      <option value="College Graduate">College Graduate</option>
                    </select>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Work</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.family_name || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("occupation", { required: false })}
                      value={residentData.occupation || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Monthly Income (PHP)</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.monthly_income || "N/A"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("monthly_income", { required: false })}
                      value={
                        residentData.monthly_income !== null
                          ? residentData.monthly_income
                          : ""
                      }
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Sectoral
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">
                      {residentData.sectoral === "Others"
                        ? residentData.other_sectoral || "N/A"
                        : residentData.sectoral || "N/A"}
                    </span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("sectoral", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.sectoral
                            ? "This field is required"
                            : true,
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
                  )}
                </div>
                {!isInfoModal && residentData.sectoral === "Others" && (
                  <div className="flex flex-col">
                    <label htmlFor="">
                      Specify Other Sectoral
                      {!isInfoModal && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("other_sectoral", {
                        validate: (value) =>
                          !isInfoModal && !value && !residentData.other_sectoral
                            ? "This field is required"
                            : true,
                      })}
                      value={residentData.other_sectoral || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                      required={residentData.sectoral === "Others"}
                    />
                  </div>
                )}
              </div>
              {isInfoModal ? null : (
                <div className="flex justify-center items-center font-semibold pt-16">
                  <button
                    type="submit"
                    className={`bg-[#338A80] text-white rounded-[5px] py-2 w-[40%] text-[18px] ${
                      isInfoModal ? "hidden" : ""
                    }`}
                  >
                    {addResidentModal ? "Add" : "Update"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdMembers;
