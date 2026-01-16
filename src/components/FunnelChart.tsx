import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FunnelChartProps {
  data: { label: string; value: string; current: number }[];
  title: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
  // Sort dimensions by score
  const sortedData = [...data].sort((a, b) => b.current - a.current);
  const top3 = sortedData.slice(0, 3);
  const bottom3 = sortedData.slice(-3).reverse();

  // Combine top and bottom for display
  const displayData = [...top3, ...bottom3];
  const colors = [
    '#10B981', '#3B82F6', '#F59E0B', // Top 3 - Green, Blue, Yellow
    '#EF4444', '#8B5CF6', '#06B6D4'  // Bottom 3 - Red, Purple, Cyan
  ];

  // Chart configuration for lollipop chart
  const chartData = {
    labels: displayData.map(d => d.label),
    datasets: [
      {
        label: 'Score',
        data: displayData.map(d => d.current),
        backgroundColor: colors.map(color => color + '80'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y' as const,
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
        padding: 10
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 6.5,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
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
      
      {/* Top 3 Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-green-600 flex items-center gap-2">
          🏆 Top 3 Dimensions
        </h4>
        <div className="space-y-2">
          {top3.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {index + 1}. {item.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(item.current / 6.5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {item.current.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 3 Section */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-red-600 flex items-center gap-2">
          ⚠️ Bottom 3 Dimensions
        </h4>
        <div className="space-y-2">
          {bottom3.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {index + 1}. {item.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${(item.current / 6.5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {item.current.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;

