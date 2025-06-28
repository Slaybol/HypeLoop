import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClick,
  hover = true,
  animation = 'slide-up',
  ...props 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500';
  
  const variants = {
    default: 'bg-white/95 backdrop-blur-md border border-white/20 shadow-soft',
    elevated: 'bg-white/95 backdrop-blur-md border border-white/20 shadow-medium',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-soft',
    dark: 'bg-neutral-800/95 backdrop-blur-md border border-neutral-700/50 shadow-medium',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200/50 shadow-soft',
  };
  
  const hoverClasses = hover ? 'hover:shadow-large hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  const animationClasses = animation ? `animate-${animation}` : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${clickableClasses} ${animationClasses} ${className}`;
  
  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better structure
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 