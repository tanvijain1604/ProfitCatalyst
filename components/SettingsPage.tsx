import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Integration } from '../types';
import IntegrationCard from './IntegrationCard';
import LoadingSpinner from './LoadingSpinner';
import { CreditCardIcon, UsersRoundIcon, ZapIcon, BellIcon, KeyIcon } from './icons';
import { useUser } from '../contexts/UserContext';
import { hasSettingTabAccess } from '../lib/permissions';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        enabled ? 'bg-gradient-to-r from-[#7F56D9] to-[#9E77ED]' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
);

interface ApiKey {
    id: string;
    name: string;
    key: string; 
    created: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useUser();

  const TABS = [
      { id: 'profile', label: 'Profile', icon: <UsersRoundIcon className="w-5 h-5"/> },
      { id: 'billing', label: 'Billing', icon: <CreditCardIcon className="w-5 h-5"/> },
      { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5"/> },
      { id: 'integrations', label: 'Integrations', icon: <ZapIcon className="w-5 h-5"/> },
      { id: 'api-keys', label: 'API Keys', icon: <KeyIcon className="w-5 h-5" /> },
  ];

  const accessibleTabs = TABS.filter(tab => hasSettingTabAccess(user.role, tab.id));

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set(['hubspot']));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john.doe@msp.com', role: 'MSP Admin' });
  const [notifications, setNotifications] = useState({
      account: { email: true, push: true },
      sla: { email: true, push: false },
      leads: { email: true, push: true },
      marketing: { email: false, push: false },
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: `key_1`, name: 'Default Production Key', key: 'pc_live_************************abcd', created: '2024-01-01' }
  ]);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{name: string, fullKey: string} | null>(null);
  const [keyNameToGenerate, setKeyNameToGenerate] = useState('');
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const billingHistory = [
      { id: 'inv1', date: '2024-08-01', description: 'Pro Tier Subscription', amount: 499.00 },
      { id: 'inv2', date: '2024-07-01', description: 'Pro Tier Subscription', amount: 499.00 },
      { id: 'inv3', date: '2024-06-01', description: 'Pro Tier Subscription', amount: 499.00 },
  ];
  
  useEffect(() => {
    setProfile({ name: user.name, email: 'user.email@msp.com', role: user.role });
  }, [user]);

  useEffect(() => {
    const isCurrentTabAccessible = accessibleTabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabAccessible) {
      setActiveTab(accessibleTabs[0]?.id || '');
    }
  }, [user.role, activeTab, accessibleTabs]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    if (activeTab === 'integrations') {
      const loadIntegrations = async () => {
        setLoading(true);
        try {
          const data = await api.fetchIntegrations(signal);
          if (isMounted) {
            setIntegrations(data);
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
             console.error("Failed to fetch integrations", error);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadIntegrations();
    }
    
    return () => {
        isMounted = false;
        controller.abort();
    };
  }, [activeTab]);

  const handleToggleIntegration = (id: string) => {
    setConnectedIntegrations(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleNotificationChange = (category: keyof typeof notifications, type: 'email' | 'push') => {
      setNotifications(prev => ({
          ...prev,
          [category]: { ...prev[category], [type]: !prev[category][type] }
      }));
  };
  
  const handleGenerateKey = () => {
    if (!keyNameToGenerate.trim()) return;
    const randomPart = Array.from({ length: 32 }, () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]).join('');
    const fullKey = `pc_live_${randomPart}`;
    const maskedKey = `pc_live_************************${randomPart.slice(-4)}`;
    const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: keyNameToGenerate,
        key: maskedKey,
        created: new Date().toISOString().split('T')[0],
    };
    setApiKeys(prev => [...prev, newKey]);
    setNewlyGeneratedKey({ name: keyNameToGenerate, fullKey });
    setKeyNameToGenerate('');
    setCopied(false);
  };

  const handleRevokeKey = (keyId: string) => {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      setKeyToRevoke(null);
  };

  const handleCopyKey = () => {
      if (newlyGeneratedKey) {
          navigator.clipboard.writeText(newlyGeneratedKey.fullKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const renderIntegrations = () => {
    if (loading) return <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>;
    return (
      <div className="space-y-4">
        {integrations.map(integration => (
          <IntegrationCard key={integration.id} integration={integration} isConnected={connectedIntegrations.has(integration.id)} onToggle={handleToggleIntegration} />
        ))}
      </div>
    );
  };
  
  const renderProfile = () => (
    <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
            <label className="text-sm text-gray-400">Full Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} className="w-full bg-transparent text-white text-lg font-semibold focus:outline-none" />
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
            <label className="text-sm text-gray-400">Email Address</label>
            <input type="email" value={profile.email} readOnly className="w-full bg-transparent text-gray-400 text-lg font-semibold focus:outline-none" />
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
            <label className="text-sm text-gray-400">Role</label>
            <p className="text-white text-lg font-semibold">{profile.role}</p>
        </div>
        <div className="flex justify-end">
            <button className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
        </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Current Plan</h3>
                <p className="text-2xl font-bold text-[#7F56D9]">Pro Tier</p>
                <p className="text-gray-400">$499.00 per month</p>
                <button className="mt-4 text-sm font-semibold text-[#7F56D9] hover:text-white transition">Change Plan</button>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Payment Method</h3>
                <div className="flex items-center">
                    <CreditCardIcon className="w-8 h-8 mr-4 text-gray-300"/>
                    <div>
                        <p className="text-white">Visa ending in 1234</p>
                        <p className="text-gray-400 text-sm">Expires 12/2026</p>
                    </div>
                </div>
                 <button className="mt-4 text-sm font-semibold text-[#7F56D9] hover:text-white transition">Update Payment Method</button>
            </div>
        </div>
        <div>
            <h3 className="font-semibold text-white mb-4">Billing History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-3 text-sm font-semibold text-gray-400">Date</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Description</th>
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right">Amount</th>
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right">Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billingHistory.map(item => (
                            <tr key={item.id} className="border-b border-white/5">
                                <td className="p-3 text-gray-300">{item.date}</td>
                                <td className="p-3 text-white">{item.description}</td>
                                <td className="p-3 font-mono text-white text-right">${item.amount.toFixed(2)}</td>
                                <td className="p-3 text-right"><a href="#" className="text-[#7F56D9] font-semibold text-sm hover:underline">Download</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderNotifications = () => {
      const categories = [
          { key: 'account' as const, title: 'Account Alerts', description: 'Security alerts and account changes.' },
          { key: 'sla' as const, title: 'SLA Breaches', description: 'Notifications for SLA compliance issues.' },
          { key: 'leads' as const, title: 'New Leads', description: 'Alerts from CRM about new sales leads.' },
          { key: 'marketing' as const, title: 'Marketing Updates', description: 'Newsletters and product updates.' },
      ]
      return (
        <div className="space-y-4">
            {categories.map(({ key, title, description }) => (
                <div key={key} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <p className="text-sm text-gray-400">{description}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-300">Email</label>
                            <ToggleSwitch enabled={notifications[key].email} onChange={() => handleNotificationChange(key, 'email')} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-300">Push</label>
                            <ToggleSwitch enabled={notifications[key].push} onChange={() => handleNotificationChange(key, 'push')} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )
  };
  
  const renderApiKeys = () => (
    <div className="space-y-8 animate-fade-in">
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">Generate New API Key</h3>
            <p className="text-sm text-gray-400 mb-4">API keys grant programmatic access to your ProfitCatalyst account. Treat them like passwords.</p>
            <div className="flex flex-col sm:flex-row items-stretch gap-4 p-4 bg-white/5 rounded-lg">
                <input
                    type="text"
                    value={keyNameToGenerate}
                    onChange={(e) => setKeyNameToGenerate(e.target.value)}
                    placeholder="Enter key name (e.g., 'CI/CD Pipeline')"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#7F56D9] focus:border-[#7F56D9] w-full"
                />
                <button
                    onClick={handleGenerateKey}
                    disabled={!keyNameToGenerate.trim()}
                    className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-shrink-0"
                >
                    Generate Key
                </button>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Your API Keys</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-3 text-sm font-semibold text-gray-400">Name</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Key</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Created</th>
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiKeys.map(key => (
                            <tr key={key.id} className="border-b border-white/5">
                                <td className="p-3 text-white font-medium">{key.name}</td>
                                <td className="p-3 font-mono text-gray-300">{key.key}</td>
                                <td className="p-3 text-gray-300">{key.created}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setKeyToRevoke(key)} className="text-red-400 hover:text-red-300 font-semibold text-sm">Revoke</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderContent = () => {
      // The useEffect hook ensures that activeTab is always an accessible one,
      // so checks within this function are redundant.
      switch (activeTab) {
          case 'profile': return renderProfile();
          case 'billing': return renderBilling();
          case 'notifications': return renderNotifications();
          case 'integrations': return renderIntegrations();
          case 'api-keys': return renderApiKeys();
          default: return null;
      }
  }

  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        
        <div className="glassmorphic rounded-2xl p-6">
          {accessibleTabs.length > 0 ? (
            <>
              <div className="border-b border-white/10 mb-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {accessibleTabs.map(tab => (
                          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-[#7F56D9] text-[#7F56D9]' : 'border-transparent text-gray-400 hover:text-white'}`}>
                              {tab.icon}
                              <span>{tab.label}</span>
                          </button>
                      ))}
                  </nav>
              </div>
              {renderContent()}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">You do not have permission to configure any settings.</p>
            </div>
          )}
        </div>
      </div>

      {newlyGeneratedKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" aria-modal="true" role="dialog">
              <div className="glassmorphic rounded-2xl w-full max-w-lg m-4 p-8 animate-slide-up">
                  <h2 className="text-xl font-bold text-white mb-2">API Key Generated</h2>
                  <p className="text-gray-400 mb-4">Please copy your new API key for <span className="font-semibold text-white">{newlyGeneratedKey.name}</span>. For your security, this key will not be shown again.</p>
                  <div className="p-3 bg-black/20 rounded-lg flex items-center justify-between font-mono text-green-300">
                      <span>{newlyGeneratedKey.fullKey}</span>
                      <button onClick={handleCopyKey} className="px-3 py-1 text-sm rounded-md bg-white/10 hover:bg-white/20 text-white">
                          {copied ? 'Copied!' : 'Copy'}
                      </button>
                  </div>
                   <div className="mt-6 flex justify-end">
                      <button onClick={() => setNewlyGeneratedKey(null)} className="bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90">
                          Done
                      </button>
                  </div>
              </div>
          </div>
      )}
      {keyToRevoke && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" aria-modal="true" role="dialog">
              <div className="glassmorphic rounded-2xl w-full max-w-md m-4 p-8 animate-slide-up">
                   <h2 className="text-xl font-bold text-white mb-2">Revoke API Key</h2>
                  <p className="text-gray-400 mb-4">Are you sure you want to revoke the key named "{keyToRevoke.name}"? This action is permanent and cannot be undone.</p>
                  <div className="flex justify-end space-x-4 mt-6">
                      <button onClick={() => setKeyToRevoke(null)} className="bg-white/10 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20">
                          Cancel
                      </button>
                      <button onClick={() => handleRevokeKey(keyToRevoke.id)} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">
                          Revoke Key
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default SettingsPage;