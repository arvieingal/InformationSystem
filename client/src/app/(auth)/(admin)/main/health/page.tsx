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
import { Doughnut, Bar } from 'react-chartjs-2';
import { populationDonutData, sectorDonutData, genderDistribution } from '@/constants/chartDummyData';
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

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [genderDistribution.male, genderDistribution.female],
        backgroundColor: ['#4A90E2', '#50E3C2'],
      },
    ],
  };

  return (
    <div className="h-full px-6 pb-6 overflow-hidden bg-white">
      <div className="h-[46%] grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Age Category List */}
        <div className="w-full relative bg-white p-8 shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-center font-bold mb-6 text-gray-900 text-lg">AGE CATEGORY BY MONTH</h2>
          {['0-6 Months', '7-12 Months', '12-24 Months', '24-32 Months', '32-48 Months', '48-60 Months', '60-72 Months'].map((age) => (
            <div
              key={age}
              className={`p-3 cursor-pointer transition-colors duration-300 rounded-md ${
                age === selectedAgeCategory ? 'bg-blue-300' : 'hover:bg-blue-200'
              }`}
              onClick={() => setSelectedAgeCategory(age)}
            >
              <span className="block text-center text-gray-800 font-medium">{age}</span>
            </div>
          ))}
        </div>

        {/* Age Category Chart */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 shadow rounded overflow-hidden">
          <p className='text-center text-xl font-semibold text-gray-900'>Number of Children Vaccinated by Vaccine Type and Gender</p>
          <AgeCategoryChart ageCategory={selectedAgeCategory} />
        </div>
      </div>

      <div className="h-[46%] grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">  
        <div className="grid grid-cols-2 justify-center items-center w-full relative bg-white shadow rounded">
          <p className='col-span-2 text-center text-2xl font-semibold text-gray-900'>Gender-Based Nutritional Status Distribution</p>
          <div className="w-full flex justify-center mt-4" style={{ width: '200%', height: '400px' }}>
            <Bar 
              data={genderData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#333',
                      font: {
                        size: 14,
                      },
                    },
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: '#f5f5f5',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12,
                      },
                    },
                  },
                  y: {
                    min: 100,
                    max: 10000,
                    grid: {
                      color: '#eee',
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12,
                      },
                      stepSize: 1000,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 justify-center items-center w-full relative bg-white p-6 shadow rounded">
          <p className='col-span-2 text-center text-2xl font-semibold text-gray-900'>Proportion of Nutritional Status Categories</p>
          <div className="w-full flex justify-center">
            <Doughnut data={sectorDonutData} options={donutOption} />
          </div>
          <div className="w-full flex justify-center">
            <DoughnutLegend data={sectorDonutData} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 justify-center items-center w-full relative bg-white p-6 shadow-lg rounded-lg">
          <p className='text-center text-2xl font-semibold text-gray-900 mb-4'>Nutritional Status by Purok</p>
          <div className="w-full flex justify-center" style={{ height: '300px' }}>
            <Bar 
              data={populationDonutData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#333',
                      font: {
                        size: 14,
                      },
                    },
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: '#f5f5f5',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12,
                      },
                    },
                  },
                  y: {
                    grid: {
                      color: '#eee',
                    },
                    ticks: {
                      color: '#666',
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthPage;
