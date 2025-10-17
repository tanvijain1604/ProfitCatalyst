import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfitabilityPage from './components/ProfitabilityPage';
import ClientsPage from './components/ClientsPage';
import SalesMarketingPage from './components/SalesMarketingPage';
import SettingsPage from './components/SettingsPage';
import ReportingPage from './components/ReportingPage';
import AccessDenied from './components/AccessDenied';
import { LayoutDashboardIcon, DollarSignIcon, UsersIcon, TargetIcon, SettingsIcon, FileTextIcon } from './components/icons';
import { UserProvider, useUser } from './contexts/UserContext';
import { hasPageAccess } from './lib/permissions';

// Centralized page configuration for dynamic routing and navigation
const pageConfig = [
  { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" />, component: Dashboard },
  { id: 'Profitability', label: 'Profitability', icon: <DollarSignIcon className="w-5 h-5" />, component: ProfitabilityPage },
  { id: 'Clients', label: 'Clients', icon: <UsersIcon className="w-5 h-5" />, component: ClientsPage },
  { id: 'Sales & Marketing', label: 'Sales & Marketing', icon: <TargetIcon className="w-5 h-5" />, component: SalesMarketingPage },
  { id: 'Reporting', label: 'Reporting', icon: <FileTextIcon className="w-5 h-5" />, component: ReportingPage },
  { id: 'Settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, component: SettingsPage },
];

const pageMap = new Map(pageConfig.map(p => [p.id, p.component]));
const navItems = pageConfig.filter(p => p.id !== 'Settings');
const settingsItem = pageConfig.find(p => p.id === 'Settings');


const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const { user } = useUser();

  useEffect(() => {
    // If user changes and they can't access the current page, redirect to dashboard
    if (!hasPageAccess(user.role, activePage)) {
      setActivePage('Dashboard');
    }
  }, [user, activePage]);

  const renderContent = () => {
    if (!hasPageAccess(user.role, activePage)) {
        return <AccessDenied />;
    }
    const PageComponent = pageMap.get(activePage) || Dashboard;
    return <PageComponent />;
  };


  return (
    <div className="min-h-screen w-full bg-[#19153a] text-gray-200 flex transition-colors duration-300">
      <Sidebar 
        navItems={navItems}
        settingsItem={settingsItem}
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      <main className="flex-1 flex flex-col pl-0 sm:pl-[280px]">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};


export default App;