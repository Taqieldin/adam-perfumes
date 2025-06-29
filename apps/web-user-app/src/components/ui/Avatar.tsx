import React from 'react';

export const Avatar = ({ src, alt, fallback }: { src?: string | null; alt: string; fallback: React.ReactNode }) => (
  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
    {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : fallback}
  </div>
);
