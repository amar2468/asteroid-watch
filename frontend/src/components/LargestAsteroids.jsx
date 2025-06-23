import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for rendering bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopLargestAsteroidsChart = ({ rawNeoData }) => {
  // Flatten all NEOs from all dates into a single array
  const allNeos = Object.values(rawNeoData).flat();

  // Sort the NEOs by their maximum estimated diameter in kilometres, in descending order
  const sortedBySize = allNeos.sort((a, b) =>
    b.estimated_diameter.kilometers.estimated_diameter_max -
    a.estimated_diameter.kilometers.estimated_diameter_max
  );

  // Select the top 5 largest NEOs
  const top5 = sortedBySize.slice(0, 5);

  // Extract names and maximum diameters for chart labels and values
  const labels = top5.map((neo) => neo.name);
  const values = top5.map(
    (neo) => neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)
  );

  // Define the dataset for the bar chart
  const data = {
    labels,
    datasets: [
      {
        label: 'Largest Asteroids - Top 5', // Label shown in the chart legend
        data: values,
        backgroundColor: '#ff9800', // Orange bars
      },
    ],
  };

  // Render the bar chart inside a responsive container
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '40px auto' }}>
      <Bar data={data} />
    </div>
  );
};

export default TopLargestAsteroidsChart;