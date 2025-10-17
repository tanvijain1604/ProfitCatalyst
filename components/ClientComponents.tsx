import React from 'react';

export const StatusBadge: React.FC<{ status: 'Active' | 'Inactive' | 'Trial' }> = ({ status }) => {
  const colorClasses = {
    Active: 'bg-[#39FF14]/20 text-[#39FF14]',
    Inactive: 'bg-gray-500/20 text-gray-500',
    Trial: 'bg-yellow-500/20 text-yellow-500',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
};

export const CsatScore: React.FC<{ score: number }> = ({ score }) => {
    const percentage = (score / 10) * 100;
    const color = percentage > 90 ? 'from-[#7F56D9] to-[#9E77ED]' : percentage > 70 ? 'from-yellow-500 to-yellow-300' : 'from-red-500 to-red-400';
    return (
        <div className="flex items-center">
            <span className="text-white mr-2 font-semibold">{score.toFixed(1)}</span>
            <div className="w-20 bg-gray-700 rounded-full h-1.5">
                <div className={`bg-gradient-to-r ${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}