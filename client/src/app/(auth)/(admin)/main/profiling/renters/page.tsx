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
import debounce from "lodash.debounce";
import SweetAlert from "@/components/SweetAlert";
import { formatDate } from "@/components/formatDate";

const Renters = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Renter>();

  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [rentOwner, setRentOwner] = useState<RentOwner[]>([]);
  const [originalRenters, setOriginalRenters] = React.useState<Renter[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Renter;
    direction: "ascending" | "descending";
  } | null>(null);

  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);

  const [isInfoModal, setIsInfoModal] = useState(false);
  const [addRenterModal, setAddRenterModal] = useState(false);
  const [editRenterModal, setEditRenterModal] = useState(false);

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
    status: "Active",
  });

  useEffect(() => {
    const fetchRenterOwner = async () => {
      try {
        const response = await api.get("/api/rent-owner");
        setRentOwner(response.data);
      } catch (error) {
        console.error("Error fetching renters:", error);
      }
    };
    fetchRenterOwner();
  }, []);

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/renter");
        setOriginalRenters(response.data);
        setRenters(response.data);
      } catch (error) {
        console.error("Error fetching renters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenters();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        status: "Active",
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
    const confirm = await SweetAlert.showConfirm('Are you sure all the information are correct?')

    if (confirm) {
      try {
        const rentNumber = Number(renterData.rent_number);

        const owner = rentOwner.find(
          (ro) => Number(ro.rent_number) === rentNumber
        );
        if (!owner) {
          console.error(`No owner found for rent number: ${rentNumber}`);
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

        const endpoint = selectedRenter?.renter_id
          ? "/api/update-renter"
          : "/api/insert-renter";

        const method = selectedRenter?.renter_id ? "put" : "post";

        const response = await api[method](endpoint, formData);

        await SweetAlert.showSuccess(
          addRenterModal ? 'Renter Added Successfully' : 'Renter Edited Successfully'
        ).then(() => {
          window.location.reload();
        });
        setAddRenterModal(false);
        setEditRenterModal(false);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  const handleArchiveResident = async (renter: Renter) => {
    try {
      const response = await api.put("/api/archive-renter", {
        renter_id: renter?.renter_id,
      });

      if (response.status === 200) {
        await SweetAlert.showSuccess(
          'Renter archived successfully!'
        ).then(() => {
          window.location.reload();
        });
      } else {
        alert("Failed to archive renter.");
      }
    } catch (error) {
      console.error("Error archiving renter:", error);
      alert("An error occurred while archiving the renter.");
    }
  };

  const HEADERS = [
    { label: "ID", key: "renter_id" },
    { label: "RENTER NAME", key: "given_name" },
    { label: "RENT OWNER", key: "rent_number" },
    { label: "CIVIL STATUS", key: "civil_status" },
    { label: "SEX", key: "gender" },
    { label: "BIRTHDATE", key: "birthdate" },
    { label: "YEARS OF STAY", key: "months_year_of_stay" },
    { label: "WORK", key: "work" },
  ];

  const handleSearch = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setRenters(originalRenters);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);

      const response = await api.get(
        `/api/renter/search?term=${searchTerm.trim()}`
      );

      if (response.data.length === 0) {
        setRenters([]);
      } else {
        setRenters(response.data);
      }
    } catch (error) {
      console.error("Error searching renter:", error);
      setRenters([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleFilterClick = async (criteria: string, value?: string) => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = {};
      if (criteria === "maleData") params.gender = "Male";
      if (criteria === "femaleData") params.gender = "Female";
      if (criteria === "archivedData") params.status = "Inactive";
      if (criteria === "isBusinessOwner" && value)
        params.is_business_owner = value;

      setRenters([]);

      const response = await api.get("/api/filter-renter", {
        params,
      });

      if (response.data.length === 0) {
        setRenters(originalRenters);
      } else {
        setRenters(response.data);
      }

      setIsSearching(true);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setRenters([]);
      setIsSearching(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof Renter | null = null) => {
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

  const sortedRenters = React.useMemo(() => {
    if (!sortConfig) return renters;

    const sortedData = [...renters];
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig?.key as keyof Renter] || "";
      const bValue = b[sortConfig?.key as keyof Renter] || "";

      if (aValue < bValue)
        return sortConfig?.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig?.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return sortedData;
  }, [renters, sortConfig]);

  const resetData = () => {
    window.location.reload();
  };

  return (
    <div className="h-full w-full" onClick={() => handleSort(null)}>
      <CardGrid cards={dashboardCards} />
      <ProfilingSearchBar
        onSearch={handleSearch}
        setAddResidentModal={() => setAddRenterModal(true)}
        handleFilterClick={handleFilterClick}
        resetData={resetData}
      />

      <div className="h-[69%] px-16 pb-2" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white h-full rounded-[10px] overflow-y-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm">
                {HEADERS.map(({ label, key }) => (
                  <th
                    key={key}
                    className="py-4 px-5 text-left font-semibold text-[16px] cursor-pointer"
                    onClick={() => handleSort(key as keyof Renter)}
                  >
                    {label}
                    {sortConfig?.key === key && (
                      <span>
                        {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                      </span>
                    )}
                  </th>
                ))}
                <th className="py-1 font-semibold px-5"></th>
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
            ) : (
              <tbody>
                {sortedRenters.length > 0 ? (
                  sortedRenters.map((renter) => {
                    const owner = rentOwner.find(
                      (ro) => ro.rent_number === renter.rent_number
                    );
                    return (
                      <tr
                        key={renter.renter_id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => onRenterClick(renter)}
                      >
                        <td className="py-2 px-5 text-left">
                          {renter.renter_id}
                        </td>
                        <td className="py-2 px-5 text-left">
                          {renter.given_name} {renter.middle_name}{" "}
                          {renter.family_name} {renter.extension}
                        </td>
                        <td className="py-2 px-5 text-left">
                          {owner ? owner.rent_owner : ""}
                        </td>
                        <td className="py-2 px-5 text-left">
                          {renter.civil_status}
                        </td>
                        <td className="py-2 px-5 text-left">{renter.gender}</td>
                        <td className="py-2 px-5 text-left">
                          {renter.birthdate}
                        </td>
                        <td className="py-2 px-5 text-left">
                          {renter.months_year_of_stay}
                        </td>
                        <td className="py-2 px-5 text-left">{renter.work}</td>
                        <td className="text-center py-2 flex items-center">
                          {session?.user.role === "Admin" && (
                            <>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const confirm = await SweetAlert.showConfirm('Are you sure you want to edit this member?');
                                  if (confirm) {
                                    onEditRenter(renter);
                                  }
                                }}>
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
                                  const confirm = await SweetAlert.showConfirm('Are you sure you want to archive this member?');
                                  if (confirm) {
                                    handleArchiveResident(renter);
                                  }
                                }}>
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
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-2 px-5 text-center">
                      No renters found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {(addRenterModal || editRenterModal || isInfoModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[60%] p-14 rounded-[10px] shadow-lg relative text-[14px]">
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
                    setAddRenterModal(false);
                    setEditRenterModal(false);
                    setIsInfoModal(false);
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
              <span className="text-[24px] font-semibold pt-3">Renter Information</span>
              <span className="text-[#545454]">
                {addRenterModal ? "Add" : editRenterModal ? "Update" : "View"}{" "}
                renter&apos;s info
              </span>
              {editRenterModal ||
                (isInfoModal && (
                  <span className="text-[#545454]">Rent number: {selectedRenter?.rent_number}</span>
                ))}
              {editRenterModal ||
                (isInfoModal && (
                  <span className="text-[#545454]">Sitio: {selectedRenter?.sitio_purok}</span>
                ))}
              {editRenterModal ||
                (isInfoModal && (
                  <span className="text-[#545454]">
                    Rent Owner:{" "}
                    {rentOwner.find(
                      (owner) =>
                        owner.rent_number === selectedRenter?.rent_number
                    )?.rent_owner || "N/A"}
                  </span>
                ))}
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)} className="pt-5 text-[14px]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="">
                    Family Name
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.family_name || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("family_name", {
                        validate: (value) =>
                          !isInfoModal && !value && !renterData.family_name
                            ? "This field is required"
                            : true,
                      })}
                      value={renterData.family_name || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Middle Name</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.middle_name || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("middle_name", { required: false })}
                      value={renterData.middle_name || ""}
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
                    <span className="font-semibold text-[18px]">{renterData.given_name || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("given_name", {
                        validate: (value) =>
                          !value && !renterData.given_name
                            ? "This field is required"
                            : true, // Validate only if there's no existing data
                      })}
                      value={renterData.given_name || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Suffix</label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.extension || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("extension", { required: false })}
                      value={renterData.extension || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Rent Owner
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{rentOwner.find((owner) => owner.rent_number === renterData.rent_number)?.rent_owner || "N/A"}</span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("rent_number", {
                        validate: (value) =>
                          !value && !renterData.rent_number
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
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
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Gender
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  <div>
                    {isInfoModal ? (
                      <span className="font-semibold text-[18px]">{renterData.gender || "N/A"}</span>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) =>
                              !value && !renterData.gender
                                ? "This field is required"
                                : true,
                          })}
                          value="Female"
                          className="border-[#969696] mx-3 w-4 h-4 cursor-pointer"
                          checked={renterData.gender === "Female"}
                          onChange={handleChange}
                          disabled={isInfoModal}
                        />
                        <span className="mr-3">Female</span>
                        <input
                          type="radio"
                          {...register("gender", {
                            validate: (value) =>
                              !value && !renterData.gender
                                ? "This field is required"
                                : true,
                          })}
                          value="Male"
                          className="border-[#969696] mr-3 w-4 h-4 cursor-pointer"
                          checked={renterData.gender === "Male"}
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
                    Civil Status
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.civil_status || "N/A"}</span>
                  ) : (
                    <select
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("civil_status", {
                        validate: (value) =>
                          !value && !renterData.civil_status
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
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
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Birthdate
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{formatDate(renterData.birthdate) || "N/A"}</span>
                  ) : (
                    <input
                      type="date"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("birthdate", {
                        validate: (value) =>
                          !value && !renterData.birthdate
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={renterData.birthdate || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Months or Years of Stay
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.months_year_of_stay || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("months_year_of_stay", {
                        validate: (value) =>
                          !value && !renterData.months_year_of_stay
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={renterData.months_year_of_stay || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">
                    Work
                    {!isInfoModal && <span className="text-red-500">*</span>}
                  </label>
                  {isInfoModal ? (
                    <span className="font-semibold text-[18px]">{renterData.work || "N/A"}</span>
                  ) : (
                    <input
                      type="text"
                      className="border-[#969696] border-[1px] rounded-[5px] py-1 px-2"
                      {...register("work", {
                        validate: (value) =>
                          !value && !renterData.work
                            ? "This field is required"
                            : true, // Ensure validation only when the field is empty
                      })}
                      value={renterData.work || ""}
                      onChange={handleChange}
                      disabled={isInfoModal}
                    />
                  )}
                </div>
              </div>
              {isInfoModal ? null : (
                <div className="flex justify-center items-center font-semibold pt-16">
                  <button
                    type="submit"
                    className={`bg-[#338A80] text-white rounded-[5px] py-2 w-[40%] text-[18px] ${isInfoModal ? "hidden" : ""
                      }`}
                  >
                    {addRenterModal ? "Add" : "Update"}
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

export default Renters;
