import React from 'react';
import { useUser } from '../contexts/UserContext';
import { hasPageAccess } from '../lib/permissions';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-[#7F56D9] text-white font-semibold shadow-lg shadow-[#7F56D9]/20'
        : 'text-gray-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    <span className="mr-4">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  navItems: NavItem[];
  settingsItem?: NavItem;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, settingsItem, activePage, setActivePage }) => {
  const { user } = useUser();

  const accessibleNavItems = navItems.filter(item => hasPageAccess(user.role, item.id));

  return (
    <aside className="hidden sm:block fixed top-0 left-0 h-full w-[280px] p-6">
       <div className="h-full w-full bg-[#120f2e] rounded-2xl flex flex-col p-4 shadow-2xl">
        <div className="flex items-center mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7F56D9] to-[#9E77ED] rounded-full mr-3"></div>
            <h1 className="text-2xl font-bold text-white tracking-wider">ProfitCatalyst</h1>
        </div>
        <nav className="flex flex-col space-y-3">
            {accessibleNavItems.map(item => (
              <NavLink 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activePage === item.id} 
                onClick={() => setActivePage(item.id)} 
              />
            ))}
        </nav>
        <div className="mt-auto">
             {settingsItem && hasPageAccess(user.role, settingsItem.id) && (
                <NavLink 
                  icon={settingsItem.icon} 
                  label={settingsItem.label} 
                  active={activePage === settingsItem.id} 
                  onClick={() => setActivePage(settingsItem.id)} 
                />
             )}
        </div>
       </div>
    </aside>
  );
};

export default Sidebar;