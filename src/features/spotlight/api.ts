import { MemberSpotlight, LinkedInScrapeResult, LinkedInScrapeData } from './types';
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

/**
 * Scrapes a LinkedIn profile for posts/data.
 * Returns a structured result object - never throws.
 */
export const scrapeLinkedInProfile = async (profileUrl: string): Promise<LinkedInScrapeResult> => {
  if (!isLinkedInScraperEnabled()) {
    return { 
      success: false, 
      data: null, 
      error: 'LinkedIn scraper is disabled' 
    };
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
        const errorText = await response.text().catch(() => response.statusText);
        return { 
          success: false, 
          data: null, 
          error: `Scrape failed (${response.status}): ${errorText}` 
        };
      }

      const json = await response.json();
      
      // Validate response structure
      if (!json || !Array.isArray(json.posts)) {
        return { 
          success: false, 
          data: null, 
          error: 'Invalid response format from LinkedIn scraper' 
        };
      }

      const data: LinkedInScrapeData = { posts: json.posts };
      return { success: true, data, error: null };
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return { 
          success: false, 
          data: null, 
          error: 'Request timed out' 
        };
      }
      
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('scrapeLinkedInProfile failed:', error);
    return { 
      success: false, 
      data: null, 
      error: errorMessage 
    };
  }
};