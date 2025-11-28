import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Linkedin, MessageSquare, User, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommunityMap from '@/components/CommunityMap';
import { useInView } from '@/hooks/useInView';

// Optional: Provide LinkedIn post URNs to embed latest posts. Example: "urn:li:share:123"
const LINKEDIN_POST_URNS: string[] = [];
const Community = () => {
  const { ref: heroRef, isInView: heroInView } = useInView<HTMLElement>({ threshold: 0.2 });
  const { ref: mapRef, isInView: mapInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: memberRef, isInView: memberInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return <PageLayout showContact={false}>
      <SEO title="Community — Gen AI Global" description="Follow us and join the conversation: LinkedIn and Discord." />
      <main className="relative pt-16 md:pt-20">
        <section ref={heroRef} className={`relative z-10 container mx-auto flex min-h-[min(calc(100dvh-6rem),600px)] max-w-5xl flex-col items-center justify-center gap-8 px-4 text-center pb-6 ${heroInView ? 'animate-slide-up' : ''}`}>
          <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl">GenAIGlobal Community</h1>
          <p className="max-w-2xl text-balance text-muted-foreground">Stay in the loop, meet contributors, and help democratize AI knowledge.</p>
          <div className="mt-2 flex justify-center">
            <a href="https://www.linkedin.com/company/gen-ai-global/" target="_blank" rel="noopener noreferrer" className="group ripple-pulse relative inline-flex items-center justify-center overflow-hidden rounded-xl border bg-card px-6 py-5 text-lg shadow-[0_0_28px_hsl(var(--accent)/0.35)] ring-1 ring-accent/40 transition-transform hover:scale-105" aria-label="Follow on LinkedIn">
              <Linkedin className="mr-2 size-5" /> Follow on LinkedIn
            </a>
          </div>

          {/* Global Community Map */}
          <div ref={mapRef} className={`mt-12 w-full max-w-5xl ${mapInView ? 'animate-slide-up stagger-1' : ''}`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Global Community Map</h2>
              
            </div>
            <CommunityMap />
          </div>

          {/* Membership Section */}
          <div ref={memberRef} className={`mt-12 w-full max-w-4xl ${memberInView ? 'animate-slide-up stagger-2' : ''}`}>
            <h2 className="text-3xl font-bold mb-6 text-center">Join Our Community</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Ready to take the next step? Choose your path to become part of our global AI community.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Join as Member</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Have MIT PE certification? Join our certified member community and access exclusive resources, networking opportunities, and advanced AI discussions.</p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Access to exclusive member-only content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Priority in community discussions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Networking with AI professionals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Early access to events and workshops</span>
                    </li>
                  </ul>
                  <Button type="button" onClick={() => window.open('https://form.fillout.com/t/6UAeDRhG7Bus', '_blank', 'noopener,noreferrer')} className="w-full group-hover:scale-105 transition-transform" size="lg">
                    Apply for Membership
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-secondary/20 hover:border-secondary/40">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Get Involved</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Want to contribute to democratizing AI knowledge? Volunteer your skills and help us build an inclusive AI community for everyone. Learn, build and contribute with us!</p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Contribute to AI education initiatives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Help organize community events</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Create content and resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Build meaningful connections</span>
                    </li>
                  </ul>
                  <Button asChild variant="secondary" className="w-full group-hover:scale-105 transition-transform" size="lg">
                    <Link to="/get-involved">
                      Explore Opportunities
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-12 w-full max-w-4xl animate-slide-up stagger-3">
            <Card className="bg-muted/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                  <p className="text-muted-foreground">
                    Our streamlined application process ensures you find the right path in our community.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <h4 className="font-medium mb-2">Choose Your Path</h4>
                    <p className="text-sm text-muted-foreground">
                      Select between membership (with credentials) or volunteering (contribute your skills)
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <h4 className="font-medium mb-2">Complete Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Fill out our comprehensive form with your details and preferences
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <h4 className="font-medium mb-2">Join Community</h4>
                    <p className="text-sm text-muted-foreground">
                      Get onboarded and start participating in our global AI community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>
    </PageLayout>;
};
export default Community;