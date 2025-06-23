import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components for rendering pie charts
ChartJS.register(ArcElement, Tooltip, Legend);

const HazardousPieChart = ({ rawNeoData }) => {
  // Flatten NEOs from all dates into a single array
  const allNeos = Object.values(rawNeoData).flat();

  // Count potentially hazardous NEOs
  const hazardousCount = allNeos.filter(neo => neo.is_potentially_hazardous_asteroid).length;

  // Derive the count of non-hazardous NEOs
  const nonHazardousCount = allNeos.length - hazardousCount;

  // Prepare the dataset for the pie chart
  const data = {
    labels: ['Hazardous NEOs', 'Non-Hazardous NEOs'], // Labels for each pie segment
    datasets: [
      {
        data: [hazardousCount, nonHazardousCount], // Data values for each segment
        backgroundColor: ['#d32f2f', '#388e3c'], // Red for hazardous, green for non-hazardous
        hoverOffset: 10, // Pop-out effect on hover
      },
    ],
  };

  // Render the pie chart within a responsive container
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '40px auto' }}>
      <Pie data={data} />
    </div>
  );
};

export default HazardousPieChart;