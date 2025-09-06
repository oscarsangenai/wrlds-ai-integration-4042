import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AchievementPillsProps {
  achievements: string[];
  memberId: number;
  className?: string;
}

const AchievementPills: React.FC<AchievementPillsProps> = ({ 
  achievements, 
  memberId, 
  className = '' 
}) => {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {achievements.map((achievement, index) => (
        <Badge
          key={`member-${memberId}-achievement-${index}`}
          variant="secondary"
          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {achievement}
        </Badge>
      ))}
    </div>
  );
};

export default React.memo(AchievementPills);