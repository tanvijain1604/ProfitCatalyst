import React from 'react';
import KpiCard from './KpiCard';
import { profitabilityKpis, clientProfitabilityData, marginTrendData, serviceProfitabilityData } from '../constants';
import ProfitabilityTable from './ProfitabilityTable';
import MarginTrendChart from './MarginTrendChart';
import ServiceProfitabilityChart from './ServiceProfitabilityChart';

const ProfitabilityPage: React.FC = () => {
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Profitability Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {profitabilityKpis.map((kpi, index) => (
                <KpiCard key={index} {...kpi} />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glassmorphic rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Overall Profit Margin Trend</h2>
                <MarginTrendChart data={marginTrendData} />
            </div>
            <div className="glassmorphic rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Profitability by Service</h2>
                <ServiceProfitabilityChart data={serviceProfitabilityData} />
            </div>
        </div>

        <div className="glassmorphic rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Client-Level Profitability</h2>
            <ProfitabilityTable data={clientProfitabilityData} />
        </div>
    </div>
  );
};

export default ProfitabilityPage;