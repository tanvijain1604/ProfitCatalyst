import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

export const mockUsers: User[] = [
    { id: 'u1', name: 'John Doe', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/admin/40' },
    { id: 'u2', name: 'Jane Smith', role: 'Manager', avatarUrl: 'https://picsum.photos/seed/manager/40' },
    { id: 'u3', name: 'Peter Jones', role: 'Analyst', avatarUrl: 'https://picsum.photos/seed/analyst/40' },
    { id: 'u4', name: 'Mary Lamb', role: 'Viewer', avatarUrl: 'https://picsum.photos/seed/viewer/40' },
];

const defaultUser = mockUsers[0]; // Default to Admin

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};