# TrailMate AI — Outdoor Data Services

This document details the external data services used by the outdoor intelligence layer of TrailMate AI.

## 1. Browser Geolocation API
- **Usage**: Retrieves user location.
- **Privacy Approach**: Emphasizes privacy by limiting accuracy. Only coarse locations (rounded to 2 decimal places, ~1km precision) are ever used or stored. Precise coordinates are never saved to the database.
- **Permission Flow**: Permissions are handled using `navigator.geolocation` and `navigator.permissions`, catching denied/timeout gracefully.

## 2. Open-Meteo
- **Usage**: Fetches current weather conditions (temperature, wind speed, weather code) based on coarse coordinates.
- **Benefits**: Completely free, requires no API key.
- **Caching & Rate Limits**: Results are cached using Next.js caching features (`revalidate: 1800` for 30 min) to minimize unnecessary requests.

## 3. OpenStreetMap Overpass API
- **Usage**: Finds nearby points of interest (POIs) such as parks, nature reserves, gardens, and trails.
- **Query specifics**: Uses a bounding box/radius search to fetch relevant elements with proper timeout and constraints.
- **Fallback**: Includes a set of offline mock parks (e.g., 'City Nature Reserve') if the API is unreachable or rate-limited.

## 4. Nominatim Reverse Geocoding
- **Usage**: Converts coarse coordinates into a human-readable city or town name.
- **Rate Limits**: Strictly adheres to the 1 request per second limit set by Nominatim.
- **Implementation**: Uses fetch with a timeout of 5 seconds and a custom user-agent.

## 5. Mock Data Strategy
All outdoor data services implement robust fallback mechanisms. When offline, API limits are hit, or services are unavailable, the services immediately return typed mock data. This guarantees the application continues to run without crashing, ensuring a seamless user experience during hackathon demos or poor connectivity.

## 6. Privacy Commitment
TrailMate AI is an open-source project that respects user privacy. Precise locations are strictly prohibited from being persisted. Instead, location data is rounded off locally on the client-side before any processing or saving occurs.
