import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', padding = true, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md',
        padding && 'p-6',
        hover && 'hover:shadow-lg transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
