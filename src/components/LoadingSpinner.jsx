import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className={`rounded-full ${sizeClasses[size]} border-solid border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;