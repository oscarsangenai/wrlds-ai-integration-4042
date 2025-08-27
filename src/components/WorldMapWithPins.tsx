import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import worldMapImage from '../assets/world-map.png';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: 'India', iso2: 'IN', lat: 20.5937, lng: 78.9629 },
  { name: 'United States', iso2: 'US', lat: 39.8283, lng: -98.5795 },
  { name: 'Switzerland', iso2: 'CH', lat: 46.8182, lng: 8.2275 },
  { name: 'United Arab Emirates', iso2: 'AE', lat: 23.4241, lng: 53.8478 },
  { name: 'Mexico', iso2: 'MX', lat: 23.6345, lng: -102.5528 },
  { name: 'Spain', iso2: 'ES', lat: 40.4637, lng: -3.7492 }
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
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl overflow-hidden shadow-2xl border border-primary/20">
      {/* World Map Background Image */}
      <img 
        src={worldMapImage}
        alt="World map showing global community presence"
        className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity"
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
                ? 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))' 
                : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4)) drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))'
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
            <MapPin 
              size={hoveredCountry === country.iso2 ? 32 : 26}
              className={`transition-all duration-300 ${
                hoveredCountry === country.iso2 
                  ? 'text-blue-400 fill-blue-500' 
                  : 'text-red-500 fill-red-600'
              }`}
            />
          </div>
        );
      })}

      {/* Modern Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-primary/30 text-sm font-semibold z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            {countries.find(c => c.iso2 === hoveredCountry)?.name}
          </div>
        </div>
      )}
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default WorldMapWithPins;