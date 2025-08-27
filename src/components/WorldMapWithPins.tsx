import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import flatWorldMap from '../assets/flat-world-map.jpg';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: 'India', iso2: 'IN', lat: 28.6139, lng: 77.2090 }, // New Delhi
  { name: 'United States', iso2: 'US', lat: 38.9072, lng: -77.0369 }, // Washington D.C.
  { name: 'Switzerland', iso2: 'CH', lat: 46.9481, lng: 7.4474 }, // Bern
  { name: 'United Arab Emirates', iso2: 'AE', lat: 24.4539, lng: 54.3773 }, // Abu Dhabi
  { name: 'Mexico', iso2: 'MX', lat: 19.4326, lng: -99.1332 }, // Mexico City
  { name: 'Spain', iso2: 'ES', lat: 40.4168, lng: -3.7038 } // Madrid
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
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 rounded-xl overflow-hidden shadow-2xl border border-primary/20">
      {/* Flat World Map Background Image */}
      <img 
        src={flatWorldMap}
        alt="Flat design world map showing global community presence"
        className="absolute inset-0 w-full h-full object-cover opacity-70 dark:opacity-60"
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
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${
                hoveredCountry === country.iso2 
                  ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                  : 'bg-red-500 shadow-md shadow-red-500/30'
              } transition-all duration-300`} 
              style={{
                width: hoveredCountry === country.iso2 ? '20px' : '16px',
                height: hoveredCountry === country.iso2 ? '20px' : '16px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }} />
              <MapPin 
                size={hoveredCountry === country.iso2 ? 28 : 24}
                className="relative text-white fill-red-500 transition-all duration-300"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              />
            </div>
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