import React from 'react';
import { X, Calendar, Users } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    dateRange: string;
    group: string;
    dimension: string;
    pdk: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{ dateRange: string; group: string; dimension: string; pdk: string; overallIndex: number; }>>;
  onClose: () => void;
  respondentGroupOptions: { value: string; label: string; }[];
  pdkOptions: { value: string; label: string; }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onClose, respondentGroupOptions, pdkOptions }) => {
  const dateRangeOptions = [
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const dimensionOptions = [
    { value: 'all', label: 'All Dimensions' },
    { value: 'training_excellence', label: 'Training Excellence' },
    { value: 'service_excellence', label: 'Service Excellence' },
    { value: 'competitive_response', label: 'Competitive Response' },
    { value: 'long_term_planning', label: 'Long-term Planning' },
    { value: 'information_distribution', label: 'Information Distribution' },
    { value: 'employee_development', label: 'Employee Development' }
  ];

  const baseSelect = `w-full px-4 py-2 rounded-full border text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500`;

  return (
    <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-opacity-80 bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-start">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            {/* Date Range Filter */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                <Calendar className="h-4 w-4 inline mr-2 align-text-bottom" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className={baseSelect}
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Filter */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                <Users className="h-4 w-4 inline mr-2 align-text-bottom" />
                Respondent Group
              </label>
              <select
                value={filters.group}
                onChange={(e) => setFilters(prev => ({ ...prev, group: e.target.value }))}
                className={baseSelect}
              >
                {respondentGroupOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PDK Filter */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                <span className="h-4 w-4 inline mr-2 align-text-bottom">🏥</span>
                PDK
              </label>
              <select
                value={filters.pdk}
                onChange={(e) => setFilters(prev => ({ ...prev, pdk: e.target.value }))}
                className={baseSelect}
              >
                {pdkOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimension Filter */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                <span className="h-4 w-4 inline mr-2 align-text-bottom">📊</span>
                Dimension
              </label>
              <select
                value={filters.dimension}
                onChange={(e) => setFilters(prev => ({ ...prev, dimension: e.target.value }))}
                className={baseSelect}
              >
                {dimensionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-full border transition-colors text-gray-600 border-gray-200 hover:text-gray-800 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;