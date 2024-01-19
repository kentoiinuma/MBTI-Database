// frontend/src/components/Ni.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Ni() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Media Works Titles',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://favorite-database-16type-f-5f78fa224595.herokuapp.com') {
    API_URL = "https://favorite-database-16type-5020d6339517.herokuapp.com";
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('${API_URL}/api/v1/media_works/statistics');
      const data = await response.json();
      setChartData({
        labels: Object.keys(data),
        datasets: [
          {
            ...chartData.datasets[0],
            data: Object.values(data),
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Media Works Title Statistics for ENFJ, ENTJ, INFJ, INTJ MBTI Types</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default Ni;