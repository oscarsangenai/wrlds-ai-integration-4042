import React, { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, ExternalLink } from 'lucide-react';
import { MemberSpotlight } from '../types';
import { fmt } from '@/lib/dateUtils';
import AchievementPills from './AchievementPills';

interface MemberCardProps {
  member: MemberSpotlight;
  index: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: shouldReduceMotion ? 0.2 : 0.4,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: 'easeOut'
      }
    }
  };

  const handleLinkedInClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Analytics could be added here
  }, []);

  const isValidLinkedInUrl = member.linkedinUrl && 
    (member.linkedinUrl.startsWith('http://') || member.linkedinUrl.startsWith('https://'));

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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
    </motion.div>
  );
};

export default React.memo(MemberCard);