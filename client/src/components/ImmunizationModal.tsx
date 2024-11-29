import React from "react";
import { Immunization } from "@/types/Immunization";

interface ModalProps {
  onClose: () => void;
  immunization: Immunization;
  onSave: (updatedImmunization: Immunization) => void;
}

const ImmunizationModal: React.FC<ModalProps> = ({ onClose, immunization, onSave }) => {
  const [editedImmunization, setEditedImmunization] = React.useState(immunization);

  const handleChange = (key: keyof Immunization, value: any) => {
    setEditedImmunization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[60%] h-[90%] relative">
        <button
          className="absolute top-0 right-0 text-gray-600 hover:text-gray-900 text-2xl p-4"
          onClick={onClose}
        >
          &times;
        </button>
        <div>
          <h2 className="text-lg font-semibold">Edit Immunization Record</h2>
          <div className="mt-4">
            <label>Name:</label>
            <input
              type="text"
              value={`${editedImmunization.full_name || ''}`.trim()}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <div className="mt-4">
            <label>Vaccine:</label>
            <input
              type="text"
              value={`${editedImmunization.vaccine_type || ''}`.trim()}
              onChange={(e) => handleChange("vaccine_type", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <div className="mt-4">
            <label>Dose:</label>
            <input
              type="text"
              value={`${editedImmunization.doses || ''}`.trim()}
              onChange={(e) => handleChange("doses", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <div className="mt-4">
            <label>Date of Vaccination:</label>
            <input
              type="date"
              value={`${editedImmunization.date_vaccinated || ''}`.trim()}
              onChange={(e) => handleChange("date_vaccinated", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <div className="mt-4">
            <label>Remarks:</label>
            <input
              type="text"
              value={`${editedImmunization.remarks || ''}`.trim()}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <div className="mt-4">
            <label>Health Center:</label>
            <input
              type="text"
              value={`${editedImmunization.health_center || ''}`.trim()}
              onChange={(e) => handleChange("health_center", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => onSave(editedImmunization)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationModal; 