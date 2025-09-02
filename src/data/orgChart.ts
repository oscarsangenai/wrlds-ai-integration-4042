import { 
  Crown, 
  Shield, 
  Cloud, 
  Server, 
  UserPlus, 
  FileText, 
  Megaphone, 
  Users, 
  Bot, 
  Globe,
  FlaskConical,
  GraduationCap,
  Cpu,
  Database,
  Boxes,
  DollarSign,
  Zap,
  User,
  Target,
  Calendar,
  MessageSquare,
  Star
} from "lucide-react";

export type OrgMember = {
  name: string;
  role?: string;
};

export type OrgUnit = {
  id: string;
  name: string;
  type: 'founder' | 'executive-director' | 'department' | 'team';
  icon: keyof typeof CATEGORY_ICON;
  description?: string;
  parentId?: string;
  members?: OrgMember[];
};

// Icon registry for group headers
export const CATEGORY_ICON = {
  Crown,
  Shield,
  Cloud,
  Server,
  UserPlus,
  FileText,
  Megaphone,
  Users,
  Bot,
  Globe,
  FlaskConical,
  GraduationCap,
  Cpu,
  Database,
  Boxes,
  DollarSign,
  Zap,
  User,
  Target,
  Calendar,
  MessageSquare,
  Star
};

