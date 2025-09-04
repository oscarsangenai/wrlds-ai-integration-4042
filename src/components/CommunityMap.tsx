import React from 'react';
import { Globe } from 'lucide-react';

interface CommunityMapProps {
  className?: string;
}

const CommunityMap: React.FC<CommunityMapProps> = ({
  className
}) => {
  return (
    <div className={`relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm ${className}`}>
      {/* Network World Map Background Image */}
      <img 
        src={`${import.meta.env.BASE_URL || '/'}lovable-uploads/b47eba27-c63a-47d2-912a-d6a26458caf2.png`}
        alt="Global network connectivity map showing connected countries"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
      
      {/* Countries count overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-cyan-400/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300">60 Countries Connected</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;