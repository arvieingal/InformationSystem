"use client";
import React, { useEffect, useState } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
import { Doughnut } from "react-chartjs-2";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { dummySectorData } from "@/constants/tableDummyData";
import { sectorDonutData } from "@/constants/chartDummyData";
import api from "@/lib/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

type PurokData = {
  purok_id: number,
  purok_name: string,
  sitio_purok: string,
}

const Sector = () => {
  const [purokData, setPurokData] = useState<PurokData[]>([]);
  const [selectedPurokId, setSelectedPurokId] = useState<number | null>(null);
  const [sectorDonutData, setSectorDonutData] = useState<{
    labels: string[];
    datasets: { data: number[]; backgroundColor: string[] }[];
  } | null>(null);
  const [totalPopulation, setTotalPopulation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('totalPopulation', totalPopulation)

  useEffect(() => {
    const fetchPurokData = async () => {
      try {
        const response = await api.get('/api/purok');
        setPurokData(response.data);
      } catch (error) {
        console.error("Error fetching purok data:", error);
      }
    };

    fetchPurokData();
  }, []);

  const handleRowClick = async (purok: PurokData) => {
    setSelectedPurokId(purok.purok_id);
    setLoading(true);

    console.log("Clicked purok:", purok);

    try {
      const response = await api.get(`/api/sectoral-by-purok?sitio_purok=${purok.sitio_purok}`);
      const filteredData = response.data.find((item: { purok_id: number }) => item.purok_id === purok.purok_id);

      if (filteredData) {
        const allLabels = ['LGBT', 'PWD', 'Senior Citizen', 'Solo Parent', 'Habal Habal', 'Erpat', 'Others'];
        const allData = [
          parseInt(filteredData.LGBT, 10) || 0,
          parseInt(filteredData.PWD, 10) || 0,
          parseInt(filteredData.Senior_Citizen, 10) || 0,
          parseInt(filteredData.Solo_Parent, 10) || 0,
          parseInt(filteredData.Habal_Habal, 10) || 0,
          parseInt(filteredData.Erpat, 10) || 0,
          parseInt(filteredData.Others, 10) || 0,
        ];

        const filteredLabels = allLabels.filter((_, index) => allData[index] !== 0);
        const filteredValues = allData.filter((value) => value !== 0);

        if (filteredLabels.length > 0) {
          setSectorDonutData({
            labels: filteredLabels,
            datasets: [
              {
                data: filteredValues,
                backgroundColor: ["#B2E3C3", "#FFD7BE", "#007F73", "#08C44C", "#F5F5DC", "#FFC2A7", "#F7E34D",].slice(
                  0,
                  filteredLabels.length
                ),
              },
            ],
          });
        } else {
          setSectorDonutData(null);
        }
      } else {
        setSectorDonutData(null);
      }

      const populationResponse = await api.get(`/api/purok-population?sitio_purok=${purok.purok_name}`);
      console.log('populationResponse', populationResponse)
      const populationData = populationResponse.data.find((item: { sitio_purok: string }) => item.sitio_purok === purok.purok_name);
      console.log('populationData', populationData)
      setTotalPopulation(populationData ? populationData.total_count : null);
    } catch (error) {
      console.error('Error fetching sectoral data:', error);
      setSectorDonutData(null);
    } finally {
      setLoading(false);
    }
  };


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

  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />

      <div className="h-[77%] flex px-32 pb-4">
        <div className="h-full w-[50%] pr-4">
          <div className="h-[13%] w-full bg-white">
            <div className="font-semibold h-full flex justify-center items-center text-[22px]">
              LISTS OF PUROK IN BARANGAY LUZ
            </div>
          </div>
          <div className="h-[87%] w-full pt-4">
            <div className="bg-white h-full overflow-y-auto overflow-x-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="sticky top-0 bg-white z-10">
                    <th className="p-2 font-semibold">Purok Number</th>
                    <th className="p-2 text-left font-semibold">Purok Name</th>
                  </tr>
                </thead>
                <tbody>
                  {purokData.map((purok) => (
                    <tr
                      key={purok.purok_id}
                      className={`${selectedPurokId === purok.purok_id
                        ? 'bg-[#D1E3E0] border border-[#007F73]'
                        : 'bg-white hover:bg-[#D1E3E0] hover:border hover:border-[#007F73]'
                        }`}
                      onClick={() => handleRowClick(purok)}
                    >
                      <td className="p-2 text-center">{purok.purok_id}</td>
                      <td className="p-2 text-left">{purok.purok_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="h-full w-[50%] bg-white">
          <div className="w-full h-full flex justify-center py-10 relative">
            {loading ? (
              <p>Loading...</p>
            ) : selectedPurokId === null ? (
              <div className="text-center text-gray-500">
                <p>Please select a purok to view data.</p>
              </div>
            ) : sectorDonutData ? (
              <div className="w-full h-[90%] flex justify-center"><Doughnut key={selectedPurokId} data={sectorDonutData} /></div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No data available for the selected purok.</p>
              </div>
            )}
            <div className="absolute bottom-0 left-0 p-4 text-[14px]">
              Total Population: {totalPopulation !== null ? totalPopulation : 'N/A'}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 text-[14px]">
              Purok {selectedPurokId}: {purokData.find(purok => purok.purok_id === selectedPurokId)?.purok_name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sector;
