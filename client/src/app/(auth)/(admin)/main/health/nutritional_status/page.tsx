"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useSession } from "next-auth/react";

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
  height_age_Z: string;
  weight_age_Z: string;
  weight_height_Z: string;
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
  height_age_Z: string;
  weight_age_Z: string;
  weight_height_Z: string;
  measurement_date: string;
  status: string;
}

const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
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
    height_age_Z: "",
    weight_age_Z: "",
    weight_height_Z: "",
    measurement_date: new Date().toISOString().split("T")[0],
    status: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const calculateChildNutritionalStatus = (
    age: number, // age of the child (0-6)
    weight: number, // weight in kilograms
    height: number // height in centimeters
  ): string => {
    if (!weight || !height || age < 0 || age > 6) return "Invalid Data";

    const heightInMeters = height / 100; // Convert cm to meters
    const bmi = weight / (heightInMeters * heightInMeters);

    // Example of classifying based on BMI-for-age percentiles (you need to implement this logic or use a library)
    if (bmi < 14.9) return "Severely Underweight"; // Below the 5th percentile
    if (bmi >= 14.9 && bmi < 17) return "Underweight"; // Between 5th and 85th percentile
    if (bmi >= 17 && bmi < 18.5) return "Normal"; // Between 5th and 85th percentile
    if (bmi >= 18.5 && bmi < 19.5) return "Overweight"; // Between 85th and 95th percentile
    return "Obese"; // Above the 95th percentile
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));

    const filteredChildren = originalChildren.filter((child) => {
      switch (key) {
        case "age":
          const age = parseInt(child.age);
          return age >= 1 && age <= 6 && age.toString() === value;
        case "gender":
          return child.sex.toLowerCase() === value.toString().toLowerCase();
        case "birthdate":
          const birthMonth = new Date(child.birthdate).getMonth() + 1;
          return birthMonth === parseInt(value.toString());
        case "nutritionalStatus":
          return (
            child.nutritional_status.toLowerCase() ===
            value.toString().toLowerCase()
          );
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

  const fetchChildById = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/${id}`);
      const data: Child = await response.json();

      setSelectedChild(data as any);
    } catch (error) {
      console.error("Error fetching child by ID:", error);
    }
  };

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
      height_age_Z: child.height_age_Z,
      weight_age_Z: child.weight_age_Z,
      weight_height_Z: child.weight_height_Z,
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

    if (!session) {
      console.error("User is not logged in");
      await SweetAlert.showError("You must be logged in to edit a child.");
      return;
    }

    const username =
      session.user?.username || session.user?.email || "Unknown User";

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
        height_age_Z: child.height_age_Z ? child.height_age_Z.toString() : "",
        weight_age_Z: child.weight_age_Z ? child.weight_age_Z.toString() : "",
        weight_height_Z: child.weight_height_Z
          ? child.weight_height_Z.toString()
          : "",
        measurement_date: child.measurement_date || "",
        status: child.status || "",
        // updated_by: username, // Include the username
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add/children`, {
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

  useEffect(() => {
    if (
      selectedChild.age &&
      selectedChild.weight_kg &&
      selectedChild.height_cm
    ) {
      const status = calculateChildNutritionalStatus(
        parseInt(selectedChild.age.toString()),
        parseFloat(selectedChild.weight_kg.toString()),
        parseInt(selectedChild.height_cm.toString())
      );
      setSelectedChild((prev) => ({ ...prev, nutritionalStatus: status }));
    }
  }, [selectedChild.age, selectedChild.weight_kg, selectedChild.height_cm]);

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    if (isEditModalOpen && selectedChild.child_id) {
      fetchChildById(selectedChild.child_id);
    }
  }, [isEditModalOpen, selectedChild.child_id]);

  async function handleUpdateChild() {
    // Validation check: Ensure that measurement_date is filled
    if (!selectedChild.measurement_date) {
      setError("Measurement Date is required.");
      return; // Prevent proceeding if date is not set
    }

    const confirmUpdate = await SweetAlert.showConfirm(
      `<p>Are you sure you want to update the child with ID: <span class="font-bold">${selectedChild.child_id}</span>?</p>`
    );

    if (!confirmUpdate) {
      return;
    }

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
      const requestData = {
        height_at_birth: selectedChild.height_at_birth ?? null,
        weight_at_birth: selectedChild.weight_at_birth ?? null,
        height_cm: selectedChild.height_cm ?? null,
        weight_kg: selectedChild.weight_kg ?? null,
        height_age_Z: selectedChild.height_age_Z ?? null,
        weight_age_Z: selectedChild.weight_age_Z ?? null,
        weight_height_Z: selectedChild.weight_height_Z ?? null,
        nutritional_status: selectedChild.nutritional_status ?? null,
        measurement_date: selectedChild.measurement_date ?? null,
        updated_by: session?.user.username || "Unknown User",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/${selectedChild.child_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      let responseData = {};
      if (response.status !== 204) {
        try {
          responseData = await response.json();
        } catch (error) {
          console.warn("Failed to parse response as JSON", error);
        }
      }

      if (response.ok) {
        let updatedChild;
        try {
          updatedChild = responseData;
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
        await SweetAlert.showSuccess(
          `<p>Child with ID: <span class="font-bold">${selectedChild.child_id}</span> has been updated successfully.</p>`
        ).then(() => {
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
      const weight = parseFloat(
        field === "weight_kg" ? value : selectedChild.weight_kg || "0"
      );
      const height = parseFloat(
        field === "height_cm" ? value : selectedChild.height_cm || "0"
      );
      const age = parseFloat(selectedChild.age || "0");

      if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        setError("Please enter valid numbers for age, weight, and height.");
        return;
      }

      if (weight <= 0 || height <= 0) {
        setError("Weight and height must be greater than zero.");
        return;
      }

      setError(null); // Clear previous errors

      const status = calculateChildNutritionalStatus(age, weight, height);
      setSelectedChild((prev) => ({
        ...prev,
        nutritional_status: status,
        weight_age_Z: calculateWeightForAge(age, weight),
        height_age_Z: calculateLengthForAge(age, height),
        weight_height_Z: calculateWeightForLength(weight, height),
      }));
    }
  };

  function calculateWeightForAge(age: number, weight: number): string {
    // Implement the logic to calculate the weight-for-age Z-score or other metric
    return weight.toString(); // Placeholder
  }

  function calculateLengthForAge(age: number, height: number): string {
    // Implement the logic to calculate the length/height-for-age Z-score or other metric
    return height.toString(); // Placeholder
  }

  function calculateWeightForLength(weight: number, height: number): string {
    // Implement the logic to calculate the weight-for-length/height Z-score or other metric
    return (weight / height).toString(); // Placeholder
  }

  async function handleArchiveClick(child: ChildTableChild): Promise<void> {
    try {
      const confirmArchive = await SweetAlert.showConfirm(
        `<p>Are you sure you want to archive the child with ID: <span class="font-bold">${child.child_id}</span>?</p>`
      );

      if (!confirmArchive) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/${child.child_id}/archive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChildren((prevChildren) =>
          prevChildren.filter((c) => c.child_id !== child.child_id)
        );
        await SweetAlert.showSuccess(
          `Child with ID: ${child.child_id} has been archived successfully.`
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to archive child:", response.status, errorText);
        await SweetAlert.showError(
          `Failed to archive child. Server responded with: ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error archiving child:", error);
      await SweetAlert.showError(
        "An error occurred while archiving the child."
      );
    }
  }

  const roleMap: Record<string, string> = {
    Admin: "admin",
    Editor: "editor",
    Viewer: "viewer",
  };

  const userRole = roleMap[session?.user.role || ""] || "viewer"; // Default to "viewer" if role is not found

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem]"></div>

      <div className="w-full mt-[1rem] ">
        <ChildTable
          children={paginatedChildren as unknown as ChildTableChild[]}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={(child) => handleEditClick(child as any)}
          onRowClick={(child) => handleRowClick(child as any)}
          onArchive={(child) => handleArchiveClick(child as any)}
          userRole={userRole as "viewer" | "admin" | "editor"}
        />
      </div>

      {isModalOpen && selectedChild && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="relative border border-black w-full">
            <button
              className="absolute top-[-3.2rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
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
              <div className="w-full flex flex-row text mt-[2rem] justify-between">
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
                  </div>
                </p>
                <p className="text flex flex-row gap-[2rem] items-center">
                  <span className="font-medium">Sex:</span>
                  <div className="border-b border-black w-[12rem] text-center p-1">
                    {selectedChild.sex}
                  </div>
                </p>
              </div>
              <div className="w-full flex-col pe-8 mt-[2rem]">
                <div className="w-full flex flex-col">
                  <p className="w-full font-medium text-[18px]">
                    During Birth Information:
                  </p>
                  <div className="w-full flex flex-row gap-4 mt-2">
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
                <div className="w-full flex flex-col mt-4">
                  <p className="w-full font-medium text-[18px]">
                    Current Information:
                  </p>
                  <div className="w-full flex flex-row gap-4 mt-1">
                    <p>Age:</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem] ">
                      <input
                        className="w-full outline-none flex text-center justify-center"
                        type="number"
                        value={selectedChild.age}
                        readOnly
                      />
                    </div>
                    <p>Weight (kg):</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                      <input
                        className="w-full outline-none"
                        type="text"
                        value={selectedChild.weight_kg}
                        readOnly
                      />
                    </div>
                    <p>Height (cm):</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                      <input
                        className="w-full outline-none"
                        type="text"
                        value={selectedChild.height_cm}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-row gap-[10px]">
                      <p>Measurement Date:</p>
                      <input
                        type="date"
                        value={
                          selectedChild.measurement_date
                            ? selectedChild.measurement_date
                            : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          setSelectedChild({
                            ...selectedChild,
                            measurement_date: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          });
                          setError(null); // Clear error when date is selected
                        }}
                        className={`border-b w-[12rem] h-[2rem] p-1 text-center ${error ? 'border-red-500 border' : 'border-black'}`}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-[1rem]">
                    <div className="w-full flex flex-row mt-[2rem]">
                      <p className="font-medium">Current Address:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {selectedChild.address}
                      </p>
                    </div>
                    <div className="w-full flex flex-row gap-[2rem] mt-[2rem]">
                      <p className="font-medium">Purok/Zone:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {selectedChild.sitio_purok}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col mt-[2rem]">
                <p className="font-medium text-[18px]">Nutritional Status:</p>
                <div className="w-full flex flex-row justify-between">
                  <div className="flex flex-row gap-[.5rem items-center mt-[1rem]">
                    <p>Weight for Age:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weight_age_Z}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p>Length/Height for Age:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.height_age_Z}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p>Weight for Length/Height:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1 ">
                      {selectedChild.weight_height_Z}
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
              <div className="w-full flex items-center justify-center mt-[4rem]">
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
                  <p>Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem] ">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.age}
                      readOnly
                    />
                  </div>
                  <p>Weight (kg):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.weight_kg}
                      onChange={(e) =>
                        handleInputChange("weight_kg", e.target.value)
                      }
                    />
                  </div>
                  <p>Height (cm):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.height_cm}
                      onChange={(e) =>
                        handleInputChange("height_cm", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-[10px]">
                    <p>Measurement Date:</p>
                    <input
                      type="date"
                      value={
                        selectedChild.measurement_date
                          ? selectedChild.measurement_date
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        setSelectedChild({
                          ...selectedChild,
                          measurement_date: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        });
                        setError(null); // Clear error when date is selected
                      }}
                      className={`border-b w-[12rem] h-[2rem] p-1 text-center ${error ? 'border-red-500 border' : 'border-black'}`}
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
                      value={selectedChild.weight_age_Z}
                      onChange={(e) =>
                        handleInputChange("weight_age_Z", e.target.value)
                      }
                    />
                  </div>
                  <p>Length/Height for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.height_age_Z}
                      onChange={(e) =>
                        handleInputChange("height_age_Z", e.target.value)
                      }
                    />
                  </div>
                  <p>Weight for Length/Height:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.weight_height_Z}
                      onChange={(e) =>
                        handleInputChange("weight_height_Z", e.target.value)
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
                        <option value="Severly Underweight">
                          Severly Underweight
                        </option>
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
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default NutritionalStatus;
