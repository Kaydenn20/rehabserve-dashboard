import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number; // number for counter animation
  subtitle?: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  tooltipText?: string;
  progressValue?: number;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  trend, 
  icon, 
  tooltipText,
  progressValue
}) => {
  const isPositive = trend === 'up';
  // Round the value at the start
  const roundedValue = Math.round(value);

  // Counter animation
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const step = Math.max(1, Math.floor(duration / roundedValue)); // Use roundedValue here
    const timer = setInterval(() => {
      start += 1;
      if (start >= roundedValue) { // Compare with roundedValue
        setDisplayValue(roundedValue); // Set to roundedValue
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, step);
    return () => clearInterval(timer);
  }, [roundedValue]);

  const gradient = 'bg-gradient-to-br from-white to-gray-50';

  return (
    <div
      className={`group relative p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border overflow-hidden border-gray-100 ${gradient}`}
    >
      {/* Accent bar on top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>

      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-gray-100">
          <div className="text-blue-600">{icon}</div>
        </div>
        <div
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium mb-1 text-gray-600">{title}</h3>
        <p className="text-3xl font-extrabold leading-tight text-blue-600">
          {Math.round(displayValue)}
        </p>
        {subtitle && (
          <p className="text-[11px] mt-0.5 text-gray-500">{subtitle}</p>
        )}
      </div>

      {/* Progress bar */}
      {typeof progressValue === 'number' && (
        <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
          />
        </div>
      )}

      {/* Tooltip */}
      {tooltipText && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gray-800 text-white`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default KPICard;
