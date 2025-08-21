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

  // Hackathon countdown (example: Jan 31, 2025)
  useEffect(() => {
    const targetDate = new Date('2025-01-31T00:00:00Z').getTime();
    
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
    const targets = { learners: 2500, projects: 150, contributors: 850, countries: 45 };
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
          <h1 className="animate-fade-in bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-balance text-5xl font-bold leading-[1.12] tracking-tight text-transparent sm:text-7xl">
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

      {/* Hackathon Spotlight */}
      <section className="relative py-16 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Global Non-Coders Hackathon</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands worldwide in our mission to make AI accessible to everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border">
              <h3 className="text-2xl font-semibold mb-6 text-center">Event Countdown</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.minutes },
                  { label: 'Seconds', value: countdown.seconds }
                ].map(({ label, value }) => (
                  <div key={label} className="bg-background/80 rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border">
                <h4 className="font-semibold mb-2">Participation Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent">1,200+</div>
                    <div className="text-sm text-muted-foreground">Registered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">85</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <a href="https://givebutter.com/genai-global" target="_blank" rel="noopener noreferrer">
                    <Heart className="mr-2 h-4 w-4" />
                    Support Event
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/spotlight">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Winners
                  </Link>
                </Button>
              </div>
            </div>
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
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Education',
                description: 'Comprehensive AI literacy programs, workshops, and certification courses designed for all skill levels.',
                features: ['Interactive Workshops', 'Certification Programs', 'Mentorship Network']
              },
              {
                icon: Share,
                title: 'Collaboration',
                description: 'Cross-industry partnerships and team-based projects that drive real-world AI innovation.',
                features: ['Industry Partnerships', 'Project Teams', 'Innovation Labs']
              },
              {
                icon: Lightbulb,
                title: 'Knowledge Sharing',
                description: 'Open resources, research publications, and community-driven content for global accessibility.',
                features: ['Open Resources', 'Research Hub', 'Community Forums']
              }
            ].map((program) => (
              <div key={program.title} className="bg-card rounded-lg p-8 border hover:shadow-lg transition-shadow">
                <program.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-4">{program.title}</h3>
                <p className="text-muted-foreground mb-6">{program.description}</p>
                <ul className="space-y-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
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
              { icon: Users, label: 'Learners Reached', value: animatedCounts.learners, suffix: '+' },
              { icon: Lightbulb, label: 'Projects Completed', value: animatedCounts.projects, suffix: '+' },
              { icon: Share, label: 'Contributors', value: animatedCounts.contributors, suffix: '+' },
              { icon: Globe, label: 'Countries', value: animatedCounts.countries, suffix: '' }
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
