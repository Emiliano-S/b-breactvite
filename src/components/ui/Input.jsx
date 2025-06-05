import React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef(({
  className = '',
  error = false,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';