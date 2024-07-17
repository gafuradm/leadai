import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ recommendations }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      }

      // Parse recommendations and add markers
      const universities = recommendations.match(/\d+\.\s(.+?),\s(.+?),\s(.+?)\n/g);
      if (universities) {
        universities.forEach(async (uni) => {
          const [, name, city, country] = uni.match(/\d+\.\s(.+?),\s(.+?),\s(.+?)\n/);
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${name}, ${city}, ${country}`)}`);
          const data = await response.json();
          if (data.length > 0) {
            L.marker([data[0].lat, data[0].lon])
              .addTo(mapRef.current)
              .bindPopup(`${name}, ${city}, ${country}`);
          }
        });
      }
    }
  }, [recommendations]);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
}