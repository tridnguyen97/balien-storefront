/**
 * Container Component
 *
 * Provides a consistent centered container with max-width and padding.
 */

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  fluid = false 
}) => {
  const baseClass = fluid 
    ? 'px-4 md:px-6' 
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};

export default Container;