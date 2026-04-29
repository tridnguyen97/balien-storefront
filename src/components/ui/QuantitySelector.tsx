/**
 * Quantity Selector Component
 *
 * A reusable component for selecting product quantity with +/- buttons.
 */

import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className = ''
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
  };

  return (
    <div className={`inline-flex items-center border border-[var(--ink-10)] rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-ink-60 hover:bg-[var(--cotton)] transition-colors"
      >
        −
      </button>
      <span className="w-10 h-10 flex items-center justify-center text-ink-90">{value}</span>
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-ink-60 hover:bg-[var(--cotton)] transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;