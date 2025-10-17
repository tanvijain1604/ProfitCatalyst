import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { SalesPipelineStage } from '../types';

interface SalesPipelineProps {
  data: SalesPipelineStage[];
  loading: boolean;
}

const colors = ['#7F56D9', '#6938C6', '#531BAF', '#3D0A94'];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glassmorphic p-4 rounded-lg">
                <p className="label text-white font-bold">{`${label}`}</p>

                <p className="intro text-gray-300">{`Value: $${new Intl.NumberFormat().format(payload[0].value)}`}</p>
                <p className="intro text-gray-300">{`Deals: ${payload[0].payload.dealCount}`}</p>
            </div>
        );
    }
    return null;
};

const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
                <div className="h-4 bg-white/10 rounded w-24 mr-4"></div>
                <div className="h-8 bg-white/10 rounded" style={{ width: `${100 - i * 15}%`}}></div>
            </div>
        ))}
    </div>
);


const SalesPipeline: React.FC<SalesPipelineProps> = ({ data, loading }) => {
  if (loading) {
      return <div className="h-[250px] flex items-center justify-center"><SkeletonLoader/></div>
  }
  
  const tickColor = '#9ca3af';
  
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="stage" 
            width={100} 
            tick={{ fill: tickColor, fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPipeline;