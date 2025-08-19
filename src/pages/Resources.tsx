import React, { useState, useMemo, useEffect } from 'react';
import resourcesData from '@/data/resources.json';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BrightDataScraper } from '@/components/BrightDataScraper';
import { BrightDataService, LinkedInPost } from '@/utils/BrightDataService';
import { ExternalLink, Calendar, User, Search, Award, Linkedin, Users, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
interface Resource {
  id: number;
  title: string;
  description: string;
  date: string;
  author: string;
  channel?: string;
  tag: string;
  resource_url: string;
  discord_url?: string;
}

// Load resources from JSON file
const resources: Resource[] = resourcesData.resources;
const Resources = () => {
  const {
    toast
  } = useToast();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [showScraper, setShowScraper] = useState(false);

  // Auto-load LinkedIn posts when page loads
  useEffect(() => {
    const loadLinkedInPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const result = await BrightDataService.scrapeLinkedInPosts('https://www.linkedin.com/company/gen-ai-global/posts/?feedView=all');
        if (result.success && result.posts) {
          setLinkedInPosts(result.posts);
          toast({
            title: "Success",
            description: `Loaded ${result.posts.length} Member of the Week posts from LinkedIn`,
            duration: 3000
          });
        } else {
          console.log('No posts loaded automatically:', result.error);
        }
      } catch (error) {
        console.log('Auto-load failed, manual scraping available');
      } finally {
        setIsLoadingPosts(false);
      }
    };
    loadLinkedInPosts();
  }, [toast]);
  const handleLinkedInPostsLoaded = (posts: LinkedInPost[]) => {
    setLinkedInPosts(posts);
    setShowScraper(false);
  };

  // Function to determine sector based on content
  const getSector = (resource: Resource): string => {
    const title = resource.title.toLowerCase();
    const description = resource.description.toLowerCase();
    const content = `${title} ${description}`;
    if (content.includes('healthcare') || content.includes('medical') || content.includes('health') || content.includes('autism') || content.includes('patient')) {
      return 'Healthcare';
    }
    if (content.includes('code') || content.includes('coding') || content.includes('developer') || content.includes('programming') || content.includes('software') || content.includes('cli') || content.includes('github')) {
      return 'Software Engineering';
    }
    if (content.includes('finance') || content.includes('financial') || content.includes('banking') || content.includes('investment') || content.includes('money') || content.includes('economic')) {
      return 'Finance';
    }
    if (content.includes('retail') || content.includes('walmart') || content.includes('shopping') || content.includes('fashion') || content.includes('trend') || content.includes('product')) {
      return 'Retail & Commerce';
    }
    if (content.includes('education') || content.includes('learning') || content.includes('course') || content.includes('tutorial') || content.includes('teaching') || content.includes('academic')) {
      return 'Education & Training';
    }
    if (content.includes('job') || content.includes('career') || content.includes('employment') || content.includes('workforce') || content.includes('hiring') || content.includes('professional')) {
      return 'Career & Employment';
    }
    if (content.includes('design') || content.includes('creative') || content.includes('canva') || content.includes('visual') || content.includes('art')) {
      return 'Design & Creative';
    }
    if (content.includes('privacy') || content.includes('security') || content.includes('ethics') || content.includes('risk') || content.includes('safety')) {
      return 'Ethics & Security';
    }
    if (content.includes('research') || content.includes('paper') || content.includes('study') || content.includes('analysis') || content.includes('arxiv')) {
      return 'Research & Academia';
    }
    return 'General AI';
  };
  const availableTags = useMemo(() => {
    const tags = ["All", ...new Set(resources.map(resource => resource.tag))];
    return tags.sort();
  }, []);
  const availableSectors = useMemo(() => {
    const sectors = ["All", ...new Set(resources.map(resource => getSector(resource)))];
    return sectors.sort();
  }, []);
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Filter by tag
    if (selectedTag !== "All") {
      filtered = filtered.filter(resource => resource.tag === selectedTag);
    }

    // Filter by sector
    if (selectedSector !== "All") {
      filtered = filtered.filter(resource => getSector(resource) === selectedSector);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => resource.title.toLowerCase().includes(query) || resource.description.toLowerCase().includes(query) || resource.author.toLowerCase().includes(query));
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedTag, selectedSector, searchQuery]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      'News/Article': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Paper': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Tutorial': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Tool': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Event': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Job/Opportunity': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return tagColors[tag] || tagColors['Other'];
  };
  return <PageLayout showContact={false}>
      <SEO title="Resources - AI Articles, Case Studies & Learning Materials" description="Access AI-related articles, case studies, and learning materials. Stay updated with the latest in artificial intelligence research and applications." keywords={["AI resources", "artificial intelligence articles", "case studies", "learning materials", "AI research"]} />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-20 pb-8 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover {resources.length} curated AI resources and featured Member of the Week posts from our community.
            </p>
            
            {/* Filter Section */}
            <div className="max-w-4xl mx-auto space-y-6 mb-12">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources by title, description, or author..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Tag:</span>
                  <Select value={selectedTag} onValueChange={value => setSelectedTag(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map(tag => <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Sector:</span>
                  <Select value={selectedSector} onValueChange={value => setSelectedSector(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors.map(sector => <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredResources.length} of {resources.length} resources
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Member of the Week Section */}
        

        {/* Resources Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:gap-6">
              {filteredResources.map(resource => <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-wrap items-start gap-3 mb-4">
                          <Badge className={getTagColor(resource.tag)}>
                            {resource.tag}
                          </Badge>
                          {resource.channel && <Badge variant="outline" className="text-xs">
                              {resource.channel}
                            </Badge>}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {resource.title}
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {resource.description}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">Author:</span>
                            <span>{resource.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(resource.date)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button asChild className="group/btn">
                            <a href={resource.resource_url} target="_blank" rel="noopener noreferrer">
                              Read More
                              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                          </Button>
                          
                          {resource.discord_url && <Button variant="outline" asChild>
                              <a href={resource.discord_url} target="_blank" rel="noopener noreferrer">
                                Discord Discussion
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {filteredResources.length === 0 && <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No resources found for the current filters.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>}
          </div>
        </section>
      </div>
    </PageLayout>;
};
export default Resources;