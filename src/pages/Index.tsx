import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <PageLayout showContact={false}>
      <SEO 
        title="Gen AI Global — Responsible AI Community" 
        description="Gen AI Global: An open, responsible AI community. Content pending verification." 
        imageUrl="/lovable-uploads/eed53564-63d3-42ef-ba27-84f9b10a41b0.png"
        keywords={['Gen AI Global', 'responsible AI', 'AI community', 'education', 'research']}
      />
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_10%,hsl(var(--accent)/0.18),transparent_60%)]" />
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(hsl(var(--accent)/0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Hero contrast overlay for light/dark, ensures WCAG AA */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background/80" />
        </div>
        <header className="container mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center overflow-visible px-4 pb-6 text-center">
          <h1 className="animate-fade-in bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-balance text-5xl font-bold leading-[1.12] tracking-tight text-transparent sm:text-7xl">
            We are democratizing AI knowledge
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-muted-foreground">Open, responsible, and future‑proof. Join a global community building practical AI literacy for everyone.</p>
          
          {/* Entry CTAs */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join as Member</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have AI credentials? Join our certified member community and access exclusive resources.
                </p>
                <Button asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link to="/join">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-secondary/20 hover:border-secondary/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Involved</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Volunteer your skills and help us democratize AI knowledge for everyone.
                </p>
                <Button asChild variant="secondary" className="w-full group-hover:scale-105 transition-transform">
                  <Link to="/get-involved">
                    Volunteer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-base">
              <Link to="/community" aria-label="Learn more about our community">Learn More</Link>
            </Button>
          </div>
        </header>
      </main>
    </PageLayout>
  );
};

export default Index;
