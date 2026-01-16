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

interface BarChartProps {
  data: { label: string; value: string; current: number }[];
  selectedGroup?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, selectedGroup }) => {
  const [showAllGroups, setShowAllGroups] = React.useState(false);
  // Transform data to match the expected format
  const currentData = data;
  const dimensionData = currentData.map((item, index) => ({
    name: item.label,
    score: item.current,
    color: ['#27ae60', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#3498db'][index % 6]
  }));

  const benchmarkData = null;

  // Chart configuration for bar chart
  const barChartData = {
    labels: dimensionData.map(d => d.name),
    datasets: [
      {
        label: selectedGroup ? `${selectedGroup} Score` : 'Current Score',
        data: dimensionData.map(d => d.score),
        backgroundColor: dimensionData.map(d => d.color + '80'),
        borderColor: dimensionData.map(d => d.color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3498db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 15,
        callbacks: {
          afterLabel: function(context: any) {
            const dimension = dimensionData[context.dataIndex];
            const performance = dimension.score >= 5.5 ? 'Excellent' : dimension.score >= 4.5 ? 'Good' : 'Needs Attention';
            return [`Performance: ${performance}`];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6.5,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2);
          },
          font: {
            size: 12
          },
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutCubic' as const
    }
  };

  return (
    <div className="w-full">
      {/* Chart Container */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              📊
            </div>
            Dimension Performance {selectedGroup && `- ${selectedGroup}`}
          </h2>
          
          {/* Benchmark removed */}
          
        </div>
          
        {/* Chart Area */}
        <div className="relative h-96">
          <div className="bg-white rounded-xl shadow-sm h-full">
            <Chart
              type="bar"
              data={barChartData}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;