import React from 'react';

interface GaugeChartProps {
  data: { label: string; value: string; current: number }[];
  title: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ data, title }) => {
  const maxValue = 7; // Maximum possible score
  const targetValue = 6; // Target score

  const Gauge = ({ item }: { item: any }) => {
    const score = item.current;
    const percentage = (score / maxValue) * 100;
    const targetPercentage = (targetValue / maxValue) * 100;
    
    // Color based on performance
    let color = '#EF4444'; // Red
    if (score >= 5.5) color = '#10B981'; // Green
    else if (score >= 4.5) color = '#F59E0B'; // Yellow
    
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const targetStrokeDashoffset = circumference - (targetPercentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center p-3">
        <div className="relative">
          <svg width="100" height="100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke='#E5E7EB'
              strokeWidth="8"
              fill="transparent"
            />
            {/* Target line */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#6B7280"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={`${targetStrokeDashoffset} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {score.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                / {maxValue}
              </div>
            </div>
          </div>
        </div>
        
        {/* Label */}
        <div className="text-xs font-medium mt-2 text-center text-gray-700">
          {item.label}
        </div>
        
        {/* Performance indicator */}
        <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
          score >= 5.5 ? 'bg-green-100 text-green-700' :
          score >= 4.5 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {score >= 5.5 ? 'Excellent' : score >= 4.5 ? 'Good' : 'Needs Attention'}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <Gauge key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
};

export default GaugeChart;

