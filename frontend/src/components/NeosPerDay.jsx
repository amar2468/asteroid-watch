import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register essential components for displaying bar charts
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const NeoCountByDateChart = ({ rawNeoData }) => {
  // Extract all date labels from the raw NEO data
  const labels = Object.keys(rawNeoData);

  // Count the number of NEOs for each date
  const values = labels.map(date => rawNeoData[date].length);

  // Prepare the chart dataset
  const data = {
    labels,
    datasets: [
      {
        label: 'Number of NEOs', // Title for the dataset shown in the legend
        data: values,
        backgroundColor: '#1976d2' // Blue bars
      }
    ]
  };

  // Render the bar chart inside a responsive container
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '40px auto' }}>
      <Bar data={data} />
    </div>
  );
};

export default NeoCountByDateChart;