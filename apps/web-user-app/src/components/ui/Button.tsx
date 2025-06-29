import React, { FC } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = {
    default: 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
  };
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};
