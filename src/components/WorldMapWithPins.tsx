import React, { useState } from 'react';

interface Country {
  name: string;
  iso2: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: 'Netherlands', iso2: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'India', iso2: 'IN', lat: 20.5937, lng: 78.9629 },
  { name: 'United States', iso2: 'US', lat: 39.8283, lng: -98.5795 },
  { name: 'Switzerland', iso2: 'CH', lat: 46.8182, lng: 8.2275 },
  { name: 'United Arab Emirates', iso2: 'AE', lat: 23.4241, lng: 53.8478 },
  { name: 'Mexico', iso2: 'MX', lat: 23.6345, lng: -102.5528 },
  { name: 'Spain', iso2: 'ES', lat: 40.4637, lng: -3.7492 }
];

const WorldMapWithPins: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Simple Mercator projection
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const latRad = (lat * Math.PI) / 180;
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 400;
    return { x, y };
  };

  const handleCountrySelect = (countryCode: string) => {
    console.log('Selected country:', countryCode);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-pink-200 via-purple-200 to-amber-200 rounded-lg overflow-hidden">
      {/* World Map SVG */}
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        role="img"
        aria-label="World map with community locations"
      >
        {/* Simplified world map outline */}
        <path
          d="M158 206c-5-3-13-3-20 2-8 5-12 12-8 16 3 3 11 2 18-2 8-5 13-12 10-16zm-33 25c-6-2-14 0-18 5-5 6-3 13 3 15 6 2 14 0 18-5 5-6 3-13-3-15zm406-85c-8-4-18-2-23 4-6 7-3 16 5 20 8 4 18 2 23-4 6-7 3-16-5-20zm-189 98c-7-3-16-1-21 5-5 6-2 14 5 17 7 3 16 1 21-5 5-6 2-14-5-17z"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
        />
        
        {/* Continental outlines - simplified */}
        <g fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5">
          {/* North America */}
          <path d="M80 80 L180 85 L190 120 L170 160 L120 170 L90 140 Z" />
          {/* South America */}
          <path d="M150 180 L180 185 L185 250 L170 280 L155 275 L145 220 Z" />
          {/* Europe */}
          <path d="M380 70 L420 75 L425 95 L410 110 L385 105 Z" />
          {/* Africa */}
          <path d="M370 120 L420 125 L430 200 L415 250 L385 245 L375 180 Z" />
          {/* Asia */}
          <path d="M450 60 L650 70 L680 140 L650 180 L500 170 L440 120 Z" />
          {/* Australia */}
          <path d="M600 220 L650 225 L655 245 L635 255 L605 250 Z" />
        </g>

        {/* Country Pins */}
        {countries.map((country) => {
          const pos = project(country.lat, country.lng);
          return (
            <g key={country.iso2}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={hoveredCountry === country.iso2 ? "8" : "6"}
                fill="hsl(var(--destructive))"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:scale-110 drop-shadow-sm"
                style={{ filter: hoveredCountry === country.iso2 ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
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
              />
            </g>
          );
        })}
      </svg>

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