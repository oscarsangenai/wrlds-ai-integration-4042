import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrightDataService, LinkedInPost } from '@/utils/BrightDataService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Loader2, Globe } from "lucide-react";

interface BrightDataScraperProps {
  onPostsLoaded: (posts: LinkedInPost[]) => void;
}

export const BrightDataScraper = ({ onPostsLoaded }: BrightDataScraperProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedPosts, setScrapedPosts] = useState<LinkedInPost[]>([]);

  const handleScrapeLinkedIn = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      setProgress(25);
      toast({
        title: "Starting Scrape",
        description: "Connecting to Bright Data to scrape LinkedIn posts...",
        duration: 3000,
      });
      
      setProgress(50);
      const result = await BrightDataService.scrapeLinkedInPosts('https://www.linkedin.com/company/gen-ai-global/posts/?feedView=all');
      setProgress(75);
      
      if (result.success && result.posts) {
        setScrapedPosts(result.posts);
        onPostsLoaded(result.posts);
        setProgress(100);
        toast({
          title: "Success",
          description: `Successfully scraped ${result.posts.length} Member of the Week posts from LinkedIn`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Scraping Complete",
          description: result.error || "No Member of the Week posts found. This could be due to LinkedIn's access restrictions or content changes.",
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error('Error scraping LinkedIn:', error);
      toast({
        title: "Error",
        description: "Failed to scrape LinkedIn posts. This may be due to LinkedIn's access restrictions or network issues.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Bright Data LinkedIn Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Enterprise-Grade Scraping</p>
              <p className="text-xs text-muted-foreground">
                Using Bright Data's professional web scraping service to extract "Member of the Week" posts from Gen AI Global's LinkedIn company page.
              </p>
            </div>
          </div>
          
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                Scraping LinkedIn data... This may take a few moments.
              </p>
            </div>
          )}
          
          <Button
            onClick={handleScrapeLinkedIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping LinkedIn Posts...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Scrape LinkedIn Posts
              </>
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
                  {post.memberTitle && (
                    <p className="text-sm text-primary">{post.memberTitle}</p>
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