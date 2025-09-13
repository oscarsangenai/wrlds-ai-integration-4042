import { MemberSpotlight, LinkedInScrapeResponse } from './types';
import fallbackData from '@/data/memberSpotlights.json';

// Data fetcher with fallback to embedded JSON
export const getMemberSpotlights = async (): Promise<MemberSpotlight[]> => {
  try {
    // Try to fetch from potential future API or updated JSON
    const baseUrl = import.meta.env.BASE_URL || '/';
    const response = await fetch(`${baseUrl}data/memberSpotlights.json`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : fallbackData;
  } catch (error) {
    console.warn('Failed to fetch member spotlights, using fallback data:', error);
    return fallbackData;
  }
};

// Feature flag check for LinkedIn scraper
export const isLinkedInScraperEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_LINKEDIN === '1';
};

// Optional LinkedIn scraper client (feature-flagged)
export const scrapeLinkedInProfile = async (profileUrl: string): Promise<LinkedInScrapeResponse> => {
  if (!isLinkedInScraperEnabled()) {
    throw new Error('LinkedIn scraper is disabled');
  }

  try {
    const response = await fetch('/api/scrape-linkedin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileUrl }),
    });

    if (!response.ok) {
      throw new Error(`Scrape failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('LinkedIn scraping failed:', error);
    throw error;
  }
};