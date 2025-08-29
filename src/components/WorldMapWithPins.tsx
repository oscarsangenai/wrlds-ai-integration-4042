import React, { useState } from 'react';
import { MapPin, Globe } from 'lucide-react';
import flatWorldMap from '../assets/flat-world-map.jpg';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  // Selected countries with pins
  { name: 'United States', iso2: 'US', lat: 38.9072, lng: -77.0369 },
  { name: 'Canada', iso2: 'CA', lat: 45.4215, lng: -75.6972 },
  { name: 'Europe', iso2: 'EU', lat: 50.1109, lng: 8.6821 }, // Central Europe
  { name: 'India', iso2: 'IN', lat: 28.6139, lng: 77.2090 },
  { name: 'Australia', iso2: 'AU', lat: -35.2809, lng: 149.1300 },
  { name: 'United Arab Emirates', iso2: 'AE', lat: 24.4539, lng: 54.3773 }, // Dubai
  { name: 'Netherlands', iso2: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'Switzerland', iso2: 'CH', lat: 46.9481, lng: 7.4474 } // Geneva
];

const WorldMapWithPins: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Enhanced Mercator projection with better accuracy
  const project = (lat: number, lng: number) => {
    // Adjust for better map alignment
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 50 - (mercatorY * 180) / (Math.PI * 5.5); // Adjusted scaling for better accuracy
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleCountrySelect = (countryCode: string) => {
    console.log('Selected country:', countryCode);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm">
      {/* Flat World Map Background Image */}
      <img 
        src={flatWorldMap}
        alt="Flat design world map showing global community presence in 60+ countries"
        className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-overlay"
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

      {/* Modern Tooltip */}
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
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
      
      {/* Member count overlay */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-primary/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">60 Countries connected</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapWithPins;