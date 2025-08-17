
import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';
// Lazy-load to prevent SSR issues
const NeonOrgGraph = lazy(() => import('@/components/NeonOrgGraph'));

const About = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <PageLayout showContact={false}>
      <SEO
        title="About Us — Gen AI Global Organization"
        description="Explore Gen AI Global's organizational structure in an interactive, searchable org chart."
      />
      <main className="relative pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Futuristic background */}
        <AuroraNebula />
        <ConstellationParticles />
        <div className="relative z-10 container mx-auto max-w-6xl">
          <header className="mb-8 text-center">
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-2">About Gen AI Global</h1>
            <p className="text-muted-foreground">Interactive organizational chart with search, zoom/pan, collapsible groups, and export options.</p>
          </header>
          <section aria-label="Organizational chart" className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] overflow-hidden rounded-lg border bg-card">
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
