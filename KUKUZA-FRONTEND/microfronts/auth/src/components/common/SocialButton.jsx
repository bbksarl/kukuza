import React from 'react';

export const SocialButton = ({
  provider,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'social-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const providerStyles = {
    google: 'bg-white/10 backdrop-blur-md border-1 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30 focus:ring-white/50',
    apple: 'bg-white/10 backdrop-blur-md border-1 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30 focus:ring-white/50',
  };

  const providerText = {
    google: 'Continuer avec Google',
    apple: 'Continuer avec Apple',
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${providerStyles[provider]} ${className}`}
      onClick={onClick}
      {...props}
    >
      <Icon className="w-6 h-6" />
      <span className="text-base">
        {providerText[provider]}
      </span>
    </button>
  );
};