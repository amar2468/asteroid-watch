import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components for rendering bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopFastestAsteroidsChart = ({ rawNeoData }) => {
  // Flatten the NEO data into a single array
  const allNeos = Object.values(rawNeoData).flat();

  // Sort the NEOs by speed in descending order
  const sortedBySpeed = allNeos.sort((a, b) => {
    const speedA = parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour);
    const speedB = parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour);
    return speedB - speedA;
  });

  // Select the top 5 fastest NEOs
  const top5 = sortedBySpeed.slice(0, 5);

  // Extract names and corresponding velocities for chart labels and values
  const labels = top5.map((neo) => neo.name);
  const values = top5.map((neo) =>
    parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0)
  );

  // Define the chart data structure
  const data = {
    labels,
    datasets: [
      {
        label: 'Velocity (km/h)', // Chart legend label
        data: values,
        backgroundColor: '#4caf50', // Bar colour
      },
    ],
  };

  // Render the bar chart within a responsive container
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '40px auto' }}>
      <Bar data={data} />
    </div>
  );
};

export default TopFastestAsteroidsChart;