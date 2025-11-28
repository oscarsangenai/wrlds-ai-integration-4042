import { useInView } from '@/hooks/useInView';

/**
 * Spotlight page header with CSS-based entrance animation.
 * Uses useInView hook to trigger animation on mount.
 */
const SpotlightHeader = () => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <section 
      ref={ref}
      className={`relative z-10 pt-20 pb-8 px-4 text-center ${isInView ? 'animate-slide-up' : ''}`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6 font-sans">
          Member Spotlight
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Celebrating the outstanding members and achievements that drive our Gen AI Global community forward.
        </p>
      </div>
    </section>
  );
};

export default SpotlightHeader;
