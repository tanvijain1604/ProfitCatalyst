import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MrrData } from '../types';

interface MrrChartProps {
  data: MrrData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glassmorphic p-4 rounded-lg">
                <p className="label text-gray-300">{`${label}`}</p>
                <p className="intro text-white font-bold">{`MRR: $${new Intl.NumberFormat().format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};


const MrrChart: React.FC<MrrChartProps> = ({ data }) => {
  const tickColor = '#9ca3af';
  const gridColor = 'rgba(255, 255, 255, 0.1)';

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} tickLine={{ stroke: tickColor }} />
                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: tickColor }} axisLine={{ stroke: tickColor }} tickLine={{ stroke: tickColor }} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#7F56D9', strokeWidth: 1, strokeDasharray: '3 3'}} />
                <Line 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="#7F56D9" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#7F56D9' }}
                    activeDot={{ r: 8, stroke: 'rgba(127, 86, 217, 0.2)', strokeWidth: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MrrChart;