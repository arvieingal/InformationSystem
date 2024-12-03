"use client";
import React, { useEffect, useState } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import ProfilingSearchBar from "@/components/ProfilingSearchBar";
import Image from "next/image";
import { dummyRenters } from "@/constants/tableDummyData";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Renter, RentOwner } from "@/types/profilingTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

const Renters = () => {
  const router = useRouter()
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Renter>();

  const [rentOwner, setRentOwner] = useState<RentOwner[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);

  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);

  const [isInfoModal, setIsInfoModal] = useState(false)
  const [addRenterModal, setAddRenterModal] = useState(false)
  const [editRenterModal, setEditRenterModal] = useState(false)

  const [renterData, setRenterData] = useState<Renter>({
    renter_id: null,
    rent_number: 0,
    family_name: "",
    given_name: "",
    middle_name: "",
    extension: "",
    civil_status: "",
    gender: "",
    birthdate: "",
    months_year_of_stay: 0,
    work: "",
    sitio_purok: "",
    status: "Active"
  })

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const response = await api.get("/api/rent-owner");
        setRentOwner(response.data);
      } catch (error) {
        console.error("Error fetching renters:", error);
      }
    };
    fetchRenters();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRenterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (addRenterModal) {
      setRenterData({
        renter_id: null,
        rent_number: 0,
        family_name: "",
        given_name: "",
        middle_name: "",
        extension: "",
        civil_status: "",
        gender: "",
        birthdate: "",
        months_year_of_stay: 0,
        work: "",
        sitio_purok: "",
        status: "Active"
      });
    } else if (selectedRenter) {
      setRenterData({
        ...renterData,
        ...selectedRenter,
      });
    }
  }, [editRenterModal, isInfoModal, addRenterModal, selectedRenter]);

  const onEditRenter = (renter: Renter) => {
    setSelectedRenter(renter);
    setEditRenterModal(true);
  };

  const onRenterClick = (renter: Renter) => {
    setSelectedRenter(renter);
    setIsInfoModal(true);
  };

  const onSubmit: SubmitHandler<Renter> = async (data) => {
    try {
      console.log("Current rent number:", renterData.rent_number);
      console.log("Rent Owner Data:", rentOwner);

      const rentNumber = Number(renterData.rent_number);

      const owner = rentOwner.find(ro => Number(ro.rent_number) === rentNumber);
      if (!owner) {
        console.error(`No owner found for rent number: ${rentNumber}`);
      } else {
        console.log(`Owner found: ${owner.rent_owner}, Sitio: ${owner.sitio_purok}`);
      }

      const formData: Renter = editRenterModal
        ? {
          ...renterData,
          renter_id: selectedRenter?.renter_id || null,
          status: "Active",
        }
        : {
          ...data,
          rent_number: rentNumber,
          months_year_of_stay: Number(renterData.months_year_of_stay),
          sitio_purok: owner?.sitio_purok || "",
          status: "Active",
        };

      console.log("Submitting Form Data:", formData);

      const endpoint = selectedRenter?.renter_id
        ? '/api/update-renter'
        : '/api/insert-renter';

      const method = selectedRenter?.renter_id ? 'put' : 'post';

      const response = await api[method](endpoint, formData);

      console.log("Submission success:", response.data);
      setAddRenterModal(false);
      setEditRenterModal(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleArchiveResident = async () => {
    try {
      const response = await api.put('/api/archive-renter', { renter_id: selectedRenter?.renter_id });

      if (response.status === 200) {
        alert('Renter archived successfully!');
      } else {
        alert('Failed to archive renter.');
      }
    } catch (error) {
      console.error('Error archiving renter:', error);
      alert('An error occurred while archiving the renter.');
    }
  };

  const HEADER = [
    "ID", "RENTER NAME", "RENT OWNER", "CIVIL STATUS", "SEX", "BIRTHDATE", "MONTHS/YEARS OF\nSTAY", "WORK"
  ]

  const onSearch = () => { };

  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar onSearch={onSearch} />

      <button className="bg-white absolute bottom-2 right-0 rounded-[5px] px-4 py-2" onClick={() => setAddRenterModal(true)}>
        <div className="flex justify-center items-center font-semibold"><Image src={'/svg/add-household.svg'} alt="add-household" width={100} height={100} className="w-5 h-5 mr-3" />Add</div>
      </button>

      <div className="h-[66%] px-64 pb-2">
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm">
                {HEADER.map((item, index) => (
                  <th key={index} className="py-1 font-semibold px-3 whitespace-pre-wrap text-center">{item}</th>
                ))}
                <th className="py-1 font-semibold px-3"></th>
              </tr>
            </thead>
            <tbody>
              {renters.map((renter) => {
                const owner = rentOwner.find(ro => ro.rent_number === renter.rent_number);
                return (
                  <tr key={renter.renter_id} className="border-b hover:bg-gray-50" onClick={() => onRenterClick(renter)}>
                    <td className="py-2 px-3 text-center">{renter.renter_id}</td>
                    <td className="py-2 px-3 text-center">{renter.given_name} {renter.middle_name} {renter.family_name} {renter.extension}</td>
                    <td className="py-2 px-3 text-center">{owner ? owner.rent_owner : ''}</td>
                    <td className="py-2 px-3 text-center">{renter.civil_status}</td>
                    <td className="py-2 px-3 text-center">{renter.gender}</td>
                    <td className="py-2 px-3 text-center">{renter.birthdate}</td>
                    <td className="py-2 px-3 text-center">{renter.months_year_of_stay}</td>
                    <td className="py-2 px-3 text-center">{renter.work}</td>
                    <td className="text-center py-2 flex items-center">
                      {session?.user.role === "Admin" && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); onEditRenter(renter) }}>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {(addRenterModal || editRenterModal || isInfoModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[80%] p-4 rounded-[10px] shadow-lg">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <Image src={'/svg/people-resident.svg'} alt="people" width={100} height={100} className="w-6 h-6" />
                <button onClick={() => { setAddRenterModal(false); setEditRenterModal(false); setIsInfoModal(false); }}>
                  <Image src={'/svg/x-logo.svg'} alt="close" width={100} height={100} className="w-5 h-5" />
                </button>
              </div>
              <span>Renter Information</span>
              <span>{addRenterModal ? "Add" : editRenterModal ? "Update" : "View"} renter's info</span>
              {editRenterModal || isInfoModal && <span>Rent number: {selectedRenter?.rent_number}</span>}
              {editRenterModal || isInfoModal && <span>Sitio: {selectedRenter?.sitio_purok}</span>}
              {editRenterModal || isInfoModal && (
                <span>
                  Rent Owner: {
                    rentOwner.find(owner => owner.rent_number === selectedRenter?.rent_number)?.rent_owner || "N/A"
                  }
                </span>
              )}
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="">Family Name{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("family_name", {
                      validate: (value) => !isInfoModal && (!value && !renterData.family_name) ? "This field is required" : true
                    })}
                    value={renterData.family_name || ""}
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
                    value={renterData.middle_name || ""}
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
                      validate: (value) => (!value && !renterData.given_name) ? "This field is required" : true // Validate only if there's no existing data
                    })}
                    value={renterData.given_name || ""}
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
                    value={renterData.extension || ""}
                    onChange={handleChange}
                    disabled={isInfoModal}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Rent Owner{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("rent_number", {
                      validate: (value) => (!value && !renterData.rent_number) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={renterData.rent_number || ""}
                    onChange={handleChange}
                    disabled={isInfoModal}
                  >
                    <option value=""></option>
                    {rentOwner.map((owner) => (
                      <option key={owner.rent_number} value={owner.rent_number}>
                        {owner.rent_owner}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Gender{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <div>
                    {isInfoModal ? (
                      <span>{renterData.gender || "N/A"}</span>
                    ) : (
                      <>
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) => (!value && !renterData.gender) ? "This field is required" : true
                          })}
                          value="Female"
                          className="border-[#969696]"
                          checked={renterData.gender === "Female"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        Female
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) => (!value && !renterData.gender) ? "This field is required" : true
                          })}
                          value="Male"
                          className="border-[#969696]"
                          checked={renterData.gender === "Male"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        Male
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Civil Status{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <select
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("civil_status", {
                      validate: (value) => (!value && !renterData.civil_status) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={renterData.civil_status || ""}
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
                      validate: (value) => (!value && !renterData.birthdate) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={renterData.birthdate || ""}
                    onChange={handleChange}
                    disabled={isInfoModal}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Months or Years of Stay{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("months_year_of_stay", {
                      validate: (value) => (!value && !renterData.months_year_of_stay) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={renterData.months_year_of_stay || ""}
                    onChange={handleChange}
                    disabled={isInfoModal}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Work{!isInfoModal && <span className="text-red-500">*</span>}</label>
                  <input
                    type="text"
                    className="border-[#969696] border-[1px] rounded-[5px]"
                    {...register("work", {
                      validate: (value) => (!value && !renterData.work) ? "This field is required" : true // Ensure validation only when the field is empty
                    })}
                    value={renterData.work || ""}
                    onChange={handleChange}
                    disabled={isInfoModal}
                  />
                </div>
              </div>
              {isInfoModal ? null :
                <div className="flex justify-center items-center font-semibold pt-16">
                  <button type="submit" className={`bg-[#338A80] text-white rounded-[5px] py-1 w-[50%] ${isInfoModal ? "hidden" : ""}`}>
                    {addRenterModal ? 'Add' : 'Update'}
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

export default Renters;
