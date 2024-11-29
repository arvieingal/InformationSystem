import React from "react";
import { Immunization } from "@/types/Immunization";
import { formatDate } from "@/components/formatDate";
import Image from "next/image";
interface ModalProps {
  onClose: () => void;
  immunization: Immunization;
  onSave: (updatedImmunization: Immunization) => void;
}

const ImmunizationModal: React.FC<ModalProps> = ({
  onClose,
  immunization,
  onSave,
}) => {
  const [editedImmunization, setEditedImmunization] =
    React.useState(immunization);

  const handleChange = (key: keyof Immunization, value: any) => {
    setEditedImmunization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center scrollbar-hidden">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[50%] h-[60%] overflow-y-auto relative">
        <button
          className="absolute top-[-3rem]  right-[-1rem] text-gray-600 hover:text-gray-900 text-[4rem] p-4"
          onClick={onClose}
        >
          &times;
        </button>
        <form>
          <Image
            src="/image/nutrition.png"
            alt="immunization"
            width={50}
            height={50}
          />
          <h2 className="text-lg font-semibold mb-4">
            Edit Immunization Record
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Child's Name:</label>
              <input
                type="text"
                value={`${editedImmunization.full_name || ""}`.trim()}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Sex:</label>
              <input
                type="text"
                value={`${editedImmunization.sex || ""}`.trim()}
                onChange={(e) => handleChange("sex", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                value={formatDate(editedImmunization.birthdate)}
                onChange={(e) => handleChange("birthdate", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Mother's Name:</label>
              <input
                type="text"
                value={`${editedImmunization.mother_name || ""}`.trim()}
                onChange={(e) => handleChange("mother_name", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Father's Name:</label>
              <input
                type="text"
                value={`${editedImmunization.father_name || ""}`.trim()}
                onChange={(e) => handleChange("father_name", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                value={`${editedImmunization.address || ""}`.trim()}
                onChange={(e) => handleChange("address", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full outline-none"
                readOnly
              />
            </div>
            <div>
              <label>Vaccine:</label>
              <input
                type="text"
                value={`${editedImmunization.vaccine_type || ""}`.trim()}
                onChange={(e) => handleChange("vaccine_type", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
            </div>
            <div>
              <label>Dose:</label>
              <input
                type="text"
                value={`${editedImmunization.doses || ""}`.trim()}
                onChange={(e) => handleChange("doses", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
            </div>
            <div>
              <label>Date of Vaccination:</label>
              <input
                type="date"
                value={`${editedImmunization.date_vaccinated || ""}`.trim()}
                onChange={(e) =>
                  handleChange("date_vaccinated", e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 w-full"
              />
            </div>
            <div>
              <label>Remarks:</label>
              <input
                type="text"
                value={`${editedImmunization.remarks || ""}`.trim()}
                onChange={(e) => handleChange("remarks", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
            </div>
            <div>
              <label>Health Center:</label>
              <input
                type="text"
                value={`${editedImmunization.health_center || ""}`.trim()}
                onChange={(e) => handleChange("health_center", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="mt-4 border border-gray-900 text-gray-500 px-4 py-2 rounded-md w-[25rem]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="mt-4 bg-[#007F73] text-white px-4 py-2 rounded-md w-[30rem]"
              onClick={() => onSave(editedImmunization)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImmunizationModal;
