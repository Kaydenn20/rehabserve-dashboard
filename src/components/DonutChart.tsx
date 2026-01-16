import React, { useState, useMemo } from 'react';

interface DonutChartProps {
  data: { label: string; value: number }[];
  onGroupClick?: (groupLabel: string) => void;
  selectedGroup?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, onGroupClick, selectedGroup }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
    percentage: string;
  }>({ visible: false, x: 0, y: 0, label: '', value: 0, percentage: '' });

  const handleMouseEnter = (x: number, y: number, label: string, value: number, percentage: string) => {
    setTooltip({ visible: true, x, y, label, value, percentage });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const total = useMemo(() => data.reduce((sum, entry) => sum + entry.value, 0), [data]);

  const chartData = useMemo(() => {
    const sum = total;
    if (sum === 0) return [] as any[];

    let startAngle = -90; // start at top
    const calculatedArcs = data.map((entry, index) => {
      const sliceAngle = (entry.value / sum) * 360;
      const endAngle = startAngle + sliceAngle;
      const percentage = ((entry.value / sum) * 100).toFixed(1) + '%';

      const colors = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#A855F7', '#22C55E'];
      const color = colors[index % colors.length];

      const arc = { startAngle, endAngle, color, label: entry.label, value: entry.value, percentage };
      startAngle = endAngle;
      return arc;
    });
    return calculatedArcs;
  }, [data, total]);

    const centerX = 120;
    const centerY = 120;
  const outerRadius = 80;
  const innerRadius = 50;

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const getArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const startOuter = getCoordinatesForAngle(startAngle, outerR);
    const endOuter = getCoordinatesForAngle(endAngle, outerR);
    const startInner = getCoordinatesForAngle(endAngle, innerR);
    const endInner = getCoordinatesForAngle(startAngle, innerR);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      `Z`,
    ].join(' ');
  };

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <svg viewBox="0 0 260 260" className="w-full h-full">
        {chartData.map((arc, _index) => {
          const path = getArcPath(arc.startAngle, arc.endAngle, innerRadius, outerRadius);

          const midAngle = (arc.startAngle + arc.endAngle) / 2;
          const labelRadius = outerRadius + 24;
          const { x: anchorX, y: anchorY } = getCoordinatesForAngle(midAngle, outerRadius + 8);
          const { x: elbowX, y: elbowY } = getCoordinatesForAngle(midAngle, labelRadius);
          const labelX = elbowX + (elbowX > centerX ? 16 : -16);
          const labelY = elbowY;

            const isSelected = selectedGroup === arc.label;
            const opacity = isSelected ? 1 : 0.8;
            const strokeWidth = isSelected ? 2 : 0;
            const strokeColor = isSelected ? '#3B82F6' : 'none';

            return (
            <g key={arc.label}>
                <path
                  d={path}
                fill={arc.color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="cursor-pointer transition-all hover:opacity-90"
                onMouseEnter={(e) => handleMouseEnter(e.clientX, e.clientY, arc.label, arc.value, arc.percentage)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onGroupClick?.(arc.label)}
                style={{ opacity }}
              />

              {/* Leader line */}
              <polyline
                points={`${anchorX},${anchorY} ${elbowX},${elbowY} ${labelX},${labelY}`}
                fill="none"
                stroke='#6B7280'
                strokeWidth="1"
              />

              {/* Label with name and percent */}
                  <text
                x={labelX}
                y={labelY}
                textAnchor={labelX > centerX ? 'start' : 'end'}
                dominantBaseline="middle"
                className="text-xs fill-gray-700"
              >
                <tspan x={labelX} dy="-0.3em" className="font-semibold">{arc.label}</tspan>
                <tspan x={labelX} dy="1.1em">{arc.percentage}</tspan>
                  </text>
              </g>
            );
          })}

        {/* Center total */}
        <circle cx={centerX} cy={centerY} r={innerRadius - 8} fill="#FFFFFF" />
        <text x={centerX} y={centerY - 6} textAnchor="middle" className="text-sm font-bold fill-gray-900">
          {total}
          </text>
        <text x={centerX} y={centerY + 12} textAnchor="middle" className="text-[11px] fill-gray-500">
          Total
          </text>
        </svg>

      {tooltip.visible && (
        <div
          className="absolute z-20 rounded-md p-2 shadow-lg bg-white text-gray-900"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <p className="text-sm font-semibold">{tooltip.label}</p>
          <p className="text-sm">Value: {tooltip.value}</p>
          <p className="text-sm">Percentage: {tooltip.percentage}</p>
            </div>
      )}
    </div>
  );
};

export default DonutChart;