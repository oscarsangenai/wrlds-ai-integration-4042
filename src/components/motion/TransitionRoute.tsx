import { memo, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransitionRouteProps extends PropsWithChildren {
  className?: string;
}

const TransitionRoute = memo(({ children, className }: TransitionRouteProps) => {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const variants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: reduce ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
});

TransitionRoute.displayName = 'TransitionRoute';

export default TransitionRoute;
