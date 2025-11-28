
import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';
import { useInView } from '@/hooks/useInView';
// Lazy-load to prevent SSR issues
const NeonOrgGraph = lazy(() => import('@/components/NeonOrgGraph'));

const About = () => {
  const [isClient, setIsClient] = useState(false);
  const { ref: headerRef, isInView: headerInView } = useInView<HTMLElement>({ threshold: 0.2 });
  
  useEffect(() => setIsClient(true), []);
  
  return (
    <PageLayout showContact={false}>
      <SEO
        title="About Us — Gen AI Global Organization"
        description="Explore Gen AI Global's organizational structure in an interactive, searchable org chart."
      />
      <main className="relative pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 container mx-auto max-w-6xl">
          <header 
            ref={headerRef}
            className={`mb-8 text-center ${headerInView ? 'animate-slide-up' : ''}`}
          >
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-2 font-sans">About Gen AI Global</h1>
            <p className="text-muted-foreground">Organizational chart with full export capabilities.</p>
          </header>
          <section aria-label="Organizational chart" className="relative min-h-[min(70dvh,600px)] sm:min-h-[min(75dvh,650px)] lg:min-h-[min(80dvh,700px)] overflow-hidden rounded-lg border bg-card">
            {isClient ? (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading org chart...</div>}>
                <NeonOrgGraph />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading org chart...</div>
            )}
          </section>
        </div>
      </main>
    </PageLayout>
  );
};

export default About;
