import React from 'react';

export const ProfileInfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) => (
  <div className="flex items-center space-x-4">
    <div className="text-gray-500 dark:text-gray-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value || 'Not set'}</p>
    </div>
  </div>
);
