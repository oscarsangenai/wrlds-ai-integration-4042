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
        includeTags: ['article', 'div', 'p', 'span', 'time', 'a'],
        excludeTags: ['script', 'style', 'nav', 'header', 'footer', 'aside'],
        waitFor: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        onlyMainContent: true
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
    
    // Enhanced patterns for Member of the Week posts
    const memberSpotlightPatterns = [
      /🎖️.*?Member\s+(?:Spotlight|of\s+the\s+Week)[:\s]*([^🎖️]*?)(?:🎖️|$)/gis,
      /Member\s+of\s+the\s+Week[:\s]*([^\.]*?)(?:\.|#|$)/gis,
      /\*\*Member\s+(?:Spotlight|of\s+the\s+Week)\*\*[:\s]*([^*]*?)(?:\*\*|$)/gis,
      /#memberoftheweek.*?([^#]*?)(?:#|$)/gis,
      /#membersspotlight.*?([^#]*?)(?:#|$)/gis,
      /(?:spotlight|featuring|celebrating).*?member[:\s]*([^\.]*?)(?:\.|#|$)/gis,
      /Gen\s+AI\s+Global.*?Member.*?Week[:\s]*([^\.]*?)(?:\.|#|$)/gis
    ];

    // Patterns to extract member names
    const namePatterns = [
      /\[([^\]]+)\]\([^)]+\)/g, // LinkedIn link format [Name](url)
      /(?:^|\s)([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, // Full names
      /meet\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
      /celebrating\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
      /spotlight\s+(?:on\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi
    ];

    // Patterns to extract titles/roles
    const titlePatterns = [
      /(?:director|manager|lead|senior|principal|chief|head|vice president|vp|ceo|cto|cfo)[\s\w,]+/gi,
      /(?:engineer|developer|analyst|scientist|researcher|consultant|advisor|specialist)[\s\w,]*/gi,
      /at\s+([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.|!)/g // Company names after "at"
    ];

    let postId = 1;

    // Enhanced extraction from markdown content
    memberSpotlightPatterns.forEach(pattern => {
      const matches = markdown.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 30) {
          const content = match[1].trim();
          
          // Extract member name with multiple patterns
          let memberName = 'Community Member';
          for (const namePattern of namePatterns) {
            const nameMatch = content.match(namePattern);
            if (nameMatch) {
              memberName = nameMatch[1] || nameMatch[0];
              // Clean up the name
              memberName = memberName.replace(/[\[\]()]/g, '').trim();
              if (memberName.split(' ').length >= 2 && memberName.split(' ').length <= 4) {
                break;
              }
            }
          }
          
          // Extract title/role
          let memberTitle = 'Community Member';
          for (const titlePattern of titlePatterns) {
            const titleMatch = content.match(titlePattern);
            if (titleMatch) {
              memberTitle = titleMatch[0].trim();
              // Clean up title
              memberTitle = memberTitle.charAt(0).toUpperCase() + memberTitle.slice(1);
              break;
            }
          }

          // Extract description (clean and meaningful)
          let memberDescription = content;
          // Remove hashtags and clean up
          memberDescription = memberDescription.replace(/#\w+/g, '').trim();
          // Limit length
          if (memberDescription.length > 300) {
            memberDescription = memberDescription.substring(0, 300) + '...';
          }

          // Extract potential LinkedIn URL from content
          const linkedinUrlMatch = content.match(/https:\/\/www\.linkedin\.com\/[^\s)]+/);
          const linkedinUrl = linkedinUrlMatch ? linkedinUrlMatch[0] : 'https://www.linkedin.com/company/gen-ai-global/posts/';

          posts.push({
            id: `linkedin-motw-${postId++}`,
            content: content,
            author: 'Gen AI Global',
            date: this.extractDateFromContent(content) || new Date().toISOString().split('T')[0],
            type: 'member-spotlight',
            linkedinUrl,
            memberName,
            memberTitle,
            memberDescription
          });
        }
      }
    });

    // Also search HTML content for additional patterns
    if (html && posts.length < 3) {
      // Remove HTML tags and extract text
      const htmlText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      
      memberSpotlightPatterns.forEach(pattern => {
        const matches = htmlText.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].trim().length > 50 && !posts.find(p => p.content.includes(match[1].substring(0, 50)))) {
            const content = match[1].trim();
            
            let memberName = 'Community Member';
            for (const namePattern of namePatterns) {
              const nameMatch = content.match(namePattern);
              if (nameMatch && nameMatch[1]) {
                memberName = nameMatch[1].trim();
                break;
              }
            }

            posts.push({
              id: `linkedin-html-${postId++}`,
              content: content,
              author: 'Gen AI Global',
              date: new Date().toISOString().split('T')[0],
              type: 'member-spotlight',
              linkedinUrl: 'https://www.linkedin.com/company/gen-ai-global/posts/',
              memberName,
              memberTitle: 'Community Member',
              memberDescription: content.substring(0, 200) + '...'
            });
          }
        }
      });
    }

    return posts.slice(0, 8); // Limit to 8 most relevant posts
  }

  private static extractDateFromContent(content: string): string | null {
    // Try to extract date patterns from content
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/,
      /(\w+\s+\d{1,2},\s+\d{4})/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/
    ];

    for (const pattern of datePatterns) {
      const match = content.match(pattern);
      if (match) {
        const date = new Date(match[1]);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
    }

    return null;
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