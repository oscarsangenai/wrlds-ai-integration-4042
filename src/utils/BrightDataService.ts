import { supabase } from '@/integrations/supabase/client';

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

export class BrightDataService {
  
  static async scrapeLinkedInPosts(url?: string): Promise<{ success: boolean; error?: string; posts?: LinkedInPost[] }> {
    try {
      console.log('Scraping LinkedIn posts with Bright Data API via Supabase edge function');
      
      // Check if Supabase is properly configured
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase client not properly configured'
        };
      }

      const { data, error } = await supabase.functions.invoke('scrape-linkedin', {
        body: {
          url: url || 'https://www.linkedin.com/company/gen-ai-global/posts/?feedView=all'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Provide more helpful error messages
        if (error.message?.includes('Function not found')) {
          return {
            success: false,
            error: 'Scraping function not deployed. Please ensure the Supabase edge function is properly set up.'
          };
        }
        
        return {
          success: false,
          error: error.message || 'Failed to invoke scraping function'
        };
      }

      if (data?.error) {
        console.error('Bright Data API error:', data.error);
        return {
          success: false,
          error: data.error
        };
      }

      console.log('Successfully scraped LinkedIn posts:', data?.posts);
      return {
        success: true,
        posts: data?.posts || []
      };

    } catch (error) {
      console.error('Error during LinkedIn scraping:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to scraping service'
      };
    }
  }
}