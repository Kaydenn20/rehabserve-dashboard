import React, { useState, useMemo } from 'react';

interface CompactDonutChartProps {
  data: { label: string; value: number }[];
  onGroupClick?: (groupLabel: string) => void;
  selectedGroup?: string;
  title: string;
  size?: number;
  thickness?: number;
}

const CompactDonutChart: React.FC<CompactDonutChartProps> = ({
  data,
  selectedGroup,
  title,
  onGroupClick,
  size = 160,
  thickness = 30
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
    color: string;
  }>({ visible: false, x: 0, y: 0, label: '', value: 0, color: '' });

  const [hoveredLabel] = useState<string | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent,
    label: string,
    value: number,
    color: string
  ) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      label,
      value,
      color
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const total = useMemo(() => data.reduce((sum, entry) => sum + entry.value, 0), [data]);

  const chartData = useMemo(() => {
    if (total === 0) return [];

    let currentAngle = 0;
    const colors = [
      '#2563EB', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#06B6D4', '#14B8A6', '#EAB308'
    ];

    const sorted = [...data].sort((a, b) => b.value - a.value);

    return sorted.map((entry, index) => {
      const angle = (entry.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle += angle;

      return {
        label: entry.label,
        value: entry.value,
        startAngle,
        endAngle,
        color: colors[index % colors.length]
      };
    });
  }, [data, total]);

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    const center = size / 2;
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2)
    };
  };

  const getArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startInner = getCoordinatesForAngle(startAngle, innerRadius);
    const endInner = getCoordinatesForAngle(endAngle, innerRadius);
    const startOuter = getCoordinatesForAngle(startAngle, outerRadius);
    const endOuter = getCoordinatesForAngle(endAngle, outerRadius);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return [
      `M ${startInner.x} ${startInner.y}`,
      `L ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
      'Z'
    ].join(' ');
  };

  const outerRadius = Math.max(40, size / 2 - 20);
  const innerRadius = Math.max(10, outerRadius - thickness);

  return (
    <div className="w-full">
      {/* Empty state */}
      {total === 0 && (
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            No respondent data available
          </p>
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 w-full">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 drop-shadow-sm"
              role="img"
              aria-label={`${title} donut chart`}
            >
              <defs>
                <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
                </filter>
              </defs>

              {chartData.map((arc) => {
                const path = getArcPath(arc.startAngle, arc.endAngle, innerRadius, outerRadius);
                const isSelected = selectedGroup === arc.label;
                const isHovered = hoveredLabel === arc.label;
                const percentage = ((arc.value / total) * 100).toFixed(1);

                return (
                  <path
                    key={arc.label}
                    d={path}
                    fill={arc.color}
                    stroke={isSelected ? '#1E40AF' : isHovered ? '#4B5563' : 'white'}
                    strokeWidth={isSelected ? 4 : isHovered ? 2 : 1.5}
                    className="cursor-pointer transition-all duration-200 ease-in-out"
                    filter="url(#donutShadow)"
                    style={{
                      opacity: isSelected ? 1 : isHovered ? 0.95 : 0.85,
                    }}
                    onClick={() => onGroupClick?.(arc.label)}
                    onMouseEnter={(e) => handleMouseEnter(e, arc.label, arc.value, arc.color)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </svg>

            {/* Center total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {(() => {
                  const active = hoveredLabel || selectedGroup || null;
                  const activeArc = active ? chartData.find((a) => a.label === active) : null;
                  if (activeArc) {
                    const percentage = ((activeArc.value / total) * 100).toFixed(1);
                    return (
                      <>
                        <div className="text-3xl font-bold text-gray-900 leading-tight">
                          {activeArc.value}
                        </div>
                        <div className="text-xs font-semibold text-[#CE1126] mt-1">
                          {percentage}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1 px-2">
                          {activeArc.label}
                        </div>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="text-3xl font-bold text-gray-900 leading-tight">
                        {total}
                      </div>
                      <div className="text-xs font-medium text-gray-600 mt-1">
                        Total responses
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full lg:w-auto min-w-0">
            <div className="space-y-3 w-full">
              {chartData.map((arc) => {
                const percentage = ((arc.value / total) * 100).toFixed(1);
                const isSelected = selectedGroup === arc.label;
                return (
                  <div
                    key={arc.label}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#CE1126]/10 border-2 border-[#CE1126]/30 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }`}
                    onClick={() => onGroupClick?.(arc.label)}
                    onMouseEnter={(e) => handleMouseEnter(e, arc.label, arc.value, arc.color)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative flex-shrink-0 mr-3">
                      <span
                        className="w-4 h-4 rounded-full block shadow-sm"
                        style={{ backgroundColor: arc.color }}
                      />
                      {isSelected && (
                        <div className="absolute -inset-1 rounded-full bg-[#CE1126]/20 animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 mr-4 overflow-hidden">
                      <div className="text-xs font-semibold text-gray-900 truncate" title={arc.label}>
                        {arc.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {percentage}% of total
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-auto">
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                        {arc.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg shadow-xl pointer-events-none border border-gray-700"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 12,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: tooltip.color }}
            />
            <span className="font-bold">{tooltip.label}</span>
          </div>
          <div className="text-xs text-gray-300">
            {tooltip.value} respondent{tooltip.value !== 1 ? 's' : ''} ({(tooltip.value / total * 100).toFixed(1)}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactDonutChart;
