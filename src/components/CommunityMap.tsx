import React from 'react';
import ProfessionalMap from './ProfessionalMap';

interface CommunityMapProps {
  className?: string;
}

const CommunityMap: React.FC<CommunityMapProps> = ({ className }) => {

  return (
    <div 
      className={`w-full h-96 ${className}`}
      role="img"
      aria-label="Interactive world map showing Gen AI Global community presence in 7 countries"
    >
      <ProfessionalMap />
    </div>
  );
};

export default CommunityMap;