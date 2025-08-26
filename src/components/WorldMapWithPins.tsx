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
      {/* World Map SVG - More detailed and accurate */}
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        role="img"
        aria-label="World map with community locations"
      >
        {/* Detailed world map outline */}
        <g fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.8">
          {/* North America */}
          <path d="M50 60 Q70 50 100 55 Q130 60 160 70 Q180 80 195 100 Q200 120 190 140 Q180 160 170 180 Q150 190 130 185 Q110 175 90 165 Q70 150 55 130 Q45 110 50 85 Z" />
          
          {/* Greenland */}
          <path d="M200 40 Q220 35 235 45 Q245 55 240 70 Q235 80 225 85 Q210 85 200 75 Q195 60 200 45 Z" />
          
          {/* South America */}
          <path d="M140 200 Q155 195 170 205 Q180 220 185 240 Q190 260 185 280 Q180 300 170 315 Q155 325 145 320 Q135 310 130 295 Q125 275 130 255 Q135 235 140 215 Z" />
          
          {/* Europe */}
          <path d="M370 70 Q390 65 410 70 Q425 75 430 90 Q425 105 415 115 Q400 120 385 115 Q375 105 370 90 Q368 80 370 75 Z" />
          
          {/* Africa */}
          <path d="M360 130 Q380 125 400 135 Q420 145 430 165 Q435 185 430 205 Q425 225 415 245 Q405 260 395 270 Q380 275 365 270 Q355 260 350 245 Q345 225 350 205 Q355 185 360 165 Q358 150 360 135 Z" />
          
          {/* Asia */}
          <path d="M440 60 Q480 55 520 65 Q560 75 600 85 Q640 95 670 105 Q690 115 700 130 Q705 145 700 160 Q690 175 670 180 Q640 185 600 180 Q560 175 520 170 Q480 165 450 155 Q430 145 425 130 Q425 115 430 100 Q435 85 440 70 Z" />
          
          {/* India subcontinent */}
          <path d="M500 140 Q520 135 535 145 Q545 155 540 170 Q535 180 525 185 Q510 185 500 175 Q495 165 495 155 Q495 145 500 140 Z" />
          
          {/* Australia */}
          <path d="M580 240 Q610 235 630 245 Q645 255 640 270 Q635 280 620 285 Q600 285 585 280 Q575 270 575 260 Q575 250 580 245 Z" />
          
          {/* Japan */}
          <path d="M650 110 Q660 105 670 115 Q675 125 670 135 Q665 140 655 140 Q650 135 650 125 Q650 115 650 110 Z" />
          
          {/* UK */}
          <path d="M340 80 Q350 75 355 85 Q355 95 350 100 Q345 100 340 95 Q338 90 340 85 Z" />
          
          {/* Scandinavia */}
          <path d="M380 50 Q395 45 405 55 Q410 65 405 75 Q395 80 385 75 Q375 70 375 60 Q375 50 380 50 Z" />
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
                fill="#dc2626"
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