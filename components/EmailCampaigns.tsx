import React from 'react';
import { EmailCampaign } from '../types';
import { MailIcon } from './icons';

interface EmailCampaignsProps {
  data: EmailCampaign[];
  loading: boolean;
}

const StatusBadge: React.FC<{ status: 'Sent' | 'Draft' | 'Scheduled' }> = ({ status }) => {
  const colorClasses = {
    Sent: 'bg-[#39FF14]/20 text-[#39FF14]',
    Draft: 'bg-gray-500/20 text-gray-500',
    Scheduled: 'bg-yellow-500/20 text-yellow-500',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg flex items-center justify-between">
                <div className='flex items-center'>
                    <div className='w-8 h-8 rounded-lg bg-white/10 mr-4'></div>
                    <div>
                        <div className="h-4 bg-white/10 rounded w-40 mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-20"></div>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="h-6 bg-white/10 rounded w-16"></div>
                    <div className="h-6 bg-white/10 rounded w-16"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmailCampaigns: React.FC<EmailCampaignsProps> = ({ data, loading }) => {
  if (loading) {
      return <SkeletonLoader />;
  }
  return (
    <div className="space-y-3">
      {data.map((campaign) => (
        <div key={campaign.id} className="p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between">
            <div className='flex items-center'>
                <div className='w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-4'>
                    <MailIcon className="w-4 h-4 text-gray-300"/>
                </div>
                <div>
                    <p className="font-semibold text-white text-sm">{campaign.name}</p>
                    <StatusBadge status={campaign.status}/>
                </div>
            </div>
          
          <div className="flex items-center space-x-6 text-sm text-right">
            <div>
              <p className="text-gray-400">Open Rate</p>
              <p className="font-bold text-white">{campaign.openRate}%</p>
            </div>
            <div>
              <p className="text-gray-400">Click Rate</p>
              <p className="font-bold text-white">{campaign.clickRate}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailCampaigns;