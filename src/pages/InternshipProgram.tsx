import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';

const InternshipProgram = () => {
  const { ref: heroRef, isInView: heroInView } = useInView<HTMLElement>({ threshold: 0.2 });

  const scrollToOverview = () => {
    const element = document.getElementById('overview');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Gen AI Global Internship Program – Gen AI Flight School"
        description="Join our 90-day Gen AI Flight School internship program. Learn AI tools and ways of working while shipping guided micro-deliverables with expert mentors."
      />
      
      <main className="-mt-4">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className={`relative py-16 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 ${heroInView ? 'animate-slide-up' : ''}`}
        >
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sans">
              Gen AI Flight School: 90-Day Internship Program
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join Gen AI Global as a "Cadet" in our immersive 90-day internship. Learn cutting-edge AI tools and workflows while shipping guided micro-deliverables alongside experienced mentors in our global community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="glow" className="text-lg px-8 py-6">
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                onClick={scrollToOverview}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Temporary Overview Placeholder */}
        <div id="overview" className="py-16">
          {/* Content sections will be added in future iterations */}
        </div>
      </main>
    </PageLayout>
  );
};

export default InternshipProgram;
