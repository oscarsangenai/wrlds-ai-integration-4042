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
    name: "Sangame Krishnamani",
    title: "Advisor, Technology Strategy & Digital Architecture | Volunteer",
    bio: "Sangame exemplifies leadership and dedication within our community, contributing as a Network Architect, Senior AI Advisor, Discord Manager, and an integral member of our Server Governance Team. Her blend of technical expertise, thoughtful collaboration, and forward-thinking approach consistently drives meaningful conversations and innovative applications of AI. Her commitment to sharing knowledge and fostering growth embodies the very spirit of our community.",
    roles: ["Network Architect", "Senior AI Advisor", "Discord Manager", "Server Governance Team"],
    achievements: [
      "Outstanding leadership and community inspiration",
      "Drives meaningful AI conversations",
      "Thoughtful collaboration and forward-thinking approach",
      "Knowledge sharing and fostering growth"
    ],
    date: "2025-01-20"
  },
  {
    id: 2,
    name: "Dragana Linfield",
    title: "Generative AI Strategy Leader",
    bio: "Before our LinkedIn space was even live, Dragana Linfield was already setting the tone for what Gen AI Global stands for—insightful leadership, meaningful collaboration, and a passion for advancing generative AI. Dragana brings a powerful blend of strategic insight and collaborative spirit to our community. Her consistent contributions exemplify what it means to lead with purpose in the era of generative AI.",
    roles: ["Strategy Leader", "Collaborative Spirit", "Thought Leader"],
    achievements: [
      "Setting tone for Gen AI Global vision",
      "Insightful leadership and meaningful collaboration",
      "Strategic insight and collaborative spirit",
      "Leading with purpose in generative AI era"
    ],
    date: "2025-01-19"
  },
  {
    id: 3,
    name: "Jose Cordovilla",
    title: "Director of Systems Integration & Architecture",
    bio: "Jose stands out for his active engagement, generous knowledge-sharing, and deep commitment to responsible AI innovation. His contributions consistently spark meaningful discussions and reflect the kind of cross-industry collaboration that powers our community. Jose helps build a smarter and more connected community while exploring the frontiers of generative AI.",
    roles: ["Innovation Advocate", "Knowledge Sharer", "Community Builder"],
    achievements: [
      "Active engagement and generous knowledge-sharing",
      "Deep commitment to responsible AI innovation",
      "Sparks meaningful discussions",
      "Cross-industry collaboration leader"
    ],
    date: "2025-01-18"
  },
  {
    id: 4,
    name: "Rodrigo Reyes",
    title: "Head of Directors",
    bio: "Rodrigo is a dynamic force in our community, seamlessly blending technical expertise with a passion for education and innovation. As a Network Architect at Gen AI Global, he plays a pivotal role in shaping our community's structure and fostering meaningful connections among members. Beyond his contributions here, Rodrigo serves as a Learning Facilitator for MIT Professional Education, guiding professionals through the complexities of Generative AI and digital transformation.",
    roles: ["Network Architect", "MIT Learning Facilitator", "Education Leader"],
    achievements: [
      "Shaping community structure and connections",
      "MIT Professional Education facilitator",
      "Technical expertise with education passion",
      "Guiding professionals in GenAI transformation"
    ],
    date: "2025-01-17"
  },
  {
    id: 5,
    name: "Marie Ribbelöv",
    title: "AI Governance & Ethics Leader",
    bio: "Marie's contributions to the Gen AI Global community have sparked meaningful conversations around AI governance and ethics. Her leadership is a powerful reminder that technology creates the greatest impact when it empowers people. Marie leads with expertise and uplifts others through knowledge and purpose, helping shape the future of our community with a focus on growth, equity, and innovation.",
    roles: ["AI Governance Expert", "Ethics Leader", "Community Advocate"],
    achievements: [
      "Sparked meaningful AI governance conversations",
      "Leadership in AI ethics",
      "Technology that empowers people",
      "Focus on growth, equity, and innovation"
    ],
    date: "2025-01-16"
  },
  {
    id: 6,
    name: "Prabhat Kumar",
    title: "Enterprise AI Solutions Expert",
    bio: "With deep expertise in integrating AI into scalable enterprise solutions, Prabhat has been a trusted voice in sharing best practices and frameworks that empower our members. His inspiring contributions demonstrate how innovation happens when diverse voices unite, generous mentorship sparks breakthroughs, and prompt design becomes a creative act with real impact.",
    roles: ["Enterprise AI Expert", "Best Practices Advocate", "Community Mentor"],
    achievements: [
      "Deep expertise in scalable enterprise AI solutions",
      "Trusted voice in best practices and frameworks",
      "Innovation through diverse voices unity",
      "Creative prompt design with real impact"
    ],
    date: "2025-01-15"
  },
  {
    id: 7,
    name: "Katherine Valqui",
    title: "Content Lead for LinkedIn Presence",
    bio: "Katherine, our Content Lead for Gen AI Global's LinkedIn presence, shapes narratives that inform, inspire, and amplify diverse voices across the generative AI ecosystem. Through her thoughtful storytelling and strategic lens, Kat brings our vision to life: Creating a space for democratized, open-source sharing of AI knowledge across industries. She embodies leadership with clarity in communication, connection across cultures, and commitment to continuous growth.",
    roles: ["Content Lead", "LinkedIn Strategy", "Narrative Shaper"],
    achievements: [
      "Shapes inspiring narratives across GenAI ecosystem",
      "Democratized, open-source AI knowledge sharing",
      "Clarity in communication",
      "Connection across cultures and industries"
    ],
    date: "2025-01-14"
  },
  {
    id: 8,
    name: "Andrea Hickethier",
    title: "Conversational Leader & AI Security Manager",
    bio: "Andrea is a standout leader blending business strategy with real-world AI innovation. As a recent graduate of MIT's Generative AI for Digital Transformation program, she's built her own PEACH Framework to help Sales & Marketing leaders assess AI use cases through process, ethics, agility, compliance, and human oversight. She's a certified AI Security Manager (ISO 42001) and passionate advocate for responsible AI.",
    roles: ["Conversational Leader", "AI Security Manager", "Framework Developer"],
    achievements: [
      "MIT Generative AI for Digital Transformation graduate",
      "Built PEACH Framework for AI use cases",
      "Certified AI Security Manager (ISO 42001)",
      "Advocate for responsible AI adoption"
    ],
    date: "2025-01-13"
  },
  {
    id: 9,
    name: "Amber Bellou",
    title: "Head of Onboarding",
    bio: "Amber is the Head of Onboarding at Gen AI Global Community, a powerhouse of strategy, onboarding, and AI-driven impact. With a multifaceted background spanning marketing, research, AI strategy, and political science, she combines data-driven thinking with storytelling to fuel real-world transformation. Her leadership ensures that every new member feels welcomed, supported, and ready to thrive in our community.",
    roles: ["Head of Onboarding", "Strategy Leader", "Member Experience Architect"],
    achievements: [
      "Architect of member experience",
      "Guiding global cohort through onboarding",
      "Scaling engagement across time zones",
      "Shaping vibrant, inclusive ecosystem"
    ],
    date: "2025-01-12"
  },
  {
    id: 10,
    name: "Diellza Ahmetaj",
    title: "Head of Agile & AIOps",
    bio: "From shaping sovereign cloud strategies at IBM to driving AI-native collaboration in her current role as Head of Agile & AIOps, Diellza is a force behind the operational backbone of our AI-driven community. She brings a unique blend of cloud leadership, design thinking, and deep community empathy. Whether orchestrating smart content-routing or championing agentic AI tools, she's helping us turn member challenges into system-level solutions.",
    roles: ["Head of Agile & AIOps", "Cloud Leadership", "Design Thinking Expert"],
    achievements: [
      "IBM sovereign cloud strategies experience",
      "AI-native collaboration driving",
      "Smart content-routing orchestration",
      "Turning challenges into system-level solutions"
    ],
    date: "2025-01-11"
  },
  {
    id: 11,
    name: "Oscar Jesús García",
    title: "Conversational Leader",
    bio: "With over 8 years of experience leading IT transformation, Oscar blends technical precision with human-centered leadership. From implementing mission-critical RP systems to facilitating multilingual, multicultural collaboration, he's helped teams move from complexity to clarity, and from strategy to success. Oscar believes great projects are built not just with code, but with trust, continuous learning, and empowered teams.",
    roles: ["Conversational Leader", "IT Transformation", "Multicultural Facilitator"],
    achievements: [
      "8+ years leading IT transformation",
      "Technical precision with human-centered leadership",
      "Multilingual, multicultural collaboration",
      "Building projects with trust and empowered teams"
    ],
    date: "2025-01-10"
  },
  {
    id: 12,
    name: "Apoorv Garg",
    title: "AI Strategy & Innovation Trailblazer",
    bio: "Apoorv is a dynamic voice in the Gen AI Global Community and a trailblazer in the world of AI strategy and innovation. He shares how this community is shaping the future of generative AI through collaboration, experimentation, and purpose-driven dialogue. His contributions, curiosity, and vision for what AI can achieve continue to accelerate responsible AI adoption across industries.",
    roles: ["AI Strategy", "Innovation Trailblazer", "Community Voice"],
    achievements: [
      "Trailblazer in AI strategy and innovation",
      "Shaping future through collaboration",
      "Purpose-driven dialogue leadership",
      "Accelerating responsible AI adoption"
    ],
    date: "2025-01-09"
  },
  {
    id: 13,
    name: "Dr. Shabana Islam",
    title: "Life Sciences & AI Ethics Leader",
    bio: "Dr. Shabana Islam is a trailblazer blending life sciences expertise with generative AI leadership. With over a decade of experience in global product line management and a sharp eye on AI's ethical and societal impacts, Shabana helps bridge scientific rigor with emerging AI strategy. Her work as a Conversational Leader consistently sparks meaningful dialogue on leadership, ethics, and innovation.",
    roles: ["Life Sciences Expert", "AI Ethics Leader", "Conversational Leader"],
    achievements: [
      "Decade+ in global product line management",
      "Bridging scientific rigor with AI strategy",
      "Focus on AI's ethical and societal impacts",
      "Sparking dialogue on leadership and ethics"
    ],
    date: "2025-01-08"
  },
  {
    id: 14,
    name: "Arturo Cuevas",
    title: "Agent Ops Team Leader",
    bio: "At Gen AI Global, Arturo leads our Agent ops team, setting secure, responsible standards for how we run and scale the community's AI infrastructure. We celebrate his leadership, vision, and commitment, along with his global mindset and ability to bridge strategy, technology, and human connection. Arturo turns innovation into outcomes with his strategic approach.",
    roles: ["Agent Ops Leader", "Infrastructure Security", "Strategy Bridge"],
    achievements: [
      "Leading Agent ops team",
      "Setting secure, responsible standards",
      "Scaling community AI infrastructure",
      "Turning innovation into outcomes"
    ],
    date: "2025-01-07"
  },
  {
    id: 15,
    name: "Frédérique Lambers",
    title: "Digital Transformation Strategist",
    bio: "A tech-savvy strategist with 10+ years in digital transformation and innovation, Frédérique bridges business and technology to deliver sustainable growth. She aligns emerging tech with corporate strategy, leads high-performing teams, and steers complex change, always with a data-driven, inclusive mindset. As a Gen AI Global community advocate, she turns vision into execution.",
    roles: ["Digital Transformation", "Strategic Leader", "Community Advocate"],
    achievements: [
      "10+ years in digital transformation",
      "Bridging business and technology",
      "Leading high-performing teams",
      "Data-driven, inclusive mindset"
    ],
    date: "2025-01-06"
  },
  {
    id: 16,
    name: "Deidré Luzmore",
    title: "AI Transformation & Agile Leadership",
    bio: "Deidré is driving real impact at the intersection of AI strategy, ethics, education, and operational excellence, all with a human-first mindset. From architecting scalable AI solution lifecycles to championing responsible governance aligned with ISO 42001 and the EU AI Act, her contributions to our AI Education Program and pursuit of clarity, collaboration, and inclusion are building a future-ready, globally connected community.",
    roles: ["AI Transformation", "Agile Leadership", "Ethics Champion"],
    achievements: [
      "AI strategy, ethics, education intersection",
      "Architecting scalable AI solution lifecycles",
      "ISO 42001 and EU AI Act governance",
      "Building future-ready global community"
    ],
    date: "2025-01-05"
  },
  {
    id: 17,
    name: "Nikhil Kassetty",
    title: "Volunteer Director of Finance & Technology Operations",
    bio: "At Gen AI Global, Nikhil serves as our Volunteer Director of Finance & Technology Operations, helping us run secure, scalable, and impactful programs for the community. He streamlines finance and tech operations so members can learn, build, and collaborate. As a content contributor and member-first leader, he bridges strategy and execution to turn ideas into outcomes.",
    roles: ["Finance Director", "Technology Operations", "Content Contributor"],
    achievements: [
      "Volunteer Director of Finance & Technology",
      "Running secure, scalable programs",
      "Streamlining finance and tech operations",
      "Bridging strategy and execution"
    ],
    date: "2025-01-04"
  },
  {
    id: 18,
    name: "Ash Mikhail, MBA",
    title: "Co-head of Non Coders",
    bio: "Ash Mikhail is a visionary transformation and strategy leader making waves across both the financial sector and our Gen AI Global Community. As Co-head of non coders, Ash brings unmatched clarity and curiosity to critical conversations around real-world AI applications. With a 20+ year journey driving strategic execution and enterprise transformation at organizations like CIBC, Ash exemplifies what it means to lead with purpose and deliver impact.",
    roles: ["Co-head Non Coders", "Transformation Leader", "Strategy Expert"],
    achievements: [
      "Visionary transformation and strategy leader",
      "20+ years strategic execution experience",
      "Enterprise transformation at CIBC",
      "Leading with purpose and delivering impact"
    ],
    date: "2025-01-03"
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
                  <h3 className="text-xl font-bold text-blue-500 mb-2">500+ Active<br />Members</h3>
                  <p className="text-sm text-muted-foreground">Global Experts & Innovators Contributing Solutions</p>
                  <p className="text-xs text-muted-foreground/80 mt-2">Access to a curated bench of AI builders, mentors, researchers, and experts.</p>
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