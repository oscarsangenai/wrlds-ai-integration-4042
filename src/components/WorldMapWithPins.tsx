import React, { useState } from 'react';
import { MapPin, Globe } from 'lucide-react';
import professionalWorldMap from '../assets/professional-world-map.png';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  // Selected countries with pins
  { name: 'USA', iso2: 'US', lat: 39.8283, lng: -98.5795 },
  { name: 'Canada', iso2: 'CA', lat: 56.1304, lng: -106.3468 },
  { name: 'Europe', iso2: 'EU', lat: 54.5260, lng: 15.2551 },
  { name: 'India', iso2: 'IN', lat: 20.5937, lng: 78.9629 },
  { name: 'Australia', iso2: 'AU', lat: -25.2744, lng: 133.7751 },
  { name: 'Dubai', iso2: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'Netherlands', iso2: 'NL', lat: 52.1326, lng: 5.2913 },
  { name: 'Geneva', iso2: 'CH', lat: 46.2044, lng: 6.1432 },
  { name: 'South America', iso2: 'SA', lat: -8.7832, lng: -55.4915 }
];

const WorldMapWithPins: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Enhanced Mercator projection with adjustable positioning
  const project = (lat: number, lng: number) => {
    // Base projection
    const baseX = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const baseY = 50 - (mercatorY * 180) / (Math.PI * 5.5);
    
    // Apply adjustments: horizontally closer by 20%, vertically expand by 30%
    const centerX = 50;
    const centerY = 50;
    const adjustedX = centerX + (baseX - centerX) * 0.8; // 20% closer horizontally
    const adjustedY = centerY + (baseY - centerY) * 1.3; // 30% more spread vertically
    
    return { x: Math.max(0, Math.min(100, adjustedX)), y: Math.max(0, Math.min(100, adjustedY)) };
  };

  const handleCountrySelect = (countryCode: string) => {
    console.log('Selected country:', countryCode);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm">
      {/* Professional World Map Background Image */}
      <img 
        src={professionalWorldMap}
        alt="Professional world map showing global community presence in 60 countries"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      
      {/* Push Pin Icons */}
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
            onClick={() => handleCountrySelect(country.iso2)}
            tabIndex={0}
            role="button"
            aria-label={`${country.name} community location`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCountrySelect(country.iso2);
              }
            }}
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                hoveredCountry === country.iso2 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                  : 'bg-cyan-500 shadow-md shadow-cyan-500/30'
              }`} 
              style={{
                width: hoveredCountry === country.iso2 ? '12px' : '8px',
                height: hoveredCountry === country.iso2 ? '12px' : '8px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }} />
              <MapPin 
                size={hoveredCountry === country.iso2 ? 20 : 16}
                className={`relative transition-all duration-300 ${
                  hoveredCountry === country.iso2 
                    ? 'text-white fill-cyan-400' 
                    : 'text-white fill-cyan-500'
                }`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
              />
            </div>
          </div>
        );
      })}

      {/* Modern Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-cyan-400/30 text-sm font-semibold z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-300">
              {countries.find(c => c.iso2 === hoveredCountry)?.name}
            </span>
          </div>
        </div>
      )}
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
      
      {/* Member count overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-cyan-400/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300">60 Countries Connected</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapWithPins;