import React from 'react';
import { KpiData } from '../types';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, UsersIcon, TargetIcon } from './icons';

interface KpiCardProps extends KpiData {}

const KpiIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const iconMap: { [key: string]: React.ReactNode } = {
        'mrr': <DollarSignIcon className="w-6 h-6 text-[#7F56D9]" />,
        'profitability': <UsersIcon className="w-6 h-6 text-[#9E77ED]" />,
        'churn': <TrendingDownIcon className="w-6 h-6 text-[#39FF14]" />,
        'new-mrr': <DollarSignIcon className="w-6 h-6 text-red-500" />,
        'margin': <DollarSignIcon className="w-6 h-6 text-[#7F56D9]" />,
        'high-profit': <UsersIcon className="w-6 h-6 text-[#9E77ED]" />,
        'ltv-cac': <TargetIcon className="w-6 h-6 text-[#7F56D9]" />,
        'top-service': <DollarSignIcon className="w-6 h-6 text-[#9E77ED]" />,
        'total-clients': <UsersIcon className="w-6 h-6 text-[#7F56D9]" />,
        'csat': <TrendingUpIcon className="w-6 h-6 text-[#39FF14]" />,
        'response-time': <TrendingDownIcon className="w-6 h-6 text-[#39FF14]" />,
        'sla': <TrendingUpIcon className="w-6 h-6 text-[#7F56D9]" />,
        'new-leads': <UsersIcon className="w-6 h-6 text-[#7F56D9]" />,
        'conversion': <TargetIcon className="w-6 h-6 text-[#9E77ED]" />,
        'pipeline-value': <DollarSignIcon className="w-6 h-6 text-[#7F56D9]" />,
        'roi': <DollarSignIcon className="w-6 h-6 text-[#9E77ED]" />,
    };
    return iconMap[icon] || <DollarSignIcon className="w-6 h-6 text-gray-400" />;
};


const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, icon }) => {
  const renderChange = () => {
    if (!change) {
      return null;
    }
    const isPositiveOutcome = changeType === 'positive';
    const isTrendingUp = change.startsWith('+');
    const changeColor = isPositiveOutcome ? 'text-[#39FF14]' : 'text-red-500';
    const ChangeIcon = isTrendingUp ? TrendingUpIcon : TrendingDownIcon;

    return (
      <div className="flex items-center space-x-1 text-sm">
        <ChangeIcon className={`w-4 h-4 ${changeColor}`} />
        <span className={changeColor}>{change}</span>
        <span className="text-gray-500">vs last month</span>
      </div>
    );
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 flex flex-col justify-between hover:border-[#7F56D9]/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
          <KpiIcon icon={icon} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        {renderChange()}
      </div>
    </div>
  );
};

export default KpiCard;