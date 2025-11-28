import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';
import FireField from '@/components/FireField';
import LightSweep from '@/components/visuals/LightSweep';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInView } from '@/hooks/useInView';
import { Users, Globe, BookOpen, Lightbulb, Share, Heart, ArrowRight } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const { ref: heroRef, isInView: heroInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  
  // Removed unused countdown state
  const [animatedCounts, setAnimatedCounts] = useState({
    learners: 0,
    projects: 0,
    contributors: 0,
    countries: 0
  });

  // Removed unused countdown effect

  // Animated counters with proper cleanup
  useEffect(() => {
    const targets = { learners: 1000, projects: 30, contributors: 500, countries: 60 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const timerIds: NodeJS.Timeout[] = [];

    Object.keys(targets).forEach(key => {
      let currentCount = 0;
      const targetCount = targets[key as keyof typeof targets];
      const increment = targetCount / steps;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
          currentCount = targetCount;
          clearInterval(timer);
        }
        setAnimatedCounts(prev => ({ ...prev, [key]: Math.floor(currentCount) }));
      }, stepTime);
      
      timerIds.push(timer);
    });

    // Cleanup function to clear all intervals on unmount
    return () => {
      timerIds.forEach(timerId => clearInterval(timerId));
    };
  }, []);

  return (
    <PageLayout showContact={false}>
      <SEO 
        title="Make AI clear, ethical, usable—for everyone | Gen AI Global" 
        description="Nonprofit community advancing cross-sector AI democratization via open education, global collaboration, and shared standards. Learn, build, network, and create impact with peers worldwide." 
        imageUrl={`${import.meta.env.BASE_URL || '/'}lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png`}
        keywords={['Gen AI Global', 'responsible AI', 'AI democratization', 'nonprofit', 'open standards', 'cross-sector']}
      />
      
      {/* FIX: Remove nested main - PageLayout already provides motion.main */}
      {/* Background layers - optimized for mobile performance */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 -z-20 overflow-visible opacity-100"
      >
        <AuroraNebula />
        {!isMobile && (
          <ConstellationParticles 
            density={36} 
            autoMobileDensity={true}
            executiveMode={true}
            strokeWidth={1.6}
            strokeOpacity={0.65}
            haloRadius={8}
            haloOpacity={0.35}
            parallaxAmplitude={10}
            animationPeriod={14}
            className="will-change-transform"
          />
        )}
      </div>
      
      {/* Fire background - desktop only for performance */}
      {!isMobile && (
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 -z-10 overflow-visible opacity-40"
        >
          <FireField />
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative z-0 min-h-[calc(100dvh-var(--header-h))] grid place-items-center px-4 py-8">
          {/* Premium light sweep - mobile performance aware */}
          <LightSweep target="hero" triggerOnMount={!isMobile}>
            <div 
              ref={heroRef}
              className={`relative backdrop-blur-md bg-white/40 border border-white/40 rounded-2xl p-8 md:p-12 max-w-[65ch] shadow-2xl text-center will-change-transform ${heroInView ? 'animate-slide-up' : ''}`}
            >
            <div className="space-y-6">
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                  <Heart className="mr-1.5 h-3 w-3" />
                  Nonprofit
                </Badge>
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                  <BookOpen className="mr-1.5 h-3 w-3" />
                  Open standards
                </Badge>
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                  <Globe className="mr-1.5 h-3 w-3" />
                  Global
                </Badge>
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200">
                  <Users className="mr-1.5 h-3 w-3" />
                  Cross-sector
                </Badge>
              </div>
              
              {/* Headlines with purple gradient */}
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-400 bg-clip-text text-transparent">
                Make AI clear, ethical, usable—for everyone.
              </h1>
              
              {/* Body copy with proper line height */}
              <div className="space-y-4 leading-relaxed text-slate-600/90">
                <p className="text-lg">
                  We're a nonprofit community advancing cross-sector AI democratization via open education, global collaboration, and shared standards.
                </p>
                <p className="text-base">
                  Learn • Build • Network • Impact—co-create skills, publish open playbooks, and shape trustworthy practices with peers worldwide.
                </p>
              </div>
              
              {/* Single CTA with purple styling + premium light sweep */}
              <div className="pt-6">
                <LightSweep target="cta">
                  <Button 
                    asChild 
                    size="lg" 
                    className="group relative px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-violet-300/20 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 hover:ring-4 hover:ring-violet-300/60 will-change-transform" 
                    aria-label="Get involved with the community"
                  >
                    <Link to="/get-involved" className="flex items-center gap-2">
                      Get involved
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </LightSweep>
              </div>
            </div>
            </div>
          </LightSweep>
        </section>


      {/* Impact Metrics */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Global Impact</h2>
            <p className="text-xl text-muted-foreground">
              Measuring our progress in democratizing AI knowledge worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Talent Pipeline', value: animatedCounts.learners, suffix: '+ AI Professionals & Rising Talent Trained' },
              { icon: Lightbulb, label: 'Program Delivery', value: animatedCounts.projects, suffix: ' Open-Source AI Learning Cohorts Completed' },
              { icon: Share, label: 'Open Innovation Network', value: animatedCounts.contributors, suffix: '+ Global Experts & Innovators Driving Solutions' },
              { icon: Globe, label: 'Global Footprint', value: animatedCounts.countries, suffix: ' Countries— Local Insights, Global Impact' }
            ].map((metric) => (
              <div key={metric.label} className="text-center bg-card/50 rounded-lg p-6 border backdrop-blur-sm group hover:bg-card/70 transition-all duration-300">
                <metric.icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-sm font-semibold text-primary mb-2">{metric.label}</div>
                <div className="text-xl font-bold text-foreground">
                  {metric.value.toLocaleString()}{metric.suffix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Blocks */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Programs</h2>
            <p className="text-xl text-muted-foreground">
              Three pillars of AI democratization for global impact
            </p>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground font-semibold">
              🔑 Exec takeaway: "Our community produces curated, enterprise-grade insights at the speed of need."
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Open-Source Education',
                description: 'Comprehensive programs and Projects for all levels, from non-coders to advanced practitioners.',
                features: ['Non-Coders Course — AI for beginners and non-technical professionals', 'Agent Dev Class — Hands-on training for agent development', 'Interactive Workshops — Skill-building and collaboration with experts', 'Self-Managed Infrastructure — Securely own and operate our website, bots, and cloud environment with enterprise-grade reliability and built-in cybersecurity']
              },
              {
                icon: Share,
                title: 'Collaboration',
                description: 'Cross-industry build space that turns high-value problems into open-source agents and measurable pilots.',
                features: ['AI Forge Sprints — Foresight → design → prototype with expert/faculty reviews', 'Ethical AI Scorecard — Governance baked into every build (risk, privacy, bias)', 'Agent Ops — Deployment runbooks, evals, and metrics (time saved, quality lift)', 'Business Model Canvas — Adoption plan and ROI case for real-world rollout']
              },
              {
                icon: Lightbulb,
                title: 'Knowledge-Sharing Platform',
                description: 'Accessible, peer-driven content and thought leadership for global impact.',
                features: ['LinkedIn Submissions — Public contributions and project showcases', 'Discussion Channels — Community-driven Q&A and brainstorming', 'In-Person Events — Networking and strategic meetups', 'Research Hub & Open Resources — Curated knowledge for enterprise decision-making']
              }
            ].map((program) => (
              <div key={program.title} className="bg-card rounded-lg p-8 border hover:shadow-lg transition-shadow">
                <program.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-4">{program.title}</h3>
                <p className="text-muted-foreground mb-6">{program.description}</p>
                <ul className="space-y-2">
                  {program.features.map((feature, index) => (
                    <li key={`${program.title}-feature-${index}`} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of the global movement to democratize AI knowledge for everyone
          </p>
          <Button asChild size="lg" variant="glow" className="px-12 py-6 text-lg shadow-[0_0_40px_hsl(var(--accent)/0.55)]">
            <Link to="/community">
              Join Us
            </Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
