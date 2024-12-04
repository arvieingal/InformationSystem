// components/AgeCategoryChart.tsx
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// Define a single, unified Child type
export interface Child {
  id: number;
  name: string;
  age: number;
  sex?: string; // Optional property if needed
  vaccine_type?: string; // Optional property if needed
}


export interface AgeCategoryChartProps {
  ageCategory: string;
  data: Child[];
}


import { ChartOptions } from "chart.js";



export default function AgeCategoryChart({ ageCategory, data = [] }: AgeCategoryChartProps) {
  const vaccineTypes = Array.from(
    new Set(data.map((child) => child.vaccine_type))
  );
  
  const boysData = vaccineTypes.map((vaccine) =>
    data.filter((child) => child.vaccine_type === vaccine && child.sex === "Male").length
  );
  
  const girlsData = vaccineTypes.map((vaccine) =>
    data.filter((child) => child.vaccine_type === vaccine && child.sex === "Female").length
  );

  const chartData = {
    labels: vaccineTypes,
    datasets: [
      {
        label: "Girls",
        backgroundColor: "rgb(255, 99, 132)",
        data: girlsData,
      },
      {
        label: "Boys",
        backgroundColor: "rgb(75, 192, 192)",
        data: boysData,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // Explicitly set to a valid literal value
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <h3 className="text-center font-semibold">{`Age Category: ${ageCategory}`}</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
