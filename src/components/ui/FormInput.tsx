/**
 * Form Input Component
 *
 * Reusable form input with label, error handling, and validation support.
 */

import React from 'react';

interface FormInputProps {
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date';
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  register?: any;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  register
}) => {
  const inputProps = register 
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
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        {...inputProps}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;