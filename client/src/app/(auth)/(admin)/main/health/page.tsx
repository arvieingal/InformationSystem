'use client'
import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { genderDistribution } from '@/constants/chartDummyData';
import AgeCategoryChart from '@/components/AgeCategoryChart';

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
  const { data: session } = useSession();
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string>('0-6 Months');
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [nutritionalData, setNutritionalData] = useState<Child[]>([]);
  const [filteredData, setFilteredData] = useState<Child[]>([]);
  const [purokNames, setPurokNames] = useState<string[]>([]); // To store unique Purok names
  const [selectedPurok, setSelectedPurok] = useState<string>(''); // State for selected purok

  useEffect(() => {
    // Fetch children data: age, sex, nutritional status, and purok
    const fetchChildrenData = async () => {
      try {
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

          // Get unique Purok names from the children data
          const uniquePuroks = Array.from(new Set(data.map(child => child.purok)));
          setPurokNames(uniquePuroks);
        } else {
          console.error("Failed to fetch children data.");
        }
      } catch (error) {
        console.error("Error fetching children data:", error);
      }
    };

    // Fetch immunization data: vaccine type and gender
    const fetchNutritionalData = async () => {
      try {
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
      }
    };

    fetchChildrenData();
    fetchNutritionalData();
  }, []);

  useEffect(() => {
    const filterNutritionalData = (): Child[] => {
      const ageRanges: Record<string, [number, number]> = {
        '0-6 Months': [0, 6],
        '7-12 Months': [7, 12],
        '12-24 Months': [12, 24],
        '24-32 Months': [24, 32],
        '32-48 Months': [32, 48],
        '48-60 Months': [48, 60],
        '60-72 Months': [60, 72],
      };

      const [minAge, maxAge] = ageRanges[selectedAgeCategory];
      return nutritionalData.filter(child => {
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
  

  console.log("filteredData", filteredData);

  const getGenderDistribution = (): { male: number; female: number } => {
    const male = filteredData.filter(child => child.sex === 'Male').length;
    const female = filteredData.filter(child => child.sex === 'Female').length;
    return { male, female };
  };

  const getSectorDistribution = (): number[] => {
    const categories = ['Severely Underweight', 'Underweight', 'Normal', 'Overweight', 'Obese'];
  
    // Filter children based on the selected purok
    const filteredByPurok = selectedPurok
      ? childrenData.filter(child => child.purok === selectedPurok)
      : childrenData; // If no purok is selected, use all data
  
    // Count children in each nutritional category
    return categories.map(category =>
      filteredByPurok.filter(child => child.nutritional_status === category).length
    );
  };
  

  const getPurokDistribution = (): number[] => {
    return purokNames.map(() =>
      Math.round(Math.random() * filteredData.length)
    ); // Replace with real logic.
  };

  const genderDistributionData = getGenderDistribution();
  // const sectorData = getSectorDistribution();
  const purokData = getPurokDistribution();

  const handlePurokChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPurok(event.target.value);
  };
  

  return (
    <div className=" px-4 pb-4 overflow-hidden">
      <div className="h-[50%] grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="w-full bg-white p-4 shadow-lg rounded-lg overflow-hidden">
        <h2 className="text-center font-bold mb-4 text-gray-900 text-lg">Select Purok</h2>
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
          <h2 className="text-center font-bold mb-4 text-gray-900 text-lg">AGE CATEGORY BY MONTH</h2>
          {['0-6 Months', '7-12 Months', '12-24 Months', '24-32 Months', '32-48 Months', '48-60 Months', '60-72 Months'].map((age) => (
            <div
              key={age}
              className={`p-2 cursor-pointer transition-colors duration-300 rounded-md ${age === selectedAgeCategory ? 'bg-blue-300' : 'hover:bg-blue-200'
                }`}
              onClick={() => setSelectedAgeCategory(age)}
            >
              <span className="block text-center text-gray-800 font-medium">{age}</span>
            </div>
          ))}
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded overflow-hidden">
          <p className='text-center text-lg font-semibold text-gray-900'>Number of Children Vaccinated by Vaccine Type and Gender</p>
          <AgeCategoryChart ageCategory={selectedAgeCategory} data={filteredData.map(child => ({...child, id: parseInt(child.id), name: child.name}))} />
        </div>
      </div>

      <div className="h-[25rem] grid grid-cols-3 gap-4 pt-4">
        <div className="h-full flex flex-col justify-center items-center w-full bg-white shadow rounded">
          <p className="text-center text-xl font-semibold text-gray-900">Gender-Based Distribution</p>
          <div className="w-[85%] flex justify-center items-center h-[85%]">
            <Bar
              data={{
                labels: ['Male', 'Female'],
                datasets: [{
                  data: [genderDistributionData.male, genderDistributionData.female],
                  backgroundColor: ['#4A90E2', '#50E3C2'],
                }],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>

        <div className="justify-center items-center w-full bg-white shadow rounded-lg pb-10 pt-4 h-[25rem]">
          <p className="text-center text-xl font-semibold text-gray-900">Proportion of Nutritional Status Categories by Purok</p>
          <div className='w-full flex justify-center items-center h-[85%]'>
            <Doughnut
              data={{
                labels: ['Severely Underweight', 'Underweight', 'Normal', 'Overweight', 'Obese'],
                datasets: [{
                  data: sectorData,
                  backgroundColor: ['#FFD700', '#FF4500', '#00FF00', '#1E90FF', '#8A2BE2'],
                }],
              }}
            />
          </div>
        </div>

        <div className="justify-center items-center h-full w-full bg-white p-4 shadow-lg rounded-lg">
          <p className="text-center text-xl font-semibold text-gray-900">Children Population by Purok</p>
          <Bar
            data={{
              labels: purokNames,
              datasets: [{
                data: purokData,
                backgroundColor: '#4A90E2',
              }],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
