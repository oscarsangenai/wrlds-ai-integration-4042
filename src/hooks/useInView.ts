import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewResult {
  ref: React.RefObject<HTMLElement>;
  isInView: boolean;
}

/**
 * Lightweight IntersectionObserver hook for scroll-triggered animations.
 * Returns a ref to attach to your element and an isInView boolean.
 * 
 * @param options - IntersectionObserver options
 * @param options.threshold - Visibility threshold (0-1), default 0.1
 * @param options.rootMargin - Root margin offset, default '0px'
 * @param options.triggerOnce - Only trigger once, default true
 * 
 * @example
 * const { ref, isInView } = useInView({ threshold: 0.2 });
 * <div ref={ref} className={isInView ? 'animate-fade-in' : 'opacity-0'}>
 */
export function useInView(options: UseInViewOptions = {}): UseInViewResult {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        // Stop observing after first intersection if triggerOnce
        if (inView && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}
