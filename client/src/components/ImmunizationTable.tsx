import React, { useState } from "react";
import Image from "next/image";
import { Immunization } from "@/types/Immunization";
import SweetAlert from "./SweetAlert";
import ImmunizationModal from "./ImmunizationModal";
import { formatDate } from "./formatDate";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

interface TableProps {
  immunizations: Immunization[];
  onSort: (key: keyof Immunization) => void;
  sortConfig: { key: keyof Immunization; direction: string } | null;
  onViewDetails: (immunization: Immunization) => void;
  loading: boolean;
}

const ImmunizationTable: React.FC<TableProps> = ({
  immunizations,
  onSort,
  sortConfig,
  onViewDetails,
  loading,
}) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImmunization, setSelectedImmunization] =
    useState<Immunization | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleEditClick = async (immunization: Immunization) => {
    if (session?.user.role === "Viewer") {
      SweetAlert.showError("You do not have permission to edit.");
      return;
    }
    const isConfirmed = await SweetAlert.showConfirm(
      "Do you want to edit this immunization?"
    );
    if (isConfirmed) {
      setSelectedImmunization(immunization);
      setIsModalOpen(true);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const handleArchiveImmunization = async (immunization: Immunization) => {
    if (session?.user.role !== "Admin") {
      SweetAlert.showError("You do not have permission to archive.");
      return;
    }

    const isConfirmed = await SweetAlert.showConfirm(
      "Do you want to archive this immunization?"
    );
    if (isConfirmed) {
      try {
        const response = await api.put("/api/archive-immunization-record", {
          child_immunization_id: immunization.child_immunization_id,
        });
        if (response.status === 200) {
          SweetAlert.showSuccess("Immunization archived successfully.").then(
            () => {
              window.location.reload();
            }
          );
        } else {
          SweetAlert.showError("Failed to archive immunization.");
        }
      } catch (error) {
        console.error("Error archiving immunization:", error);
        SweetAlert.showError("An error occurred while archiving.");
      }
    }
  };

  const paginatedImmunizations = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return immunizations.slice(startIndex, endIndex);
  }, [immunizations, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(immunizations.length / itemsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(immunizations.length / itemsPerPage);

  const headers = [
    { label: "ID", key: "child_immunization_id" },
    { label: "Name", key: "full_name" },
    { label: "Vaccine", key: "vaccine_type" },
    { label: "Dose", key: "doses" },
    { label: "Date of Vaccination", key: "date_vaccinated" },
    { label: "Remarks", key: "remarks" },
    { label: "Health Center", key: "health_center" },
  ];

  return (
    <div className="w-full px-[1.5rem] h-full">
      <div className="bg-white h-full rounded-[5px] overflow-y-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead className="text-center">
            <tr className="sticky top-0 bg-white shadow-gray-300 shadow-sm">
              {headers.map(({ label, key }) => (
                <th
                  key={key}
                  className="py-4 px-6 text-left font-semibold text-[16px] cursor-pointer"
                  onClick={() => onSort(key as keyof Immunization)}
                >
                  {label}
                  {sortConfig?.key === key && (
                    <span>
                      {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
              {(session?.user.role === "Admin" ||
                session?.user.role === "Editor") && (
                <th className="py-4 pr-6 text-left font-semibold text-[16px]">
                  Option
                </th>
              )}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={headers.length + 1}>
                  <div className="flex justify-center items-center w-full h-full pt-16">
                    <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-center">
              {immunizations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedImmunizations.map((immunization, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.child_immunization_id}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {`${immunization.full_name || ""}`.trim()}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.vaccine_type === "Others"
                        ? immunization.other_vaccine_type
                        : immunization.vaccine_type || ""}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.doses === "Others"
                        ? immunization.other_doses
                        : immunization.doses || ""}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.date_vaccinated
                        ? formatDate(
                            immunization.date_vaccinated.toString()
                          ).trim()
                        : ""}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.remarks}
                    </td>
                    <td
                      className="py-2 px-6 text-left"
                      onClick={() => onViewDetails(immunization)}
                    >
                      {immunization.health_center}
                    </td>
                    {session?.user.role === "Admin" && (
                      <td className="py-2 pr-6 text-left flex items-center">
                        <Image
                          src="/svg/edit.svg"
                          alt="Edit"
                          height={100}
                          width={100}
                          className="w-5 h-5 mr-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(immunization);
                          }}
                        />
                        <Image
                          src="/svg/archive.svg"
                          alt="Archive"
                          height={100}
                          width={100}
                          className="w-5 h-5 mr-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveImmunization(immunization);
                          }}
                        />
                      </td>
                    )}
                    {session?.user.role === "Editor" && (
                      <td className="py-2 pr-6 text-left flex items-center">
                        <Image
                          src="/svg/edit.svg"
                          alt="Edit"
                          height={100}
                          width={100}
                          className="w-5 h-5 mr-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(immunization);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#007F73] text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#007F73] text-white rounded disabled:opacity-50 ml-2 w-[5.5rem]"
        >
          Next
        </button>
      </div>
      {isModalOpen && selectedImmunization && (
        <ImmunizationModal
          onClose={() => setIsModalOpen(false)}
          immunization={selectedImmunization}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ImmunizationTable;
