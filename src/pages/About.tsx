
import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';
import OrgChart3D from '@/components/OrgChart3D';
import { Button } from '@/components/ui/button';
import { RotateCcw, BarChart3, Network } from 'lucide-react';
// Lazy-load to prevent SSR issues
const NeonOrgGraph = lazy(() => import('@/components/NeonOrgGraph'));

const About = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentView, setCurrentView] = useState<'detailed' | 'summary'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('org.view.v1');
      return (stored as 'detailed' | 'summary') || 'detailed';
    }
    return 'detailed';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [clearSearchTrigger, setClearSearchTrigger] = useState(false);

  useEffect(() => setIsClient(true), []);

  const handleViewChange = (view: 'detailed' | 'summary') => {
    setCurrentView(view);
    localStorage.setItem('org.view.v1', view);
    // Clear search when switching views
    setSearchQuery('');
    setClearSearchTrigger(prev => !prev);
  };

  const handleReset = () => {
    // Clear all stored states
    localStorage.removeItem('org-graph-expanded-departments');
    localStorage.removeItem('org.zoom.v1');
    localStorage.removeItem('org-chart-expand-all');
    localStorage.removeItem('org.view.v1');
    
    // Reset to defaults
    setCurrentView('detailed');
    setSearchQuery('');
    setClearSearchTrigger(prev => !prev);
    
    // Force reload after state cleanup
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

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
          <motion.header 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-2 font-sans">About Gen AI Global</h1>
            <p className="text-muted-foreground">Interactive organizational chart with search, zoom/pan, collapsible groups, and export options.</p>
            
            {/* View Toggle and Global Search */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Button
                  variant={currentView === 'detailed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewChange('detailed')}
                  className="rounded-xl"
                  data-testid="view-toggle-detailed"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detailed
                </Button>
                <Button
                  variant={currentView === 'summary' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewChange('summary')}
                  className="rounded-xl"
                  data-testid="view-toggle-summary"
                >
                  <Network className="w-4 h-4 mr-2" />
                  Summary
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl hover:bg-white/20"
                data-testid="reset-button"
                aria-label="Reset all settings and view states"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </motion.header>
          
          <section aria-label="Organizational chart" className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] overflow-hidden rounded-lg border bg-card">
            {isClient ? (
              currentView === 'detailed' ? (
                <OrgChart3D />
              ) : (
                <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading org chart...</div>}>
                  <NeonOrgGraph 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    clearSearchTrigger={clearSearchTrigger}
                  />
                </Suspense>
              )
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
