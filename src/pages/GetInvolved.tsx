import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Users, Mail, Globe, Clock, Briefcase, ExternalLink, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';

// Mock data - In production, this would come from Supabase
const volunteerRoles = [
  {
    id: 1,
    title: "Community Manager",
    department: "Community",
    description: "Help build and nurture our global AI community across platforms.",
    skills: ["Community Building", "Social Media", "Communication"],
    status: "open"
  },
  {
    id: 2,
    title: "Content Creator",
    department: "Content",
    description: "Create engaging AI-related content, articles, and educational materials.",
    skills: ["Content Writing", "AI Knowledge", "Video Production"],
    status: "open"
  },
  {
    id: 3,
    title: "Technical Writer",
    department: "Documentation",
    description: "Document AI tools, write tutorials, and create technical guides.",
    skills: ["Technical Writing", "AI/ML", "Documentation"],
    status: "open"
  },
  {
    id: 4,
    title: "Event Coordinator",
    department: "Events",
    description: "Organize virtual and in-person AI events, workshops, and meetups.",
    skills: ["Event Planning", "Project Management", "Networking"],
    status: "open"
  },
  {
    id: 5,
    title: "Research Analyst",
    department: "Research",
    description: "Research AI trends, compile reports, and analyze industry developments.",
    skills: ["Research", "Data Analysis", "AI Trends"],
    status: "open"
  },
  {
    id: 6,
    title: "UI/UX Designer",
    department: "Design",
    description: "Design user experiences for our platforms and digital assets.",
    skills: ["UI/UX Design", "Figma", "User Research"],
    status: "closed"
  }
];

const timezones = [
  "UTC-12:00 (Baker Island Time)",
  "UTC-11:00 (Hawaii Standard Time)",
  "UTC-10:00 (Hawaii-Aleutian Standard Time)",
  "UTC-09:00 (Alaska Standard Time)",
  "UTC-08:00 (Pacific Standard Time)",
  "UTC-07:00 (Mountain Standard Time)",
  "UTC-06:00 (Central Standard Time)",
  "UTC-05:00 (Eastern Standard Time)",
  "UTC-04:00 (Atlantic Standard Time)",
  "UTC-03:00 (Argentina Time)",
  "UTC-02:00 (South Georgia Time)",
  "UTC-01:00 (Azores Time)",
  "UTC+00:00 (Greenwich Mean Time)",
  "UTC+01:00 (Central European Time)",
  "UTC+02:00 (Eastern European Time)",
  "UTC+03:00 (Moscow Time)",
  "UTC+04:00 (Gulf Standard Time)",
  "UTC+05:00 (Pakistan Standard Time)",
  "UTC+05:30 (India Standard Time)",
  "UTC+06:00 (Bangladesh Standard Time)",
  "UTC+07:00 (Indochina Time)",
  "UTC+08:00 (China Standard Time)",
  "UTC+09:00 (Japan Standard Time)",
  "UTC+10:00 (Australian Eastern Standard Time)",
  "UTC+11:00 (Solomon Islands Time)",
  "UTC+12:00 (New Zealand Standard Time)"
];

const GetInvolved = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: '',
    availability: '',
    preferredDepartment: '',
    portfolioUrl: '',
    notes: '',
    consent: false
  });

  const fromJoin = searchParams.get('from') === 'join';

  const handleFilloutRedirect = () => {
    // Open Fillout form in new tab with volunteer parameter
    window.open('https://form.fillout.com/t/wHKtxCmdQDus?type=volunteer', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (fromJoin) {
      toast({
        title: "Welcome to our volunteer program!",
        description: "Since no certificate was provided, explore our volunteer opportunities below.",
        duration: 5000
      });
    }
  }, [fromJoin, toast]);

  const availableSkills = [
    "AI/ML", "Python", "JavaScript", "React", "Node.js", "Data Science",
    "Community Building", "Content Writing", "Social Media", "Video Production",
    "Technical Writing", "Documentation", "Event Planning", "Project Management",
    "UI/UX Design", "Figma", "Research", "Data Analysis", "Networking",
    "Public Speaking", "Marketing", "SEO", "Graphic Design", "Photography"
  ];

  const openRoles = volunteerRoles.filter(role => role.status === 'open');
  const departments = [...new Set(openRoles.map(role => role.department))];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.timezone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name, email, and timezone.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to the terms and privacy policy to continue.",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.portfolioUrl && !formData.portfolioUrl.startsWith('http')) {
      toast({
        title: "Invalid portfolio URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement Supabase integration for:
      // 1. Insert into volunteer_applications table
      // 2. Send confirmation email
      // 3. Trigger admin notification
      // 4. Log application event

      const applicationData = {
        ...formData,
        skills: selectedSkills,
        source: fromJoin ? 'join-redirect' : 'direct',
        status: 'received'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in volunteering. We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        timezone: '',
        availability: '',
        preferredDepartment: '',
        portfolioUrl: '',
        notes: '',
        consent: false
      });
      setSelectedSkills([]);

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showContact={false}>
      <SEO
        title="Get Involved - Volunteer with Gen AI Global"
        description="Join our volunteer program and help shape the future of AI. Explore opportunities to contribute your skills to our global AI community."
        keywords={["volunteer AI", "AI volunteer opportunities", "contribute to AI community", "Gen AI Global volunteer"]}
      />
      
      <main className="relative pt-16 md:pt-20">
        {/* Futuristic background */}
        <AuroraNebula />
        <ConstellationParticles />
        
        {/* Hero Section */}
        <motion.section 
          className="relative z-10 container mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center gap-8 px-4 text-center overflow-visible"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl font-sans">
            Get Involved
          </h1>
          <p className="max-w-2xl text-balance text-muted-foreground">
            Join our volunteer community and help democratize AI knowledge. Find opportunities that match your skills and passion.
          </p>
        </motion.section>
        
        <div className="relative z-10 container mx-auto max-w-6xl px-4 py-16">

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Volunteer Opportunities */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6" />
                  Current Opportunities
                </h2>
                <div className="grid gap-4">
                  {openRoles.map((role) => (
                    <Card key={role.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{role.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {role.department}
                            </Badge>
                          </div>
                          <Badge 
                            variant={role.status === 'open' ? 'default' : 'secondary'}
                            className={role.status === 'open' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {role.status === 'open' ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {role.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ready to Get Involved?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Join our volunteer program and help democratize AI knowledge. Click below to access our comprehensive application form.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Quick application process</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Flexible time commitments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Global remote opportunities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Skill-based matching</span>
                    </div>
                  </div>
                  
                  <form className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleFilloutRedirect();
                    }}
                  >

                    <Button 
                      onClick={handleFilloutRedirect}
                      className="w-full" 
                      size="lg"
                    >
                      Apply to Volunteer
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Have questions about volunteering?{' '}
              <a href="mailto:volunteer@genaiglobal.org" className="text-primary hover:underline">
                Contact our volunteer coordinator
              </a>
            </p>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default GetInvolved;