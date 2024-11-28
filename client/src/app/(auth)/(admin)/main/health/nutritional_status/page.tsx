"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/PersonModal";
import SweetAlert from "@/components/SweetAlert";
import SearchBar from "@/components/SearchBar";
import ChildTable from "@/components/ChildTable";
import Pagination from "@/components/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Child as ChildTableChild } from "@/components/ChildTable";
import { formatDate } from "@/components/formatDate";
import api from "@/lib/axios";

export interface Resident {
  resident_id: number;
  family_name: string;
  given_name: string;
  middle_name: string;
  extension: string;
  gender: string;
  place_of_birth: string;
  birthdate: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  age: number;
  children: Child[];
}
export interface Child {
  resident_id: number;
  full_name: string;
  sex: string;
  birthdate: string;
  age: string;
  address: string;
  place_of_birth: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  child_id: number;
  height_at_birth: string;
  weight_at_birth: string;
  height_cm: string;
  weight_kg: string;
  nutritional_status: string;
  heightAgeZ: string;
  weightAgeZ: string;
  weight_for_length: string;
  measurement_date: string;
  status: string;
}

interface ChildFormData {
  resident_id: number;
  full_name: string;
  sex: string;
  birthdate: string;
  age: string;
  address: string;
  place_of_birth: string;
  sitio_purok: string;
  barangay: string;
  city: string;
  child_id: number;
  height_at_birth: string;
  weight_at_birth: string;
  height_cm: string;
  weight_kg: string;
  nutritional_status: string;
  heightAgeZ: string;
  weightAgeZ: string;
  weight_for_length: string;
  measurement_date: string;
  status: string;
}


