import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  isInView: boolean;
}

// Registry of shared observers keyed by options string
const observerRegistry = new Map<string, IntersectionObserver>();

// Map of element -> callback for each observer
const callbackRegistry = new Map<string, Map<Element, (entry: IntersectionObserverEntry) => void>>();

/**
 * Creates a unique key for observer options to enable sharing
 */
function getObserverKey(threshold: number | number[], rootMargin: string): string {
  const t = Array.isArray(threshold) ? threshold.join(',') : threshold;
  return `${t}|${rootMargin}`;
}

/**
 * Gets or creates a shared IntersectionObserver for the given options
 */
function getSharedObserver(
  threshold: number | number[],
  rootMargin: string
): IntersectionObserver {
  const key = getObserverKey(threshold, rootMargin);
  
  let observer = observerRegistry.get(key);
  if (!observer) {
    // Initialize callback map for this observer
    callbackRegistry.set(key, new Map());
    
    observer = new IntersectionObserver(
      (entries) => {
        const callbacks = callbackRegistry.get(key);
        if (!callbacks) return;
        
        entries.forEach((entry) => {
          const callback = callbacks.get(entry.target);
          if (callback) {
            callback(entry);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observerRegistry.set(key, observer);
  }
  
  return observer;
}

/**
 * Registers an element with a shared observer
 */
function observeElement(
  element: Element,
  threshold: number | number[],
  rootMargin: string,
  callback: (entry: IntersectionObserverEntry) => void
): void {
  const key = getObserverKey(threshold, rootMargin);
  const observer = getSharedObserver(threshold, rootMargin);
  const callbacks = callbackRegistry.get(key);
  
  if (callbacks) {
    callbacks.set(element, callback);
  }
  
  observer.observe(element);
}

/**
 * Unregisters an element from a shared observer
 */
function unobserveElement(
  element: Element,
  threshold: number | number[],
  rootMargin: string
): void {
  const key = getObserverKey(threshold, rootMargin);
  const observer = observerRegistry.get(key);
  const callbacks = callbackRegistry.get(key);
  
  if (observer) {
    observer.unobserve(element);
  }
  
  if (callbacks) {
    callbacks.delete(element);
    
    // Clean up observer if no elements are being tracked
    if (callbacks.size === 0) {
      observer?.disconnect();
      observerRegistry.delete(key);
      callbackRegistry.delete(key);
    }
  }
}

/**
 * Lightweight IntersectionObserver hook for scroll-triggered animations.
 * Uses a shared observer pool to minimize IntersectionObserver instances.
 * Returns a ref to attach to your element and an isInView boolean.
 * 
 * @param options - IntersectionObserver options
 * @param options.threshold - Visibility threshold (0-1), default 0.1
 * @param options.rootMargin - Root margin offset, default '0px'
 * @param options.triggerOnce - Only trigger once, default true
 * 
 * @example
 * const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
 * <div ref={ref} className={isInView ? 'animate-fade-in' : 'opacity-0'}>
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): UseInViewResult<T> {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Stable callback that handles intersection updates
  const handleIntersection = useCallback((entry: IntersectionObserverEntry) => {
    const inView = entry.isIntersecting;
    
    // Skip if already triggered and triggerOnce is enabled
    if (hasTriggeredRef.current && triggerOnce) {
      return;
    }
    
    setIsInView(inView);
    
    if (inView && triggerOnce) {
      hasTriggeredRef.current = true;
      // Unobserve after first trigger
      if (ref.current) {
        unobserveElement(ref.current, threshold, rootMargin);
      }
    }
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Reset trigger state on re-mount
    hasTriggeredRef.current = false;

    observeElement(element, threshold, rootMargin, handleIntersection);

    return () => {
      unobserveElement(element, threshold, rootMargin);
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, isInView };
}