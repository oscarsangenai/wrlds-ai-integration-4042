import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';
import { Clock, Users, Globe, BookOpen, Lightbulb, Share, Heart, Trophy } from 'lucide-react';

const Index = () => {
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
        title="Gen AI Global — Responsible AI Community" 
        description="Gen AI Global: An open, responsible AI community. Content pending verification." 
        imageUrl="/lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png"
        keywords={['Gen AI Global', 'responsible AI', 'AI community', 'education', 'research']}
      />
      
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <AuroraNebula />
        <ConstellationParticles />
        
        <header className="relative z-10 container mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center overflow-visible px-4 pb-6 text-center">
          <h1 className="animate-fade-in bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-balance text-5xl font-bold leading-[1.12] tracking-tight text-transparent sm:text-7xl font-sans">
            We are democratizing AI knowledge
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Open, responsible, and future‑proof. Join a global community building practical AI literacy for everyone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" variant="glow" className="relative px-10 py-6 text-base shadow-[0_0_40px_hsl(var(--accent)/0.55)]">
              <Link to="/get-involved" aria-label="Get involved with the community">Get Involved</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-10 py-6 text-base">
              <a href="https://givebutter.com/genai-global" target="_blank" rel="noopener noreferrer">
                <Heart className="mr-2 h-5 w-5" />
                Donate
              </a>
            </Button>
          </div>
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
              { icon: Share, label: 'Open Innovation Network', value: animatedCounts.contributors, suffix: '+ Global Experts & Innovators Contributing Solutions' },
              { icon: Globe, label: 'Global Footprint', value: animatedCounts.countries, suffix: ' Countries — Local Insights, Global Scale' }
            ].map((metric) => (
              <div key={metric.label} className="text-center bg-card/50 rounded-lg p-6 border backdrop-blur-sm">
                <metric.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">
                  {metric.value.toLocaleString()}{metric.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
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
              🔑 Exec takeaway: "Our community produces curated, enterprise-grade insights at the speed of need."
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Open-Source Education',
                description: 'Comprehensive programs for all levels, from non-coders to advanced practitioners.',
                features: ['Non-Coders Course — AI for beginners and non-technical professionals', 'Agent Dev Class — Hands-on training for agent development', 'Interactive Workshops — Skill-building and collaboration with experts']
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
            <a href="https://form.fillout.com/t/wHKtxCmdQDus" target="_blank" rel="noopener noreferrer">
              Apply for Membership
            </a>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
