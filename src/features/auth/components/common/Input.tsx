import React, { InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/core/i18n';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  label?: ReactNode;
  className?: string;
}

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
}: InputProps) => {
  const { translateText } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const baseClasses = 'auth-input';
  const errorClasses = 'ring-2 ring-red-500 focus:ring-red-500 border-red-500';
  const hasError = error && touched;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  return (
    <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
      {label && (
        <label htmlFor={name} className={`block text-[0.688rem] xs:text-xs sm:text-sm font-medium ${hasError ? 'text-red-400' : 'text-white/80'}`}>
          {hasError ? translateText(error) : label}
        </label>
      )}
      <div className={isPassword ? 'relative' : undefined}>
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={hasError ? '' : placeholder}
          className={`${baseClasses} ${isPassword ? 'pr-10' : ''} ${hasError ? errorClasses : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#297560]"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
};
