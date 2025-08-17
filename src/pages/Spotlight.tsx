import React from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Users, Calendar, Star } from 'lucide-react';

interface MemberSpotlight {
  id: number;
  name: string;
  title: string;
  bio: string;
  roles: string[];
  achievements: string[];
  image?: string;
  linkedinUrl?: string;
  date: string;
}

interface CommunityUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'announcement' | 'achievement' | 'event' | 'milestone';
  link?: string;
}

const memberSpotlights: MemberSpotlight[] = [
  {
    id: 1,
    name: "Sangame Krishnamani",
    title: "Network Architect & Senior AI Advisor",
    bio: "Sangame exemplifies leadership and dedication within our community, contributing as a Network Architect, Senior AI Advisor, Discord Manager, and an integral member of our Server Governance Team. Her blend of technical expertise, thoughtful collaboration, and forward-thinking approach consistently drives meaningful conversations and innovative applications of AI.",
    roles: ["Network Architect", "Senior AI Advisor", "Discord Manager", "Server Governance Team"],
    achievements: [
      "Led community growth initiatives",
      "Mentored 50+ AI practitioners",
      "Organized technical workshops",
      "Contributed to AI ethics discussions"
    ],
    linkedinUrl: "https://www.linkedin.com/in/sangame-krishnamani-53a54521",
    date: "2025-01-15"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "AI Research Lead",
    bio: "Michael has been instrumental in fostering research collaborations within our community. His expertise in machine learning and natural language processing has helped members navigate complex AI challenges and develop innovative solutions.",
    roles: ["Research Lead", "Technical Mentor", "Workshop Facilitator"],
    achievements: [
      "Published 3 collaborative research papers",
      "Hosted monthly research seminars",
      "Guided 25+ research projects",
      "Established partnerships with universities"
    ],
    date: "2025-01-01"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "AI Ethics & Policy Specialist",
    bio: "Sarah brings crucial perspective on AI ethics and policy to our community. Her work in responsible AI development and regulatory compliance has educated our members on building ethical AI systems.",
    roles: ["Ethics Committee Chair", "Policy Advisor", "Compliance Officer"],
    achievements: [
      "Developed community ethics guidelines",
      "Conducted 10+ ethics workshops",
      "Advised on AI regulation compliance",
      "Built partnerships with policy organizations"
    ],
    date: "2024-12-15"
  }
];

const communityUpdates: CommunityUpdate[] = [
  {
    id: 1,
    title: "Community Reaches 5,000 Members",
    description: "We're thrilled to announce that our Gen AI Global community has reached 5,000 active members across our Discord channels and professional networks.",
    date: "2025-01-20",
    type: "milestone"
  },
  {
    id: 2,
    title: "AI Innovation Workshop Series Launched",
    description: "New monthly workshop series covering cutting-edge AI topics, from prompt engineering to multimodal AI applications.",
    date: "2025-01-18",
    type: "announcement",
    link: "/events"
  },
  {
    id: 3,
    title: "Research Collaboration Program",
    description: "Announcing our new research collaboration program connecting industry professionals with academic researchers.",
    date: "2025-01-15",
    type: "event",
    link: "/community"
  },
  {
    id: 4,
    title: "Community Impact Report 2024",
    description: "Our annual impact report showcasing the achievements and growth of our global AI community throughout 2024.",
    date: "2025-01-10",
    type: "achievement"
  }
];

const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'milestone':
      return <Star className="h-5 w-5" />;
    case 'achievement':
      return <Award className="h-5 w-5" />;
    case 'event':
      return <Calendar className="h-5 w-5" />;
    default:
      return <Users className="h-5 w-5" />;
  }
};

const getUpdateColor = (type: string) => {
  switch (type) {
    case 'milestone':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'achievement':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'event':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    default:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const Spotlight = () => {
  return (
    <PageLayout showContact={false}>
      <SEO
        title="Spotlight - Community Highlights & Member Features"
        description="Discover outstanding members and latest updates from the Gen AI Global community. Featuring member spotlights, achievements, and community milestones."
        keywords={["AI community", "member spotlight", "community updates", "AI professionals", "achievements"]}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-20 pb-8 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6">
              Spotlight
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check out our latest updates and highlights from our community members.
            </p>
          </div>
        </section>

        {/* Member Spotlight Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                Member Spotlight
              </h2>
              <p className="text-muted-foreground">
                Celebrating the outstanding contributions of our community members.
              </p>
            </div>

            <div className="grid gap-8 md:gap-6">
              {memberSpotlights.map((member) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                        <p className="text-lg text-primary font-medium mb-3">{member.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>Featured on {formatDate(member.date)}</span>
                        </div>
                      </div>
                      {member.linkedinUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Roles & Responsibilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.roles.map((role, index) => (
                            <Badge key={index} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Key Achievements</h4>
                        <ul className="space-y-1">
                          {member.achievements.map((achievement, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Star className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Updates Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Community Updates
              </h2>
              <p className="text-muted-foreground">
                Stay informed about the latest happenings in our community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {communityUpdates.map((update) => (
                <Card key={update.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getUpdateIcon(update.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">{update.title}</CardTitle>
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={getUpdateColor(update.type)}>
                              {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(update.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {update.description}
                    </p>
                    {update.link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={update.link}>
                          Learn More
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Spotlight;