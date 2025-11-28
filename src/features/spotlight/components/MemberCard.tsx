import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';
import { MemberSpotlight } from '../types';
import { fmt } from '@/lib/dateUtils';
import AchievementPills from './AchievementPills';
import { useInView } from '@/hooks/useInView';

interface MemberCardProps {
  member: MemberSpotlight;
  index: number;
}

/**
 * Member spotlight card with CSS-based stagger animations.
 * Uses useInView hook to trigger animation on scroll.
 * Stagger delay is applied via CSS animation-delay based on index.
 */
const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const handleLinkedInClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Analytics could be added here
  }, []);

  const isValidLinkedInUrl = member.linkedinUrl && 
    (member.linkedinUrl.startsWith('http://') || member.linkedinUrl.startsWith('https://'));

  // Calculate stagger class based on index (cycle through stagger-1, stagger-2, stagger-3)
  const staggerClass = `stagger-${(index % 3) + 1}`;

  return (
    <div
      ref={ref}
      className={`${isInView ? `animate-slide-up ${staggerClass}` : ''}`}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/50 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
                {member.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium mb-3">
                {member.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={member.date}>
                  {fmt(member.date)}
                </time>
              </div>
            </div>
            {isValidLinkedInUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLinkedInClick}
                asChild
                className="flex-shrink-0 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                aria-label={`View ${member.name}'s LinkedIn profile`}
                title={`Connect with ${member.name} on LinkedIn`}
              >
                <a 
                  href={member.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {member.bio}
          </p>
          
          {member.roles && member.roles.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Roles</h4>
              <div className="flex flex-wrap gap-1">
                {member.roles.map((role, roleIndex) => (
                  <Badge
                    key={`member-${member.id}-role-${roleIndex}`}
                    variant="outline"
                    className="text-xs"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {member.achievements && member.achievements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Key Achievements</h4>
              <AchievementPills 
                achievements={member.achievements} 
                memberId={member.id}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(MemberCard);
