import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  className = '',
  error = false,
  children,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={clsx(
          'block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors appearance-none bg-white',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
});

Select.displayName = 'Select';