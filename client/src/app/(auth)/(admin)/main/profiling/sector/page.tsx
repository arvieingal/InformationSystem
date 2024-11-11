"use client";
import React, { useState } from "react";
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

const Sector = () => {
  const donutOption: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "50%", // Doughnut cutout for inner circle
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
      datalabels: {
        // Show data value inside the chart
        color: "#000", // Data value color inside
        formatter: (value: number) => `${value}%`, // Show percentage value inside
        font: {
          size: 14, // Adjust value font size
          weight: "bold",
        },
        anchor: "center", // Position data value inside the slice
        align: "center", // Align data value in the center
      },
      tooltip: {
        enabled: true, // Tooltip still works
      },
    },
    // Add label outside configuration via layout adjustment
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
        <div className="h-[full] w-[50%] pr-4">
          <div className="h-[13%] w-full bg-white">
            <div className="font-semibold h-full flex justify-center items-center text-[22px]">
              LISTS OF PUROK IN BARANGAY LUZ
            </div>
          </div>
          <div className="h-[87%] w-full pt-4">
            <div className="bg-white h-full">
              <table className="w-full text-[14px]">
                <thead>
                  <tr>
                    <th className="p-2 font-semibold">Purok Number</th>
                    <th className="p-2 text-left font-semibold">Purok Name</th>
                  </tr>
                </thead>
                <tbody>
                  {dummySectorData.map((purok) => (
                    <tr key={purok.number}>
                      <td className="p-2 text-center">{purok.number}</td>
                      <td className="p-2 text-left">{purok.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="h-full w-[50%] bg-white">
          <div className="w-full h-full flex justify-center py-10">
              <Doughnut data={sectorDonutData} options={donutOption} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sector;
