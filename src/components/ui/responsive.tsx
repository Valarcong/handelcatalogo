import React from 'react';
import { cn } from '@/lib/utils';

// Componente para mostrar contenido solo en móvil
export const MobileOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("block md:hidden", className)}>
    {children}
  </div>
);

// Componente para mostrar contenido solo en desktop
export const DesktopOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("hidden md:block", className)}>
    {children}
  </div>
);

// Componente para mostrar contenido solo en tablet y desktop
export const TabletAndUp: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("hidden sm:block", className)}>
    {children}
  </div>
);

// Componente para mostrar contenido solo en móvil y tablet
export const MobileAndTablet: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("block lg:hidden", className)}>
    {children}
  </div>
);

// Grid responsive mejorado
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}> = ({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 }
}) => {
  const gridClasses = [
    `grid gap-4`,
    `grid-cols-${cols.mobile || 1}`,
    `sm:grid-cols-${cols.tablet || 2}`,
    `md:grid-cols-${cols.desktop || 3}`,
    `xl:grid-cols-${cols.wide || 4}`,
  ].join(' ');

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
};

// Container responsive
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}> = ({ 
  children, 
  className,
  maxWidth = 'xl'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
};

// Texto responsive
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  className?: string;
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}> = ({ 
  children, 
  className,
  sizes = { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' }
}) => {
  const textClasses = [
    sizes.mobile || 'text-sm',
    `sm:${sizes.tablet || 'text-base'}`,
    `md:${sizes.desktop || 'text-lg'}`,
  ].join(' ');

  return (
    <div className={cn(textClasses, className)}>
      {children}
    </div>
  );
};

// Botón responsive
export const ResponsiveButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  className,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  ...props
}) => {
  const buttonClasses = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
      'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
      'text-primary underline-offset-4 hover:underline': variant === 'link',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
    },
    {
      'h-9 rounded-md px-3 text-xs': size === 'sm',
      'h-10 px-4 py-2': size === 'default',
      'h-11 rounded-md px-8': size === 'lg',
    },
    {
      'w-full': fullWidth,
    },
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

// Card responsive
export const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}> = ({ 
  children, 
  className,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div className={cn(
      'bg-card text-card-foreground rounded-lg border shadow-sm',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

// Hook para detectar breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('mobile');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('mobile');
      else if (width < 768) setBreakpoint('tablet');
      else if (width < 1280) setBreakpoint('desktop');
      else setBreakpoint('wide');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Hook para detectar si es móvil
export const useIsMobile = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
};

// Hook para detectar si es tablet o menor
export const useIsTabletOrLess = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile' || breakpoint === 'tablet';
}; 