import { salesPipelineData, emailCampaignsData, socialMediaStats, integrations } from '../constants';
import { SalesPipelineStage, EmailCampaign, SocialMediaStats, Integration } from '../types';

const MOCK_API_DELAY = 1200; // ms

const delayedResponse = <T>(data: T, signal?: AbortSignal): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            resolve(data);
        }, MOCK_API_DELAY);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
};

const api = {
    fetchSalesPipelineData: (signal?: AbortSignal): Promise<SalesPipelineStage[]> => {
        return delayedResponse(salesPipelineData, signal);
    },
    
    fetchEmailCampaignsData: (signal?: AbortSignal): Promise<EmailCampaign[]> => {
        return delayedResponse(emailCampaignsData, signal);
    },
    
    fetchSocialMediaStats: (signal?: AbortSignal): Promise<SocialMediaStats> => {
        return delayedResponse(socialMediaStats, signal);
    },
    
    fetchIntegrations: (signal?: AbortSignal): Promise<Integration[]> => {
        return delayedResponse(integrations, signal);
    }
};

export default api;