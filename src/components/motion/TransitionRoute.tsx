import { PropsWithChildren, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TransitionRouteProps extends PropsWithChildren {
  className?: string;
}

/**
 * CSS-based route transition wrapper.
 * Applies .animate-in class on mount for smooth page entrances.
 * Respects prefers-reduced-motion for accessibility.
 */
const TransitionRoute = ({ children, className }: TransitionRouteProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsActive(true);
  }, []);

  return (
    <div
      className={cn(
        isActive ? 'animate-slide-up' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export default TransitionRoute;