export const ORG_UNITS: OrgUnit[] = [
  // Founders
  {
    id: "founder-1",
    name: "Abel Sanchez",
    type: "founder",
    icon: "Crown",
    description: "Co-Founder",
    members: [
      { name: "Abel Sanchez", role: "Founder" },
    ],
  },
  {
    id: "founder-2", 
    name: "Oscar Sanchez",
    type: "founder",
    icon: "Crown",
    description: "Co-Founder",
    members: [
      { name: "Oscar Sanchez", role: "Founder" },
    ],
  },

  // Executive Director
  {
    id: "executive-director",
    name: "Executive Director of Operations",
    type: "executive-director",
    icon: "User",
    description: "Executive operations leadership",
    members: [
      { name: "Rodrigo Reyes Jara", role: "Executive Director of Operations" },
    ],
  },

  // Departments under Rodrigo
  {
    id: "agile-department",
    name: "Agile & AI Ops",
    type: "department",
    icon: "Zap",
    description: "Agile operations and AI operations",
    parentId: "executive-director",
    members: [
      { name: "Deidré Luzmore", role: "Director of Enterprise Agility & Operational Excellence" },
    ],
  },
  {
    id: "dept-ai-forge",
    name: "AI Forge",
    type: "department",
    icon: "FlaskConical",
    description: "Program design and innovation",
    parentId: "executive-director",
    members: [
      { name: "Diellza Ahmetaj", role: "Director of Program Design & Innovation" },
    ],
  },
  {
    id: "cloud-department",
    name: "Cloud",
    type: "department",
    icon: "Cloud",
    description: "Cloud infrastructure and DevOps",
    parentId: "executive-director",
    members: [
      { name: "Sangame Krishnamani", role: "Volunteer Advisor, Technology Strategy & Digital Architecture" },
    ],
  },
  {
    id: "community-engagement-department",
    name: "Community Engagement",
    type: "department", 
    icon: "Users",
    description: "Community experience and volunteer strategy",
    parentId: "executive-director",
    members: [
      { name: "Oscar García", role: "Director of Community Experience & Volunteer Strategy" },
    ],
  },
  {
    id: "documentation-department",
    name: "Documentation",
    type: "department",
    icon: "FileText",
    description: "Documentation and knowledge management",
    parentId: "executive-director",
    members: [
      { name: "Anagha Pamidi", role: "Head of Documentation Department" },
    ],
  },
  {
    id: "education-tracks-department",
    name: "Education Tracks",
    type: "department",
    icon: "GraduationCap",
    description: "Agent development and non-coder education",
    parentId: "executive-director",
    members: [
      { name: "Brandon Pendleton", role: "Head of Agent Development Instructors" },
      { name: "Apoorv Garg", role: "Non-Coders Class Lead" },
      { name: "Ash Mikhail", role: "Non-Coders Class Lead" },
      { name: "Rodrigo Reyes Jara", role: "Non-Coders Class Lead" },
    ],
  },
  {
    id: "finance-department",
    name: "Finance",
    type: "department",
    icon: "DollarSign",
    description: "Finance and technology operations",
    parentId: "executive-director",
    members: [
      { name: "Nikhil Kassetty", role: "Volunteer Director of Finance & Technology Operations" },
    ],
  },
  {
    id: "fundraising-department",
    name: "Fundraising",
    type: "department",
    icon: "Target",
    description: "Fundraising and partnerships",
    parentId: "executive-director",
    members: [
      { name: "Oscar Sanchez", role: "Fundraising Dept Director" },
      { name: "Rodrigo Reyes Jara", role: "Fundraising Dept Director" },
    ],
  },
  {
    id: "information-technology-department",
    name: "Information Technology",
    type: "department",
    icon: "Server",
    description: "IT operations and infrastructure",
    parentId: "executive-director",
    members: [
      { name: "Nikhil Kassetty", role: "IT Lead" },
    ],
  },
  {
    id: "marketing-department",
    name: "Marketing",
    type: "department",
    icon: "Megaphone",
    description: "Marketing, communications, and brand strategy",
    parentId: "executive-director",
    members: [
      { name: "Katherine Valqui", role: "Director of Marketing & Communications" },
      { name: "Xiaoke Pu", role: "Director of Influencer Strategy & Content Innovation" },
    ],
  },
  {
    id: "onboarding-department",
    name: "Onboarding",
    type: "department",
    icon: "UserPlus",
    description: "Talent acquisition and onboarding strategy",
    parentId: "executive-director",
    members: [
      { name: "Amber Bellou", role: "Director of Talent Acquisition & Onboarding Strategy" },
    ],
  },
  {
    id: "web-development-department",
    name: "Web Development",
    type: "department",
    icon: "Globe",
    description: "Website development and digital architecture",
    parentId: "executive-director",
    members: [
      { name: "Sangame Krishnamani", role: "Volunteer Advisor, Technology Strategy & Digital Architecture" },
    ],
  },

  // Teams under departments
  // Marketing Department Teams
  {
    id: "marketing-team",
    name: "Marketing Team (Content & Exhibits)",
    type: "team",
    icon: "Megaphone",
    parentId: "marketing-department",
    description: "Content creation, exhibitions, and marketing operations",
    members: [
      { name: "Katherine Valqui", role: "Head of Marketing" },
      { name: "Alfredo Serrano", role: "Content & Editorial Lead" },
      { name: "Michelle Rhee", role: "Events Manager" },
      { name: "Oscar García", role: "Discord Manager" },
      { name: "Oscar Sanchez", role: "Brand Identity Lead" },
      { name: "Rodrigo Reyes Jara", role: "Events Manager" },
      { name: "Xiaoke Pu", role: "Growth Marketer" },
    ],
  },
  {
    id: "influencer-team",
    name: "Influencer Team",
    type: "team",
    icon: "Star",
    parentId: "marketing-department",
    description: "Influencer strategy and content innovation",
    members: [
      { name: "Xiaoke Pu", role: "Director" },
      { name: "Prajwal Mandale", role: "Head of Daily Operations" },
      { name: "Kasia Zmuda", role: "Influencer Team Member" },
      { name: "Nathan Ngo", role: "Influencer Team Member" },
      { name: "Thuy Pham", role: "Influencer Team Member" },
    ],
  },
  {
    id: "ambassador-team",
    name: "Ambassador Team",
    type: "team",
    icon: "Users",
    parentId: "marketing-department",
    description: "Community ambassadors and brand representatives",
    members: [
      { name: "Alfredo Serrano", role: "Ambassador" },
      { name: "Walter Shields", role: "Ambassador" },
    ],
  },
  {
    id: "content-curators",
    name: "Content Curators",
    type: "team",
    icon: "FileText",
    parentId: "marketing-department",
    description: "Content curation and editorial management",
    members: [
      { name: "Aida Torras", role: "Content Curator" },
      { name: "Andrea Hicketthier", role: "Content Curator" },
      { name: "Antoine Christopher", role: "Content Curator" },
      { name: "Ash Mikhail", role: "Content Curator" },
      { name: "Bisera Ferrero", role: "Content Curator" },
      { name: "Carol Choi", role: "Content Curator" },
      { name: "Cristian Vasquez", role: "Content Curator" },
      { name: "Eduardo Fadanelli", role: "Content Curator" },
      { name: "Georgi Pavlov", role: "Content Curator" },
      { name: "Hector Perez", role: "Content Curator" },
      { name: "Jasmina Ciconkova", role: "Content Curator" },
      { name: "jmikels", role: "Content Curator" },
      { name: "Julia Haitz", role: "Content Curator" },
      { name: "Juliana Quintero", role: "Content Curator" },
      { name: "Laura Neder", role: "Content Curator" },
      { name: "Marie Ribbelöv", role: "Content Curator" },
      { name: "Mauricio Perez", role: "Content Curator" },
      { name: "Melinda Melcher", role: "Content Curator" },
      { name: "Michael Keady", role: "Content Curator" },
      { name: "Michelle Rhee Los Angeles GMT-7", role: "Content Curator" },
      { name: "Nura Mukyshev", role: "Content Curator" },
      { name: "Oscar Garcia", role: "Content Curator" },
      { name: "Prabhat Kumar", role: "Content Curator" },
      { name: "Rad Ramamurthy", role: "Content Curator" },
      { name: "Rodrigo Baeza", role: "Content Curator" },
      { name: "Sebastien Francois", role: "Content Curator" },
      { name: "Sergio A. Gaiti", role: "Content Curator" },
      { name: "Shabana Islam", role: "Content Curator" },
      { name: "Silke Finken", role: "Content Curator" },
      { name: "Virva Launo", role: "Content Curator" },
    ],
  },

  // Onboarding Department Team
  {
    id: "onboarding-team",
    name: "Onboarding Team",
    type: "team",
    icon: "UserPlus",
    parentId: "onboarding-department",
    description: "New member onboarding and talent acquisition",
    members: [
      { name: "Amber Bellou", role: "Director" },
      { name: "Catalina Rendon", role: "Onboarding Team Member" },
      { name: "Hatice Yavuz", role: "Onboarding Team Member" },
      { name: "Narsi Pasaladi", role: "Onboarding Team Member" },
      { name: "Sagnik Chand", role: "Onboarding Team Member" },
    ],
  },

  // Community Engagement Department Team
  {
    id: "community-engagement-team",
    name: "Community Engagement Team",
    type: "team",
    icon: "Users",
    parentId: "community-engagement-department",
    description: "Community experience and volunteer coordination",
    members: [
      { name: "Oscar Garcia", role: "Director of Community Experience & Volunteer Strategy" },
      { name: "Jasmina Ciconkova", role: "Community Engagement Team Member" },
      { name: "Shabana Islam", role: "Calendar Manager" },
    ],
  },

  // Agile & AI Ops Teams
  {
    id: "agile-ops-team",
    name: "Agile Ops Team (Delivery)",
    type: "team",
    icon: "Zap",
    parentId: "agile-department",
    description: "Agile delivery and operations management",
    members: [
      { name: "Deidré Luzmore", role: "Head" },
      { name: "Anagha Pamidi", role: "Agile Leader & Technical Documentation Specialist" },
      { name: "Mahua Sircar Mitra", role: "Agile Leader & Test Manager" },
      { name: "Michelle Rhee", role: "Agile Leader" },
      { name: "Pragya Shukla", role: "Agile Leader" },
      { name: "Ricardo Valverde", role: "Agile Leader" },
      { name: "Safouen Selmi", role: "Agile Leader" },
      { name: "Sven-Christian Endres", role: "Agile Leader" },
    ],
  },

  // AI Forge Teams
  {
    id: "team-ai-forge",
    name: "AI Forge Team",
    type: "team",
    icon: "FlaskConical",
    parentId: "dept-ai-forge",
    description: "Program design and innovation team",
    members: [
      { name: "Diellza Ahmetaj", role: "Lead" },
      { name: "Juan Napoli", role: "AI Forge Team Member" },
      { name: "René Jost", role: "AI Forge Team Member" },
      { name: "Salvador Nunez", role: "AI Forge Team Member" },
    ],
  },

  // Documentation Department Team
  {
    id: "documentation-team",
    name: "Documentation Team",
    type: "team",
    icon: "FileText",
    parentId: "documentation-department",
    description: "Knowledge management and documentation",
    members: [
      { name: "Anagha Pamidi", role: "Director" },
      { name: "Amber Bellou", role: "Documentation Team Member" },
      { name: "Prajwal Mandale", role: "Documentation Team Member" },
    ],
  },

  // Finance Department Team
  {
    id: "finance-team",
    name: "Finance Team",
    type: "team",
    icon: "DollarSign",
    parentId: "finance-department",
    description: "Financial management and operations",
    members: [
      { name: "Nikhil Kassetty", role: "Director" },
      { name: "Salvador Nunez", role: "Support" },
    ],
  },

  // Fundraising Department Team
  {
    id: "fundraising-team",
    name: "Fundraising Team (Members)",
    type: "team",
    icon: "Target",
    parentId: "fundraising-department",
    description: "Fundraising and partnership development",
    members: [
      { name: "Amber Bellou", role: "Fundraising Team Member" },
      { name: "Brandon Pendleton", role: "Fundraising Team Member" },
      { name: "Egbert Wetherborne", role: "Fundraising Team Member" },
      { name: "Fabian Chahin", role: "Fundraising Team Member" },
      { name: "Himanshu Joshi", role: "Fundraising Team Member" },
      { name: "Juan Napoli", role: "Fundraising Team Member" },
      { name: "Katherine Valqui", role: "Fundraising Team Member" },
      { name: "Nikhil Kassetty", role: "Fundraising Team Member" },
      { name: "Oscar Garcia", role: "Fundraising Team Member" },
      { name: "Paul Hohenberger", role: "Fundraising Team Member" },
      { name: "Salvador Nunez", role: "Fundraising Team Member" },
    ],
  },

  // Web Development Team
  {
    id: "web-dev-team",
    name: "Web Dev Team",
    type: "team",
    icon: "Globe",
    parentId: "web-development-department",
    description: "Website development and digital architecture",
    members: [
      { name: "Sangame Krishnamani", role: "Director" },
      { name: "Amber Bellou", role: "Web Dev Team Member" },
      { name: "Manal Moinuddin", role: "Web Dev Team Member" },
      { name: "Mary Ann Belarmino", role: "Web Dev Team Member" },
      { name: "Nikhil Kassetty", role: "Web Dev Team Member" },
      { name: "Pragya Shukla", role: "Web Dev Team Member" },
    ],
  },

  // Cloud Team
  {
    id: "cloud-team",
    name: "Cloud Team",
    type: "team",
    icon: "Cloud",
    parentId: "cloud-department",
    description: "Cloud infrastructure and DevOps operations",
    members: [
      { name: "Sangame Krishnamani", role: "Director" },
      { name: "Deidré Luzmore", role: "Cloud Team Member" },
      { name: "Desiree Lemons", role: "Cloud Team Member" },
      { name: "Enrique Camarena", role: "Cloud Team Member" },
      { name: "Jefferson Kiocia", role: "Cloud Team Member" },
      { name: "Ryan Dear", role: "Cloud Team Member" },
    ],
  },

  // Education Tracks Teams
  {
    id: "a-dev-instructors",
    name: "A Dev Instructors",
    type: "team",
    icon: "Bot",
    parentId: "education-tracks-department",
    description: "Agent development instruction and mentorship",
    members: [
      { name: "Brandon Pendleton", role: "Lead" },
      { name: "Abheek S.", role: "A Dev Instructor" },
      { name: "Anagha Pamidi", role: "A Dev Instructor" },
      { name: "Carlos Ruiz Viquez", role: "A Dev Instructor" },
      { name: "Chad Tetreault", role: "A Dev Instructor" },
      { name: "Happy Bhati", role: "A Dev Instructor" },
      { name: "Himanshu Joshi", role: "A Dev Instructor" },
      { name: "Jim Haney", role: "A Dev Instructor" },
      { name: "Luis Zeron", role: "A Dev Instructor" },
      { name: "Mary Ann Belarmino", role: "A Dev Instructor" },
      { name: "Shahzad Muhammad", role: "A Dev Instructor" },
      { name: "Suryanarayanan Jagadeesan", role: "A Dev Instructor" },
      { name: "Vijay Redkar", role: "A Dev Instructor" },
    ],
  },
  {
    id: "non-coders-instructors",
    name: "Non-Coders Instructors", 
    type: "team",
    icon: "GraduationCap",
    parentId: "education-tracks-department",
    description: "Non-technical education and training",
    members: [
      { name: "Apoorv Garg", role: "Co-Director" },
      { name: "Ash Mikhail", role: "Co-Director" },
      { name: "Rodrigo Reyes Jara", role: "Executive Director of Operations" },
      { name: "Deidré Luzmore", role: "Non-Coders Instructor" },
      { name: "Emile Karam", role: "Non-Coders Instructor" },
      { name: "Jonathan Horden", role: "Non-Coders Instructor" },
    ],
  },

  // Information Technology Team
  {
    id: "it-team",
    name: "IT Team",
    type: "team",
    icon: "Server",
    parentId: "information-technology-department",
    description: "Information technology operations and support",
    members: [
      { name: "Nikhil Kassetty", role: "Lead" },
      { name: "Max Leon", role: "IT Team Member" },
      { name: "Roberto Parraguez", role: "IT Team Member" },
      { name: "Ryan Dear", role: "IT Team Member" },
    ],
  },
];