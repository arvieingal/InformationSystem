"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { usePathname } from "next/navigation";
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
import { ageData, genderDistribution, populationDonutData, voterDistribution } from "@/constants/chartDummyData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function page() {
  const total = genderDistribution.male + genderDistribution.female;
  const malePercentage = ((genderDistribution.male / total) * 100).toFixed(0);
  const femalePercentage = ((genderDistribution.female / total) * 100).toFixed(
    0
  );

  const voterTotal =
    voterDistribution.registered + voterDistribution.nonRegistered;
  const registeredPercentage = (
    (voterDistribution.registered / voterTotal) *
    100
  ).toFixed(0);
  const nonRegisteredPercentage = (
    (voterDistribution.nonRegistered / voterTotal) *
    100
  ).toFixed(0);

  // Configuration options for the chart
  const ageOptions: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y", // This makes the chart horizontal
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 2000, // Custom step size for X-axis
          callback: function (value: number | string) {
            return Number(value).toFixed(0); // Remove decimals from axis labels
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
          display: false, // Remove grid lines for Y-axis
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#000000",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
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
    <div className="h-full w-full">
      <CardGrid cards={dashboardCards} />

      <div className="flex gap-[2rem] h-[77%] pb-[1rem]">
        <div className="w-[45%] pl-[2rem] h-full flex flex-col">
          <div className="h-[18%] pb-3">
            <div className="flex flex-col justify-center w-full px-12 py-3 bg-white rounded-xl h-full">
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
                      {genderDistribution.male.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#B1E5BA]"></div>
                  <div className="flex items-center gap-1">
                    <p className="text-[12px]">Female</p>
                    <p className="text-[14px] font-semibold">
                      {genderDistribution.female.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[18%] pb-3">
            <div className="flex flex-col justify-center w-full bg-white rounded-xl px-12 py-3 h-full">
              <div className="text-[12px]">
                NUMBER OF REGISTERED VOTERS BY 2024
              </div>
              <div className="flex my-1 h-5 w-full rounded-full bg-green-200 overflow-hidden">
                <div
                  className="bg-[#B1E5BA] h-full"
                  style={{ width: `${registeredPercentage}%` }}
                ></div>
                <div
                  className="bg-[#007F73] h-full"
                  style={{ width: `${nonRegisteredPercentage}%` }}
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
            </div>
          </div>

          <div className="flex flex-col w-full bg-white rounded-xl h-[64%] p-6 text-[14px] font-semibold">
            <div className="flex justify-between">
              <div>Age Group</div>
              <div>Population by Age Group</div>
            </div>
            <div className="flex justify-center w-full"> {/* Modified container */}
              <div className="w-[90%]">
                <Bar data={ageData} options={ageOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[55%] pr-[2rem]">
          <div className="h-full bg-white rounded-xl px-6">
            <div className="h-[85%] flex justify-center items-center w-full">
              <div className="w-[50%]">
                <Doughnut data={populationDonutData} options={populationDonutOptions} />
              </div>
              <div className="absolute right-[5%] top-[34%]">
                <DoughnutLegend data={populationDonutData} />
              </div>
            </div>
            <p className="text-[12px]">
              *Barangay Luz, Mabolo City*
              <br />
              *Population Percentage displayed in a pie chart, this data relies
              on the last updated document records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
