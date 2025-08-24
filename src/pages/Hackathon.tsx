import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Globe, Heart, Target, Calendar, Trophy, Lightbulb, Share, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hackathon = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  const givebutterUrl = import.meta.env.VITE_GIVEBUTTER_URL || "https://givebutter.com/genai-global";
  const discordUrl = import.meta.env.VITE_DISCORD_URL || "#";

  return (
    <PageLayout>
      <SEO 
        title="Hack-GenAIGlobal V1.0 – Gen AI Global"
        description="Join our global non-coders hackathon - democratizing AI knowledge through community fundraising and education. No coding required!"
      />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hack-GenAIGlobal V1.0
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Non-Coders Hackathon: Democratizing AI knowledge through community fundraising and education
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" variant="glow" className="text-lg px-8 py-6">
                <a href={givebutterUrl} target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-5 w-5" />
                  Donate on Givebutter
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join the Community
                </Link>
              </Button>
            </div>

            {/* Countdown */}
            <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Clock className="h-8 w-8" />
                  Event Countdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6 text-center">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds }
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-background/80 rounded-lg p-6">
                      <div className="text-4xl font-bold text-primary">{value}</div>
                      <div className="text-sm text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>


        {/* Concept & Guardrails */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Concept
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    A community-driven fundraising hackathon that democratizes AI education while building our global impact. 
                    No coding skills required - this is about creativity, collaboration, and community building.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Judging Metric:</strong> Total dollars raised for Gen AI Global through creative campaigns and community engagement.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-6 w-6" />
                    Guardrails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Teams must include at least one approved community member</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Only approved members may post from official LinkedIn account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>LinkedIn promotion required for all campaigns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>All fundraising links must direct to official Givebutter page</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    <strong>Tracking:</strong> Donations via Givebutter dashboard; reach via LinkedIn Analytics
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4-Week Run of Show */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-4xl font-bold text-center mb-12">4-Week Run of Show</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  week: 'Week 1',
                  title: 'Launch & Team Formation',
                  summary: 'Kickoff announcement, team registration, and initial strategy planning'
                },
                {
                  week: 'Week 2',
                  title: 'Campaign Development',
                  summary: 'Create fundraising campaigns, content development, and community outreach'
                },
                {
                  week: 'Week 3',
                  title: 'Execution & Promotion',
                  summary: 'Launch campaigns, social media promotion, and community engagement'
                },
                {
                  week: 'Week 4',
                  title: 'Final Push & Judging',
                  summary: 'Last-minute efforts, final submissions, and results announcement'
                }
              ].map((week, index) => (
                <Card key={index} className="rounded-2xl text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="mb-3">{week.week}</Badge>
                    <h3 className="font-semibold mb-2">{week.title}</h3>
                    <p className="text-sm text-muted-foreground">{week.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* Donor Rewards */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Donor Rewards (Beta)</h2>
            <p className="text-center text-muted-foreground mb-12">Recognition and perks for our community supporters</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  tier: 'Tier 1',
                  range: '$5-25',
                  perks: ['Community recognition', 'Digital thank you badge']
                },
                {
                  tier: 'Tier 2',
                  range: '$26-75',
                  perks: ['Exclusive newsletter access', 'Early event notifications', 'Community Discord role']
                },
                {
                  tier: 'Tier 3',
                  range: '$76-150',
                  perks: ['Workshop priority access', 'Mentorship program eligibility', 'Quarterly impact reports']
                },
                {
                  tier: 'Tier 4',
                  range: '$151-500',
                  perks: ['1-on-1 community leader session', 'Beta feature early access', 'Annual community summit invitation']
                },
                {
                  tier: 'Tier 5',
                  range: '$500+',
                  perks: ['Advisory board consideration', 'Custom consultation session', 'Lifetime community membership']
                }
              ].map((tier, index) => (
                <Card key={index} className="rounded-2xl text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1">{tier.tier}</h3>
                    <p className="text-lg font-bold text-primary mb-4">{tier.range}</p>
                    <ul className="space-y-2 text-left">
                      {tier.perks.map((perk, perkIndex) => (
                        <li key={perkIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Powered by Givebutter */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Powered by Givebutter</h2>
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6">
                  Our fundraising platform provides enterprise-grade capabilities for community impact
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  {[
                    'Global payment processing in 100+ countries',
                    'Team and peer-to-peer fundraising tools',
                    'Livestream and virtual event integration',
                    '0% platform fee structure via optional tips'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>



        {/* Footer CTA */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join Hack-GenAIGlobal V1.0 and help democratize AI knowledge for everyone. 
              Remember: Success is measured by total dollars raised for our global mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="glow" className="text-lg px-8 py-6">
                <a href={givebutterUrl} target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Fundraising
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default Hackathon;