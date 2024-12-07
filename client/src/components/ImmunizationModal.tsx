import React from "react";
import { Immunization } from "@/types/Immunization";
import { formatDate } from "@/components/formatDate";
import Image from "next/image";
import SweetAlert from "@/components/SweetAlert";

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
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleChange = (key: keyof Immunization, value: any) => {
    setEditedImmunization((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleVaccineTypeChange = (value: string) => {
    handleChange("vaccine_type", value);
  };

  const handleDoseChange = (value: string) => {
    handleChange("doses", value);
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedImmunization.vaccine_type) newErrors.vaccine_type = "Vaccine type is required.";
    if (!editedImmunization.doses) newErrors.doses = "Dose is required.";
    if (!editedImmunization.date_vaccinated) newErrors.date_vaccinated = "Date of vaccination is required.";
    if (!editedImmunization.health_center) newErrors.health_center = "Health center is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/child-immunization-record/${editedImmunization.child_immunization_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedImmunization),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Record updated successfully:', result);
        onSave(editedImmunization);
        await SweetAlert.showSuccess('Record updated successfully!');

        if (result.isArchived) {
          window.location.reload();
        }
      } else {
        console.error('Failed to update record:', response.statusText);
        await SweetAlert.showError('Failed to update record.');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      await SweetAlert.showError('An error occurred while updating the record.');
    }
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
        <form onSubmit={handleSubmit}>
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
              {errors.full_name && <span className="text-red-500">{errors.full_name}</span>}
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
                value={editedImmunization.birthdate}
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
              <label>Vaccine:<span className="text-red-500">*</span></label>
              <select
                value={editedImmunization.vaccine_type || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleVaccineTypeChange(value);
                  if (value === "Others") {
                    handleChange("other_vaccine_type", "");
                  }
                }}
                className="border border-gray-300 rounded-md p-1 w-full"
              >
                <option value="">Select Vaccine</option>
                <option value="BCG Vaccine">BCG Vaccine</option>
                <option value="Hepatitis B Vaccine">Hepatitis B Vaccine</option>
                <option value="Pentavalent Vaccine (DPT-Hep B-HIB)">Pentavalent Vaccine (DPT-Hep B-HIB)</option>
                <option value="Inactivated Polio Vaccine (IPV)">Inactivated Polio Vaccine (IPV)</option>
                <option value="Pneumococcal Conjugate Vaccine (PCV)">Pneumococcal Conjugate Vaccine (PCV)</option>
                <option value="Measles, Mumps, Rubella Vaccine (MMR)">Measles, Mumps, Rubella Vaccine (MMR)</option>
                <option value="Vitamin A">Vitamin A</option>
                <option value="Deworming">Deworming</option>
                <option value="Dental Check-up">Dental Check-up</option>
                <option value="Others">Others</option>
              </select>
              {editedImmunization.vaccine_type === "Others" && (
                <input
                  type="text"
                  placeholder="Enter custom vaccine"
                  value={editedImmunization.other_vaccine_type || ""}
                  onChange={(e) => handleChange("other_vaccine_type", e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-full mt-2"
                />
              )}
              {errors.vaccine_type && <span className="text-red-500">{errors.vaccine_type}</span>}
            </div>

            <div>
              <label>Dose:<span className="text-red-500">*</span></label>
              <select
                value={editedImmunization.doses || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleDoseChange(value);
                  if (value === "Others") {
                    handleChange("other_doses", "");
                  }
                }}
                className="border border-gray-300 rounded-md p-1 w-full"
              >
                <option value="">Select Dose</option>
                {editedImmunization.doses && (
                  <option value={String(editedImmunization.doses)}>
                    {String(editedImmunization.doses)}
                  </option>
                )}
                <option value="First dose">First dose</option>
                <option value="Second dose">Second dose</option>
                <option value="Third dose">Third dose</option>
                <option value="Fourth dose">Fourth dose</option>
                <option value="Fifth dose">Fifth dose</option>
                <option value="Others">Others</option>
              </select>
              {editedImmunization.doses === "Others" && (
                <input
                  type="text"
                  placeholder="Enter custom dose"
                  value={editedImmunization.other_doses || ""}
                  onChange={(e) => handleChange("other_doses", e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-full mt-2"
                />
              )}
              {errors.doses && <span className="text-red-500">{errors.doses}</span>}
            </div>
            <div>
              <label>Date of Vaccination:<span className="text-red-500">*</span></label>
              <input
                type="date"
                value={`${editedImmunization.date_vaccinated || ""}`.trim()}
                onChange={(e) =>
                  handleChange("date_vaccinated", e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 w-full"
              />
              {errors.date_vaccinated && <span className="text-red-500">{errors.date_vaccinated}</span>}
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
              <label>Health Center:<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={`${editedImmunization.health_center || ""}`.trim()}
                onChange={(e) => handleChange("health_center", e.target.value)}
                className="border border-gray-300 rounded-md p-1 w-full"
              />
              {errors.health_center && <span className="text-red-500">{errors.health_center}</span>}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="mt-4 border border-gray-900 text-gray-500 px-4 py-2 rounded-md w-[25rem]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mt-4 bg-[#007F73] text-white px-4 py-2 rounded-md w-[30rem]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImmunizationModal;
