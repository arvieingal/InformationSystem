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
            <label>Health Center:</label>
            <input
              type="text"
              value={editedImmunization.health_center}
              onChange={(e) => handleChange("health_center", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full"
            />
          </div>
          {/* Add more fields as needed */}
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