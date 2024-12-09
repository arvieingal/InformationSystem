"use client";
import React, { useEffect, useState } from "react";
import CardGrid from "@/components/CardGrid";
import { dashboardCards } from "@/constants/cardData";
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
import { Bar, Doughnut } from "react-chartjs-2";
import { DoughnutLegend } from "@/components/DoughnutLegend";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const labels = [
  "Elderly (75+ years)",
  "Senior Citizens (60-74 years)",
  "Adults (35-59 years)",
  "Young Adults (20-34 years)",
  "Youth (13-19 years)",
  "Children (1-12 years)",
  "Infants (0-1 year)",
];

export default function page() {
  const [loading, setLoading] = useState(true);

  const [genderData, setGenderData] = useState({ Male: 0, Female: 0 })
  const [voterDistribution, setVoterDistribution] = useState<{ registered: number; nonRegistered: number }>({ registered: 0, nonRegistered: 0 });
  const [ageData, setAgeData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; borderRadius: number; barThickness: number; }[] }>({
    labels: labels,
    datasets: [],
  });
  const [purokPopulationData, setPurokPopulationData] = useState<{ labels: string[]; datasets: { data: number[]; backgroundColor: string[]; }[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchGenderData = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/gender");
        const data = response.data;

        const genderCounts: { Male: number; Female: number } = {
          Male: 0,
          Female: 0,
        };

        data.forEach((item: { gender: string; count: number }) => {
          genderCounts[item.gender as keyof typeof genderCounts] = item.count;
        });

        setGenderData(genderCounts);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchGenderData();
  }, []);

  const total = genderData.Male + genderData.Female;
  const malePercentage = ((genderData.Male / total) * 100).toFixed(0);
  const femalePercentage = ((genderData.Female / total) * 100).toFixed(
    0
  );

  useEffect(() => {
    const fetchRegisteredData = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/registered-voter");

        const registeredCount = response.data.find((item: { is_registered_voter: string; count: number }) => item.is_registered_voter === "Yes")?.count || 0;
        const nonRegisteredCount = response.data.find((item: { is_registered_voter: string; count: number }) => item.is_registered_voter === "No")?.count || 0;
        setVoterDistribution({ registered: registeredCount, nonRegistered: nonRegisteredCount });
      } catch (error) {
        console.error("Error fetching registered data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchRegisteredData();
  }, []);

  useEffect(() => {
    const fetchAgeData = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/age-group");
        const data = response.data;

        const counts = labels.map(label => {
          const ageGroup = data.find((item: { age_group: string; count: number }) => {
            switch (label) {
              case "Elderly (75+ years)":
                return item.age_group === "75+";
              case "Senior Citizens (60-74 years)":
                return item.age_group === "60 - 74";
              case "Adults (35-59 years)":
                return item.age_group === "35 - 59";
              case "Young Adults (20-34 years)":
                return item.age_group === "20 - 34";
              case "Youth (13-19 years)":
                return item.age_group === "13 - 19";
              case "Children (1-12 years)":
                return item.age_group === "2 - 12";
              case "Infants (0-1 year)":
                return item.age_group === "0 - 1";
              default:
                return false;
            }
          });
          return ageGroup ? ageGroup.count : 0;
        });

        setAgeData({
          labels: labels,
          datasets: [
            {
              label: "Population",
              data: counts,
              backgroundColor: "#00C0A9",
              borderRadius: 5,
              barThickness: 18,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching age data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchAgeData();
  }, []);

  useEffect(() => {
    const fetchPurokPopulationData = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/purok-population");
        const data: { sitio_purok: string; total_count: number }[] = response.data;

        const labels = data.map(item => item.sitio_purok);
        const counts = data.map(item => item.total_count);

        setPurokPopulationData({
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: [
              "#FF0000",
              "#FF4500",
              "#FFD700",
              "#FFFF00",
              "#ADFF2F",
              "#7FFF00",
              "#00FF00",
              "#00FA9A",
              "#00FFFF",
              "#1E90FF",
              "#0000FF",
              "#8A2BE2",
              "#FF00FF",
              "#FF1493",
              "#FF69B4",
            ],
          }],
        });
      } catch (error) {
        console.error("Error fetching purok population data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchPurokPopulationData();
  }, []);

  const ageOptions: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: ageData.datasets.length > 0 ? Math.max(...ageData.datasets[0].data) + 10 : 100,
        ticks: {
          stepSize: 10,
          callback: function (value: number | string) {
            const maxDataValue = ageData.datasets.length > 0 ? Math.max(...ageData.datasets[0].data) + 10 : 100;
            const scaleValues = Array.from({ length: Math.ceil(maxDataValue / 10) }, (_, i) => i * 10);
            return scaleValues.includes(Number(value)) ? value : null;
          },
          font: {
            size: 10,
          },
          color: "#000000",
        },
        grid: {
          color: "#000000",
          display: false,
        },
      },
      y: {
        grid: {
          color: "#000000",
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#000000",
        },
      },
    },
    plugins: {
      datalabels: {
        color: '',
        font: {
          weight: 'bold',
          size: 12,
        }
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  const populationDonutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "50%",
    plugins: {
      datalabels: {
        color: '',
        font: {
          weight: 'bold',
          size: 12,
        }
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  return (
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />

      <div className="flex gap-[2rem] h-[77%] pb-[1rem]">
        <div className="w-[45%] pl-[2rem] h-full flex flex-col">
          <div className="h-[18%] pb-3">
            <div className="flex flex-col justify-center w-full px-12 py-3 bg-white rounded-xl h-full">
              {loading ? (
                <div role="status" className="w-full h-full animate-pulse flex flex-col justify-center items-center">
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-[12px]">GENDER</div>
                  <div className="flex my-1 h-5 w-full rounded-full bg-green-200 overflow-hidden">
                    <div
                      className="bg-[#007F73] h-full"
                      style={{ width: `${malePercentage}%` }}
                    ></div>
                    <div
                      className="bg-[#B1E5BA] h-full"
                      style={{ width: `${femalePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#007F73]"></div>
                      <div className="flex items-center gap-1">
                        <p className="text-[12px]">Male</p>
                        <p className="text-[14px] font-semibold">
                          {genderData.Male.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#B1E5BA]"></div>
                      <div className="flex items-center gap-1">
                        <p className="text-[12px]">Female</p>
                        <p className="text-[14px] font-semibold">
                          {genderData.Female.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          <div className="h-[18%] pb-3">
            <div className="flex flex-col justify-center w-full bg-white rounded-xl px-12 py-3 h-full">
              {loading ? (
                <div role="status" className="w-full h-full animate-pulse flex flex-col justify-center items-center">
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-[12px]">
                    NUMBER OF REGISTERED VOTERS BY 2024
                  </div>
                  <div className="flex my-1 h-5 w-full rounded-full bg-green-200 overflow-hidden">
                    <div
                      className="bg-[#B1E5BA] h-full"
                      style={{ width: `${voterDistribution.registered}%` }}
                    ></div>
                    <div
                      className="bg-[#007F73] h-full"
                      style={{ width: `${voterDistribution.nonRegistered}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#B1E5BA]"></div>
                      <div className="flex items-center gap-1">
                        <p className="text-[12px]">Registered Voters</p>
                        <p className="text-[14px] font-semibold">
                          {voterDistribution.registered.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#007F73]"></div>
                      <div className="flex items-center gap-1">
                        <p className="text-[12px]">Non Voters</p>
                        <p className="text-[14px] font-semibold">
                          {voterDistribution.nonRegistered.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full bg-white rounded-xl h-[64%] p-6 text-[14px] font-semibold">
            {loading ? (
              <div className="flex justify-center items-center h-full w-full">
                <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <div>Age Group</div>
                  <div>Population by Age Group</div>
                </div>
                <div className="flex justify-center w-full">
                  <div className="w-[90%]">
                    <Bar data={ageData} options={ageOptions} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-[55%] pr-[2rem]">
          <div className="h-full bg-white rounded-xl px-6">
            {loading ? (
              <div className="flex justify-center items-center h-full w-full">
                <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
              </div>
            ) : (
              <>
                <div className="h-[85%] flex justify-center items-center w-full">
                  <div className="w-[50%]">
                    <Doughnut data={purokPopulationData} options={populationDonutOptions} />
                  </div>
                  <div className="absolute right-[5%] top-[34%]">
                    <DoughnutLegend data={purokPopulationData} />
                  </div>
                </div>
                <p className="text-[12px]">
                  *Barangay Luz, Mabolo City*
                  <br />
                  *Population Number displayed in a pie chart, this data relies
                  on the last updated document records.
                </p>
              </>
            )}
          </div>
        </div>
      </div >
    </div >
  );
}
