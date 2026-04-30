/**
 * Error State Component
 *
 * Displays an error message with optional retry action.
 */

import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  action?: React.ReactNode;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  retryText = 'Try Again', 
  action, 
  className = '' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="bg-gold text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            {retryText}
          </button>
        )}
        {action}
      </div>
    </div>
  );
};

export default ErrorState;