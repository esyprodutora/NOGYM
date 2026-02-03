import React from 'react';

interface DataPoint {
  date: string;
  weight: number;
}

export const WeightChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const height = 180;
  const width = 340;
  const padding = 20;

  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights) - 1;
  const maxWeight = Math.max(...weights) + 1;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((d.weight - minWeight) / (maxWeight - minWeight)) * (height - padding * 2) - padding;
    return { x, y, value: d.weight, date: d.date };
  });

  // Create SVG path
  const pathData = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, "");

  // Area under curve
  const areaPath = `${pathData} L ${points[points.length-1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#A4006D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A4006D" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
             const y = padding + tick * (height - 2*padding);
             return <line key={tick} x1={padding} y1={y} x2={width-padding} y2={y} stroke="#333" strokeDasharray="4 4" strokeWidth="1" opacity="0.5" />
        })}

        {/* Area Fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#A4006D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#121212" stroke="#A4006D" strokeWidth="2" />
            {/* Show label for first and last point */}
            {(i === 0 || i === points.length - 1) && (
                <text x={p.x} y={p.y - 12} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {p.value}kg
                </text>
            )}
             <text x={p.x} y={height - 2} textAnchor="middle" fill="#666" fontSize="10">
                {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};