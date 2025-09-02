import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface LightSweepProps {
  children: React.ReactNode;
  target?: 'hero' | 'cta';
  className?: string;
  triggerOnMount?: boolean;
}

// FIX: Business-grade directional light sweep for premium feel
const LightSweep: React.FC<LightSweepProps> = ({ 
  children, 
  target = 'hero',
  className = '',
  triggerOnMount = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimatedOnMount, setHasAnimatedOnMount] = useState(false);

  // FIX: Trigger first-paint hero sweep
  useEffect(() => {
    if (target === 'hero' && triggerOnMount && !shouldReduceMotion && !hasAnimatedOnMount) {
      const timer = setTimeout(() => {
        setHasAnimatedOnMount(true);
      }, 200); // Small delay for mount
      return () => clearTimeout(timer);
    }
  }, [target, triggerOnMount, shouldReduceMotion, hasAnimatedOnMount]);

  const baseClasses = "relative overflow-hidden";
  
  // FIX: CSS mask gradient sweep - fallback to opacity if unsupported
  const sweepClasses = shouldReduceMotion 
    ? "" 
    : target === 'hero' 
      ? hasAnimatedOnMount && triggerOnMount
        ? "before:animate-[lightSweepHero_1.2s_ease-out_forwards] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:skew-x-[25deg] before:pointer-events-none"
        : ""
      : isHovered
        ? "before:animate-[lightSweepCta_0.6s_ease-out_forwards] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-100%] before:skew-x-[25deg] before:pointer-events-none"
        : "";

  const handleMouseEnter = () => {
    if (target === 'cta' && !shouldReduceMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (target === 'cta') {
      setIsHovered(false);
    }
  };

  const handleAnimationEnd = () => {
    if (target === 'cta') {
      setIsHovered(false);
    }
  };

  return (
    <div 
      className={`${baseClasses} ${sweepClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

export default LightSweep;