import React, { useState } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon } from './icons';
import { useUser, mockUsers } from '../contexts/UserContext';
import { User } from '../types';

const UserMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useUser();

    const handleSelectUser = (selectedUser: User) => {
        setUser(selectedUser);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <img
                    src={user.avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-[#7F56D9]/50"
                />
                <div className="text-right hidden sm:block">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 glassmorphic rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                        <p className="font-semibold text-sm text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                    <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Switch Role</p>
                    </div>
                    {mockUsers.map(mockUser => (
                        <button
                            key={mockUser.id}
                            onClick={() => handleSelectUser(mockUser)}
                            className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                                user.id === mockUser.id
                                ? 'text-[#9E77ED] bg-[#7F56D9]/10'
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-8 h-8 rounded-full mr-3" />
                            <div>
                                <p className="font-semibold">{mockUser.name}</p>
                                <p className="text-xs text-gray-400">{mockUser.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
};


const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 p-4 sm:p-8 sm:pt-6 sm:pb-4">
      <div className="w-full h-16 flex items-center justify-between px-6 glassmorphic rounded-xl">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients, services, or reports..."
            className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:ring-0"
          />
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#39FF14] rounded-full border-2 border-[#19153a]"></span>
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;