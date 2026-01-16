import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

interface HorizontalBarChartProps {
  data: { label: string; value: string; current: number }[];
  title: string;
  selectedGroup?: string;
}

const HorizontalBar: React.FC<HorizontalBarChartProps> = ({
  data,
  title,
  selectedGroup
}) => {
  // Transform data and sort by score (highest first)
  const dimensionData = data
    .map((item, index) => ({
      name: item.label,
      score: item.current,
      color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Chart config
  const chartData = {
    labels: dimensionData.map((d) => d.name),
    datasets: [
      {
        label: selectedGroup ? `${selectedGroup} Score` : 'Current Score',
        data: dimensionData.map((d) => d.score),
        backgroundColor: dimensionData.map((d) => d.color + '80'),
        borderColor: dimensionData.map((d) => d.color),
        borderWidth: 1,
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#CE1126',
        borderWidth: 2,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context: any) {
            const dimension = dimensionData[context.dataIndex];
            const percentage = ((dimension.score / 7) * 100).toFixed(1);
            return [`Score: ${dimension.score.toFixed(2)} / 7.0 (${percentage}%)`];
          },
          afterLabel: function (context: any) {
            const dimension = dimensionData[context.dataIndex];
            const performance =
              dimension.score >= 5.5
                ? 'Excellent'
                : dimension.score >= 4.5
                ? 'Good'
                : 'Needs Attention';
            return [`Performance: ${performance}`];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 7,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: true,
          borderColor: '#e5e7eb',
          lineWidth: 1
        },
        ticks: {
          font: { size: 11, weight: 500 },
          color: '#6b7280',
          stepSize: 1,
          callback: function(value: any) {
            return value.toFixed(1);
          }
        },
        title: {
          display: true,
          text: 'Score (out of 7.0)',
          font: { size: 12, weight: 600 },
          color: '#374151',
          padding: { top: 10, bottom: 0 }
        }
      },
      y: {
        grid: { 
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { size: 12, weight: 500 },
          color: '#374151',
          padding: 8
        }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutCubic' as const
    }
  };

  // Get performance indicators
  const getPerformanceColor = (score: number) => {
    if (score >= 5.5) return 'text-green-600';
    if (score >= 4.5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 5.5) return 'Excellent';
    if (score >= 4.5) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {dimensionData.slice(0, 3).map((dim, index) => (
          <div key={dim.name} className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-gray-600 truncate flex-1" title={dim.name}>
                #{index + 1}
              </div>
              <div className={`text-xs font-bold ${getPerformanceColor(dim.score)}`}>
                {getPerformanceLabel(dim.score)}
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-900 truncate mb-1" title={dim.name}>
              {dim.name}
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-bold text-gray-900">
                {dim.score.toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-500">
                / 7.0
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="h-80">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default HorizontalBar;



