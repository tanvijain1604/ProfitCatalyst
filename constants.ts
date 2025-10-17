

import { KpiData, MrrData, ClientProfitability, ServiceProfitability, DetailedClient, SalesPipelineStage, EmailCampaign, MarginTrendData, SocialMediaStats, Integration } from './types';

// Dashboard Data
export const kpiData: KpiData[] = [
  {
    title: 'Monthly Recurring Revenue',
    value: '$125,634',
    change: '+12.5%',
    changeType: 'positive',
    icon: 'mrr',
  },
  {
    title: 'Client Profitability',
    value: '63.8%',
    change: '+2.1%',
    changeType: 'positive',
    icon: 'profitability',
  },
  {
    title: 'Client Churn Rate',
    value: '1.2%',
    change: '-0.3%',
    changeType: 'positive',
    icon: 'churn',
  },
  {
    title: 'New MRR',
    value: '$12,830',
    change: '-15.2%',
    changeType: 'negative',
    icon: 'new-mrr',
  },
];

export const mrrData: MrrData[] = [
  { month: 'Jan', mrr: 85000 },
  { month: 'Feb', mrr: 88000 },
  { month: 'Mar', mrr: 95000 },
  { month: 'Apr', mrr: 102000 },
  { month: 'May', mrr: 110000 },
  { month: 'Jun', mrr: 115000 },
  { month: 'Jul', mrr: 121000 },
  { month: 'Aug', mrr: 125634 },
];

export const clientProfitabilityData: ClientProfitability[] = [
  { id: 'C001', client: 'Innovate Corp', margin: 72, churnRisk: 'Low', ltv: 250000 },
  { id: 'C002', client: 'Quantum Dynamics', margin: 65, churnRisk: 'Low', ltv: 180000 },
  { id: 'C003', client: 'Synergy Solutions', margin: 58, churnRisk: 'Medium', ltv: 95000 },
  { id: 'C004', client: 'Apex Innovations', margin: 75, churnRisk: 'Low', ltv: 320000 },
  { id: 'C005', client: 'Future Enterprises', margin: 45, churnRisk: 'High', ltv: 50000 },
  { id: 'C006', client: 'Stellar Tech', margin: 68, churnRisk: 'Low', ltv: 210000 },
];

export const serviceProfitabilityData: ServiceProfitability[] = [
    { service: 'Managed IT', profit: 75000 },
    { service: 'Cloud Services', profit: 95000 },
    { service: 'Cybersecurity', profit: 62000 },
    { service: 'VoIP', profit: 35000 },
    { service: 'Consulting', profit: 48000 },
];

// Profitability Page Data
export const profitabilityKpis: KpiData[] = [
    { title: 'Avg. Client Margin', value: '63.8%', change: '+2.1%', changeType: 'positive', icon: 'margin' },
    { title: 'High-Profit Clients', value: '4', change: '+1', changeType: 'positive', icon: 'high-profit' },
    { title: 'LTV/CAC Ratio', value: '4.2', change: '+0.5', changeType: 'positive', icon: 'ltv-cac' },
    { title: 'Top Service', value: 'Cloud', change: '', changeType: 'positive', icon: 'top-service' },
];

export const marginTrendData: MarginTrendData[] = [
    { month: 'Jan', margin: 58 },
    { month: 'Feb', margin: 59 },
    { month: 'Mar', margin: 61 },
    { month: 'Apr', margin: 60 },
    { month: 'May', margin: 62 },
    { month: 'Jun', margin: 63 },
    { month: 'Jul', margin: 64 },
    { month: 'Aug', margin: 63.8 },
];

// Clients Page Data
export const clientsKpis: KpiData[] = [
    { title: 'Total Active Clients', value: '86', change: '+2', changeType: 'positive', icon: 'total-clients' },
    { title: 'Avg. CSAT Score', value: '9.2/10', change: '+0.1', changeType: 'positive', icon: 'csat' },
    { title: 'Avg. Response Time', value: '15 min', change: '-2 min', changeType: 'positive', icon: 'response-time' },
    { title: 'SLA Compliance', value: '99.8%', change: '+0.1%', changeType: 'positive', icon: 'sla' },
];

export const detailedClientData: DetailedClient[] = [
    { id: 'C001', name: 'Innovate Corp', logo: 'logo1.svg', status: 'Active', csat: 9.8, openTickets: 0, ltv: 250000, joinDate: '2022-01-15' },
    { id: 'C002', name: 'Quantum Dynamics', logo: 'logo2.svg', status: 'Active', csat: 9.5, openTickets: 1, ltv: 180000, joinDate: '2022-03-20' },
    { id: 'C003', name: 'Synergy Solutions', logo: 'logo3.svg', status: 'Active', csat: 8.9, openTickets: 3, ltv: 95000, joinDate: '2023-05-10' },
    { id: 'C004', name: 'Apex Innovations', logo: 'logo4.svg', status: 'Active', csat: 9.9, openTickets: 0, ltv: 320000, joinDate: '2021-11-01' },
    { id: 'C005', name: 'Future Enterprises', logo: 'logo5.svg', status: 'Trial', csat: 8.2, openTickets: 5, ltv: 50000, joinDate: '2024-07-01' },
    { id: 'C006', name: 'Stellar Tech', logo: 'logo6.svg', status: 'Active', csat: 9.6, openTickets: 1, ltv: 210000, joinDate: '2022-08-12' },
    { id: 'C007', name: 'Nexus Group', logo: 'logo7.svg', status: 'Inactive', csat: 7.5, openTickets: 0, ltv: 80000, joinDate: '2022-02-28' },
];

// Sales & Marketing Page Data
export const salesKpis: KpiData[] = [
    { title: 'New Leads (Month)', value: '42', change: '+15%', changeType: 'positive', icon: 'new-leads' },
    { title: 'Conversion Rate', value: '18.5%', change: '+1.2%', changeType: 'positive', icon: 'conversion' },
    { title: 'Pipeline Value', value: '$258,400', change: '+$25k', changeType: 'positive', icon: 'pipeline-value' },
    { title: 'Marketing ROI', value: '250%', change: '+30%', changeType: 'positive', icon: 'roi' },
];

export const salesPipelineData: SalesPipelineStage[] = [
    { stage: 'Leads', value: 50000, dealCount: 20 },
    { stage: 'Qualified', value: 85000, dealCount: 15 },
    { stage: 'Proposal', value: 65000, dealCount: 8 },
    { stage: 'Negotiation', value: 40000, dealCount: 4 },
];

export const emailCampaignsData: EmailCampaign[] = [
    { id: 'EC001', name: 'Q3 Security Webinar', status: 'Sent', openRate: 35, clickRate: 8 },
    { id: 'EC002', name: 'New Cloud Service Promo', status: 'Sent', openRate: 42, clickRate: 12 },
    { id: 'EC003', name: 'Monthly Newsletter - Aug', status: 'Scheduled', openRate: 0, clickRate: 0 },
    { id: 'EC004', name: 'Upsell Campaign - Innovate Corp', status: 'Draft', openRate: 0, clickRate: 0 },
];

export const socialMediaStats: SocialMediaStats = {
    platform: 'LinkedIn',
    followers: 12580,
    engagement: 2.8,
    followerChange: 312,
};

export const integrations: Integration[] = [
    {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Sync your CRM data, manage pipelines, and track deals.',
        logo: 'HubSpot'
    },
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Manage email campaigns and track marketing performance.',
        logo: 'Mailchimp'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        description: 'Automate posts and track engagement on your company page.',
        logo: 'LinkedIn'
    },
];