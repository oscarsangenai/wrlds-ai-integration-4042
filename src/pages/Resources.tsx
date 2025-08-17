import React, { useState, useMemo } from 'react';
import resourcesData from '@/data/resources.json';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, User } from 'lucide-react';

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

// Sample data based on the provided format - now loaded from JSON
const sampleResources: Resource[] = resourcesData;

const Resources = () => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const availableTags = useMemo(() => {
    const tags = ["All", ...new Set(sampleResources.map(resource => resource.tag))];
    return tags;
  }, []);

  const filteredResources = useMemo(() => {
    if (selectedTag === "All") return sampleResources;
    return sampleResources.filter(resource => resource.tag === selectedTag);
  }, [selectedTag]);

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

  return (
    <PageLayout showContact={false}>
      <SEO
        title="Resources - AI Articles, Case Studies & Learning Materials"
        description="Access AI-related articles, case studies, and learning materials. Stay updated with the latest in artificial intelligence research and applications."
        keywords={["AI resources", "artificial intelligence articles", "case studies", "learning materials", "AI research"]}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access AI-related articles, case studies, and learning materials.
            </p>
            
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <span className="text-sm font-medium text-muted-foreground">Filter by Tag:</span>
              <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-wrap items-start gap-3 mb-4">
                          <Badge className={getTagColor(resource.tag)}>
                            {resource.tag}
                          </Badge>
                          {resource.channel && (
                            <Badge variant="outline" className="text-xs">
                              {resource.channel}
                            </Badge>
                          )}
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
                            <a 
                              href={resource.resource_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Read More
                              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                          </Button>
                          
                          {resource.discord_url && (
                            <Button variant="outline" asChild>
                              <a 
                                href={resource.discord_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Discord Discussion
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No resources found for the selected tag.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Resources;