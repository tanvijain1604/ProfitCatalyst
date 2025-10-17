import { ReactNode } from "react";

export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

export interface MrrData {
  month: string;
  mrr: number;
}

export interface MarginTrendData {
  month: string;
  margin: number;
}


export interface ClientProfitability {
  id: string;
  client: string;
  margin: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  ltv: number;
}

export interface ServiceProfitability {
  service: string;
  profit: number;
}

export interface DetailedClient {
  id: string;
  name: string;
  logo: string;
  status: 'Active' | 'Inactive' | 'Trial';
  csat: number;
  openTickets: number;
  ltv: number;
  joinDate: string;
}

export interface SalesPipelineStage {
  stage: string;
  value: number;
  dealCount: number;
}

export interface EmailCampaign {
  id: string;
  name:string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  openRate: number;
  clickRate: number;
}

export interface SocialMediaStats {
    platform: 'LinkedIn';
    followers: number;
    engagement: number;
    followerChange: number;
}

export interface Integration {
    id: string;
    name: 'HubSpot' | 'Mailchimp' | 'LinkedIn';
    description: string;
    logo: 'HubSpot' | 'Mailchimp' | 'LinkedIn';
}

export interface UpsellOpportunity {
    client: string;
    opportunity: string;
    reason: string;
}

export interface ServiceOptimizationRecommendation {
    strategy: string;
    recommendation: string;
    potential_impact: string;
}

export interface AIInsightsResponse {
    summary: string;
    upsellOpportunities: UpsellOpportunity[];
    serviceOptimizationRecommendations: ServiceOptimizationRecommendation[];
}

export type Role = 'Admin' | 'Manager' | 'Analyst' | 'Viewer';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string;
}