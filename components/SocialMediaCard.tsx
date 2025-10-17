import React from 'react';
import { SocialMediaStats } from '../types';
import { LinkedInIcon, TrendingUpIcon } from './icons';

interface SocialMediaCardProps {
    stats: SocialMediaStats | null;
    loading: boolean;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ stats, loading }) => {
    
    const SkeletonLoader = () => (
        <div className="animate-pulse flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg mr-4"></div>
                <div>
                    <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-32"></div>
                </div>
            </div>
            <div className="flex items-center space-x-8">
                <div>
                    <div className="h-3 bg-white/10 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-white/10 rounded w-20"></div>
                </div>
                <div>
                    <div className="h-3 bg-white/10 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-white/10 rounded w-20"></div>
                </div>
            </div>
        </div>
    );

    if (loading || !stats) {
        return <SkeletonLoader />;
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                    <LinkedInIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">{stats.platform}</h3>
                    <p className="text-sm text-gray-400">Company Page Performance</p>
                </div>
            </div>

            <div className="flex items-center space-x-8">
                <div>
                    <p className="text-sm text-gray-400">Followers</p>
                    <p className="text-xl font-bold text-white">{new Intl.NumberFormat().format(stats.followers)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Engagement</p>
                    <p className="text-xl font-bold text-white">{stats.engagement}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">New Followers (30d)</p>
                    <div className="flex items-center">
                        <TrendingUpIcon className="w-4 h-4 text-[#39FF14] mr-1" />
                        <p className="text-xl font-bold text-[#39FF14]">
                            {stats.followerChange}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaCard;
