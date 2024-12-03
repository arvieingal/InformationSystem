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
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
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
    <div className="h-full px-6 pb-6 overflow-hidden">
      <div className="h-[50%] grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Age Category List */}
        <div className="w-full bg-white p-8 shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-center font-bold mb-6 text-gray-900 text-lg">AGE CATEGORY BY MONTH</h2>
          {['0-6 Months', '7-12 Months', '12-24 Months', '24-32 Months', '32-48 Months', '48-60 Months', '60-72 Months'].map((age) => (
            <div
              key={age}
              className={`p-3 cursor-pointer transition-colors duration-300 rounded-md ${age === selectedAgeCategory ? 'bg-blue-300' : 'hover:bg-blue-200'
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

      <div className="h-[50%] grid grid-cols-3 gap-6 pt-6">
        <div className="h-full flex flex-col justify-center items-center w-full bg-white shadow rounded">
          <p className='text-center text-2xl font-semibold text-gray-900 mt-4'>Gender-Based Nutritional Status Distribution</p>
          <div className='w-full h-full'>
            <div className="w-[90%] flex justify-center items-center h-[90%]">
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
        </div>
        <div className="justify-center items-center h-full w-full bg-white shadow rounded-lg p-6">
          <p className='text-center text-2xl font-semibold text-gray-900 mb-4'>Proportion of Nutritional Status Categories</p>
          <div className="w-full h-full">
            <div className="h-[85%] flex justify-center items-center w-full relative">
              <div className="w-[45%]">
                <Doughnut data={sectorDonutData} options={donutOption} />
              </div>
              <div className="absolute right-0 top-[25%]">
                <DoughnutLegend data={sectorDonutData} />
              </div>
            </div>
            {/* <div className="flex justify-center items-center">
              <div className="flex h-full w-full">
                <Doughnut data={sectorDonutData} options={donutOption} />
              </div>
              <div className="flex">
                <DoughnutLegend data={sectorDonutData} />
              </div>
            </div> */}
          </div>
        </div>
        <div className="justify-center items-center h-full w-full bg-white p-6 shadow-lg rounded-lg">
          <p className='text-center text-2xl font-semibold text-gray-900'>Nutritional Status by Purok</p>
          <div className='w-full h-full'>
            <div className="w-full flex justify-center items-center h-[90%]">
              <Bar
                data={{
                  ...populationDonutData,
                  datasets: populationDonutData.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: [
                      '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5',
                      '#FF8C33', '#8C33FF', '#33FF8C', '#FF3333', '#33FF33',
                      '#3333FF', '#FF33FF', '#33FFFF', '#FFFF33', '#FF9933'
                    ],
                  })),
                }}
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
    </div>
  );
}

export default HealthPage;
