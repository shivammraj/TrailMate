'use client';

import type { CoarseLocation, LocationContext, NearbyPark } from '@/lib/types';

export const locationService = {
  /**
   * Request user's location with permission handling.
   * Returns coarse location (rounded to 2 decimal places for privacy).
   */
  async getLocation(): Promise<LocationContext> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return { available: false };
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000, // 5 min cache
          enableHighAccuracy: false, // Don't need high accuracy, saves battery
        });
      });

      const coarseLocation: CoarseLocation = {
        lat: Math.round(position.coords.latitude * 100) / 100, // Round to ~1km precision
        lng: Math.round(position.coords.longitude * 100) / 100,
        accuracy: position.coords.accuracy,
        city: undefined, // Will be fetched separately via reverse geocode if needed
      };

      return {
        available: true,
        coarseLocation,
      };
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            console.info('[Location] User denied location access');
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            console.info('[Location] Position unavailable');
            break;
          case GeolocationPositionError.TIMEOUT:
            console.info('[Location] Location request timed out');
            break;
        }
      }
      return { available: false };
    }
  },

  /**
   * Get city name from coordinates using Nominatim (OSM reverse geocode, free).
   * Rate limit: 1 req/sec. Cache results.
   */
  async getCityName(lat: number, lng: number): Promise<string | undefined> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
        {
          headers: { 'User-Agent': 'TrailMateAI/1.0 (opensource hackathon project)' },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (!response.ok) return undefined;
      const data = await response.json();
      return data.address?.city ?? data.address?.town ?? data.address?.village ?? undefined;
    } catch {
      return undefined;
    }
  },

  /**
   * Calculate distance between two coordinates in km.
   * Uses Haversine formula.
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  },

  /**
   * Check if location permission is already granted.
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) return 'prompt';
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch {
      return 'prompt';
    }
  },
};
