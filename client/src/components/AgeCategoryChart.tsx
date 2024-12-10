import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export interface Child {
  id: number;
  name: string;
  age: number;
  sex?: string;
  vaccine_type?: string;
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

  const totalData = vaccineTypes.map((vaccine, index) => boysData[index] + girlsData[index]);

  const chartData = {
    labels: vaccineTypes,
    datasets: [
      {
        label: "Girls",
        backgroundColor: "rgb(255, 99, 132)",
        data: girlsData.map((count, index) => ({
          x: vaccineTypes[index],
          y: count,
          percentage: ((count / totalData[index]) * 100).toFixed(2) + '%'
        })),
      },
      {
        label: "Boys",
        backgroundColor: "rgb(75, 192, 192)",
        data: boysData.map((count, index) => ({
          x: vaccineTypes[index],
          y: count,
          percentage: ((count / totalData[index]) * 100).toFixed(2) + '%'
        })),
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = (context.raw as { y: number }).y;
            const percentage = (context.raw as { percentage: string }).percentage;
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <h3 className="text-center font-semibold">{`Age Category: ${ageCategory}`}</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
