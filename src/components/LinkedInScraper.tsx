import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService, LinkedInPost } from '@/utils/FirecrawlService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Key, Download, Loader2 } from "lucide-react";

interface LinkedInScraperProps {
  onPostsLoaded: (posts: LinkedInPost[]) => void;
}

export const LinkedInScraper = ({ onPostsLoaded }: LinkedInScraperProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());
  const [scrapedPosts, setScrapedPosts] = useState<LinkedInPost[]>([]);

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setHasApiKey(true);
        setApiKey('');
        toast({
          title: "Success",
          description: "API key saved and validated successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid API key. Please check your key and try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrapeLinkedIn = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      setProgress(25);
      const result = await FirecrawlService.scrapeLinkedInPosts('https://www.linkedin.com/company/gen-ai-global/posts/?feedView=all');
      setProgress(75);
      
      if (result.success && result.posts) {
        setScrapedPosts(result.posts);
        onPostsLoaded(result.posts);
        setProgress(100);
        toast({
          title: "Success",
          description: `Successfully scraped ${result.posts.length} posts from LinkedIn`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Warning",
          description: result.error || "LinkedIn content may be behind authentication. Try with a different approach or manual data entry.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error scraping LinkedIn:', error);
      toast({
        title: "Error",
        description: "Failed to scrape LinkedIn posts. LinkedIn may require authentication.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  if (!hasApiKey) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Firecrawl API Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To scrape LinkedIn posts, you need a Firecrawl API key. Get one from{' '}
              <a 
                href="https://www.firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                firecrawl.dev
              </a>
            </p>
            <form onSubmit={handleApiKeySubmit} className="space-y-3">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Firecrawl API key"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            LinkedIn Data Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scrape "Member of the Week" posts from Gen AI Global's LinkedIn page.
          </p>
          
          {isLoading && (
            <Progress value={progress} className="w-full" />
          )}
          
          <Button
            onClick={handleScrapeLinkedIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping LinkedIn...
              </>
            ) : (
              'Scrape LinkedIn Posts'
            )}
          </Button>
        </CardContent>
      </Card>

      {scrapedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraped Posts ({scrapedPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {scrapedPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={post.type === 'member-spotlight' ? 'default' : 'secondary'}>
                      {post.type === 'member-spotlight' ? 'Member Spotlight' : 'General Post'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  {post.memberName && (
                    <h4 className="font-semibold">{post.memberName}</h4>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.memberDescription || post.content}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={post.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      View on LinkedIn
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};