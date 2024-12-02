"use client";
import React, { useState, useEffect } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import { dummyHouseholds } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { Resident } from "@/types/profilingTypes";

type Household = {
  household_number: number;
  family_name: string;
  given_name: string;
  middle_name: string;
  extension: string;
  sitio_purok: string;
  is_business_owner: string;
};

const Households = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Resident>();

  const [households, setHouseholds] = useState<Household[]>([]);
  const [addResidentModal, setAddResidentModal] = useState(false)
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

  console.log(households)

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await api.get('/api/household-head');
        setHouseholds(response.data);
      } catch (error) {
        console.error("Error fetching households:", error);
      }
    };

    fetchHouseholds();
  }, []);

  const onSubmit: SubmitHandler<Resident> = async (data) => {
    try {

      const formData: Resident =
      {
        ...data,
        other_relationship: data.other_relationship || "",
        household_number: Number(data.household_number),
        age: data.age || null,
        lot_number: Number(data.lot_number),
        block_number: data.block_number,
        sitio_purok: data.sitio_purok || "",
        highest_educational_attainment: data.highest_educational_attainment || "",
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

      const response = await api.post('/api/insert-household-head', formData);

      console.log("Submission success:", response.data);
      setAddResidentModal(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSearch = () => { };
  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <button className="bg-white absolute bottom-2 right-0 rounded-[5px] px-4 py-2" onClick={() => setAddResidentModal(true)}>
        <div className="flex justify-center items-center font-semibold"><Image src={'/svg/add-household.svg'} alt="add-household" width={100} height={100} className="w-5 h-5 mr-3" />Add</div>
      </button>

      <div className="h-[66%] px-32 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm">
                <th className="text-center py-5 font-semibold">
                  Household Number
                </th>
                <th className="text-left py-5 font-semibold">Household Head</th>
                <th className="text-left py-5 font-semibold">Purok</th>
                <th className="text-center py-5 font-semibold">
                  BUSINESS OWNER
                </th>
              </tr>
            </thead>
            <tbody>
              {households.map((household) => (
                <tr key={household.household_number} className="border-b hover:bg-gray-50" onClick={() => router.push(`/main/profiling/households/${household.household_number}`)}>
                  <td className="py-2 text-center">{household.household_number}</td>
                  <td className="py-2 cursor-pointer">
                    {household.given_name} {household.middle_name} {household.family_name} {household.extension}
                  </td>
                  <td className="py-2">{household.sitio_purok}</td>
                  <td className="py-2 text-center">
                    <p
                      className={`${household.is_business_owner === "Yes"
                        ? "bg-[#007F73] text-white"
                        : "bg-[#A4A4A4]"
                        } rounded-[4px] py-1 w-20 inline-block`}
                    >
                      {household.is_business_owner}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {addResidentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[80%] p-4 rounded-[10px] shadow-lg">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <Image src={'/svg/people-resident.svg'} alt="people" width={100} height={100} className="w-6 h-6" />
                <button onClick={() => { setAddResidentModal(false); }}>
                  <Image src={'/svg/x-logo.svg'} alt="close" width={100} height={100} className="w-5 h-5" />
                </button>
              </div>
              <span>Add household head&apos;s info</span>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="">Family Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("family_name", { required: true })}

                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Middle Name</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("middle_name", { required: false })}

                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">First Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("given_name", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Suffix</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("extension", { required: false })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Household Number<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("household_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Block Number<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("block_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Lot Number<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("lot_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Gender<span className="text-red-500">*</span></label>
                  <div>
                    <>
                      <input
                        type="radio"
                        {...register("gender", { required: true })}
                        value="Female"
                        className="border-[#969696]"
                      />
                      Female
                      <input
                        type="radio"
                        {...register("gender", { required: true })}
                        value="Male"
                        className="border-[#969696]"
                      />
                      Male
                    </>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Relationship<span className="text-red-500">*</span></label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("relationship", {
                      validate: (value) => (!value && !residentData.relationship) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={residentData.relationship || ""}
                    onChange={(e) => {
                      const value = e.target.value as "" | "Husband" | "Wife" | "Son" | "Daughter" | "Grandmother" | "Grandfather" | "Son in law" | "Daughter in law" | "Others";
                      setResidentData((prev) => ({ ...prev, relationship: value, other_relationship: value === "Others" ? "" : prev.other_relationship }));
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
                    <label htmlFor="">Specify Other Relationship<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px]"
                      {...register("other_relationship", {
                        validate: (value) => (!value && !residentData.other_relationship) ? "This field is required" : true // Validate only if there's no existing data
                      })}
                      value={residentData.other_relationship || ""}
                      onChange={(e) => setResidentData((prev) => ({ ...prev, other_relationship: e.target.value }))}
                      required={residentData.other_relationship === "Others"}
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <label htmlFor="">Civil Status<span className="text-red-500">*</span></label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("civil_status", { required: true })}
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
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Sitio<span className="text-red-500">*</span></label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
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
                  <label htmlFor="">Barangay<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("barangay", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">City<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("city", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Birthplace<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("birthplace", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Registered Voter?<span className="text-red-500">*</span></label>
                  <div>
                    <>
                      <input
                        type="radio"
                        {...register("is_registered_voter", { required: true })}
                        value="Yes"
                        className="border-[#969696]"
                      />
                      Yes
                      <input
                        type="radio"
                        {...register("is_registered_voter", { required: true })}
                        value="No"
                        className="border-[#969696]"

                      />
                      No
                    </>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Religion<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("religion", { required: true })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Highest Educational Attainment</label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("highest_educational_attainment", { required: false })}
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
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Monthly Income (PHP)</label>
                  <input
                    type="number"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("monthly_income", { required: false })}

                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Sectoral<span className="text-red-500">*</span></label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("sectoral", { required: true })}
                    onChange={(e) => {
                      const value = e.target.value as "" | "Others" | "LGBT" | "PWD" | "Senior Citizen" | "Solo Parent" | "Habal - Habal" | "Erpat";
                      setResidentData((prev) => ({
                        ...prev,
                        sectoral: value,
                        other_sectoral: value === "Others" ? "" : prev.other_sectoral
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
                    <label htmlFor="">Specify Other Sectoral<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px]"
                      {...register("other_sectoral", {
                        validate: (value) => (!value && !residentData.other_sectoral) ? "This field is required" : true
                      })}
                      required={residentData.sectoral === "Others"}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center font-semibold pt-16">
                <button type="submit" className={`bg-[#338A80] text-white rounded-[5px] py-1 w-[50%]`}>
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
