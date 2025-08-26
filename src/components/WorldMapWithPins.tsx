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
    // Convert to radians
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    
    // Enhanced projection with better scaling
    const x = ((lng + 180) / 360) * 800;
    const y = (1 - (Math.log(Math.tan(Math.PI / 4 + latRad / 2)) / Math.PI)) * 200 + 100;
    
    return { x, y };
  };

  const handleCountrySelect = (countryCode: string) => {
    console.log('Selected country:', countryCode);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-xl overflow-hidden shadow-xl border border-slate-200/50">
      {/* Modern overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-200/20 pointer-events-none" />
      
      {/* World Map Background Image */}
      <img 
        src={worldMapImage}
        alt="World map"
        className="absolute inset-0 w-full h-full object-cover opacity-90 filter contrast-110 saturate-110"
      />
      
      {/* Push Pin Icons */}
      {countries.map((country) => {
        const pos = project(country.lat, country.lng);
        return (
          <div
            key={country.iso2}
            className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              left: `${(pos.x / 800) * 100}%`,
              top: `${(pos.y / 400) * 100}%`,
              transform: 'translate(-50%, -100%)',
              filter: hoveredCountry === country.iso2 ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
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
              size={hoveredCountry === country.iso2 ? 28 : 24}
              className="text-red-500 fill-red-500 drop-shadow-lg"
              strokeWidth={2}
            />
          </div>
        );
      })}

      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border text-sm font-medium">
          {countries.find(c => c.iso2 === hoveredCountry)?.name}
        </div>
      )}
    </div>
  );
};

export default WorldMapWithPins;