'use client'
import React, { useState, useEffect } from 'react';
import ImmunizationTable from '@/components/ImmunizationTable';
interface Immunization {
  id: string;
  name: string;
  date: string;
}

const ImmuniReport: React.FC = () => {
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchImmunizationData();
        setImmunizations(data as unknown as Immunization[]);
      } catch (error) {
        console.error('Error fetching immunization data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Republic of the Philippines</h2>
        <h3 className="font-semibold">Department of Health</h3>
        <h4 className="font-semibold">NATIONAL IMMUNIZATION COUNCIL</h4>
        <h5 className="mt-4 font-semibold">
          Immunization Report Summary
        </h5>
      </div>

      {/* General Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 px-[8rem]">
        <div className="flex flex-col">
          <label>Municipality/City:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Province:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Region:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
        <div className="flex flex-col">
          <label>Year:</label>
          <input type="text" className="border-b border-black bg-transparent outline-none p-1" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-[2rem] px-[8rem]">
      
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 px-[8rem]">
        <div className="flex flex-col">
          <label>Prepared By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of Immunization Coordinator</p>
        </div>
        <div className="flex flex-col">
          <label>Checked By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of City/Municipal Health</p>
        </div>
        <div className="flex flex-col">
          <label>Approved By:</label>
          <div className="border-b border-black bg-transparent outline-none p-[1rem] w-full"></div>
          <p className="mt-2">Name & Signature of Mayor</p>
        </div>
      </div>
    </div>
  );
};

export default ImmuniReport;
function fetchImmunizationData() {
    throw new Error('Function not implemented.');
}

