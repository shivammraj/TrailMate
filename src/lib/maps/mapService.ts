// Server-safe — no 'use client', can run in API routes

import type { CoarseLocation, NearbyPark } from '@/lib/types';

// Mock nearby parks for when Overpass is unavailable
const MOCK_PARKS: NearbyPark[] = [
  { id: '1', name: 'City Nature Reserve', type: 'park', distance: 0.3 },
  { id: '2', name: 'Riverside Trail', type: 'trail', distance: 0.8 },
  { id: '3', name: 'Community Garden', type: 'garden', distance: 1.2 },
];

export const mapService = {
  /**
   * Find nearby parks/trails/gardens using OSM Overpass API.
   * Falls back to mock data gracefully.
   */
  async findNearbyParks(location: CoarseLocation, radiusKm = 2): Promise<NearbyPark[]> {
    try {
      const radiusM = radiusKm * 1000;
      // Overpass query: parks, nature reserves, gardens within radius
      const query = `
        [out:json][timeout:10];
        (
          node["leisure"~"^(park|nature_reserve|garden)$"](around:${radiusM},${location.lat},${location.lng});
          way["leisure"~"^(park|nature_reserve|garden)$"](around:${radiusM},${location.lat},${location.lng});
          way["highway"="footway"]["access"!="private"](around:${radiusM},${location.lat},${location.lng});
        );
        out center 10;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) return MOCK_PARKS;
      
      const data = await response.json();
      const parks: NearbyPark[] = data.elements
        .filter((el: { tags?: Record<string, string>; lat?: number; center?: { lat: number; lon: number }; lon?: number }) => el.tags?.name)
        .slice(0, 5)
        .map((el: { id: number; tags: Record<string, string>; lat?: number; center?: { lat: number; lon: number }; lon?: number }) => {
          const elLat = el.lat ?? el.center?.lat ?? location.lat;
          const elLng = el.lon ?? el.center?.lon ?? location.lng;
          return {
            id: String(el.id),
            name: el.tags.name,
            type: el.tags.leisure ?? 'park',
            distance: calculateDistance(location.lat, location.lng, elLat, elLng),
          };
        })
        .sort((a: NearbyPark, b: NearbyPark) => a.distance - b.distance);
      
      return parks.length > 0 ? parks : MOCK_PARKS;
    } catch {
      return MOCK_PARKS;
    }
  },
};

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
}
