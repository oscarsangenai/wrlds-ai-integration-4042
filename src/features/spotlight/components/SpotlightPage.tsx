import React from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Users } from 'lucide-react';
import { SpotlightPageProps } from '../types';
import { useMemberSpotlights } from '../hooks/useMemberSpotlights';
import SpotlightHeader from './SpotlightHeader';
import MemberList from './MemberList';

const SpotlightPage: React.FC<SpotlightPageProps> = ({ geometryDensity = 32 }) => {
  const { data: members, isLoading, isError, error, refetch } = useMemberSpotlights();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Gen AI Global Community Member Spotlight',
    description: 'Outstanding members and achievements from the Gen AI Global community',
    numberOfItems: members?.length || 0,
    itemListElement: members?.map((member, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: member.name,
        jobTitle: member.title,
        description: member.bio,
        ...(member.linkedinUrl && { url: member.linkedinUrl })
      }
    })) || []
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <LoadingAnimation />
            <p className="text-muted-foreground">Loading member spotlights...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="max-w-2xl mx-auto py-24">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to load member spotlights</AlertTitle>
            <AlertDescription className="mt-2">
              {error?.message || 'An unexpected error occurred while fetching the member data.'}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (!members || members.length === 0) {
      return (
        <div className="text-center py-24">
          <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Members Featured Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working on featuring outstanding community members. Check back soon!
          </p>
        </div>
      );
    }

    return <MemberList members={members} pageSize={12} />;
  };

  return (
    <PageLayout showContact={false}>
      <SEO
        title="Member Spotlight — WRLDS"
        description="Discover outstanding members and latest updates from the Gen AI Global community. Featuring member spotlights, achievements, and community milestones."
        keywords={["AI community", "member spotlight", "community updates", "AI professionals", "achievements"]}
      />
      
      <div className="min-h-[100dvh]">
        <SpotlightHeader />
        
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default SpotlightPage;