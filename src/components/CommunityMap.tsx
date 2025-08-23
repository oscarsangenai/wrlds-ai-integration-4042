import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CommunityMapProps {
  className?: string;
}

const CommunityMap: React.FC<CommunityMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Country coordinates for pins
  const countries = [
    { name: 'Netherlands', coordinates: [5.2913, 52.1326] },
    { name: 'India', coordinates: [78.9629, 20.5937] },
    { name: 'United States', coordinates: [-95.7129, 37.0902] },
    { name: 'Switzerland', coordinates: [8.2275, 46.8182] },
    { name: 'United Arab Emirates', coordinates: [53.8478, 23.4241] },
    { name: 'Mexico', coordinates: [-102.5528, 23.6345] },
    { name: 'Spain', coordinates: [-3.7492, 40.4637] }
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use placeholder token - should be replaced with environment variable
    const accessToken = process.env.MAPBOX_ACCESS_TOKEN || 'your-mapbox-token-here';
    
    // Only initialize if we have a proper token
    if (accessToken === 'your-mapbox-token-here') {
      // Fallback display when no token is provided
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-muted/30 rounded-lg border">
            <div class="text-center p-8">
              <h3 class="text-lg font-semibold mb-2">Global Community Map</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Interactive world map showing our presence in 7 countries
              </p>
              <div class="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                ${countries.map(country => `<div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-primary rounded-full"></div>
                  ${country.name}
                </div>`).join('')}
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [15, 30], // Centered to show all pins
      zoom: 1.5,
      interactive: true
    });

    map.current.on('load', () => {
      // Add markers for each country
      countries.forEach((country) => {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg cursor-pointer';
        markerElement.setAttribute('aria-label', `Pin for ${country.name}`);
        
        // Create popup for hover
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: 'community-map-popup'
        }).setText(country.name);

        // Create marker
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat(country.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);

        // Show popup on hover
        markerElement.addEventListener('mouseenter', () => {
          popup.addTo(map.current!);
        });

        markerElement.addEventListener('mouseleave', () => {
          popup.remove();
        });
      });

      // Fit map to show all markers
      const bounds = new mapboxgl.LngLatBounds();
      countries.forEach(country => bounds.extend(country.coordinates as [number, number]));
      map.current!.fitBounds(bounds, { padding: 50 });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div 
      className={`w-full h-80 rounded-lg overflow-hidden shadow-lg ${className}`}
      role="img"
      aria-label="Interactive world map showing Gen AI Global community presence in 7 countries"
    >
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default CommunityMap;