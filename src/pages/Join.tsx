import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, User, ArrowRight, FileText, Users } from 'lucide-react';
const Join = () => {
  const navigate = useNavigate();
  const handleFilloutRedirect = () => {
    // Open Fillout form in new tab
    window.open('https://form.fillout.com/t/wHKtxCmdQDus', '_blank', 'noopener,noreferrer');
  };
  return <PageLayout showContact={false}>
      <SEO title="Join Gen AI Global - Member Application" description="Join our global AI community as a member. Submit your credentials and become part of our network of AI professionals." keywords={["join AI community", "AI membership", "AI professionals", "Gen AI Global"]} />
      
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Join Gen AI Global</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Become part of our global AI community. Choose your path below to get started with your application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Member Path */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Join as Member</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Have AI credentials or certifications? Join our certified member community and access exclusive resources, networking opportunities, and advanced AI discussions.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Access to exclusive member-only content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Priority in community discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Networking with AI professionals
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Early access to events and workshops
                  </li>
                </ul>
                <Button onClick={handleFilloutRedirect} className="w-full group-hover:scale-105 transition-transform" size="lg">
                  Apply for Membership
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Volunteer Path */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-secondary/20 hover:border-secondary/40">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">Get Involved</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">Want to contribute to democratizing AI knowledge? Volunteer your skills and help us build an inclusive AI community for everyone. Learn, build and contribute with us!</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Contribute to AI education initiatives
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Help organize community events
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Create content and resources
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Build meaningful connections
                  </li>
                </ul>
                <Button onClick={() => navigate('/get-involved')} variant="secondary" className="w-full group-hover:scale-105 transition-transform" size="lg">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Have questions about joining?{' '}
              <a href="mailto:hello@genaiglobal.org" className="text-primary hover:underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>;
};
export default Join;