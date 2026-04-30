/**
 * Loading Spinner Component
 *
 * Displays a centered loading state with spinner and optional text.
 */

import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-gold mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-muted-dark">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;