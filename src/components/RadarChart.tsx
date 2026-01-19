import React from 'react';
// Import chart.js/auto to automatically register all controllers including RadarController
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

interface RadarChartProps {
  data: { label: string; value: string; current: number }[];
  title: string;
  selectedGroup?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, title, selectedGroup }) => {
  // Transform data (exclude "All Score")
  const dimensionData = data
    .filter((item) => item.label !== 'All Score')
    .map((item, index) => ({
      name: item.label,
      score: item.current,
      color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]
    }));

  // Chart configuration for radar chart
  const chartData = {
    labels: dimensionData.map(d => d.name),
    datasets: [
      {
        label: selectedGroup ? `${selectedGroup} Score` : 'Current Score',
        data: dimensionData.map(d => d.score),
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: '#3498db',
        borderWidth: 3,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3498db',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            return `Score: ${context.parsed.r.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 7,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11
          },
          color: '#374151'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic' as const
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <div className="h-64">
        <Chart
          type="radar"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default RadarChart;



