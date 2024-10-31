"use client";
import React from "react";
import HealthCard from "@/components/HealthCard";
import { useRouter } from "next/navigation"; // Import useRouter

const PatientRecord: React.FC = () => {
  const router = useRouter(); // Initialize router

  // Sample data can be replaced with dynamic data

  const patients = [
    {
      name: "Arvie Ingal",
      age: 5,
      gender: "Male",
      birthdate: "10/26/2018",
      purok: "Purok 1",
      nutritionalStatus: "Normal",
      heightCm: 110,
      weightKg: 18,
      heightAgeZ: 0.5,
      weightAgeZ: 0.3,
      weightHeightZ: 0.2,
      measurementDate: "10/26/2023",
    },
  ];

  function handleCardClick(path: string): void {
    router.push(path); // Navigate to the specified path
  }

  return (
    <>
      <div className="flex flex-row md:flex md:flex-row justify-center gap-[3rem] ">
        {/* Card 1 */}
        <HealthCard
          path="/health/nutritional_status"
          imageSrc="/img/patient_record.png"
          altText="Image 1"
          title="Nutritional Status"
          onClick={() => handleCardClick("/health/nutritional_status")}
        />
        {/* Card 2 */}
        <HealthCard
          path="/health/health_record"
          imageSrc="/img/health_record.png"
          altText="Image 2"
          title="Health Records"
          onClick={() => handleCardClick("/health/health_record")}
        />
        {/* Card 3 */}
        <HealthCard
          path="/reports-analysis"
          imageSrc="/img/report.png"
          altText="Image 3"
          title="Reports and Analysis"
          onClick={() => handleCardClick("/reports-analysis")}
        />
        {/* Card 4 */}
        <HealthCard
          path="/health/settings"
          imageSrc="/img/settings.png"
          altText="Image 4"
          title="Settings"
          onClick={() => handleCardClick("/health/settings")}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem]">
          <input
            type="text"
            placeholder="Search ......."
            className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none"
          />
          <button className="flex items-center space-x-2 text-blue-500 hover:underline">
            <span className="material-icons">add_circle</span>
            <span>Add</span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem]">
          <div className="w-full border bg-white h-[400px] rounded-lg">
            <div className="w-full">
              <div className="flex justify-center mt-4">
                <table className="min-w-full border-collapse border border-[#CCCCCC] text-sm ">
                  <thead>
                    <tr>
                      <th className="border border-[#CCCCCC]  py-2">
                        ID
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        First Name
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Last Name
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Birthdate
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Age (Months)
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Height (cm)
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Weight (kg)
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Height for Age Z
                      </th>
                      <th className="border border-[#CCCCCC] py-2 ">
                        Weight for Age Z
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Weight for Height Z
                      </th>
                      <th className="border border-[#CCCCCC]  py-2">
                        Nutritional Status
                      </th>
                      <th className="border border-[#CCCCCC] py-2">
                        Measurement Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center ">
                    {/* Sample data can be replaced with dynamic data */}
                    {patients.map((patient, index) => (
                      <tr key={index}>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.name.split(" ")[0]}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.name.split(" ")[1]}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.birthdate}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.age}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.heightCm}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.weightKg}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.heightAgeZ}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.weightAgeZ}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.weightHeightZ}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.nutritionalStatus}
                        </td>
                        <td className="border border-[#CCCCCC] px-4 py-2">
                          {patient.measurementDate}
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
    </>
  );
};

export default PatientRecord;
