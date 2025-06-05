import React from 'react';
import { clsx } from 'clsx';

export const Spinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-b-2 border-primary-600',
        sizes[size],
        className
      )}
    />
  );
};