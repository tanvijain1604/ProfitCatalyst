import React, { useState, useEffect } from 'react';
import { salesKpis } from '../constants';
import KpiCard from './KpiCard';
import EmailCampaigns from './EmailCampaigns';
import SocialMediaCard from './SocialMediaCard';
import api from '../lib/api';
import { EmailCampaign, SocialMediaStats, SalesPipelineStage } from '../types';
import SalesPipeline from './SalesPipeline';

const SalesMarketingPage: React.FC = () => {
    const [campaignsData, setCampaignsData] = useState<EmailCampaign[]>([]);
    const [socialStats, setSocialStats] = useState<SocialMediaStats | null>(null);
    const [pipelineData, setPipelineData] = useState<SalesPipelineStage[]>([]);

    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [socialLoading, setSocialLoading] = useState(true);
    const [pipelineLoading, setPipelineLoading] = useState(true);
    
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        let isMounted = true;
        
        const loadData = async () => {
            setCampaignsLoading(true);
            setSocialLoading(true);
            setPipelineLoading(true);
            
            try {
                const [campaigns, social, pipeline] = await Promise.all([
                    api.fetchEmailCampaignsData(signal),
                    api.fetchSocialMediaStats(signal),
                    api.fetchSalesPipelineData(signal)
                ]);

                if (isMounted) {
                    setCampaignsData(campaigns);
                    setSocialStats(social);
                    setPipelineData(pipeline);
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error("Failed to load sales and marketing data:", error);
                }
            } finally {
                if (isMounted) {
                    setCampaignsLoading(false);
                    setSocialLoading(false);
                    setPipelineLoading(false);
                }
            }
        };
        loadData();
        
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Sales & Marketing Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {salesKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 glassmorphic rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">HubSpot Sales Pipeline</h2>
            <SalesPipeline data={pipelineData} loading={pipelineLoading} />
        </div>
        <div className="lg:col-span-2 glassmorphic rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Mailchimp Campaigns</h2>
            <EmailCampaigns data={campaignsData} loading={campaignsLoading} />
        </div>
      </div>

      <div className="glassmorphic rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Social Media Integration</h2>
        <SocialMediaCard stats={socialStats} loading={socialLoading} />
      </div>

    </div>
  );
};

export default SalesMarketingPage;