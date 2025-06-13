import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean; // Optional, to indicate if the field is required
  disabled?: boolean; // Optional, to indicate if the field is disabled
}

const Select: React.FC<SelectProps> = ({
  name,
  options = [],
  placeholder = 'Select an option',
  onChange,
  required = false,
  disabled = false,
  className = '',
  defaultValue = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select
      name={name}
      disabled={disabled}
      required={required}
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? 'text-gray-800 dark:text-white/90'
          : 'text-gray-400 dark:text-gray-400'
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      <option
        value=''
        disabled
        className='text-gray-700 dark:bg-gray-900 dark:text-gray-400'
      >
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className='text-gray-700 dark:bg-gray-900 dark:text-gray-400'
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
