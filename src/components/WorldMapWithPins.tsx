import React from 'react';
import { Globe } from 'lucide-react';
import professionalWorldMap from '../assets/professional-world-map.png';

interface Continent {
  name: string;
  lat: number;
  lng: number;
}

const continents: Continent[] = [
  { name: 'North America', lat: 45.0, lng: -100.0 },
  { name: 'South America', lat: -15.0, lng: -60.0 },
  { name: 'Europe', lat: 54.0, lng: 15.0 },
  { name: 'Africa', lat: 0.0, lng: 20.0 },
  { name: 'Asia', lat: 30.0, lng: 100.0 },
  { name: 'Australia', lat: -25.0, lng: 135.0 }
];

const connections = [
  [0, 1], // North America to South America
  [0, 2], // North America to Europe
  [0, 4], // North America to Asia
  [1, 2], // South America to Europe
  [1, 3], // South America to Africa
  [2, 3], // Europe to Africa
  [2, 4], // Europe to Asia
  [3, 4], // Africa to Asia
  [4, 5], // Asia to Australia
  [2, 5]  // Europe to Australia
];

const WorldMapWithPins: React.FC = () => {
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
        alt="Interactive world map showing global network connections"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ aspectRatio: '16/9' }}
      />
      
      {/* SVG Network Web */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ aspectRatio: '16/9' }}>
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="cyan" stopOpacity="0.8" />
            <stop offset="50%" stopColor="blue" stopOpacity="0.6" />
            <stop offset="100%" stopColor="cyan" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feMorphology operator="dilate" radius="2"/>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        {connections.map(([fromIndex, toIndex], index) => {
          const from = project(continents[fromIndex].lat, continents[fromIndex].lng);
          const to = project(continents[toIndex].lat, continents[toIndex].lng);
          
          return (
            <line
              key={`connection-${index}`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              filter="url(#glow)"
              className="animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '3s'
              }}
            />
          );
        })}
        
        {/* Continent Nodes */}
        {continents.map((continent, index) => {
          const pos = project(continent.lat, continent.lng);
          return (
            <circle
              key={`node-${index}`}
              cx={`${pos.x}%`}
              cy={`${pos.y}%`}
              r="8"
              fill="cyan"
              stroke="white"
              strokeWidth="2"
              filter="url(#glow)"
              className="animate-pulse"
              style={{
                animationDelay: `${index * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          );
        })}
      </svg>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none"></div>
      
      {/* Network info overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-cyan-400/20 text-xs font-medium z-20">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-300">Global Network Connected</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapWithPins;