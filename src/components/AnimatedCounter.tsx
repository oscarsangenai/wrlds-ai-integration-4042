import { useState, useEffect, memo } from 'react';

interface AnimatedCounterProps {
  /** Target value to animate to */
  target: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Suffix to display after the number */
  suffix?: string;
  /** Prefix to display before the number */
  prefix?: string;
  /** Custom className for the container */
  className?: string;
}

/**
 * Self-contained animated counter that manages its own state.
 * Only this component re-renders during animation, not the parent.
 */
const AnimatedCounter = memo(function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return;
    }

    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= target) {
        currentCount = target;
        clearInterval(timer);
      }
      setCount(Math.floor(currentCount));
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
});

export default AnimatedCounter;