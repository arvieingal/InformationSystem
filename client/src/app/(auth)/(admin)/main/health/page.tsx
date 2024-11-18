'use client'
import React, { useState, useEffect } from 'react';
import AgeCategoryChart from '@/components/AgeCategoryChart';
import NutritionalStatusChart from '@/components/NutritionalStatusChart';

interface Child {
  age: number;
}

const HealthPage = () => {
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>('0-6 Months');
  const [nutritionalData, setNutritionalData] = useState<Child[]>([]);

  useEffect(() => {
    const fetchNutritionalData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/children");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setNutritionalData(data);
        } else {
          console.error("Failed to fetch nutritional data.");
        }
      } catch (error) {
        console.error("Error fetching nutritional data:", error);
      }
    };

    fetchNutritionalData();
  }, []);

  // Function to filter nutritional data based on selected age category
  const filterNutritionalData = (ageCategory: string): Child[] => {
    // Define age range based on the selected category
    const ageRanges: Record<string, [number, number]> = {
      '0-6 Months': [0, 6],
      '7-12 Months': [7, 12],
      '12-24 Months': [12, 24],
      '24-32 Months': [24, 32],
      '32-48 Months': [32, 48],
      '48-60 Months': [48, 60],
      '60-72 Months': [60, 72],
    };

    const [minAge, maxAge] = ageRanges[ageCategory];
    return nutritionalData.filter(child => child.age >= minAge && child.age <= maxAge);
  };

  const filteredData = filterNutritionalData(selectedAgeCategory);

  return (
    <div className="p-4 bg-gray-50 min-h-screen overflow-hidden">
      <h1 className="text-center text-2xl font-semibold mb-4">Number of Children Vaccinated by Vaccine Type and Gender</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Age Category List */}
        <div className="w-full bg-white p-4 shadow rounded overflow-hidden">
          <h2 className="text-center font-bold mb-4">AGE CATEGORY BY MONTH</h2>
          {['0-6 Months', '7-12 Months', '12-24 Months', '24-32 Months', '32-48 Months', '48-60 Months', '60-72 Months'].map((age) => (
            <div
              key={age}
              className={`p-2 cursor-pointer ${age === selectedAgeCategory ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedAgeCategory(age)}
            >
              {age}
            </div>
          ))}
        </div>

        {/* Age Category Chart */}
        <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded overflow-hidden">
          <AgeCategoryChart ageCategory={selectedAgeCategory} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <NutritionalStatusChart title="Weight for Age" nutritionalData={filteredData} />
        <NutritionalStatusChart title="Height/Length for Age" nutritionalData={filteredData} />
        <NutritionalStatusChart title="Weight for Length/Height" nutritionalData={filteredData} />
      </div>
    </div>
  );
}

export default HealthPage;
