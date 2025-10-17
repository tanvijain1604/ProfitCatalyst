import React from 'react';
import KpiCard from './KpiCard';
import ProfitabilityTable from './ProfitabilityTable';
import { kpiData, clientProfitabilityData, mrrData, serviceProfitabilityData } from '../constants';
import MrrChart from './MrrChart';
import ServiceProfitabilityChart from './ServiceProfitabilityChart';
import AIInsights from './AIInsights';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Statically imported AI Insights component to resolve dynamic import issues */}
      <AIInsights />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glassmorphic rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">MRR Growth</h2>
          <MrrChart data={mrrData} />
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

export default Dashboard;