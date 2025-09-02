import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FireFieldProps {
  className?: string;
}

const FireField = memo(({ className }: FireFieldProps) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: shouldReduceMotion 
        ? { opacity: 0.8 }
        : { 
            opacity: [0.8, 1, 0.8],
            scale: [0.96, 1.04, 0.96]
          }
    }),
    [shouldReduceMotion]
  );

  const conicVariants = useMemo(
    () => ({
      animate: shouldReduceMotion 
        ? { rotate: 0 }
        : { rotate: 360 }
    }),
    [shouldReduceMotion]
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Radial gradient layer 1 - Top left */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 opacity-60"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, #A78BFA 35%, #C084FC 60%, transparent 80%)',
          filter: 'blur(40px)',
          mixBlendMode: 'screen'
        }}
        variants={variants}
        initial="initial"
        animate="animate"
        transition={shouldReduceMotion ? {} : {
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Radial gradient layer 2 - Bottom right */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-80 h-80 opacity-50"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, #8B5CF6 40%, #F0ABFC 70%, transparent 90%)',
          filter: 'blur(35px)',
          mixBlendMode: 'screen'
        }}
        variants={variants}
        initial="initial"
        animate="animate"
        transition={shouldReduceMotion ? {} : {
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />

      {/* Conic gradient flare */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #8B5CF6 20%, #C084FC 40%, transparent 60%, #A78BFA 80%, transparent 100%)',
          filter: 'blur(30px)',
          mixBlendMode: 'plus-lighter'
        }}
        variants={conicVariants}
        animate="animate"
        transition={shouldReduceMotion ? {} : {
          duration: 50,
          ease: "linear",
          repeat: Infinity
        }}
      />

      {/* Soft ambient glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, #8B5CF6 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
});

FireField.displayName = 'FireField';

export default FireField;