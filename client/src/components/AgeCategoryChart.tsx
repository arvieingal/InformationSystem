// components/AgeCategoryChart.tsx
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AgeCategoryChart({ ageCategory }: { ageCategory: string }) {
  const data = {
    labels: [
      'BCG Vaccine', 'Hepatitis B', 'Pentavalent (DPT+Hep B+Hib)', 
      'Oral Polio (OPV)', 'Inactivated Polio (IPV)', 
      '(PCV)', 'Vitamin A', 'Deworming', 'Dental Check Up'
    ],
    datasets: [
      {
        label: 'Girl',
        backgroundColor: 'rgb(255, 99, 132)',
        data: [8000, 9000, 11000, 10000, 7000, 8000, 9000, 8000, 9000],
      },
      {
        label: 'Boy',
        backgroundColor: 'rgb(75, 192, 192)',
        data: [6000, 7000, 10000, 8000, 6000, 7000, 8000, 6000, 8000],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h3 className="text-center font-semibold">{`Aged ${ageCategory}`}</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
