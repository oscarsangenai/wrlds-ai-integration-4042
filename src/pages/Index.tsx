import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';
import { Clock, Users, Globe, BookOpen, Lightbulb, Share, Heart, Trophy } from 'lucide-react';

const Index = () => {
  const shouldReduceMotion = useReducedMotion();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [animatedCounts, setAnimatedCounts] = useState({
    learners: 0,
    projects: 0,
    contributors: 0,
    countries: 0
  });

  // Hackathon countdown (Oct 15, 2025)
  useEffect(() => {
    const targetDate = new Date('2025-10-15T00:00:00Z').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    const targets = { learners: 1000, projects: 30, contributors: 500, countries: 60 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

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
    });
  }, []);

  return (
    <PageLayout showContact={false}>
      <SEO 
        title="Make AI clear, ethical, usable—for everyone | Gen AI Global" 
        description="Nonprofit community advancing cross-sector AI democratization via open education, global collaboration, and shared standards. Learn, build, network, and create impact with peers worldwide." 
        imageUrl="/lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png"
        keywords={['Gen AI Global', 'responsible AI', 'AI democratization', 'nonprofit', 'open standards', 'cross-sector']}
      />
      
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <div className="absolute inset-0 opacity-30">
          <AuroraNebula />
          <ConstellationParticles />
        </div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <header className="relative z-10 container mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl justify-start items-center px-4 pb-6">
          {/* Glass wrap hero content */}
          <motion.div 
            className="relative backdrop-blur-sm bg-white/60 border border-white/20 rounded-2xl p-8 md:p-12 max-w-[65ch] shadow-2xl"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Accent line */}
            <div className="accent-topline"></div>
            
            <div className="space-y-6">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="inline-flex items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <Heart className="mr-1.5 h-3 w-3 text-destructive" />
                  Nonprofit
                </div>
                <div className="inline-flex items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <BookOpen className="mr-1.5 h-3 w-3 text-primary" />
                  Open standards
                </div>
                <div className="inline-flex items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <Globe className="mr-1.5 h-3 w-3 text-accent" />
                  Global
                </div>
                <div className="inline-flex items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  <Users className="mr-1.5 h-3 w-3 text-secondary" />
                  Cross-sector
                </div>
              </div>
              
              {/* Headlines with gradient */}
              <h1 className="text-left text-4xl md:text-6xl font-bold leading-[1.12] tracking-tight bg-gradient-to-r from-primary via-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in">
                Make AI clear, ethical, usable—for everyone.
              </h1>
              
              {/* Body copy with proper line height */}
              <div className="text-left space-y-4 leading-relaxed text-foreground/90">
                <p className="text-lg">
                  We're a nonprofit community advancing cross-sector AI democratization via open education, global collaboration, and shared standards.
                </p>
                <p className="text-base text-muted-foreground">
                  Learn • Build • Network • Impact—co-create skills, publish open playbooks, and shape trustworthy practices with peers worldwide.
                </p>
              </div>
              
              {/* Single CTA with enhanced styling */}
              <div className="pt-4">
                <Button asChild size="lg" className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium ripple-pulse transition-all duration-300 hover:shadow-[0_0_32px_hsl(var(--primary)/0.4)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Get involved with the community">
                  <Link to="/get-involved" className="flex items-center gap-2">
                    Get involved
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </header>
      </main>


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
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm">
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
