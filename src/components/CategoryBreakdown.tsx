import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface CategoryBreakdownProps {
  data: { label: string; value: string; current: number }[];
  title: string;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data, title }) => {
  // Categorize dimensions by performance
  const excellent = data.filter(d => d.current >= 5.5).length;
  const good = data.filter(d => d.current >= 4.5 && d.current < 5.5).length;
  const needsImprovement = data.filter(d => d.current < 4.5).length;
  const total = data.length;

  const excellentPercent = (excellent / total) * 100;
  const goodPercent = (good / total) * 100;
  const needsImprovementPercent = (needsImprovement / total) * 100;

  // Chart configuration for 100% stacked bar chart
  const chartData = {
    labels: ['Dimension Performance Distribution'],
    datasets: [
      {
        label: 'Excellent (≥5.5)',
        data: [excellentPercent],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      },
      {
        label: 'Good (4.5-5.4)',
        data: [goodPercent],
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        borderWidth: 1
      },
      {
        label: 'Needs Improvement (<4.5)',
        data: [needsImprovementPercent],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
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
        cornerRadius: 6,
        padding: 10,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const count = context.dataset.label === 'Excellent (≥5.5)' ? excellent :
                         context.dataset.label === 'Good (4.5-5.4)' ? good : needsImprovement;
            return `${label}: ${value.toFixed(1)}% (${count} dimensions)`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          },
          color: '#6b7280',
          callback: function(value: any) {
            return value + '%';
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
    <div className="w-full">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Excellent Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border-2 border-green-200 p-3.5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                {excellent}
              </div>
              <div className="text-xs font-semibold text-green-600 mt-0.5">
                {excellentPercent.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-900">
            Excellent
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">
            Score ≥ 5.5
          </div>
        </div>
        
        {/* Good Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border-2 border-amber-200 p-3.5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 bg-amber-500/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-700">
                {good}
              </div>
              <div className="text-xs font-semibold text-amber-600 mt-0.5">
                {goodPercent.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-900">
            Good
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">
            Score 4.5 - 5.4
          </div>
        </div>
        
        {/* Needs Improvement Card */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg border-2 border-red-200 p-3.5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 bg-red-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-700">
                {needsImprovement}
              </div>
              <div className="text-xs font-semibold text-red-600 mt-0.5">
                {needsImprovementPercent.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-900">
            Needs Improvement
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">
            Score &lt; 4.5
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="h-36">
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;













