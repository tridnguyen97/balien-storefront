/**
 * Form Select Component
 *
 * Reusable form select with label, error handling, and validation support.
 */

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  register?: any;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  className = '',
  register
}) => {
  const selectProps = register 
    ? register(name)
    : { name, value, onChange };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        disabled={disabled}
        className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        {...selectProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;