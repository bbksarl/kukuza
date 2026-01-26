import React from 'react';

export const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  label,
  className = '',
  ...props
}) => {
  const baseClasses = 'auth-input';
  const errorClasses = 'ring-2 ring-red-500 focus:ring-red-500 border-red-500';
  
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${baseClasses} ${error && touched ? errorClasses : ''} ${className}`}
        {...props}
      />
      {error && touched && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};