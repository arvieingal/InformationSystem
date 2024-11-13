// components/NutritionalStatusChart.tsx
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, ChartData, ChartOptions } from 'chart.js';

// Register the necessary components
Chart.register(ArcElement);

interface NutritionalStatusChartProps {
  title: string;
}

export default function NutritionalStatusChart({ title }: NutritionalStatusChartProps) {
  const data: ChartData<'doughnut'> = {
    labels: ['Normal', 'Underweight', 'Overweight', 'Obese'],
    datasets: [
      {
        data: [50, 25, 10, 15],
        backgroundColor: ['#338A80', '#85D0C8', '#C2E7C5', '#D7EFB1'],
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow rounded" style={{ width: '580px', height: '400px' }}>
      <h3 className="text-center font-semibold">{title}</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
}
