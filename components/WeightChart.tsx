import React from 'react';

interface DataPoint {
  date: string;
  weight: number;
}

export const WeightChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Use a coordinate system of 100x50 units for the SVG internal logic
  // logic: x goes 0 -> 100, y goes 0 -> 50
  const VIEW_WIDTH = 100;
  const VIEW_HEIGHT = 50;
  const PADDING = 5;

  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights) - 0.5;
  const maxWeight = Math.max(...weights) + 0.5;

  // Calculate coordinates
  const points = data.map((d, i) => {
    // X is percentage of width
    const x = (i / (data.length - 1)) * (VIEW_WIDTH - PADDING * 2) + PADDING;
    // Y is inverted (SVG 0 is top)
    const normalizedWeight = (d.weight - minWeight) / (maxWeight - minWeight);
    const y = VIEW_HEIGHT - (normalizedWeight * (VIEW_HEIGHT - PADDING * 2)) - PADDING;
    return { x, y, value: d.weight, date: d.date };
  });

  // Create SVG path
  const pathData = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, "");

  // Area under curve (close the path at bottom)
  const areaPath = `${pathData} L ${points[points.length-1].x},${VIEW_HEIGHT} L ${points[0].x},${VIEW_HEIGHT} Z`;

  return (
    <div className="w-full h-48 md:h-56 overflow-hidden relative">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} 
        className="overflow-visible" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#A4006D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A4006D" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal Grid lines (Subtle) */}
        {[0.2, 0.4, 0.6, 0.8].map((tick) => {
             const y = PADDING + tick * (VIEW_HEIGHT - 2*PADDING);
             return <line key={tick} x1={0} y1={y} x2={VIEW_WIDTH} y2={y} stroke="#333" strokeDasharray="2 2" strokeWidth="0.2" opacity="0.3" />
        })}

        {/* Area Fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#A4006D" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

        {/* Points & Labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="1.5" fill="#121212" stroke="#A4006D" strokeWidth="0.5" />
            
            {/* Show Weight Labels occasionally to avoid clutter */}
            {(i === 0 || i === points.length - 1 || i === Math.floor(points.length/2)) && (
                <text x={p.x} y={p.y - 4} textAnchor="middle" fill="currentColor" className="text-[3px] font-bold fill-gray-500 dark:fill-gray-300">
                    {p.value}
                </text>
            )}
             
             {/* Date Labels */}
             <text x={p.x} y={VIEW_HEIGHT + 4} textAnchor="middle" className="text-[2.5px] fill-gray-400 dark:fill-brand-muted uppercase">
                {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};