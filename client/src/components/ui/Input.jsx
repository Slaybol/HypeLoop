import React from 'react';

const Input = ({ 
  label,
  error,
  success,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  let inputClasses = `${baseClasses} border-neutral-300 focus:border-primary-500 focus:ring-primary-500`;
  
  if (error) {
    inputClasses = `${baseClasses} border-game-danger focus:border-game-danger focus:ring-game-danger`;
  } else if (success) {
    inputClasses = `${baseClasses} border-game-success focus:border-game-success focus:ring-game-success`;
  }
  
  const containerClasses = `relative ${className}`;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-neutral-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-neutral-400">
              {rightIcon}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-game-danger animate-fade-in">
          {error}
        </p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-game-success animate-fade-in">
          {success}
        </p>
      )}
    </div>
  );
};

export default Input; 