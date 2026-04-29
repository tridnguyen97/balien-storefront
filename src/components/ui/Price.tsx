/**
 * Price Formatting Component
 *
 * Formats and displays prices with currency symbol and optional formatting.
 */

import React from 'react';

interface PriceProps {
  amount: number;
  currency?: string;
  showCurrencySymbol?: boolean;
  className?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl';
}

const Price: React.FC<PriceProps> = ({
  amount,
  currency = 'USD',
  showCurrencySymbol = true,
  className = '',
  size = 'base'
}) => {
  // Format the amount to 2 decimal places
  const formattedAmount = amount.toFixed(2);
  
  // Size mapping for text sizes
  const sizeMap: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  const textSize = sizeMap[size] || sizeMap.base;
  
  return (
    <span className={`${textSize} font-medium ${className}`}>
      {showCurrencySymbol && '$'}
      {formattedAmount}
      {showCurrencySymbol && ` ${currency}`}
    </span>
  );
};

export default Price;