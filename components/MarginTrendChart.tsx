import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MarginTrendData } from '../types';

interface MarginTrendChartProps {
  data: MarginTrendData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glassmorphic p-4 rounded-lg">
                <p className="label text-gray-300">{`${label}`}</p>
                <p className="intro text-white font-bold">{`Margin: ${payload[0].value.toFixed(1)}%`}</p>
            </div>
        );
    }
    return null;
};


const MarginTrendChart: React.FC<MarginTrendChartProps> = ({ data }) => {
  const tickColor = '#9ca3af';
  const gridColor = 'rgba(255, 255, 255, 0.1)';

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                 <defs>
                    <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} tickLine={{ stroke: tickColor }} />
                <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} tickLine={{ stroke: tickColor }} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#8A2BE2', strokeWidth: 1, strokeDasharray: '3 3'}} />
                <Area 
                    type="monotone" 
                    dataKey="margin" 
                    stroke="#8A2BE2" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMargin)"
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MarginTrendChart;