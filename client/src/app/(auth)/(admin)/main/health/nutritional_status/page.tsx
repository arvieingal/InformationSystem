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

export interface Child {
  dateOfBirth: string;
  placeOfBirth: string;
  id: number;
  name: string;
  age: number;
  sex: string;
  birthdate: string;
  heightCm: number;
  weightKg: number;
  nutritionalStatus: string;
  address: string;
  purok: string;
  weightAtBirth?: string;
  heightAtBirth?: string;
  currentWeight?: string;
  currentHeight?: string;
  currentAge?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  measurementDate?: string;
}

// Define a type for the form data
interface ChildFormData {
  placeOfBirth: string;
  dateOfBirth: string;
  id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  sex: string;
  birthdate: string;
  weightAtBirth: string;
  heightAtBirth: string;
  currentAge: number;
  currentWeight: string;
  currentHeight: string;
  address: string;
  purok: string;
  suffix?: string;
  nutritionalStatus?: string;
  heightAgeZ?: number;
  weightHeightZ?: number;
  measurementDate?: string;
}

// Function to calculate nutritional status based on age, weight, and height
const calculateNutritionalStatus = (
  age: number,
  weight: number,
  height: number
): string => {
  if (age < 24) {
    if (weight < 10) return "Underweight";
    if (weight > 15 && weight <= 20) return "Overweight";
    if (weight > 20) return "Obese";
  } else {
    if (height < 80) return "Underweight";
    if (height > 100 && height <= 120) return "Overweight";
    if (height > 120) return "Obese";
  }
  return "Normal";
};

