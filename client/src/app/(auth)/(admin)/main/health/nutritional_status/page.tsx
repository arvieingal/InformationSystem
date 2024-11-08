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

interface Child {
  id: number;
  name: string;
  age: number;
  sex: string;
  birthdate: string;
  heightCm: number;
  weightKg: number;
  nutritionalStatus: string;
  address?: string;
  email?: string;
  purok?: string;
  phoneNumber?: string;
}

// Define a type for the form data
interface ChildFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  birthdate: string;
  weightAtBirth: string;
  heightAtBirth: string;
  currentAge: number;
  currentWeight: string;
  currentHeight: string;
  address: string;
  purok: string;
}

// Function to calculate nutritional status based on age, weight, and height
const calculateNutritionalStatus = (age: number, weight: number, height: number): string => {
  // Example logic for determining nutritional status
  if (age < 24) {
    if (weight < 10) return "Underweight";
    if (weight > 15) return "Overweight";
  } else {
    if (height < 80) return "Underweight";
    if (height > 100) return "Overweight";
  }
  return "Normal";
};

const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<ChildFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    birthdate: '',
    weightAtBirth: '',
    heightAtBirth: '',
    currentAge: 0,
    currentWeight: '',
    currentHeight: '',
    address: '',
    purok: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Child;
    direction: string;
  } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/children");
        if (response.ok) {
          const data: Child[] = await response.json();
          console.log("Fetched children data:", data);
          setChildren(data);
        } else {
          console.error("Failed to fetch children data.");
        }
      } catch (error) {
        console.error("Error fetching children data:", error);
      }
    };

    fetchChildren();
  }, []);

  const fetchChildById = async (id: number) => {
    try {
      const response = await fetch(`localhost:3001/api/children/${id}`);
      if (response.ok) {
        const data: Child = await response.json();
        setSelectedChild(data as any);
        setIsModalOpen(true);
      } else {
        console.error("Child not found.");
      }
    } catch (error) {
      console.error("Error fetching child by ID:", error);
    }
  };

  function handleRowClick(child: Child): void {
    setSelectedChild({
      firstName: child.name.split(' ')[0] || '',
      middleName: child.name.split(' ')[1] || '',
      lastName: child.name.split(' ')[2] || '',
      sex: child.sex,
      birthdate: child.birthdate,
      weightAtBirth: '', // Assuming this data is not available in Child
      heightAtBirth: '', // Assuming this data is not available in Child
      currentAge: child.age,
      currentWeight: child.weightKg.toString(),
      currentHeight: child.heightCm.toString(),
      address: child.address || '',
      purok: child.purok || '',
    });
    setIsModalOpen(true);
  }

  async function handleEditClick(child: Child): Promise<void> {
    const confirmEdit = await SweetAlert.showConfirm(
      `Are you sure you want to edit this child with ID: ${child.id}?`
    );
    if (confirmEdit) {
      setSelectedChild(child);
      setIsEditModalOpen(true);
    }
  }

  async function handleArchiveClick(child: Child): Promise<void> {
    const confirmArchive = await SweetAlert.showConfirm(
      `Are you sure you want to archive this child with ID: ${child.id}?`
    );
    if (confirmArchive) {
      console.log(`Child with ID: ${child.id} archived.`);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  function handleSort(key: keyof Child) {
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
    // Implement search logic here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddChild = async (childData: ChildFormData) => {
    try {
      const response = await fetch("http://localhost:3001/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
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
      const status = calculateNutritionalStatus(currentAge, parseFloat(currentWeight), parseFloat(currentHeight));
      setSelectedChild((prev) => ({ ...prev, nutritionalStatus: status }));
    }
  }, [selectedChild.currentAge, selectedChild.currentWeight, selectedChild.currentHeight]);

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] ">
        <div onClick={() => router.push("/main/health/nutritional_status")}>
          <Image
            className="mt-[2rem]"
            src="/svg/immunization_records.svg"
            alt="Nutritional Status"
            width={200}
            height={50}
          />
        </div>
        <div onClick={() => router.push("/main/health/immunization_record")}>
          <Image
            src="/svg/health_image.svg"
            alt="Nutritional Status"
            width={200}
            height={50}
          />
        </div>
      </div>
      <div className="w-full flex flex-row pr-[3rem]  items-center justify-between gap-4 ">
        <div className="w-full pl-2">
          <SearchBar onSearch={handleSearch} />
        </div>
        <button className="flex items-center space-x-2 text-blue-500 hover:underline">
          <Image
            src="/svg/filter.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          />
          <Image
            src="/svg/add_nutritional.svg"
            alt="Nutritional Status"
            width={30}
            height={50}
            onClick={() => setIsAddModalOpen(true)}
          />
        </button>
        {isFilterDropdownOpen && (
          <div className="absolute right-[1rem] mt-[40%] bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Age
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Sex
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Birthdate
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Height
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Weight
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Filter by Nutritional Status
              </li>
              {/* Add more filter options as needed */}
            </ul>
          </div>
        )}
      </div>
      <div className="w-full mt-[1rem] ">
        <ChildTable
          children={paginatedChildren}
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
          <div ref={modalRef} className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div>
              <Image
                src="/svg/health_nutritionalstatus.svg"
                alt="Update Nutritional Status"
                width={40}
                height={50}
              />
            </div>
            <h2 className="text-lg font-semibold text">
              View Full Nutritional Status of the Child
            </h2>
            <div className="w-full flex flex-row gap-[10rem] text mt-[2rem]">
              <p className="text">
                <span className="font-medium">Name of the Child:</span>
                <u>{selectedChild.firstName}</u>
                <u>{selectedChild.middleName || 'N/A'}</u>
                <u>{selectedChild.lastName}</u>
                <select
                  value={selectedChild.suffix || ''}
                  onChange={(e) =>
                    setSelectedChild({ ...selectedChild, suffix: e.target.value })
                  }
                >
                  <option value="">Select Suffix</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="III">III</option>
                  {/* Add more suffix options as needed */}
                </select>
              </p>
              <p className="text">
                <span className="font-medium">Birthdate:</span>
                <u>{selectedChild.birthdate}</u>
              </p>
              <p className="text">
                <span className="font-medium">Age:</span>
                <u>{selectedChild.currentAge}</u>
              </p>
            </div>
            <p className="font-medium mt-[2rem]">Current:</p>
            <div className="w-full flex flex-row gap-[5rem]">
              <span className="font-medium">Age in Months:</span>
              <u>{selectedChild.currentAge}</u>
              <span className="font-medium">Weight(Kg):</span>
              <u>{selectedChild.currentWeight}</u>
              <span className="font-medium">Height(Cm):</span>
              <u>{selectedChild.currentHeight}</u>
            </div>
            <p className="font-medium mt-[2rem]">Nutritional Status:</p>
            <div className="w-full flex flex-row gap-[5rem] mt-4">
              <select
                value={selectedChild.nutritionalStatus || ''}
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
                {/* Add more options as needed */}
              </select>
            </div>
            <p className="font-medium mt-[2rem]">Location:</p>
            <div className="w-full flex flex-row gap-[10rem]">
              <p className="text">Address: <u>{selectedChild.address}</u></p>
              <p className="text">Purok/Zone: <u>{selectedChild.purok}</u></p>
            </div>

          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedChild && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div ref={modalRef} className="relative text">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>
            <div>
              <Image
                src="/svg/health_nutritionalstatus.svg"
                alt="Update Nutritional Status"
                width={40}
                height={50}
              />
            </div>
            <h2 className="text-lg font-semibold text">
              Update Child Nutritional Status
            </h2>

            <div className="grid grid-cols-3 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.firstName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        firstName: e.target.value,
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
                    value={selectedChild.middleName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        middleName: e.target.value,
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
                    value={selectedChild.lastName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        lastName: e.target.value,
                      })
                    }
                  />
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
                    selected={new Date(selectedChild.birthdate)}
                    onChange={(date: Date | null) =>
                      setSelectedChild({
                        ...selectedChild,
                        birthdate: date?.toISOString().split('T')[0] || '', 
                      })
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full outline-none"
                    customInput={
                      <div className="flex items-centerrounded-md p-1 ">
                        <input 
                          className="w-full outline-none" 
                          value={selectedChild.birthdate} 
                          readOnly 
                        />
                        <FaCalendarAlt className=" text-black  w-[2rem] ml-[5rem]" />
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>During Birth:</p>
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
                </div>
              </div>

              {/* Nutritional Status */}
              <div className="w-full">
                <h1 className="text-lg font-semibold">Nutritional Status :</h1>
                <div className="w-full flex gap-[20px] mt-4">
                  <p>Weight for Age:</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
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
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
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
                  <div className="border border-gray-300 rounded-md p-1 w-[3rem] h-[2.5rem]">
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
                  onClick={() => {
                    /* handle save logic here */
                  }}
                >
                  <p className="text-lg font-medium">Cancel</p>
                </button>
              </div>
              <div className="w-full border border-gray-300 bg-[#007F73] rounded-md p-2">
                <button
                  className="w-full"
                  onClick={() => {
                    /* handle save logic here */
                  }}
                >
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
          <div className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>
            <div>
              <Image
                src="/svg/health_nutritionalstatus.svg"
                alt="Update Nutritional Status"
                width={40}
                height={50}
              />
            </div>
            <h2 className="text-lg font-semibold text">
              Add Child Nutritional Status
            </h2>

            <div className="grid grid-cols-4 gap-[20px] w-full mt-4">
              <div className="w-full">
                <p>First Name of the Child:</p>
                <div className="border border-gray-300 rounded-md p-1">
                  <input
                    className="w-full outline-none"
                    type="text"
                    value={selectedChild.firstName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        firstName: e.target.value,
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
                    value={selectedChild.middleName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        middleName: e.target.value,
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
                    value={selectedChild.lastName}
                    onChange={(e) =>
                      setSelectedChild({
                        ...selectedChild,
                        lastName: e.target.value,
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
                    value={selectedChild.suffix || ''}
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
                    selected={new Date(selectedChild.birthdate)}
                    onChange={(date: Date | null) =>
                      setSelectedChild({
                        ...selectedChild,
                        birthdate: date?.toISOString().split('T')[0] || '',
                      })
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full outline-none"
                    customInput={
                      <div className="flex items-center rounded-md p-1 text-black">
                        <input className="w-full outline-none" />
                        <FaCalendarAlt className="ml-2 text-black" />
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p>During Birth:</p>
                <div className="w-full flex gap-[1rem] ">
                  <p className="w-[20rem]">Weight (kg):</p>
                  <div className="border border-gray-300 rounded-md p-1 w-[12rem] h-[2.5rem]">
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
                  <div className="border border-gray-300 rounded-md p-1 w-[12rem] h-[2.5rem]">
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
                    value={selectedChild.nutritionalStatus || ''}
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
                <button
                  className="w-full"
                  onClick={() => handleAddChild(selectedChild)}
                >
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