const calculateNutritionalStatus = (
  age: number,
  weight: number,
  height: number
): string => {
  if (height < 20) {
    return "Error: Height value seems incorrect. Please verify.";
  }

  // Placeholder logic for WFL-Z calculation
  const wflZ = (weight / height) - 1; // Simplified example, replace with actual calculation

  if (wflZ < -2) {
    return "Underweight";
  } else if (wflZ <= 1) {
    return "Normal";
  } else if (wflZ <= 2) {
    return "Overweight";
  } else {
    return "Obese";
  }
};
const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<ChildFormData>({
    resident_id: 0,
    full_name: "",
    sex: "",
    birthdate: "",
    age: "",
    address: "",
    place_of_birth: "",
    sitio_purok: "",
    barangay: "",
    city: "",
    child_id: 0,
    height_at_birth: "",
    weight_at_birth: "",
    height_cm: "",
    weight_kg: "",
    nutritional_status: "",
    heightAgeZ: "",
    weightAgeZ: "",
    weight_for_length: "",
    measurement_date: new Date().toISOString().split("T")[0],
    status: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [originalChildren, setOriginalChildren] = useState<Child[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ChildTableChild;
    direction: string;
  } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const [error, setError] = useState<string | null>(null);

  const addModalRef = useRef<HTMLDivElement>(null);

  const [archivedChildren, setArchivedChildren] = useState<number[]>([]);

  const [filterCriteria, setFilterCriteria] = useState({
    age: "",
    gender: "",
    birthdate: "",
    height: "",
    weight: "",
    nutritionalStatus: "",
    archived: false,
  });

  const [residents, setResidents] = useState<Child | null>(null);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));

    const filteredChildren = originalChildren.filter((child) => {
      switch (key) {
        case "age":
          return child.age.toString() === value;
        case "gender":
          return child.sex.toLowerCase() === value.toString().toLowerCase();
        case "birthdate":
          return formatDate(child.birthdate) === value;
        case "height":
          return child.height_cm.toString() === value;
        case "weight":
          return child.weight_kg.toString() === value;
        case "nutritionalStatus":
          return child.nutritional_status.toLowerCase() === value.toString().toLowerCase();
        case "archived":
          return child.status.toLowerCase() === (value ? "archive" : "active");
        default:
          return true;
      }
    });

    setChildren(filteredChildren);
  };

  const handleClickOutsideAddModal = (event: MouseEvent) => {
    if (
      addModalRef.current &&
      !addModalRef.current.contains(event.target as Node)
    ) {
      setIsAddModalOpen(false);
    }
  };

  useEffect(() => {
    if (isAddModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideAddModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideAddModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAddModal);
    };
  }, [isAddModalOpen]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/residents");
        if (response.ok) {
          const data: Child[] = await response.json();
          setOriginalChildren(data);
          setChildren(data);
        } else {
          throw new Error("Failed to fetch residents data.");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchResidents();
  }, []);

  console.log(residents, "Resident Data");



  const fetchChildById = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/children/${id}`);
      const data: Child = await response.json();

      setSelectedChild(data as any);
    } catch (error) {
      console.error("Error fetching child by ID:", error);
    }
  };


  // useEffect(() => {

  //   fetchChildById(selectedChild.child_id);

  // })

  const handleDateChange = (date: Date | null) => {
    setSelectedChild({
      ...selectedChild,
      birthdate: date ? formatDate(date.toISOString()) : "",
    });
  };

  const handleRowClick = (child: Child) => {
    setSelectedChild({
      resident_id: child.resident_id,
      full_name: child.full_name,
      sex: child.sex,
      birthdate: child.birthdate,
      age: child.age,
      address: child.address,
      place_of_birth: child.place_of_birth,
      sitio_purok: child.sitio_purok,
      barangay: child.barangay,
      city: child.city,
      child_id: child.child_id,
      height_at_birth: child.height_at_birth,
      weight_at_birth: child.weight_at_birth,
      height_cm: child.height_cm,
      weight_kg: child.weight_kg,
      nutritional_status: child.nutritional_status,
      heightAgeZ: child.heightAgeZ,
      weightAgeZ: child.weightAgeZ,
      weight_for_length: child.weight_for_length,
      measurement_date: child.measurement_date,
      status: child.status,
    });
    setIsModalOpen(true);
  };
  async function handleEditClick(child: ChildTableChild): Promise<void> {
    if (!child) {
      console.error("Child object is undefined");
      return;
    }

    const confirmEdit = await SweetAlert.showConfirm(
      `<p> Are you sure you want to edit this child with ID: <span class="font-bold">${child.child_id}</span>?</p>`
    );

    if (confirmEdit) {
      setSelectedChild({
        resident_id: child.resident_id,
        full_name: child.full_name || "",
        sex: child.sex,
        birthdate: child.birthdate,
        age: child.age ? child.age.toString() : "",
        address: child.address || "",
        place_of_birth: child.place_of_birth || "",
        sitio_purok: child.sitio_purok || "",
        barangay: child.barangay || "",
        city: child.city || "",
        child_id: child.child_id,
        height_at_birth: child.height_at_birth
          ? child.height_at_birth.toString()
          : "",
        weight_at_birth: child.weight_at_birth
          ? child.weight_at_birth.toString()
          : "",
        height_cm: child.height_cm ? child.height_cm.toString() : "",
        weight_kg: child.weight_kg ? child.weight_kg.toString() : "",
        nutritional_status: child.nutritional_status || "",
        heightAgeZ: child.heightAtAgeZ ? child.heightAtAgeZ.toString() : "",
        weightAgeZ: child.weightAtAgeZ ? child.weightAtAgeZ.toString() : "",
        weight_for_length: child.weight_for_length ? child.weight_for_length.toString() : "",
        measurement_date: child.measurement_date || "",
        status: child.status || "",
      });
      setIsEditModalOpen(true);
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
      setIsEditModalOpen(true);
      setIsAddModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen || isEditModalOpen || isAddModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, isEditModalOpen, isAddModalOpen]);

  function handleSort(key: keyof ChildTableChild) {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  }

  const sortedChildren = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...children].sort((a, b) => {
        const key = sortConfig.key as keyof typeof a;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) {
          return 0; // Handle undefined values by treating them as equal
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return children;
  }, [children, sortConfig]);

  const paginatedChildren = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedChildren.slice(startIndex, endIndex);
  }, [sortedChildren, currentPage]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredChildren = originalChildren.filter((child) => {
      const fullName = child.full_name.toLowerCase();
      return (
        child.resident_id.toString().includes(lowerCaseQuery) ||
        fullName.includes(lowerCaseQuery) ||
        child.age.toString().includes(lowerCaseQuery) ||
        child.sex.toLowerCase().includes(lowerCaseQuery) ||
        child.birthdate.toLowerCase().includes(lowerCaseQuery) ||
        child.height_cm.toString().includes(lowerCaseQuery) ||
        child.weight_kg.toString().includes(lowerCaseQuery) ||
        child.nutritional_status.toLowerCase().includes(lowerCaseQuery) ||
        (child.measurement_date &&
          child.measurement_date.toLowerCase().includes(lowerCaseQuery))
      );
    });
    setChildren(filteredChildren);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddChild = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/add/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedChild),
      });

      if (response.ok) {
        const newChild = await response.json();
        setChildren((prevChildren) => [...prevChildren, newChild]);
        setIsAddModalOpen(false);
      } else {
        console.error("Failed to add new child.");
      }
    } catch (error) {
      console.error("Error adding new child:", error);
    }
  };

  // Update nutritional status when age, weight, or height changes
  useEffect(() => {
    if (
      selectedChild.age &&
      selectedChild.weight_kg &&
      selectedChild.height_cm
    ) {
      const status = calculateNutritionalStatus(
        parseInt(selectedChild.age.toString()),
        parseFloat(selectedChild.weight_kg.toString()),
        parseInt(selectedChild.height_cm.toString())
      );
      setSelectedChild((prev) => ({ ...prev, nutritionalStatus: status }));
    }
  }, [
    selectedChild.age,
    selectedChild.weight_kg,
    selectedChild.height_cm,
  ]);

  // Utility function to safely parse date strings
  const parseDate = (dateString: string) => {
    if (!dateString) return null; // Return null if the date string is empty
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    if (isEditModalOpen && selectedChild.child_id) {
      fetchChildById(selectedChild.child_id);
    }
  }, [isEditModalOpen, selectedChild.child_id]);

  async function handleUpdateChild(p0: any) {
    console.log("Update button clicked!");

    const confirmUpdate = await SweetAlert.showConfirm(
      `<p>Are you sure you want to update the child with ID: <span class="font-bold">${selectedChild.child_id}</span>?</p>`
    );

    if (!confirmUpdate) {
      console.log("Update canceled by user");
      return;
    }

    console.log("Selected Child ID:", selectedChild.child_id);
    console.log("Selected Child Data:", selectedChild);

    // Validation check: Ensure that all required fields are filled before sending
    const weight_kg = parseFloat(selectedChild.weight_kg);
    const height_cm = parseFloat(selectedChild.height_cm);
    const age = parseFloat(selectedChild.age);

    if (
      isNaN(weight_kg) ||
      isNaN(height_cm) ||
      isNaN(age) ||
      selectedChild.child_id === undefined ||
      selectedChild.child_id === null
    ) {
      await SweetAlert.showError(
        "Please fill in all required fields before updating."
      );
      return;
    }

    try {
      console.log("Sending data to backend:", selectedChild);

      // Prepare data for the request and ensure undefined values are converted to null
      const requestData = {
        height_at_birth: selectedChild.height_at_birth ?? null,
        weight_at_birth: selectedChild.weight_at_birth ?? null,
        height_cm: selectedChild.height_cm ?? null,
        weight_kg: selectedChild.weight_kg ?? null,
        heightAgeZ: selectedChild.heightAgeZ ?? null,
        weightAgeZ: selectedChild.weightAgeZ ?? null,
        weight_for_length: selectedChild.weight_for_length ?? null,
        nutritional_status: selectedChild.nutritional_status ?? null,
        measurement_date: selectedChild.measurement_date ?? null,
      };

      const response = await fetch(
        `http://localhost:3001/api/children/${selectedChild.child_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response status:", response.status);

      let responseData = {};
      if (response.status !== 204) {
        try {
          responseData = await response.json();
          console.log("Backend response data:", responseData);
        } catch (error) {
          console.warn("Failed to parse response as JSON", error);
        }
      }

      if (response.ok) {
        let updatedChild;
        try {
          updatedChild = responseData;
          console.log("Updated child data from server:", updatedChild);
        } catch (error) {
          console.warn("Response is not JSON or is empty. Using local data.");
          updatedChild = selectedChild;
        }

        setChildren((prevChildren) => {
          return prevChildren.map((child) =>
            child.child_id === selectedChild.child_id
              ? { ...child, ...updatedChild }
              : child
          );
        });

        setIsEditModalOpen(false);
        await SweetAlert.showSuccess(`<p>Child with ID: <span class="font-bold">${selectedChild.child_id}</span> has been updated successfully.</p>`).then(() => {
          window.location.reload();
        });

      } else {
        console.error(`Failed to update child. Status: ${response.status}`);
        await SweetAlert.showError(
          `<p>Failed to update child with ID: <span class="font-bold">${selectedChild.child_id}</span>. Please try again later.</p>`
        );
      }
    } catch (error) {
      console.error("Error updating child:", error);
      await SweetAlert.showError(
        `<p>An error occurred while updating the child with ID: <span class="font-bold">${selectedChild.child_id}</span>.</p>`
      );
    }
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field: keyof ChildFormData, value: string) => {
    setSelectedChild((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "weight_kg" || field === "height_cm") {
      const weight = parseFloat(value);
      const height = parseInt(selectedChild.height_cm || "0");
      const age = parseInt(selectedChild.age || "0");

      if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
        const status = calculateNutritionalStatus(age, weight, height);
        setSelectedChild((prev) => ({
          ...prev,
          nutritional_status: status,
          weightAgeZ: calculateWeightForAge(age, weight),
          heightAgeZ: calculateLengthForAge(age, height),
          weight_for_length: calculateWeightForLength(weight, height),
        }));
      }
    }
  };

  function calculateWeightForAge(age: number, weight: number): string {
    return weight.toString();
  }

  function calculateLengthForAge(age: number, height: number): string {

    return height.toString();
  }

  function calculateWeightForLength(weight: number, height: number): string {

    return (weight / height).toString();
  }

  function handleArchiveClick(arg0: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="h-full">

      <div className="w-full h-full">
        <ChildTable
          children={paginatedChildren as unknown as ChildTableChild[]}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={(child) => handleEditClick(child as any)}
          onRowClick={(child) => handleRowClick(child as any)}
          onArchive={(child) => handleArchiveClick(child as any)}
        />
      </div>

      {isModalOpen && selectedChild && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="relative border border-black w-full h-full">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div className="w-full p-[2rem] gap-4">
              <div className="w-full flex pt-2">
                <Image
                  src="/svg/health_nutritionalstatus.svg"
                  alt="Update Nutritional Status"
                  width={40}
                  height={50}
                />
                <h2 className="font-semibold text text-[20px]">
                  View Child Information
                </h2>
              </div>
              <p className="italic text-sm pl-[3rem]">
                Barangay Luz, Cebu City
              </p>
              <div className="w-full flex flex-row text pt-[2rem] justify-between">
                <div className="text flex flex-row">
                  <div className="flex flex-row w-full gap-[1rem] items-center">
                    <p className="font-medium">Child's Name:</p>
                    <div className="flex flex-row gap-[1rem]">
                      <div className="border-b border-black p-1">
                        <p className="text-center">{`${selectedChild.full_name}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text px-4 flex flex-row gap-[1rem] items-center">
                  <span className="font-medium">Birthdate:</span>
                  <div className="border-b border-black p-1 text-center">
                    {formatDate(selectedChild.birthdate)}
                  </div>
                </div>
                <p className="text flex flex-row gap-[2rem] items-center">
                  <span className="font-medium">Age:</span>
                  <div className="border-b border-black text-center p-1 flex flex-row gap-2 items-center">
                    {selectedChild.age}
                    <p>months</p>
                  </div>
                </p>
                <p className="text flex flex-row gap-[2rem] items-center">
                  <span className="font-medium">Sex:</span>
                  <div className="border-b border-black w-[12rem] text-center p-1">
                    {selectedChild.sex}
                  </div>
                </p>
              </div>
              <div className="w-full flex-col pe-8 pt-[2rem]">
                <div className="w-full flex flex-col">
                  <p className="w-full font-medium text-[18px]">
                    During Birth Information:
                  </p>
                  <div className="w-full flex flex-row gap-4 pt-2">
                    <p>Birth Height (cm):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.height_at_birth}
                    </p>
                    <p>Birth Weight (kg):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weight_at_birth}
                    </p>
                    <p className="font-medium">Place of Birth:</p>
                    <p className="border-b border-black w-[12rem] h-[2rem] text-center p-1 ">
                      {selectedChild?.place_of_birth || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-col pt-4">
                  <p className="w-full font-medium text-[18px]">
                    Current Information:
                  </p>
                  <div className="w-full flex flex-row gap-4 pt-1">
                    <p>Age in Months:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.age}
                    </p>
                    <p>Height (cm):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.height_cm}
                    </p>
                    <p>Weight (kg):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weight_kg}
                    </p>
                    <p className="font-medium">Measurement Date:</p>
                    <p className="border-b border-black w-[12rem] h-[2rem] text-center p-1 ">
                      {selectedChild.measurement_date
                        ? formatDate(selectedChild.measurement_date)
                        : ""}
                    </p>
                  </div>
                  <div className="w-full flex flex-row gap-[1rem]">
                    <div className="w-full flex flex-row pt-[2rem]">
                      <p className="font-medium">Current Address:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {selectedChild.barangay + ", " + selectedChild.city}
                      </p>
                    </div>
                    <div className="w-full flex flex-row gap-[2rem] pt-[2rem]">
                      <p className="font-medium">Purok/Zone:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {selectedChild.sitio_purok}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col pt-[2rem]">
                <p className="font-medium text-[18px]">Nutritional Status:</p>
                <div className="w-full flex flex-row justify-between">
                  <div className="flex flex-row gap-[.5rem items-center pt-[1rem]">
                    <p>Weight for Age:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weightAgeZ}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p>Length/Height for Age:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.heightAgeZ}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p>Weight for Length/Height:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weight_for_length}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p>Nutritional Status:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.nutritional_status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-center pt-[2rem]">
                <button
                  className="bg-[#007F73] text-white px-[2rem] py-2 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedChild && (
        <Modal onClose={handleEditModalClose}>
          <div ref={modalRef} className="relative text">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={handleEditModalClose}
            >
              &times;
            </button>
          </div>
          <div className="w-full flex flex-col gap-[1rem] border border-black p-[2rem]">
            <div className="w-full flex flex-row gap-[1rem]">
              <Image
                src="/svg/health_nutritionalstatus.svg"
                alt="Update Nutritional Status"
                width={40}
                height={50}
              />
              <div>
                <h2 className="text-lg font-semibold text">
                  Update Child Nutritional Status
                </h2>
                <p className="italic text-sm">Barangay Luz, Cebu City</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p> Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.full_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Sex:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.sex}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Birthdate:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={formatDate(selectedChild.birthdate)}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="font-medium text-[18px]">During Birth:</p>
              <div className="w-full flex gap-[2rem] ">
                <p>Weight (kg):</p>
                <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={
                      selectedChild.weight_at_birth
                        ? selectedChild.weight_at_birth.toString()
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        weight_at_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <p>Height (cm):</p>
                <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={
                      selectedChild.height_at_birth
                        ? selectedChild.height_at_birth.toString()
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        height_at_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-row gap-[10px]">
                  <p>Place of Birth:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem]">
                    <input
                      className="rounded-md p-1 outline-none text-center"
                      type="text"
                      value={selectedChild.place_of_birth}
                      onChange={(e) => {
                        if (selectedChild) {
                          setSelectedChild({
                            ...selectedChild,
                            place_of_birth: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[20px]">
              {/* Current */}
              <div className="w-full">
                <h1 className="text-lg font-semibold">Current :</h1>
                <div className="w-full flex gap-[20px]">
                  <p>Age in Months :</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem] ">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.age}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          age: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Weight (kg):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.weight_kg}
                      onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                    />
                  </div>
                  <p>Height (cm):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.height_cm}
                      onChange={(e) => handleInputChange("height_cm", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row gap-[10px]">
                    <p>Measurement Date:</p>
                    <DatePicker
                      selected={
                        selectedChild.measurement_date
                          ? parseDate(selectedChild.measurement_date)
                          : null
                      }
                      onChange={(date: Date | null) =>
                        setSelectedChild({
                          ...selectedChild,
                          measurement_date: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        })
                      }
                      dateFormat="MMMM d, yyyy"
                      className=" border-b  border-black w-[12rem] h-[2rem] p-1 text-center"
                      customInput={
                        <div className="flex items-center p-1 text-black">
                          <input
                            className="w-full outline-none"
                            value={
                              selectedChild.measurement_date
                                ? formatDate(selectedChild.measurement_date)
                                : ""
                            }
                          />
                          <FaCalendarAlt className="ml-2 text-black" />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Nutritional Status */}
              <div className="w-full">
                <h1 className="text-lg font-semibold">Nutritional Status :</h1>
                <div className="w-full flex gap-[2rem] mt-4">
                  <p>Weight for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.weightAgeZ}
                      onChange={(e) =>
                        handleInputChange("weightAgeZ", e.target.value)
                      }
                    />
                  </div>
                  <p>Length/Height for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.heightAgeZ}
                      onChange={(e) =>
                        handleInputChange("heightAgeZ", e.target.value)
                      }
                    />
                  </div>
                  <p>Weight for Length/Height:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.weight_for_length}
                      onChange={(e) =>
                        handleInputChange("weight_for_length", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full">
                    <p>Nutritional Status:</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[15rem]">
                      <select
                        className="w-full outline-none"
                        value={selectedChild.nutritional_status || ""}
                        onChange={(e) =>
                          setSelectedChild({
                            ...selectedChild,
                            nutritional_status: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Nutritional Status</option>
                        <option value="Normal">Normal</option>
                        <option value="Underweight">Underweight</option>
                        <option value="Overweight">Overweight</option>
                        <option value="Obese">Obese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row gap-[10px] mt-[2rem]">
              <p>Address:</p>
              <input
                className="outline-none border border-gray-300 rounded-md p-1 w-[20rem]"
                type="text"
                value={selectedChild.address}
                onChange={(e) =>
                  setSelectedChild({
                    ...selectedChild,
                    address: e.target.value,
                  })
                }
              />
              <p>Purok/Zone:</p>
              <input
                className="outline-none border border-gray-300 rounded-md p-1 w-[20rem]"
                type="text"
                value={selectedChild.sitio_purok}
                onChange={(e) =>
                  setSelectedChild({
                    ...selectedChild,
                    sitio_purok: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full flex justify-between mt-[2rem] gap-[20px]">
              <div className="w-full border border-[#696969] rounded-md p-2">
                <button
                  className="w-full"
                  onClick={handleEditModalClose} // Close modal on cancel
                >
                  <p className="text-lg font-medium">Cancel</p>
                </button>
              </div>
              <div className="w-full border border-gray-300 bg-[#007F73] rounded-md p-2">
                <button className="w-full" onClick={handleUpdateChild}>
                  <p className="text-white text-lg font-medium">
                    Update Nutritional Status
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NutritionalStatus;
