import { memo, PropsWithChildren, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransitionRouteProps extends PropsWithChildren {
  className?: string;
}

const TransitionRoute = memo(({ children, className }: TransitionRouteProps) => {
  // Remove useReducedMotion for now to avoid React context issues
  // We'll use a simple animation that respects user preferences via CSS
  const variants = useMemo(
    () => ({
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
    }),
    []
  );

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: 0.24, 
        ease: [0.22, 1, 0.36, 1],
        // Respect user's reduced motion preference via CSS
        ...(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {
          duration: 0.01
        } : {})
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
});

TransitionRoute.displayName = 'TransitionRoute';

export default TransitionRoute;
