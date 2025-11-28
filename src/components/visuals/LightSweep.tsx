import React, { useEffect, useState } from 'react';

interface LightSweepProps {
  children: React.ReactNode;
  target?: 'hero' | 'cta';
  className?: string;
  triggerOnMount?: boolean;
}

/**
 * Pure CSS light sweep effect for premium interactions.
 * Uses CSS animations from index.css - respects prefers-reduced-motion automatically.
 * No framer-motion dependency.
 */
const LightSweep: React.FC<LightSweepProps> = ({ 
  children, 
  target = 'hero',
  className = '',
  triggerOnMount = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimatedOnMount, setHasAnimatedOnMount] = useState(false);

  // Trigger first-paint hero sweep
  useEffect(() => {
    if (target === 'hero' && triggerOnMount && !hasAnimatedOnMount) {
      const timer = setTimeout(() => {
        setHasAnimatedOnMount(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [target, triggerOnMount, hasAnimatedOnMount]);

  const baseClasses = "relative overflow-hidden";
  
  // CSS gradient sweep - automatically disabled by prefers-reduced-motion
  const sweepClasses = target === 'hero' 
    ? hasAnimatedOnMount && triggerOnMount
      ? "before:animate-[lightSweepHero_1.2s_ease-out_forwards] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:skew-x-[25deg] before:pointer-events-none"
      : ""
    : isHovered
      ? "before:animate-[lightSweepCta_0.6s_ease-out_forwards] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-100%] before:skew-x-[25deg] before:pointer-events-none"
      : "";

  const handleMouseEnter = () => {
    if (target === 'cta') {
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
