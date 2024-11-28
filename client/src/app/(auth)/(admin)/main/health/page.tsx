'use client'
import React, { useState, useEffect } from 'react';
import AgeCategoryChart from '@/components/AgeCategoryChart';
import NutritionalStatusChart from '@/components/NutritionalStatusChart';
import api from '@/lib/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
} from "chart.js";
import { Doughnut } from 'react-chartjs-2';
import { populationDonutData, sectorDonutData } from '@/constants/chartDummyData';
import { DoughnutLegend } from '@/components/DoughnutLegend';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Child {
  age: number;
}

const HealthPage = () => {
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>('0-6 Months');
  const [nutritionalData, setNutritionalData] = useState<Child[]>([]);

  useEffect(() => {
    const fetchNutritionalData = async () => {
      try {
        const response = await api.get("/api/children");
        if (response.status === 200) {
          const data = response.data;
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

  const donutOption: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "50%",
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#000",
        formatter: (value: number) => `${value}%`,
        font: {
          size: 14,
          weight: "bold",
        },
        anchor: "center",
        align: "center",
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        bottom: 20,
      },
    },
  };

  const populationDonutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "50%", // Doughnut cutout
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
    },
  };

  return (
    <div className="h-full px-4 pb-4 overflow-hidden">
      <div className='h-[8%] flex justify-center items-center'>
        <h1 className="text-center text-2xl font-semibold">Number of Children Vaccinated by Vaccine Type and Gender</h1>
      </div>

      <div className="h-[46%] grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="h-[46%] grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="flex justify-center items-center w-full relative bg-white">
          <div className="w-[50%]">
            <Doughnut data={sectorDonutData} options={donutOption} />
          </div>
          <div className="absolute right-[5%] top-[34%]">
            <DoughnutLegend data={sectorDonutData} />
          </div>
        </div>
        <div className="flex justify-center items-center w-full relative bg-white">
          <div className="w-[50%]">
            <Doughnut data={sectorDonutData} options={donutOption} />
          </div>
          <div className="absolute right-[5%] top-[34%]">
            <DoughnutLegend data={sectorDonutData} />
          </div>
        </div>
        <div className="flex justify-center items-center w-full relative bg-white">
          <div className="w-[50%]">
            <Doughnut data={sectorDonutData} options={donutOption} />
          </div>
          <div className="absolute right-[5%] top-[34%]">
            <DoughnutLegend data={sectorDonutData} />
          </div>
        </div>
        {/* <NutritionalStatusChart title="Weight for Age" nutritionalData={filteredData} />
        <NutritionalStatusChart title="Height/Length for Age" nutritionalData={filteredData} />
        <NutritionalStatusChart title="Weight for Length/Height" nutritionalData={filteredData} /> */}
      </div>
    </div>
  );
}

export default HealthPage;
