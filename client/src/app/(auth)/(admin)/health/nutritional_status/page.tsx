'use client'
import React from 'react'
import HealthCard from '@/components/HealthCard'; 
import { useRouter } from 'next/navigation'; // Import useRouter

const PatientRecord: React.FC = () => { 
  const router = useRouter(); // Initialize router

  // Sample data can be replaced with dynamic data

  const patients = [

    { name: "Arvie Ingoal", age: 5, gender: "Male", birthdate: "10/26/2018", purok: "Purok 1", nutritionalStatus: "Normal" },

    // Add more patient objects here

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
        onClick={() => handleCardClick("/health/nutritional_status")} />
      {/* Card 2 */}
      <HealthCard
        path="/health/health_record"
        imageSrc="/img/health_record.png"
        altText="Image 2"
        title="Health Records"
        onClick={() => handleCardClick("/health/health_record")} />
      {/* Card 3 */}
      <HealthCard
        path="/reports-analysis"
        imageSrc="/img/report.png"
        altText="Image 3"
        title="Reports and Analysis"
        onClick={() => handleCardClick("/reports-analysis")} />
      {/* Card 4 */}
      <HealthCard
        path="/health/settings"
        imageSrc="/img/settings.png"
        altText="Image 4"
        title="Settings"
        onClick={() => handleCardClick("/health/settings")} />
    </div>

    <div className='w-full'>
    <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem]">
          <input
            type="text"
            placeholder="Search ......."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
          <button className="flex items-center space-x-2 text-blue-500 hover:underline">
            <span className="material-icons">add_circle</span>
            <span>Add</span>
          </button>
        </div>
    </div>
    <div className='w-full'>
    <div className="flex items-center justify-center gap-[1rem] px-[2rem] mt-[2rem]">
      <div className='w-full border bg-white h-[400px] rounded-lg'>

      </div>
        </div>
    </div>
   <div className='w-full'>
   <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-1">
              {/* Pagination */}
              <button className="px-2 py-1 text-sm">{"<"}</button>
              {[1, 2, 3, 4, 5, "...", 36].map((page, index) => (
                <button key={index} className="px-2 py-1 text-sm">
                  {page}
                </button>
              ))}
              <button className="px-2 py-1 text-sm">{">"}</button>
            </div>
          </div>
   </div>
          
      </>
  );
};

export default PatientRecord