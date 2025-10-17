import React from 'react';
import { ClientProfitability } from '../types';

interface ProfitabilityTableProps {
  data: ClientProfitability[];
}

const ChurnRiskBadge: React.FC<{ risk: 'Low' | 'Medium' | 'High' }> = ({ risk }) => {
  const colorClasses = {
    Low: 'bg-[#39FF14]/20 text-[#39FF14]',
    Medium: 'bg-yellow-500/20 text-yellow-500',
    High: 'bg-red-500/20 text-red-500',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[risk]}`}>{risk}</span>;
};

const ProfitabilityTable: React.FC<ProfitabilityTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-sm font-semibold text-gray-400">Client</th>
            <th className="p-4 text-sm font-semibold text-gray-400">Profit Margin</th>
            <th className="p-4 text-sm font-semibold text-gray-400">Churn Risk</th>
            <th className="p-4 text-sm font-semibold text-gray-400 text-right">Lifetime Value (LTV)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((client) => (
            <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-white">{client.client}</td>
              <td className="p-4">
                <div className="flex items-center">
                    <span className="text-white mr-2">{client.margin}%</span>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-[#8A2BE2] to-[#7F56D9] h-1.5 rounded-full" style={{ width: `${client.margin}%`}}></div>
                    </div>
                </div>
              </td>
              <td className="p-4">
                <ChurnRiskBadge risk={client.churnRisk} />
              </td>
              <td className="p-4 font-mono text-white text-right">
                ${new Intl.NumberFormat().format(client.ltv)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfitabilityTable;