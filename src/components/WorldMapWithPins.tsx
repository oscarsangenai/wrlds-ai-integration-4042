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
  // North America
  { name: 'United States', iso2: 'US', lat: 38.9072, lng: -77.0369 },
  { name: 'Canada', iso2: 'CA', lat: 45.4215, lng: -75.6972 },
  { name: 'Mexico', iso2: 'MX', lat: 19.4326, lng: -99.1332 },
  
  // Europe
  { name: 'United Kingdom', iso2: 'GB', lat: 51.5074, lng: -0.1278 },
  { name: 'Germany', iso2: 'DE', lat: 52.5200, lng: 13.4050 },
  { name: 'France', iso2: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Netherlands', iso2: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'Switzerland', iso2: 'CH', lat: 46.9481, lng: 7.4474 },
  { name: 'Spain', iso2: 'ES', lat: 40.4168, lng: -3.7038 },
  { name: 'Italy', iso2: 'IT', lat: 41.9028, lng: 12.4964 },
  { name: 'Sweden', iso2: 'SE', lat: 59.3293, lng: 18.0686 },
  { name: 'Norway', iso2: 'NO', lat: 59.9139, lng: 10.7522 },
  { name: 'Denmark', iso2: 'DK', lat: 55.6761, lng: 12.5683 },
  { name: 'Finland', iso2: 'FI', lat: 60.1699, lng: 24.9384 },
  { name: 'Poland', iso2: 'PL', lat: 52.2297, lng: 21.0122 },
  { name: 'Austria', iso2: 'AT', lat: 48.2082, lng: 16.3738 },
  { name: 'Belgium', iso2: 'BE', lat: 50.8503, lng: 4.3517 },
  { name: 'Ireland', iso2: 'IE', lat: 53.3498, lng: -6.2603 },
  { name: 'Portugal', iso2: 'PT', lat: 38.7223, lng: -9.1393 },
  
  // Asia-Pacific
  { name: 'India', iso2: 'IN', lat: 28.6139, lng: 77.2090 },
  { name: 'China', iso2: 'CN', lat: 39.9042, lng: 116.4074 },
  { name: 'Japan', iso2: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Singapore', iso2: 'SG', lat: 1.3521, lng: 103.8198 },
  { name: 'Australia', iso2: 'AU', lat: -35.2809, lng: 149.1300 },
  { name: 'New Zealand', iso2: 'NZ', lat: -41.2924, lng: 174.7787 },
  { name: 'South Korea', iso2: 'KR', lat: 37.5665, lng: 126.9780 },
  { name: 'Thailand', iso2: 'TH', lat: 13.7563, lng: 100.5018 },
  { name: 'Malaysia', iso2: 'MY', lat: 3.1390, lng: 101.6869 },
  { name: 'Philippines', iso2: 'PH', lat: 14.5995, lng: 120.9842 },
  { name: 'Indonesia', iso2: 'ID', lat: -6.2088, lng: 106.8456 },
  { name: 'Vietnam', iso2: 'VN', lat: 21.0285, lng: 105.8542 },
  { name: 'Taiwan', iso2: 'TW', lat: 25.0330, lng: 121.5654 },
  { name: 'Hong Kong', iso2: 'HK', lat: 22.3193, lng: 114.1694 },
  
  // Middle East & Africa
  { name: 'United Arab Emirates', iso2: 'AE', lat: 24.4539, lng: 54.3773 },
  { name: 'Saudi Arabia', iso2: 'SA', lat: 24.7136, lng: 46.6753 },
  { name: 'Israel', iso2: 'IL', lat: 31.7683, lng: 35.2137 },
  { name: 'South Africa', iso2: 'ZA', lat: -25.7479, lng: 28.2293 },
  { name: 'Nigeria', iso2: 'NG', lat: 9.0765, lng: 7.3986 },
  { name: 'Kenya', iso2: 'KE', lat: -1.2921, lng: 36.8219 },
  { name: 'Egypt', iso2: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Morocco', iso2: 'MA', lat: 34.0209, lng: -6.8416 },
  
  // South America
  { name: 'Brazil', iso2: 'BR', lat: -15.8267, lng: -47.9218 },
  { name: 'Argentina', iso2: 'AR', lat: -34.6118, lng: -58.3960 },
  { name: 'Chile', iso2: 'CL', lat: -33.4489, lng: -70.6693 },
  { name: 'Colombia', iso2: 'CO', lat: 4.7110, lng: -74.0721 },
  { name: 'Peru', iso2: 'PE', lat: -12.0464, lng: -77.0428 },
  
  // Eastern Europe & Russia
  { name: 'Russia', iso2: 'RU', lat: 55.7558, lng: 37.6176 },
  { name: 'Ukraine', iso2: 'UA', lat: 50.4501, lng: 30.5234 },
  { name: 'Czech Republic', iso2: 'CZ', lat: 50.0755, lng: 14.4378 },
  { name: 'Hungary', iso2: 'HU', lat: 47.4979, lng: 19.0402 },
  { name: 'Romania', iso2: 'RO', lat: 44.4268, lng: 26.1025 },
  { name: 'Bulgaria', iso2: 'BG', lat: 42.6977, lng: 23.3219 },
  { name: 'Croatia', iso2: 'HR', lat: 45.8150, lng: 15.9819 },
  { name: 'Serbia', iso2: 'RS', lat: 44.7866, lng: 20.4489 },
  
  // Additional Countries
  { name: 'Turkey', iso2: 'TR', lat: 39.9334, lng: 32.8597 },
  { name: 'Greece', iso2: 'GR', lat: 37.9838, lng: 23.7275 },
  { name: 'Cyprus', iso2: 'CY', lat: 35.1264, lng: 33.4299 },
  { name: 'Malta', iso2: 'MT', lat: 35.8997, lng: 14.5146 },
  { name: 'Luxembourg', iso2: 'LU', lat: 49.6116, lng: 6.1319 },
  { name: 'Estonia', iso2: 'EE', lat: 59.4370, lng: 24.7536 },
  { name: 'Latvia', iso2: 'LV', lat: 56.9496, lng: 24.1052 },
  { name: 'Lithuania', iso2: 'LT', lat: 54.6872, lng: 25.2797 },
  { name: 'Slovenia', iso2: 'SI', lat: 46.0569, lng: 14.5058 },
  { name: 'Slovakia', iso2: 'SK', lat: 48.1486, lng: 17.1077 },
  { name: 'Bosnia and Herzegovina', iso2: 'BA', lat: 43.8563, lng: 18.4131 },
  { name: 'Montenegro', iso2: 'ME', lat: 42.4304, lng: 19.2594 },
  { name: 'North Macedonia', iso2: 'MK', lat: 41.9973, lng: 21.4280 },
  { name: 'Albania', iso2: 'AL', lat: 41.3275, lng: 19.8187 }
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
          <span className="text-muted-foreground">60+ Countries Connected</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapWithPins;