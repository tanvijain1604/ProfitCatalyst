import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ServiceProfitability } from '../types';

interface ServiceProfitabilityChartProps {
  data: ServiceProfitability[];
}

const colors = ['#7F56D9', '#6938C6', '#531BAF', '#3D0A94', '#7F56D9'];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glassmorphic p-4 rounded-lg">
                <p className="label text-gray-300">{`${label}`}</p>
                <p className="intro text-white font-bold">{`Profit: $${new Intl.NumberFormat().format(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const ServiceProfitabilityChart: React.FC<ServiceProfitabilityChartProps> = ({ data }) => {
  const tickColor = '#9ca3af';

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="service" 
            width={100} 
            tick={{ fill: tickColor, fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 0, 0, 0.1)'}} />
          <Bar dataKey="profit" radius={[0, 8, 8, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceProfitabilityChart;