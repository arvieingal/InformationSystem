"use client";
import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { genderDistribution } from "@/constants/chartDummyData";
import AgeCategoryChart from "@/components/AgeCategoryChart";

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
  sex: string;
  name: string;
  id: string;
  age: number;
  gender: string;
  vaccineType: string;
  nutritional_status?: string;
  purok: string;
}

const HealthPage = () => {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [selectedAgeCategory, setSelectedAgeCategory] =
    useState<string>("0-6 Months");
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [nutritionalData, setNutritionalData] = useState<Child[]>([]);
  const [filteredData, setFilteredData] = useState<Child[]>([]);
  const [purokNames, setPurokNames] = useState<string[]>([]); // To store unique Purok names
  const [selectedPurok, setSelectedPurok] = useState<string>(""); // State for selected purok
  const [purokData, setPurokData] = useState<number[]>([]);

  useEffect(() => {
    // Fetch children data: age, sex, nutritional status, and purok
    const fetchChildrenData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/children");
        if (response.status === 200) {
          const data: Child[] = response.data.map((item: any) => ({
            id: item.child_id,
            name: item.full_name,
            age: item.age,
            sex: item.sex,
            nutritional_status: item.nutritional_status,
            purok: item.sitio_purok,
          }));
          setChildrenData(data);

          const uniquePuroks = Array.from(
            new Set(data.map((child) => child.purok))
          );
          setPurokNames(uniquePuroks);
        } else {
          console.error("Failed to fetch children data.");
        }
      } catch (error) {
        console.error("Error fetching children data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNutritionalData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/child-immunization-record");
        if (response.status === 200) {
          const data: Child[] = response.data.map((item: any) => ({
            id: item.child_id,
            name: item.full_name,
            age: item.age,
            sex: item.sex,
            vaccine_type: item.vaccine_type,
          }));
          setNutritionalData(data);
        } else {
          console.error("Failed to fetch nutritional data.");
        }
      } catch (error) {
        console.error("Error fetching nutritional data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildrenData();
    fetchNutritionalData();
  }, []);

  useEffect(() => {
    const filterNutritionalData = (): Child[] => {
      const ageRanges: Record<string, [number, number]> = {
        "0-6 Months": [0, 6],
        "7-12 Months": [7, 12],
        "12-24 Months": [12, 24],
        "24-32 Months": [24, 32],
        "32-48 Months": [32, 48],
        "48-60 Months": [48, 60],
        "60-72 Months": [60, 72],
      };

      const [minAge, maxAge] = ageRanges[selectedAgeCategory];
      return nutritionalData.filter((child) => {
        const ageInMonths = Math.floor(child.age * 12);
        return ageInMonths >= minAge && ageInMonths <= maxAge;
      });
    };

    setFilteredData(filterNutritionalData());
  }, [selectedAgeCategory, nutritionalData]);

  const [sectorData, setSectorData] = useState<number[]>([]);

  useEffect(() => {
    const sectorData = getSectorDistribution();
    setSectorData(sectorData);
  }, [selectedPurok, childrenData]);

  const getGenderDistribution = (): { male: number; female: number } => {
    const male = filteredData.filter((child) => child.sex === "Male").length;
    const female = filteredData.filter(
      (child) => child.sex === "Female"
    ).length;
    return { male, female };
  };

  const getSectorDistribution = (): number[] => {
    const categories = [
      "Severely Underweight",
      "Underweight",
      "Normal",
      "Overweight",
      "Obese",
    ];

    const filteredByPurok = selectedPurok
      ? childrenData.filter((child) => child.purok === selectedPurok)
      : childrenData;

    return categories.map(
      (category) =>
        filteredByPurok.filter((child) => child.nutritional_status === category)
          .length
    );
  };

  const getPurokDistribution = async (): Promise<number[]> => {
    try {
      const response = await api.get("/api/count-nutritional-by-purok", {
        params: { age_range: selectedAgeCategory },
      });
      if (response.status === 200) {
        const data = response.data;
        return purokNames.map((purokName) => {
          const purokData = data.find(
            (item: any) =>
              item.purok_name === purokName &&
              item.age_range === selectedAgeCategory
          );
          return purokData ? purokData.child_count : 0;
        });
      } else {
        console.error("Failed to fetch purok distribution data.");
        return purokNames.map(() => 0);
      }
    } catch (error) {
      console.error("Error fetching purok distribution data:", error);
      return purokNames.map(() => 0);
    }
  };

  useEffect(() => {
    const fetchPurokDistribution = async () => {
      const distributionData = await getPurokDistribution();
      setPurokData(distributionData);
    };

    fetchPurokDistribution();
  }, [selectedAgeCategory, purokNames]);

  const genderDistributionData = getGenderDistribution();

  const handlePurokChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPurok(event.target.value);
  };

  return (
    <div className=" px-4 pb-4 overflow-hidden">
      <div className="h-[50%] grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="w-full bg-white p-4 shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-center font-bold mb-4 text-gray-900 text-lg">
            Select Purok
          </h2>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            value={selectedPurok}
            onChange={handlePurokChange}
          >
            <option value="">All Puroks</option>
            {purokNames.map((purok) => (
              <option key={purok} value={purok}>
                {purok}
              </option>
            ))}
          </select>
          <h2 className="text-center font-bold mb-4 text-gray-900 text-lg">
            AGE CATEGORY BY MONTH
          </h2>
          {[
            "0-6 Months",
            "7-12 Months",
            "12-24 Months",
            "24-32 Months",
            "32-48 Months",
            "48-60 Months",
            "60-72 Months",
          ].map((age) => (
            <div
              key={age}
              className={`p-2 cursor-pointer transition-colors duration-300 rounded-md ${
                age === selectedAgeCategory
                  ? "bg-blue-300"
                  : "hover:bg-blue-200"
              }`}
              onClick={() => setSelectedAgeCategory(age)}
            >
              <span className="block text-center text-gray-800 font-medium">
                {age}
              </span>
            </div>
          ))}
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded overflow-hidden">
          <p className="text-center text-lg font-semibold text-gray-900">
            Number of Children Vaccinated by Vaccine Type and Gender
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
            </div>
          ) : (
            <AgeCategoryChart
              ageCategory={selectedAgeCategory}
              data={filteredData.map((child) => ({
                ...child,
                id: parseInt(child.id),
                name: child.name,
              }))}
            />
          )}
        </div>
      </div>

      <div className="h-[25rem] grid grid-cols-3 gap-4 pt-4">
        <div className="h-full flex flex-col justify-center items-center w-full bg-white shadow rounded">
          <p className="text-center text-xl font-semibold text-gray-900">
            Gender-Based Distribution
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
            </div>
          ) : (
            <div className="w-[85%] flex justify-center items-center h-[85%]">
              <Bar
                data={{
                  labels: ["Male", "Female"],
                  datasets: [
                    {
                      data: [
                        genderDistributionData.male,
                        genderDistributionData.female,
                      ],
                      backgroundColor: ["#4A90E2", "#50E3C2"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const data = context.dataset.data as number[];
                          const total = data.reduce(
                            (sum, value) => sum + value,
                            0
                          );
                          const value = context.raw as number;
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="justify-center items-center w-full bg-white shadow rounded-lg pb-10 pt-4 h-[25rem]">
          <p className="text-center text-xl font-semibold text-gray-900">
            Proportion of Nutritional Status Categories by Purok
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center h-[85%]">
              <Doughnut
                data={{
                  labels: [
                    "Severely Underweight",
                    "Underweight",
                    "Normal",
                    "Overweight",
                    "Obese",
                  ],
                  datasets: [
                    {
                      data: sectorData,
                      backgroundColor: [
                        "#FFD700",
                        "#FF4500",
                        "#00FF00",
                        "#1E90FF",
                        "#8A2BE2",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const data = context.dataset.data as number[];
                          const total = data.reduce(
                            (sum, value) => sum + value,
                            0
                          );
                          const value = context.raw as number;
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${context.label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="justify-center items-center h-full w-full bg-white p-4 shadow-lg rounded-lg">
          <p className="text-center text-xl font-semibold text-gray-900">
            Children Population by Purok
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
            </div>
          ) : (
            <Bar
              data={{
                labels: purokNames,
                datasets: [
                  {
                    data: purokData,
                    backgroundColor: "#4A90E2",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const data = context.dataset.data as number[];
                        const total = data.reduce(
                          (sum, value) => sum + value,
                          0
                        );
                        const value = context.raw as number;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${context.label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
