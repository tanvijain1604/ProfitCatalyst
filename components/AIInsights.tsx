import React, { useState } from 'react';
import { kpiData, clientProfitabilityData, serviceProfitabilityData } from '../constants';
import { AIInsightsResponse } from '../types';
import { SparklesIcon, LightbulbIcon, TrendingUpIcon } from './icons';

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded w-full"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="h-6 w-48 bg-white/10 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-lg space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-full"></div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg space-y-2">
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="h-6 w-56 bg-white/10 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-lg space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-full"></div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg space-y-2">
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsightsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);
    setHasGenerated(true);

    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
      setError("API_KEY is not configured. Please ensure the environment variable is set.");
      setLoading(false);
      return;
    }

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const dataSummary = `
        Key Performance Indicators: ${JSON.stringify(kpiData, null, 2)}
        Client-Level Profitability: ${JSON.stringify(clientProfitabilityData, null, 2)}
        Service-Level Profitability: ${JSON.stringify(serviceProfitabilityData, null, 2)}
      `;

      const prompt = `
        As an expert MSP business analyst, analyze the following business data for ProfitCatalyst. Your analysis should be highly specific and actionable.

        Data:
        ${dataSummary}

        Based on this data, provide the following insights:

        1.  **Business Health Summary**: Focus specifically on the MRR growth trend. Is it accelerating or decelerating? Also, comment on the distribution of client profitability. Is it healthy, or is the business overly reliant on a few high-margin clients?

        2.  **Targeted Upsell Opportunities**: Identify the top 2 clients for upsell opportunities. Prioritize clients with high current profitability and low churn risk who are not yet utilizing your most profitable service (Cloud Services). For each, name the client, suggest the specific upsell, and provide a data-driven reason.

        3.  **Service Line Optimization**: The 'VoIP' service line has the lowest profitability. Provide two concrete recommendations to improve its margin. These could involve operational changes, bundling strategies, or pricing adjustments.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A brief, insightful summary of the overall business health, focusing on MRR trend and client profitability distribution.",
          },
          upsellOpportunities: {
            type: Type.ARRAY,
            description: "A list of specific, targeted upsell opportunities.",
            items: {
              type: Type.OBJECT,
              properties: {
                client: { type: Type.STRING, description: "The name of the client with the upsell opportunity." },
                opportunity: { type: Type.STRING, description: "The specific service or product to upsell." },
                reason: { type: Type.STRING, description: "A brief, data-driven reason why this is a good opportunity." },
              },
            },
          },
          serviceOptimizationRecommendations: {
            type: Type.ARRAY,
            description: "Actionable recommendations to improve the profitability of the 'VoIP' service line.",
            items: {
              type: Type.OBJECT,
              properties: {
                strategy: { type: Type.STRING, description: "The type of strategy (e.g., 'Pricing Adjustment', 'Bundling')." },
                recommendation: { type: Type.STRING, description: "The specific recommendation to improve the VoIP service margin." },
                potential_impact: { type: Type.STRING, description: "The expected outcome of implementing this recommendation." },
              },
            },
          },
        },
        required: ["summary", "upsellOpportunities", "serviceOptimizationRecommendations"],
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
      
      let jsonText = response.text.trim();
      if (!jsonText) {
        throw new Error("Received an empty response from the AI service.");
      }
      
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonText = jsonMatch[1];
      }

      const parsedInsights = JSON.parse(jsonText);
      setInsights(parsedInsights);

    } catch (e: any) {
      console.error("Error generating AI insights:", e);
      setError(e.message || "An unknown error occurred while generating AI insights.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return (
        <div className="text-center text-red-400 p-4">
          <p>{error}</p>
        </div>
      );
    }

    if (insights) {
      return (
        <div className="space-y-6">
          <p className="text-gray-300">{insights.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                <TrendingUpIcon className="w-5 h-5 mr-2 text-[#39FF14]" />
                Upsell Opportunities
              </h4>
              <ul className="space-y-3">
                {insights.upsellOpportunities?.map((opp, index) => (
                  <li key={index} className="p-3 bg-white/5 rounded-lg">
                    <p className="font-semibold text-white">{opp.client}: <span className="font-normal">{opp.opportunity}</span></p>
                    <p className="text-sm text-gray-400">{opp.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                <LightbulbIcon className="w-5 h-5 mr-2 text-[#7F56D9]" />
                Service Line Optimization (VoIP)
              </h4>
              <ul className="space-y-3">
                {insights.serviceOptimizationRecommendations?.map((rec, index) => (
                  <li key={index} className="p-3 bg-white/5 rounded-lg">
                    <p className="font-semibold text-white">{rec.strategy}: <span className="font-normal">{rec.recommendation}</span></p>
                    <p className="text-sm text-gray-400">Impact: {rec.potential_impact}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    if (hasGenerated) return null; // Should be covered by loading/error/insights states
    
    return (
        <div className="text-center p-6 flex flex-col items-center">
            <p className="text-gray-400 mb-4 max-w-md">Click to generate an AI-powered analysis of your current dashboard data for actionable strategies.</p>
            <button
                onClick={generateInsights}
                disabled={loading}
                className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {loading ? 'Analyzing...' : 'Generate Insights'}
            </button>
        </div>
    );
  };


  return (
    <div className="glassmorphic rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <SparklesIcon className="w-6 h-6 mr-3 text-transparent bg-clip-text bg-gradient-to-r from-[#7F56D9] to-[#9E77ED]" />
          AI-Powered Insights
        </h2>
        {hasGenerated && (
             <button
                onClick={generateInsights}
                disabled={loading}
                className="px-3 py-1 text-xs font-semibold text-[#7F56D9] bg-[#7F56D9]/10 rounded-md hover:bg-[#7F56D9]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                {loading ? 'Analyzing...' : 'Refresh'}
            </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default AIInsights;