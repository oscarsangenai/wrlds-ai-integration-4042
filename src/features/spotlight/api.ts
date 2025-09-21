import { MemberSpotlight, LinkedInScrapeResponse } from './types';
import fallbackData from '@/data/memberSpotlights.json';

// Data fetcher with fallback to embedded JSON
export const getMemberSpotlights = async (): Promise<MemberSpotlight[]> => {
  try {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000);
    
    try {
      // Try to fetch from potential future API or updated JSON
      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}data/memberSpotlights.json`, {
        headers: {
          'Accept': 'application/json',
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw { message: `HTTP ${response.status}: ${response.statusText}`, status: response.status };
      }

      const data = await response.json();
      return Array.isArray(data) ? data : fallbackData;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw { message: 'timeout', status: 408 };
      }
      throw fetchError;
    }
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
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000);
    
    try {
      const response = await fetch('/api/scrape-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileUrl }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw { message: `Scrape failed: ${response.statusText}`, status: response.status };
      }

      return await response.json();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw { message: 'timeout', status: 408 };
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('LinkedIn scraping failed:', error);
    throw error;
  }
};