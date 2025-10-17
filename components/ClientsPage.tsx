import React, { useState } from 'react';
import { clientsKpis, detailedClientData } from '../constants';
import KpiCard from './KpiCard';
import ClientsTable from './ClientsTable';
import ClientDetailModal from './ClientDetailModal';
import { useUser } from '../contexts/UserContext';
import { hasActionPermission } from '../lib/permissions';
import { DetailedClient } from '../types';

const ClientsPage: React.FC = () => {
  const { user } = useUser();
  const canAddClient = hasActionPermission(user.role, 'clients:add');
  const [selectedClient, setSelectedClient] = useState<DetailedClient | null>(null);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Client Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {clientsKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="glassmorphic rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-white">All Clients</h2>
            <div className="flex items-center gap-4">
                <button className="bg-transparent border border-[#7F56D9] text-[#7F56D9] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7F56D9]/20 transition-colors">
                    Generate Report
                </button>
                {canAddClient && (
                  <button className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                      Add Client
                  </button>
                )}
            </div>
        </div>
        <ClientsTable data={detailedClientData} onRowClick={setSelectedClient} />
      </div>

      <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
    </div>
  );
};

export default ClientsPage;