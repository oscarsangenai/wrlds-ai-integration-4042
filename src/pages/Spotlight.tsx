import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Users, Calendar, Star, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';

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
    name: "Oscar Sanchez",
    title: "Digital Transformation Executive",
    bio: "A visionary member whose leadership in AI-driven digital transformation has revolutionized multiple industries. His strategic insights and innovative implementations continue to shape the future of business AI.",
    roles: ["Digital Transformation Leader", "AI Strategy Executive", "Innovation Catalyst"],
    achievements: [
      "Led AI transformation across multiple industries",
      "Strategic insights and innovative implementations",
      "Shapes the future of business AI",
      "Drives enterprise AI adoption"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/oscarsanch_memberoftheweek-genai-digitaltransformation-activity-7362501035975663618-bBep",
    date: "2025-01-15"
  },
  {
    id: 2,
    name: "Wei Lin Tan",
    title: "Generative AI Specialist",
    bio: "A remarkable contributor whose work in generative AI and community building has been instrumental in fostering innovation and collaboration within our Singapore chapter.",
    roles: ["Generative AI Expert", "Community Builder", "Innovation Leader"],
    achievements: [
      "Instrumental in Singapore chapter growth",
      "Generative AI innovation",
      "Community collaboration leader",
      "Cross-cultural AI initiatives"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_memberoftheweek-genai-sgu-activity-7359599098850660353-XIPd",
    date: "2025-01-10"
  },
  {
    id: 3,
    name: "Jennifer Wu",
    title: "Neural Networks Specialist",
    bio: "A distinguished member whose expertise in neural networks and commitment to advancing AI education have made significant contributions to our community's growth and learning.",
    roles: ["Neural Networks Expert", "AI Educator", "Research Contributor"],
    achievements: [
      "Advanced AI education initiatives",
      "Neural networks expertise",
      "Community growth contributor",
      "Educational content creator"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/activity-7358617146085515265-p0_U",
    date: "2025-01-08"
  },
  {
    id: 4,
    name: "Dr. Alex Kumar",
    title: "AI Research Pioneer",
    bio: "A true AI pioneer whose groundbreaking research and community leadership have set new standards in the field. Their innovative thinking and collaborative approach embody the future of AI development.",
    roles: ["Research Pioneer", "Community Leader", "Innovation Driver"],
    achievements: [
      "Groundbreaking AI research",
      "Set new industry standards",
      "Innovative thinking leader",
      "Collaborative approach advocate"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/apoorvgarg88_genai-memberoftheweek-aipioneers-activity-7350014303699161088-KCth",
    date: "2024-12-27"
  },
  {
    id: 5,
    name: "Elena Petrov",
    title: "Open Source AI Advocate",
    bio: "An exceptional member whose contributions to open-source AI projects and community mentorship have been invaluable. Her passion for democratizing AI access continues to inspire our global network.",
    roles: ["Open Source Leader", "Community Mentor", "AI Democratization Advocate"],
    achievements: [
      "Open-source AI project contributions",
      "Community mentorship excellence",
      "Democratizing AI access",
      "Global network inspiration"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7354510363482046464-zspw",
    date: "2025-01-03"
  },
  {
    id: 6,
    name: "David Rodriguez",
    title: "AI for Social Impact Lead",
    bio: "A visionary member who has been leading initiatives in AI for social impact. His work demonstrates how artificial intelligence can be a force for positive change in the world.",
    roles: ["Social Impact Leader", "AI for Good Advocate", "Change Agent"],
    achievements: [
      "Leading AI for social impact initiatives",
      "Demonstrates AI as positive force",
      "Social change through technology",
      "Global impact initiatives"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aiforgood-activity-7336743269898285056-POwj",
    date: "2024-11-29"
  },
  {
    id: 7,
    name: "Dr. Priya Sharma",
    title: "AI Research Scientist",
    bio: "A dedicated community member whose innovative approaches to AI problem-solving and commitment to knowledge sharing have made a lasting impact. Her collaborative spirit enriches our global community.",
    roles: ["Research Scientist", "Problem Solver", "Knowledge Sharing Expert"],
    achievements: [
      "Innovative AI problem-solving approaches",
      "Knowledge sharing commitment",
      "Lasting community impact",
      "Collaborative spirit leader"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7329133041845493760-1viY",
    date: "2024-11-08"
  },
  {
    id: 8,
    name: "Marcus Thompson",
    title: "AI Ethics Researcher",
    bio: "A remarkable leader in our AI community whose vision and leadership have inspired countless members. His contributions to AI ethics and responsible development continue to shape our collective understanding.",
    roles: ["Ethics Researcher", "Community Leader", "Responsible AI Advocate"],
    achievements: [
      "AI ethics and responsible development",
      "Shapes collective understanding",
      "Inspires community members",
      "Vision and leadership excellence"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aileadership-activity-7334209562918445057-9xHP",
    date: "2024-11-22"
  },
  {
    id: 9,
    name: "Sarah Chen",
    title: "ML Engineer at TechCorp",
    bio: "An outstanding community member who has been instrumental in advancing AI innovation and fostering collaborative discussions. Her expertise in machine learning and dedication to community building exemplifies the spirit of Gen AI Global.",
    roles: ["ML Engineer", "Innovation Advocate", "Community Builder"],
    achievements: [
      "Advancing AI innovation",
      "Fostering collaborative discussions",
      "Machine learning expertise",
      "Community building dedication"
    ],
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7331665271591477254-gbhe",
    date: "2024-11-15"
  }
];

const communityUpdates: CommunityUpdate[] = [
  {
    id: 1,
    title: "Community Reaches 5,000 Members",
    description: "We're thrilled to announce that our Gen AI Global community has reached 5,000 active members across our Discord channels and professional networks.",
    date: "2025-01-19",
    type: "milestone"
  },
  {
    id: 2,
    title: "AI Innovation Workshop Series Launched",
    description: "New monthly workshop series covering cutting-edge AI topics, from prompt engineering to multimodal AI applications.",
    date: "2025-01-17",
    type: "announcement",
    link: "/events"
  },
  {
    id: 3,
    title: "Research Collaboration Program",
    description: "Announcing our new research collaboration program connecting industry professionals with academic researchers.",
    date: "2025-01-14",
    type: "event",
    link: "/community"
  },
  {
    id: 4,
    title: "Community Impact Report 2024",
    description: "Our annual impact report showcasing the achievements and growth of our global AI community throughout 2024.",
    date: "2025-01-09",
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
      
      <div className="min-h-screen">
        {/* Futuristic background */}
        <AuroraNebula />
        <ConstellationParticles />
        
        {/* Hero Section */}
        <section className="relative z-10 pt-20 pb-8 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6 font-sans">
              Spotlight
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check out our latest updates and highlights from our community members.
            </p>
          </div>
        </section>

        {/* Community Updates Section */}
        <section className="relative z-10 py-12 px-4 bg-muted/30">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-500 mb-2">500+</h3>
                  <p className="text-sm text-muted-foreground">Global Experts & Innovators Contributing Solutions</p>
                  <p className="text-xs text-muted-foreground/80 mt-2">Access to a curated bench of AI builders, researchers, and operators.</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-green-500 mb-2">Weekly Executive Access</h3>
                  <p className="text-sm text-muted-foreground">Exclusive Weekly Q&A With AI Leaders</p>
                  <p className="text-xs text-muted-foreground/80 mt-2">Members submit 5 questions, answered live by top AI executives & researchers.</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-500 mb-2">Private Sessions Cadence</h3>
                  <p className="text-sm text-muted-foreground">12 Invite-Only Executive Sessions Every Month</p>
                  <p className="text-xs text-muted-foreground/80 mt-2">Curated discussions designed to drive strategy and real-world adoption.</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <ExternalLink className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-500 mb-2">Direct MIT Faculty Access</h3>
                  <p className="text-sm text-muted-foreground">20 Sessions With MIT Faculty — 240+ Questions Answered</p>
                  <p className="text-xs text-muted-foreground/80 mt-2">Dr. Abel Sanchez, John Williams, and peers continue shaping member strategies.</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Member Spotlight Section */}
        <section className="relative z-10 py-12 px-4">
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


            {/* Sample/Fallback Member Spotlights */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Featured Community Members</h3>
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
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Spotlight;