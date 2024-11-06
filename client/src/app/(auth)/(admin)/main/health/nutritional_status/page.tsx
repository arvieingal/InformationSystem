"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/PersonModal";
import SweetAlert from "@/components/SweetAlert";

const NutritionalStatus: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch('/api/children');
        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error("Error fetching children data:", error);
      }
    };

    fetchChildren();
  }, []);

  function handleRowClick(child: any): void {
    setSelectedChild(child);
    setIsModalOpen(true);
  }

  function handleEditClick(child: any): void {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  }

  async function handleArchiveClick(child: any): Promise<void> {
    const confirmArchive = await SweetAlert.showConfirm(`Are you sure you want to archive this child with ID: ${child.id}?`);
    if (confirmArchive) {
      console.log(`Child with ID: ${child.id} archived.`);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  function handleSort(key: string) {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const sortedChildren = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...children].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return children;
  }, [children, sortConfig]);

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] ">
        <div onClick={() => router.push("/main/health/nutritional_status")}>
          <Image
            className="mt-[2rem]"
            src="/svg/immunization_records.svg"
            alt="Nutritional Status"
            width={250}
            height={50}
          />
        </div>
        <div onClick={() => router.push("/main/health/immunization_record")}>
        <Image
          src="/svg/health_image.svg"
          alt="Nutritional Status"
          width={250}
          height={50}
        />
      </div>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem] relative">
          <input
            type="text"
            placeholder="Search ......."
            className="w-full px-4 border border-[#CCCCCC] rounded-md focus:outline-none py-2"
          />
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
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Age</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Sex</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Birthdate</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Height</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Weight</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Filter by Nutritional Status</li>
                {/* Add more filter options as needed */}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem]">
          <div className="w-full border bg-white h-[400px] rounded-lg">
            <div className="w-full">
              <div className="flex justify-center mt-4  px-[2rem]">
                <table className="min-w-full border-collapse border border-[#CCCCCC] text-sm">
                  <thead>
                    <tr>
                      {['id', 'name', 'age', 'sex', 'birthdate', 'heightCm', 'weightKg', 'nutritionalStatus'].map((key) => (
                        <th
                          key={key}
                          className="border border-gray-600 bg-gray-300 py-2"
                          onClick={() => handleSort(key)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          {sortConfig?.key === key && (
                            <span>
                              {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                            </span>
                          )}
                        </th>
                      ))}
                      <th className="border border-gray-600 bg-gray-300 py-2">Option</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {sortedChildren.map((child, index) => (
                      <tr key={index}>
                        <td className="border border-[#CCCCCC] px-4 py-2">{index + 1}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.name.split(" ")[0]}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.age}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.sex}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.birthdate}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.heightCm}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.weightKg}</td>
                        <td className="border border-[#CCCCCC] px-4 py-2">{child.nutritionalStatus}</td>
                        <td className="border py-2 flex flex-row justify-center gap-2">
                          <Image
                            src="/svg/edit.svg"
                            alt="Edit"
                            width={20}
                            height={20}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(child);
                            }}
                          />
                          <Image
                            src="/svg/archive.svg"
                            alt="Archive"
                            width={20}
                            height={20}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveClick(child);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedChild && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div ref={modalRef} className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem]  text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2>Child Details</h2>
            <p>Full Name: {selectedChild.name}</p>
            <p>Birthdate: {selectedChild.birthdate}</p>
            <p>Address: {selectedChild.address}</p>
            <p>Email: {selectedChild.email}</p>
            <p>Age: {selectedChild.age}</p>
            <p>Sex: {selectedChild.sex}</p>
            <p>Purok/Zone: {selectedChild.purok}</p>
            <p>Phone Number: {selectedChild.phoneNumber}</p>
          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedChild && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div ref={modalRef} className="relative">
            <button
              className="absolute top-[-3rem] right-[-2rem] text-gray-500 hover:text-gray-700 p-4 text-[3rem]"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </button>
            <h2>Edit Child Details</h2>
            <input
              type="text"
              value={selectedChild.name}
              onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
            />
            <input
              type="text"
              value={selectedChild.birthdate}
              onChange={(e) => setSelectedChild({ ...selectedChild, birthdate: e.target.value })}
            />
            <input
              type="text"
              value={selectedChild.address}
              onChange={(e) => setSelectedChild({ ...selectedChild, address: e.target.value })}
            />
            <input
              type="email"
              value={selectedChild.email}
              onChange={(e) => setSelectedChild({ ...selectedChild, email: e.target.value })}
            />
            <input
              type="number"
              value={selectedChild.age}
              onChange={(e) => setSelectedChild({ ...selectedChild, age: parseInt(e.target.value) })}
            />
            <input
              type="text"
              value={selectedChild.sex}
              onChange={(e) => setSelectedChild({ ...selectedChild, sex: e.target.value })}
            />
            <input
              type="text"
              value={selectedChild.purok}
              onChange={(e) => setSelectedChild({ ...selectedChild, purok: e.target.value })}
            />
            <input
              type="tel"
              value={selectedChild.phoneNumber}
              onChange={(e) => setSelectedChild({ ...selectedChild, phoneNumber: e.target.value })}
            />
            <button onClick={() => {/* handle save logic here */}}>Save</button>
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
            <h2>Add Child Details</h2>
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Birthdate" />
            <input type="text" placeholder="Address" />
            <input type="email" placeholder="Email" />
            <input type="number" placeholder="Age" />
            <input type="text" placeholder="Sex" />
            <input type="text" placeholder="Purok/Zone" />
            <input type="tel" placeholder="Phone Number" />
            <button onClick={() => {/* handle save logic here */}}>Save</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NutritionalStatus;
