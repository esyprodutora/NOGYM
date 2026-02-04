import React from 'react';

interface DataPoint {
  date: string;
  weight: number;
}

export const WeightChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  // Handle empty or single data point cases gracefully
  if (!data || data.length === 0) {
      return (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-700 rounded-xl bg-white/5">
              <span className="text-xs text-gray-500">Sem dados suficientes</span>
          </div>
      );
  }

  // If only one point, duplicate it to make a line
  const chartData = data.length === 1 ? [{...data[0], date: 'Start'}, data[0]] : data;

  // Use a coordinate system of 100x50 units
  const VIEW_WIDTH = 100;
  const VIEW_HEIGHT = 50;
  const PADDING = 5;

  const weights = chartData.map(d => d.weight);
  const minWeight = Math.min(...weights) - 1; // Add buffer
  const maxWeight = Math.max(...weights) + 1;

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * (VIEW_WIDTH - PADDING * 2) + PADDING;
    const normalizedWeight = (d.weight - minWeight) / (maxWeight - minWeight);
    const y = VIEW_HEIGHT - (normalizedWeight * (VIEW_HEIGHT - PADDING * 2)) - PADDING;
    return { x, y, value: d.weight, date: d.date };
  });

  const pathData = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, "");

  const areaPath = `${pathData} L ${points[points.length-1].x},${VIEW_HEIGHT} L ${points[0].x},${VIEW_HEIGHT} Z`;

  return (
    <div className="w-full h-40 overflow-hidden relative select-none">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} 
        className="overflow-visible" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF5500" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((tick) => {
             const y = PADDING + tick * (VIEW_HEIGHT - 2*PADDING);
             return <line key={tick} x1={0} y1={y} x2={VIEW_WIDTH} y2={y} stroke="#333" strokeDasharray="1 1" strokeWidth="0.1" opacity="0.5" />
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#FF5500" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow)" vectorEffect="non-scaling-stroke" />

        {/* Data Points */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Dot */}
            <circle cx={p.x} cy={p.y} r="1.2" fill="#FFFFFF" stroke="#FF5500" strokeWidth="0.4" />
            
            {/* Weight Label (Only for First, Last, and Min/Max) */}
            {(i === 0 || i === points.length - 1 || p.value === Math.min(...weights) || p.value === Math.max(...weights)) && (
                <text x={p.x} y={p.y - 3} textAnchor="middle" className="text-[2.5px] font-bold fill-white" style={{ textShadow: '0px 1px 2px black' }}>
                    {p.value}
                </text>
            )}
             
             {/* Date Label (Only First and Last) */}
             {(i === 0 || i === points.length - 1) && (
                <text x={p.x} y={VIEW_HEIGHT + 3} textAnchor={i === 0 ? "start" : "end"} className="text-[2px] fill-gray-500 uppercase font-medium tracking-wider">
                    {p.date}
                </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
