type DoughnutLegendProps = {
  data: {
    labels: string[];
    datasets: { backgroundColor: string[] }[];
  };
};

export const DoughnutLegend = ({ data }: DoughnutLegendProps) => (
  <div className="flex flex-col justify-center ml-12">
    {data.labels.map((label, index) => (
      <div key={index} className="flex items-center mb-2">
        <span
          className="inline-block w-3 h-3 mr-2 rounded-full"
          style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
        ></span>
        <span className="text-[9px]">{label}</span>
      </div>
    ))}
  </div>
);

