import React from 'react';
import { Integration } from '../types';
import { HubSpotIcon, MailchimpIcon, LinkedInIcon } from './icons';

interface IntegrationCardProps {
  integration: Integration;
  isConnected: boolean;
  onToggle: (id: string) => void;
}

const iconMap: { [key in Integration['logo']]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    HubSpot: HubSpotIcon,
    Mailchimp: MailchimpIcon,
    LinkedIn: LinkedInIcon,
};

const iconPropsMap: { [key in Integration['logo']]: { className: string } } = {
    HubSpot: { className: "w-8 h-8 text-orange-500" },
    Mailchimp: { className: "w-8 h-8 text-yellow-500" },
    LinkedIn: { className: "w-8 h-8 text-blue-500" },
};


const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration, isConnected, onToggle }) => {
  const IconComponent = iconMap[integration.logo];

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-transparent hover:border-white/20 transition-all">
      <div className="flex items-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mr-4">
          {IconComponent && <IconComponent {...iconPropsMap[integration.logo]} />}
        </div>
        <div>
          <h3 className="font-semibold text-white">{integration.name}</h3>
          <p className="text-sm text-gray-400">{integration.description}</p>
        </div>
      </div>
      <button
        onClick={() => onToggle(integration.id)}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
          isConnected
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-green-500/20 text-[#39FF14] hover:bg-green-500/30'
        }`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export default IntegrationCard;