const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<ChildFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    sex: "",
    birthdate: "",
    dateOfBirth: "",
    placeOfBirth: "",
    weightAtBirth: "",
    heightAtBirth: "",
    currentAge: 0,
    currentWeight: "",
    currentHeight: "",
    address: "",
    purok: "",
    nutritionalStatus: "",
    heightAgeZ: 0,
    weightHeightZ: 0,
    measurementDate: new Date().toISOString().split("T")[0],
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
    age: '',
    sex: '',
    birthdate: '',
    height: '',
    weight: '',
    nutritionalStatus: '',
    archived: false, // New filter for archived status
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));
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
    const fetchChildren = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/children");
        if (response.ok) {
          const data: Child[] = await response.json();
          const filteredData = data.filter(
            (child) => !archivedChildren.includes(child.id)
          );
          setChildren(filteredData);
          setOriginalChildren(filteredData);
        } else {
          throw new Error("Failed to fetch children data.");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchChildren();
  }, [archivedChildren]);

  const fetchChildById = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/children/${id}`);
      if (response.ok) {
        const data: Child = await response.json();
        setSelectedChild(data as any);
      } else {
        console.error("Child not found.");
      }
    } catch (error) {
      console.error("Error fetching child by ID:", error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedChild({
      ...selectedChild,
      birthdate: date ? date.toISOString().split("T")[0] : "",
    });
  };
  const handleRowClick = (child: Child) => {
    setSelectedChild({
      first_name: child.first_name || "",
      middle_name: child.middle_name || "",
      last_name: child.last_name || "",
      sex: child.sex,
      birthdate: child.birthdate,
      weightAtBirth: child.weightAtBirth || "",
      heightAtBirth: child.heightAtBirth || "",
      currentAge: child.age,
      currentWeight: child.weightKg.toString(),
      currentHeight: child.heightCm.toString(),
      address: child.address || "",
      purok: child.purok || "",
      nutritionalStatus: child.nutritionalStatus || "",
      placeOfBirth: child.placeOfBirth || "",
      dateOfBirth: child.dateOfBirth || "",
      measurementDate: child.measurementDate || "",
    });
    setIsModalOpen(true);
  };

  async function handleEditClick(child: ChildTableChild): Promise<void> {
    const confirmEdit = await SweetAlert.showConfirm(
      ` <p> Are you sure you want to edit this child with ID: <span class="font-bold">${child.id}</span>?</p>`
    );

    if (confirmEdit) {
      setSelectedChild({
        ...child,
        first_name: child.first_name || "",
        middle_name: child.middle_name || "",
        last_name: child.last_name || "",
        sex: child.sex || "",
        birthdate: child.birthdate || "",
        weightAtBirth: child.weightAtBirth || "",
        heightAtBirth: child.heightAtBirth || "",
        currentAge: child.currentAge || 0,
        currentWeight: child.currentWeight || "",
        currentHeight: child.currentHeight || "",
        address: child.address || "",
        purok: child.purok || "",
        dateOfBirth: child.dateOfBirth || "",
        placeOfBirth: child.placeOfBirth || "",
        measurementDate: child.measurementDate || "",
      });
      setIsEditModalOpen(true);
    }
  }

  async function handleArchiveClick(child: Child): Promise<void> {
    const confirmArchive = await SweetAlert.showConfirm(
      `<p>Are you sure you want to archive this child with ID: <span class="font-bold">${child.id}</span>?</p>`
    );
    if (confirmArchive) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/children/${child.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Archive" }),
          }
        );

        if (response.ok) {
          setArchivedChildren((prevArchived) => [...prevArchived, child.id]);
          console.log(`Child with ID: ${child.id} archived.`);
        } else {
          console.error("Failed to archive child.");
        }
      } catch (error) {
        console.error("Error archiving child:", error);
      }
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
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
        const key = sortConfig.key;
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
      const matchesQuery = 
        child.id.toString().includes(lowerCaseQuery) ||
        (child.name && child.name.toLowerCase().includes(lowerCaseQuery)) ||
        child.age.toString().includes(lowerCaseQuery) ||
        child.sex.toLowerCase().includes(lowerCaseQuery) ||
        child.birthdate.includes(lowerCaseQuery) ||
        child.heightCm.toString().includes(lowerCaseQuery) ||
        child.weightKg.toString().includes(lowerCaseQuery) ||
        child.nutritionalStatus.toLowerCase().includes(lowerCaseQuery) ||
        (child.address && child.address.toLowerCase().includes(lowerCaseQuery)) ||
        (child.purok && child.purok.toLowerCase().includes(lowerCaseQuery)) ||
        (child.weightAtBirth && child.weightAtBirth.includes(lowerCaseQuery)) ||
        (child.heightAtBirth && child.heightAtBirth.includes(lowerCaseQuery)) ||
        (child.currentWeight && child.currentWeight.includes(lowerCaseQuery)) ||
        (child.currentHeight && child.currentHeight.includes(lowerCaseQuery));

      const matchesFilter = 
        (!filterCriteria.age || child.age.toString() === filterCriteria.age) &&
        (!filterCriteria.sex || child.sex === filterCriteria.sex) &&
        (!filterCriteria.birthdate || child.birthdate === filterCriteria.birthdate) &&
        (!filterCriteria.height || child.heightCm.toString() === filterCriteria.height) &&
        (!filterCriteria.weight || child.weightKg.toString() === filterCriteria.weight) &&
        (!filterCriteria.nutritionalStatus || child.nutritionalStatus === filterCriteria.nutritionalStatus) &&
        (filterCriteria.archived === archivedChildren.includes(child.id));

      return matchesQuery && matchesFilter;
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
    const { currentAge, currentWeight, currentHeight } = selectedChild;
    if (currentAge && currentWeight && currentHeight) {
      const status = calculateNutritionalStatus(
        currentAge,
        parseFloat(currentWeight),
        parseFloat(currentHeight)
      );
      setSelectedChild((prev) => ({ ...prev, nutritionalStatus: status }));
    }
  }, [
    selectedChild.currentAge,
    selectedChild.currentWeight,
    selectedChild.currentHeight,
  ]);

  // Utility function to safely parse date strings
  const parseDate = (dateString: string) => {
    if (!dateString) return null; // Return null if the date string is empty
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    if (isEditModalOpen && selectedChild.id) {
      fetchChildById(selectedChild.id);
    }
  }, [isEditModalOpen, selectedChild.id]);

  async function handleUpdateChild() {
    try {
      const response = await fetch(`/api/children/${selectedChild.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedChild),
      });

      if (response.ok) {
        const updatedChild = await response.json();
        console.log("Child updated successfully:", updatedChild);
        setIsEditModalOpen(false); // Close the modal after update
        // Optionally, update the children list in the state
        setChildren((prevChildren) =>
          prevChildren.map((child) =>
            child.id === updatedChild.id ? updatedChild : child
          )
        );
      } else {
        console.error("Failed to update child.");
      }
    } catch (error) {
      console.error("Error updating child:", error);
    }
  }

  const handleAddModalOpen = () => {
    // Reset selectedChild to empty values for a new entry
    setSelectedChild({
      first_name: "",
      middle_name: "",
      last_name: "",
      sex: "",
      birthdate: "",
      dateOfBirth: "",
      placeOfBirth: "",
      weightAtBirth: "",
      heightAtBirth: "",
      currentAge: 0,
      currentWeight: "",
      currentHeight: "",
      address: "",
      purok: "",
      nutritionalStatus: "",
      // Ensure all fields are reset to empty or default values
    });
    setIsAddModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] mt-[2rem] "></div>
      <div className="w-full flex flex-row pr-[3rem]  items-center justify-between gap-4 ">
        <div className="w-full pl-2">
          <SearchBar onSearch={handleSearch} />
        </div>
        <Image
          src="/svg/filter.svg"
          alt="Nutritional Status"
          width={30}
          height={50}
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          className="cursor-pointer"
        />
        <button
          className="flex items-center space-x-2 text-blue-500 hover:underline"
          onClick={handleAddModalOpen}
        >
          <Image
            src="/svg/add_nutritional.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
          />
        </button>
        <button
          className="flex items-center space-x-2 text-blue-500 hover:underline"
          onClick={() => router.push("/main/health/nutriReport")}
        >
          <Image
            src="/svg/report.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
          />
        </button>
        {isFilterDropdownOpen && (
          <div className="absolute right-[1rem]  md:mt-[48%] lg:mt-[36%] xl:mt-[28%] 2xl:mt-[20%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('age', 'specificAge')}>
                Filter by Age
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('sex', 'male')}>
                Filter by Sex
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('birthdate', 'specificDate')}>
                Filter by Birthdate
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('height', 'specificHeight')}>
                Filter by Height
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('weight', 'specificWeight')}>
                Filter by Weight
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('nutritionalStatus', 'Normal')}>
                Filter by Nutritional Status
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilterChange('archived', !filterCriteria.archived)}>
                {filterCriteria.archived ? 'Show Active' : 'Show Archived'}
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="w-full mt-[1rem] ">
        <ChildTable
          children={paginatedChildren as ChildTableChild[]}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={handleEditClick}
          onArchive={handleArchiveClick}
          onRowClick={handleRowClick}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(children.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />

      {isModalOpen && selectedChild && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div ref={modalRef} className="relative border border-black w-full">
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
               <h2 className=" font-semibold text text-[20px] ">
                View Full Nutritional Status of the Child
              </h2>
                </div>
                <p className="italic text-sm pl-[3rem]">Barangay Luz, Cebu City</p>
              <div className="w-full flex flex-row  text mt-[2rem]  justify-between ">
                <div className=" text flex flex-row ">
                  <div className="flex flex-row  w-full gap-[1rem]  items-center">
                    <p className="font-medium ">Child's Name:</p>
                    <div className="flex flex-row gap-[1rem]">
                      <div className="border-b border-black   p-1">
                        <p className="text-center">{`${
                          selectedChild.first_name
                        } ${selectedChild.last_name} ${
                          selectedChild.middle_name
                            ? `${selectedChild.middle_name}`
                            : ""
                        } ${
                          selectedChild.suffix ? selectedChild.suffix : ""
                        }`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" text px-4 flex flex-row gap-[1rem] items-center">
                  <span className="font-medium">Birthdate:</span>
                  <div className="border-b border-black   p-1 text-center">
                    {selectedChild.birthdate}
                  </div>
                </div>
                <p className="text flex  flex-row gap-[2rem] items-center">
                  <span className="font-medium">Age:</span>
                  <div className="border-b border-black text-center p-1">
                    {selectedChild.currentAge}
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
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1">
                      {selectedChild.heightAtBirth}
                    </p>
                    <p>Birth Weight (kg):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1">
                      {selectedChild.weightAtBirth}
                    </p>
                    <p className="font-medium ">Date of Birth:</p>
                    <p className="border-b border-black w-[10rem] h-[2rem]   p-1 text-center">
                      {" "}
                      {selectedChild.dateOfBirth}
                    </p>
                    <p className="font-medium ">Place of Birth:</p>
                    <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                      {" "}
                      {selectedChild.placeOfBirth}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-col mt-4">
                  <p className="w-full font-medium text-[18px]">
                    Current Information:
                  </p>
                  <div className="w-full flex flex-row  gap-4 mt-1">
                    <p className="">Age in Months:</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1">
                      {selectedChild.currentAge}
                    </p>
                    <p>Height (cm):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1">
                      {selectedChild.currentHeight}
                    </p>
                    <p>Weight (kg):</p>
                    <p className="border-b border-black w-[4rem] h-[2rem] text-center p-1">
                      {selectedChild.currentWeight}
                    </p>
                    <p className="font-medium ">Measurement Date:</p>
                    <p className="border-b border-black w-[10rem] h-[2rem] p-1 text-center">
                      {selectedChild.measurementDate
                        ? new Date(
                            selectedChild.measurementDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="w-full flex flex-row gap-[1rem]">
                    <div className="w-full flex flex-row  mt-[2rem]">
                      <p className="font-medium ">Current Address:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {" "}
                        {selectedChild.address}
                      </p>
                    </div>

                    <div className="w-full flex flex-row gap-[2rem] mt-[2rem]">
                      <p className="font-medium ">Purok/Zone:</p>
                      <p className="border-b border-black w-[12rem] h-[2rem] p-1 text-center">
                        {" "}
                        {selectedChild.purok}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[1rem] mt-[2rem] ">
                <p className="font-medium text-[18px]">Nutritional Status:</p>
                <div className="w-full flex flex-row gap-[1rem] justify-between">
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p >Weight for Age:</p>
                    <p className="border-b border-black text-center  p-1">
                      {selectedChild.currentWeight}
                    </p>
                  </div>

                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p >Length/Height for Age:</p>
                    <p className="border-b border-black  text-center p-1">
                      {selectedChild.currentHeight}
                    </p>
                  </div>

                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p >Weight for Length/Height:</p>
                    <p className="border-b border-black  text-center p-1">
                      {selectedChild.currentWeight}
                    </p>
                  </div>
                  <div className="flex flex-row gap-[.5rem] items-center">
                    <p >Nutritional Status:</p>
                    <p className="border-b border-black  text-center p-1">
                      {selectedChild.nutritionalStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex  items-center justify-center mt-[4rem]">
              <button
                  className="bg-[#007F73] text-white px-[2rem] py-2 rounded-md"
                  onClick={() => setIsModalOpen(false)} // Close modal on click
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedChild && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div ref={modalRef} className="relative text ">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsEditModalOpen(false)}
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
            <p className="italic text-sm ">Barangay Luz, Cebu City</p>
            </div>
           
        
         </div>
        
            <div className="grid grid-cols-4 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.first_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Last Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.last_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Middle Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.middle_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        middle_name: e.target.value,
                      })
                    }
                  />
                  <div></div>
                </div>
              </div>
              <div className="w-full">
                <p>Suffix:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <select
                    className="w-full outline-none"
                    value={selectedChild.suffix || ""}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        suffix: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    {/* Add more suffix options as needed */}
                  </select>
                </div>
              </div>
              <div className="w-full">
                <p>Sex:</p>
                <div className="w-[80%] flex justify-between px-4">
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      checked={selectedChild.sex === "male"}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          sex: e.target.value,
                        })
                      }
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      checked={selectedChild.sex === "female"}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          sex: e.target.value,
                        })
                      }
                    />
                    Female
                  </label>
                </div>
              </div>
              <div className="w-full">
                <p>Birthdate:</p>
                <div className="border border-gray-300 rounded-md p-1 flex items-center">
                  <DatePicker
                    selected={parseDate(selectedChild.birthdate)}
                    onChange={(date: Date | null) =>
                      setSelectedChild({
                        ...selectedChild,
                        birthdate: date ? date.toISOString().split("T")[0] : "",
                      })
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full outline-none"
                    customInput={
                      <div className="flex items-center rounded-md p-1 text-black">
                        <input
                          className="w-full outline-none"
                          value={selectedChild.birthdate}
                          readOnly
                        />
                        <FaCalendarAlt className="ml-2 text-black" />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="font-medium text-[18px]">During Birth:</p>
              <div className="w-full flex gap-[20px] ">
                <p>Weight (kg):</p>
                <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.weightAtBirth}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        weightAtBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <p>Height (cm):</p>
                <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none "
                    type="text"
                    value={selectedChild.heightAtBirth}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        heightAtBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-row gap-[10px]">
                  <p>Place of Birth:</p>
                  <div className=" border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem] ">
                    <input
                      className="  rounded-md p-1  outline-none text-center"
                      type="text"
                      value={selectedChild.placeOfBirth}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-[10px]">
                  <p>Date of Birth:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem] flex items-center">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.dateOfBirth}
                      readOnly
                    />
                    <FaCalendarAlt className="ml-2 text-black" />
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
                      value={selectedChild.currentAge}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentAge: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <p>Weight (kg):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.currentWeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Height (cm):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.currentHeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentHeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-[10px]">
                    <p>Measurement Date:</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem]">
                      <DatePicker
                        selected={
                          selectedChild.measurementDate
                            ? parseDate(selectedChild.measurementDate)
                            : null
                        }
                        onChange={(date: Date | null) =>
                          setSelectedChild({
                            ...selectedChild,
                            measurementDate: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          })
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full outline-none"
                        customInput={
                          <div className="flex items-center rounded-md p-1 text-black">
                            <input
                              className="w-full outline-none"
                              value={selectedChild.measurementDate}
                              readOnly
                            />
                            <FaCalendarAlt className="ml-2 text-black" />
                          </div>
                        }
                      />
                    </div>
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
                      value={selectedChild.currentWeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Length/Height for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentHeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentHeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Weight for Length/Height:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[8rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentWeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p className="font-medium ">Nutritional Status:</p>
                  <div className="w-full border border-gray-300 rounded-md h-[2.5rem] outline-none">
                    <select
                      className="w-full outline-none flex "
                      value={selectedChild.nutritionalStatus || ""}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          nutritionalStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Nutritional Status</option>
                      <option value="Normal">Normal</option>
                      <option value="Overweight">Overweight</option>
                      <option value="Underweight">Underweight</option>
                      <option value="Obese">Obese</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row gap-[10px] ">
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
                value={selectedChild.purok}
                onChange={(e) =>
                  setSelectedChild({ ...selectedChild, purok: e.target.value })
                }
              />
            </div>
            <div className="w-full flex justify-between mt-[2rem] gap-[20px]">
              <div className="w-full border border-[#696969] rounded-md p-2">
                <button
                  className="w-full"
                  onClick={() => {
                    /* handle save logic here */
                  }}
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

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <div ref={addModalRef} className="relative border border-black p-[2rem]">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>
            <div className="w-full flex flex-row gap-[1rem] ">
            <div>
              <Image
                src="/svg/health_nutritionalstatus.svg"
                alt="Update Nutritional Status"
                width={40}
                height={50}
              />
            </div>
            <div className="w-full flex flex-col gap-[1rem]">
            <h2 className="text-lg font-semibold text">
              Add Child Nutritional Status
            </h2>
              <p className="italic text-sm ">Barangay Luz, Cebu City</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.first_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Last Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.last_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Middle Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.middle_name}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        middle_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Suffix:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <select
                    className="w-full outline-none"
                    value={selectedChild.suffix || ""}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        suffix: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    {/* Add more suffix options as needed */}
                  </select>
                </div>
              </div>
              <div className="w-full">
                <p>Sex:</p>
                <div className="w-[80%] flex justify-between px-4">
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      checked={selectedChild.sex === "male"}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          sex: e.target.value,
                        })
                      }
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      checked={selectedChild.sex === "female"}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          sex: e.target.value,
                        })
                      }
                    />
                    Female
                  </label>
                </div>
              </div>
              <div className="w-full">
                <p>Birthdate:</p>
                <div className="border border-gray-300 rounded-md p-1 flex items-center">
                  <DatePicker
                    selected={
                      selectedChild.birthdate
                        ? new Date(selectedChild.birthdate)
                        : null
                    }
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="w-full outline-none"
                    placeholderText="Select birthdate"
                    showYearDropdown
                    scrollableYearDropdown
                    minDate={new Date("1900-01-01")}
                    maxDate={new Date()}
                    customInput={
                      <div className="flex items-center rounded-md p-1 text-black">
                        <input
                          className="w-full outline-none"
                          value={selectedChild.birthdate}
                          readOnly
                        />
                        <FaCalendarAlt className="ml-2 text-black" />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <p className="font-medium text-[18px]">During Birth:</p>
              <div className="w-full flex gap-2 ">
                <p className="">Weight (kg):</p>
                <div className="border border-gray-300 rounded-md w-[5rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none text-center "
                    type="text"
                    value={selectedChild.weightAtBirth}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        weightAtBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <p>Height (cm):</p>
                <div className="border border-gray-300 rounded-md p-1 w-[5rem] h-[2.5rem]">
                  <input
                    className="w-full outline-none text-center"
                    type="text"
                    value={selectedChild.heightAtBirth}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        heightAtBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-row gap-[10px]">
                  <p>Place of Birth:</p>
                  <div className=" border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem] ">
                    <input
                      className="  rounded-md p-1  outline-none text-center"
                      type="text"
                      value={selectedChild.placeOfBirth}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-[10px]">
                  <p>Date of Birth:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem] flex items-center">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.dateOfBirth}
                      readOnly
                    />
                    <FaCalendarAlt className="ml-2 text-black" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[20px]">
              {/* Current */}
              <div className="w-full">
                <h1 className="text-lg font-semibold mt-[1rem]">Current :</h1>
                <div className="w-full flex gap-[1rem]">
                  <p>Age in Months :</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[5rem] h-[2.5rem] ">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentAge}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentAge: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <p>Weight (kg):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[5rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.currentWeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Height (cm):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[5rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none"
                      type="text"
                      value={selectedChild.currentHeight}
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentHeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-full flex flex-row gap-[10px]">
                    <p>Measurement Date:</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[15rem] h-[2.5rem]">
                      <DatePicker
                        selected={
                          selectedChild.measurementDate
                            ? parseDate(selectedChild.measurementDate)
                            : null
                        }
                        onChange={(date: Date | null) =>
                          setSelectedChild({
                            ...selectedChild,
                            measurementDate: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          })
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full outline-none"
                        customInput={
                          <div className="flex items-center rounded-md p-1 text-black">
                            <input
                              className="w-full outline-none"
                              value={selectedChild.measurementDate}
                              readOnly
                            />
                            <FaCalendarAlt className="ml-2 text-black" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutritional Status */}
              <div className="w-full ">
                <h1 className="text-lg font-semibold">Nutritional Status :</h1>
                <div className="w-full flex gap-[2rem] mt-4">
                  <p>Weight for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[10rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentWeight}
                      placeholder="kg"
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Length/Height for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[10rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentHeight}
                      placeholder="cm"
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentHeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Weight for Length/Height:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[10rem] h-[2.5rem]">
                    <input
                      className="w-full outline-none flex text-center justify-center"
                      type="number"
                      value={selectedChild.currentWeight}
                      placeholder=""
                      onChange={(e) =>
                        setSelectedChild({
                          ...selectedChild,
                          currentWeight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <p>Nutritional Status:</p>
                    <div className="border border-gray-300 rounded-md p-1 w-[15rem]">
                      <select
                        className="w-full outline-none"
                        value={selectedChild.nutritionalStatus || ""}
                        onChange={(e) =>
                          setSelectedChild({
                            ...selectedChild,
                            nutritionalStatus: e.target.value,
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
                value={selectedChild.purok}
                onChange={(e) =>
                  setSelectedChild({ ...selectedChild, purok: e.target.value })
                }
              />
            </div>
            <div className="w-full flex justify-between mt-[2rem] gap-[20px]">
              <div className="w-full border border-[#696969] rounded-md p-2">
                <button
                  className="w-full"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <p className="text-lg font-medium">Cancel</p>
                </button>
              </div>
              <div className="w-full border border-gray-300 bg-[#007F73] rounded-md p-2">
                <button className="w-full" onClick={handleAddChild}>
                  <p className="text-white text-lg font-medium">
                    Add Nutritional Status
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NutritionalStatus;
