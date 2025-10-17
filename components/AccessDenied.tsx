import React from 'react';
import { ZapIcon } from './icons'; // Using ZapIcon as a generic "stop" or "warning" icon

const AccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <ZapIcon className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
      </p>
    </div>
  );
};

export default AccessDenied;
