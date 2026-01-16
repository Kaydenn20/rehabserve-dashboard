import React from 'react';
import { TrendingUp } from 'lucide-react';

interface CompactKPICardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down';
}

const CompactKPICard: React.FC<CompactKPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  trend
}) => {
  const isPositive = trend === 'up';

  // Function to format value based on title
  const formatValue = (val: number, title: string) => {
    if (title === 'Total Respondents') {
      return Math.round(val);
    }
    if (title === 'RehabServE Index' || title === 'RehabServE with AI Index' || title === 'Best Dimension') {
      return val.toFixed(2);
    }
    return val.toFixed(0);
  };

  // Get gradient based on title
  const getGradient = (title: string) => {
    if (title === 'RehabServE Index' || title === 'RehabServE with AI Index') {
      return 'from-blue-500 to-blue-600';
    }
    if (title === 'Best Dimension') {
      return 'from-green-500 to-green-600';
    }
    return 'from-purple-500 to-purple-600';
  };

  return (
    <div className="group relative p-6 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 hover:border-gray-300 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(title)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M20 20v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Title - Small and Secondary */}
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {title}
        </div>
        
        {/* Value - Large and Bold */}
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`text-3xl font-bold bg-gradient-to-r ${getGradient(title)} bg-clip-text text-transparent`}>
            {formatValue(value, title)}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-3 w-3 ${!isPositive ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <div className="text-sm text-gray-600 font-medium mt-1 line-clamp-2">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactKPICard;