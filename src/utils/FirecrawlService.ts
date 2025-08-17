import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export interface LinkedInPost {
  id: string;
  content: string;
  author: string;
  date: string;
  type: 'member-spotlight' | 'general';
  linkedinUrl: string;
  memberName?: string;
  memberTitle?: string;
  memberDescription?: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test scrape to verify the API key
      const testResponse = await this.firecrawlApp.scrapeUrl('https://example.com');
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async scrapeLinkedInPosts(companyUrl: string): Promise<{ success: boolean; error?: string; posts?: LinkedInPost[] }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found. Please set your Firecrawl API key first.' };
    }

    try {
      console.log('Scraping LinkedIn posts with Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const scrapeResponse = await this.firecrawlApp.scrapeUrl(companyUrl, {
        formats: ['markdown', 'html'],
        includeTags: ['article', 'div', 'p', 'span'],
        excludeTags: ['script', 'style', 'nav', 'header', 'footer'],
        waitFor: 3000
      });

      if (!scrapeResponse.success) {
        console.error('Scrape failed:', scrapeResponse.error);
        return { 
          success: false, 
          error: scrapeResponse.error || 'Failed to scrape LinkedIn posts' 
        };
      }

      // Parse the scraped content to extract Member of the Week posts
      const posts = this.parseLinkedInPosts(scrapeResponse.markdown || '', scrapeResponse.html || '');
      
      console.log('Scraped posts:', posts);
      return { 
        success: true,
        posts 
      };
    } catch (error) {
      console.error('Error during LinkedIn scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  private static parseLinkedInPosts(markdown: string, html: string): LinkedInPost[] {
    const posts: LinkedInPost[] = [];
    
    // Look for patterns that indicate Member of the Week posts
    const memberSpotlightPatterns = [
      /🎖️\s*Member Spotlight[:\s]*([^🎖️]*?)🎖️/gi,
      /Member\s+of\s+the\s+Week[:\s]*([^\.]*?)(?:\.|$)/gi,
      /\*\*Member\s+Spotlight\*\*[:\s]*([^*]*?)(?:\*\*|$)/gi,
      /#memberoftheweek\s+([^#]*?)(?:#|$)/gi,
      /#membersspotlight\s+([^#]*?)(?:#|$)/gi
    ];

    let postId = 1;

    // Try to extract posts from markdown content
    memberSpotlightPatterns.forEach(pattern => {
      const matches = markdown.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 50) {
          const content = match[1].trim();
          
          // Extract member name (usually the first mentioned name)
          const nameMatch = content.match(/\[([^\]]+)\]\([^)]+\)|([A-Z][a-z]+\s+[A-Z][a-z]+)/);
          const memberName = nameMatch ? (nameMatch[1] || nameMatch[2]) : 'Unknown Member';
          
          // Extract description (usually after the name)
          const descriptionMatch = content.match(/(?:exemplifies|demonstrates|shows|brings|contributes)([^.]*\.)/i);
          const memberDescription = descriptionMatch ? descriptionMatch[1].trim() : content.substring(0, 200) + '...';

          posts.push({
            id: `linkedin-${postId++}`,
            content: content,
            author: 'Gen AI Global',
            date: new Date().toISOString().split('T')[0], // Default to today, could be improved with actual date extraction
            type: 'member-spotlight',
            linkedinUrl: 'https://www.linkedin.com/company/gen-ai-global/posts/',
            memberName,
            memberTitle: 'Community Member', // Could be extracted with more sophisticated parsing
            memberDescription
          });
        }
      }
    });

    // If no member spotlight posts found, look for general posts with member mentions
    if (posts.length === 0) {
      const generalPostPatterns = [
        /(?:congratulations|celebrate|proud to announce|spotlight)([^.]*member[^.]*\.)/gi,
        /(?:welcome|introducing|meet)([^.]*member[^.]*\.)/gi
      ];

      generalPostPatterns.forEach(pattern => {
        const matches = markdown.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].trim().length > 30) {
            posts.push({
              id: `linkedin-general-${postId++}`,
              content: match[1].trim(),
              author: 'Gen AI Global',
              date: new Date().toISOString().split('T')[0],
              type: 'general',
              linkedinUrl: 'https://www.linkedin.com/company/gen-ai-global/posts/',
              memberName: 'Community Member',
              memberDescription: match[1].trim()
            });
          }
        }
      });
    }

    return posts.slice(0, 10); // Limit to 10 most recent posts
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}