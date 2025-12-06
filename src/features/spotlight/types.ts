export interface MemberSpotlight {
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

export interface CommunityUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'announcement' | 'achievement' | 'event' | 'milestone';
  link?: string;
}

export interface SpotlightPageProps {
  geometryDensity?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface LinkedInScrapeData {
  posts: Array<{
    id: string;
    content: string;
    author: string;
    date: string; // ISO yyyy-mm-dd
    type: 'member-spotlight' | 'general';
    linkedinUrl: string;
    memberName?: string;
    memberTitle?: string;
    memberDescription?: string;
  }>;
}

/** @deprecated Use LinkedInScrapeResult instead */
export interface LinkedInScrapeResponse {
  success: boolean;
  posts: LinkedInScrapeData['posts'];
}

/** Structured result type for scrapeLinkedInProfile - never throws */
export type LinkedInScrapeResult = 
  | { success: true; data: LinkedInScrapeData; error: null }
  | { success: false; data: null; error: string };