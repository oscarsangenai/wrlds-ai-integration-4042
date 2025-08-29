import React, { useState } from 'react';
import { MapPin, Globe } from 'lucide-react';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: 'United States', iso2: 'US', lat: 38.9072, lng: -77.0369 },
  { name: 'Canada', iso2: 'CA', lat: 45.4215, lng: -75.6972 },
  { name: 'India', iso2: 'IN', lat: 28.6139, lng: 77.2090 },
  { name: 'Spain', iso2: 'ES', lat: 40.4168, lng: -3.7038 },
  { name: 'Netherlands', iso2: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'Brazil', iso2: 'BR', lat: -15.8267, lng: -47.9218 },
  { name: 'Mexico', iso2: 'MX', lat: 19.4326, lng: -99.1332 },
  { name: 'Switzerland', iso2: 'CH', lat: 46.2044, lng: 6.1432 } // Geneva coordinates
];

const ProfessionalMap: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Enhanced Mercator projection
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 50 - (mercatorY * 180) / (Math.PI * 5.5);
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/30 rounded-xl overflow-hidden shadow-lg border border-primary/10">
      {/* Professional World Map SVG */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30"
        viewBox="0 0 1000 500"
        style={{ filter: 'hue-rotate(220deg) saturate(0.8) brightness(1.1)' }}
      >
        {/* Simplified world map paths */}
        <g fill="hsl(var(--primary))" opacity="0.6">
          {/* North America */}
          <path d="M158,206 L158,180 L180,160 L200,140 L240,140 L280,160 L300,180 L320,200 L300,220 L280,240 L240,250 L200,240 L180,220 Z" />
          {/* South America */}
          <path d="M240,280 L260,260 L280,280 L290,320 L280,360 L260,380 L240,370 L230,340 L235,300 Z" />
          {/* Europe */}
          <path d="M480,160 L500,140 L520,150 L540,160 L530,180 L520,200 L500,190 L480,180 Z" />
          {/* Africa */}
          <path d="M480,220 L500,200 L520,210 L540,240 L530,280 L520,320 L500,340 L480,330 L470,300 L475,250 Z" />
          {/* Asia */}
          <path d="M560,140 L600,120 L650,130 L700,140 L720,160 L700,180 L650,190 L600,180 L560,170 Z" />
          {/* Australia */}
          <path d="M650,320 L680,310 L700,320 L690,340 L670,350 L650,340 Z" />
          {/* India */}
          <path d="M580,200 L600,190 L620,200 L610,220 L600,230 L580,220 Z" />
        </g>
      </svg>
      
      {/* Country Pins */}
      {countries.map((country) => {
        const pos = project(country.lat, country.lng);
        return (
          <div
            key={country.iso2}
            className="absolute cursor-pointer transition-all duration-300 hover:scale-125 z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -100%)',
              filter: hoveredCountry === country.iso2 
                ? 'drop-shadow(0 8px 16px hsl(var(--primary) / 0.6)) drop-shadow(0 0 12px hsl(var(--accent) / 0.8))' 
                : 'drop-shadow(0 4px 8px hsl(var(--primary) / 0.4)) drop-shadow(0 0 6px hsl(var(--primary) / 0.3))'
            }}
            onMouseEnter={() => setHoveredCountry(country.iso2)}
            onMouseLeave={() => setHoveredCountry(null)}
            tabIndex={0}
            role="button"
            aria-label={`${country.name} community location`}
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                hoveredCountry === country.iso2 
                  ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50' 
                  : 'bg-gradient-to-br from-primary/80 to-accent/60 shadow-md shadow-primary/30'
              }`} 
              style={{
                width: hoveredCountry === country.iso2 ? '20px' : '16px',
                height: hoveredCountry === country.iso2 ? '20px' : '16px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }} />
              <MapPin 
                size={hoveredCountry === country.iso2 ? 28 : 24}
                className={`relative transition-all duration-300 ${
                  hoveredCountry === country.iso2 
                    ? 'text-primary-foreground fill-primary' 
                    : 'text-primary-foreground fill-primary/90'
                }`}
                style={{ filter: 'drop-shadow(0 2px 4px hsl(var(--foreground) / 0.2))' }}
              />
            </div>
          </div>
        );
      })}

      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-primary/30 text-sm font-semibold z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {countries.find(c => c.iso2 === hoveredCountry)?.name}
            </span>
          </div>
        </div>
      )}
      
      {/* Country count overlay */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-primary/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">60 Countries Connected</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMap;