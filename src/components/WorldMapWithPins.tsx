import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import professionalWorldMap from '../assets/professional-world-map.png';

interface Country {
  name: string;
  lat: number;
  lng: number;
}

const countries: Country[] = [
  { name: 'India', lat: 20.5937, lng: 78.9629 },
  { name: 'China', lat: 35.8617, lng: 104.1954 },
  { name: 'United States', lat: 39.8283, lng: -98.5795 },
  { name: 'Indonesia', lat: -0.7893, lng: 113.9213 },
  { name: 'Pakistan', lat: 30.3753, lng: 69.3451 },
  { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
  { name: 'Bangladesh', lat: 23.6850, lng: 90.3563 },
  { name: 'Russia', lat: 61.5240, lng: 105.3188 },
  { name: 'Mexico', lat: 23.6345, lng: -102.5528 },
  { name: 'Japan', lat: 36.2048, lng: 138.2529 },
  { name: 'Philippines', lat: 12.8797, lng: 121.7740 },
  { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
  { name: 'Iran', lat: 32.4279, lng: 53.6880 },
  { name: 'Turkey', lat: 38.9637, lng: 35.2433 },
  { name: 'Germany', lat: 51.1657, lng: 10.4515 },
  { name: 'Thailand', lat: 15.8700, lng: 100.9925 },
  { name: 'France', lat: 46.6034, lng: 1.8883 },
  { name: 'United Kingdom', lat: 55.3781, lng: -3.4360 },
  { name: 'Italy', lat: 41.8719, lng: 12.5674 },
  { name: 'Myanmar', lat: 21.9162, lng: 95.9560 },
  { name: 'South Korea', lat: 35.9078, lng: 127.7669 },
  { name: 'Colombia', lat: 4.5709, lng: -74.2973 },
  { name: 'Spain', lat: 40.4637, lng: -3.7492 },
  { name: 'Argentina', lat: -38.4161, lng: -63.6167 },
  { name: 'Netherlands', lat: 52.1326, lng: 5.2913 },
  { name: 'Iraq', lat: 33.2232, lng: 43.6793 },
  { name: 'Poland', lat: 51.9194, lng: 19.1451 },
  { name: 'Canada', lat: 56.1304, lng: -106.3468 },
  { name: 'Ukraine', lat: 48.3794, lng: 31.1656 },
  { name: 'Afghanistan', lat: 33.9391, lng: 67.7100 },
  { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792 },
  { name: 'Uzbekistan', lat: 41.3775, lng: 64.5853 },
  { name: 'Peru', lat: -9.1900, lng: -75.0152 },
  { name: 'Malaysia', lat: 4.2105, lng: 101.9758 },
  { name: 'Yemen', lat: 15.5527, lng: 48.5164 },
  { name: 'Nepal', lat: 28.3949, lng: 84.1240 },
  { name: 'North Korea', lat: 40.3399, lng: 127.5101 },
  { name: 'Australia', lat: -25.2744, lng: 133.7751 },
  { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718 },
  { name: 'Chile', lat: -35.6751, lng: -71.5430 },
  { name: 'Kazakhstan', lat: 48.0196, lng: 66.9237 },
  { name: 'Syria', lat: 34.8021, lng: 38.9968 },
  { name: 'Cambodia', lat: 12.5657, lng: 104.9910 },
  { name: 'Ecuador', lat: -1.8312, lng: -78.1834 },
  { name: 'Venezuela', lat: 6.4238, lng: -66.5897 },
  { name: 'Guatemala', lat: 15.7835, lng: -90.2308 },
  { name: 'Cuba', lat: 21.5218, lng: -77.7812 },
  { name: 'Bolivia', lat: -16.2902, lng: -63.5887 },
  { name: 'Greece', lat: 39.0742, lng: 21.8243 },
  { name: 'Portugal', lat: 39.3999, lng: -8.2245 },
  { name: 'Czechia', lat: 49.8175, lng: 15.4730 },
  { name: 'Sweden', lat: 60.1282, lng: 18.6435 },
  { name: 'Hungary', lat: 47.1625, lng: 19.5033 },
  { name: 'Belarus', lat: 53.7098, lng: 27.9534 },
  { name: 'Austria', lat: 47.5162, lng: 14.5501 },
  { name: 'Switzerland', lat: 46.8182, lng: 8.2275 },
  { name: 'Serbia', lat: 44.0165, lng: 21.0059 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'Israel', lat: 31.0461, lng: 34.8516 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 }
];

const WorldMapWithPins: React.FC = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  // Map dimensions for coordinate conversion
  const MAP_WIDTH = 1024;
  const MAP_HEIGHT = 576;

  // Equirectangular projection coordinate conversion
  const project = (lat: number, lng: number) => {
    const x = (lng + 180) * (MAP_WIDTH / 360);
    const y = (90 - lat) * (MAP_HEIGHT / 180);
    
    // Convert to percentage for responsive positioning
    const xPercent = (x / MAP_WIDTH) * 100;
    const yPercent = (y / MAP_HEIGHT) * 100;
    
    return { 
      x: Math.max(0, Math.min(100, xPercent)), 
      y: Math.max(0, Math.min(100, yPercent)) 
    };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-primary/20 backdrop-blur-sm">
      {/* World Map Background Image */}
      <img 
        src={professionalWorldMap}
        alt="Interactive world map showing global community presence in 65 countries"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ aspectRatio: '16/9' }}
      />
      
      {/* Static Country Pins */}
      {countries.map((country, index) => {
        const pos = project(country.lat, country.lng);
        return (
          <div
            key={`${country.name}-${index}`}
            className="absolute cursor-pointer transition-all duration-300 hover:scale-150 z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredCountry(country.name)}
            onMouseLeave={() => setHoveredCountry(null)}
            role="button"
            aria-label={`${country.name} community location`}
            tabIndex={0}
          >
            <div 
              className={`rounded-full transition-all duration-300 ${
                hoveredCountry === country.name 
                  ? 'bg-cyan-300 shadow-lg shadow-cyan-300/50' 
                  : 'bg-cyan-500 shadow-md shadow-cyan-500/30'
              }`}
              style={{
                width: '8px',
                height: '8px',
                border: '1px solid #00FFFF'
              }}
            />
          </div>
        );
      })}

      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-cyan-400/30 text-sm font-semibold z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-300">{hoveredCountry}</span>
          </div>
        </div>
      )}
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
      
      {/* Member count overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-cyan-400/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300">65 Countries Connected</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapWithPins;