'use client'
import React, { useState } from 'react';
import AgeCategoryChart from '@/components/AgeCategoryChart';
import NutritionalStatusChart from '@/components/NutritionalStatusChart';

const HealthPage = () => {
  const [selectedAgeCategory, setSelectedAgeCategory] = useState('0-6 Years Month');

  return (
    <div className="p-4 bg-gray-50 min-h-screen overflow-hidden">
      <h1 className="text-center text-2xl font-semibold mb-4">Number of Children Vaccinated by Vaccine Type and Gender</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Age Category List */}
        <div className="w-full bg-white p-4 shadow rounded  overflow-hidden">
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
        <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded  overflow-hidden">
          <AgeCategoryChart  ageCategory={selectedAgeCategory} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <NutritionalStatusChart title="Weight for Age" />
        <NutritionalStatusChart title="Height/Length for Age" />
        <NutritionalStatusChart title="Weight for Length/Height" />
      </div>
    </div>
  );
}

export default HealthPage;
