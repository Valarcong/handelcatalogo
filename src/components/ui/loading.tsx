import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Loading spinner básico
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn(
      'animate-spin text-blue-600',
      sizeClasses[size],
      className
    )} />
  );
};

// Loading page completo
export const LoadingPage: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'Cargando...', className }) => (
  <div className={cn(
    'min-h-screen flex items-center justify-center bg-gray-50',
    className
  )}>
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Loading skeleton para productos
export const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

// Grid de skeletons para productos
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

// Loading skeleton para tablas
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);

// Loading skeleton para cards
export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3 bg-gray-200 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  </div>
);

// Loading overlay para modales
export const LoadingOverlay: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'Procesando...', className }) => (
  <div className={cn(
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
    className
  )}>
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  </div>
);

// Loading button
export const LoadingButton: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, loading = false, className, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
      'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
  >
    {loading && <LoadingSpinner size="sm" />}
    {children}
  </button>
); 