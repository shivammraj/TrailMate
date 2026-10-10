import type { WeatherData } from '@/lib/types';

// Open-Meteo weather condition codes mapped to descriptions
// https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODES: Record<number, { condition: string; isGoodForOutdoors: boolean }> = {
  0: { condition: 'Clear Sky', isGoodForOutdoors: true },
  1: { condition: 'Mainly Clear', isGoodForOutdoors: true },
  2: { condition: 'Partly Cloudy', isGoodForOutdoors: true },
  3: { condition: 'Overcast', isGoodForOutdoors: true },
  45: { condition: 'Foggy', isGoodForOutdoors: false },
  48: { condition: 'Icy Fog', isGoodForOutdoors: false },
  51: { condition: 'Light Drizzle', isGoodForOutdoors: false },
  61: { condition: 'Light Rain', isGoodForOutdoors: false },
  63: { condition: 'Moderate Rain', isGoodForOutdoors: false },
  65: { condition: 'Heavy Rain', isGoodForOutdoors: false },
  71: { condition: 'Light Snow', isGoodForOutdoors: false },
  80: { condition: 'Rain Showers', isGoodForOutdoors: false },
  95: { condition: 'Thunderstorm', isGoodForOutdoors: false },
};

const MOCK_WEATHER: WeatherData = {
  temperature: 22,
  condition: 'Partly Cloudy',
  windSpeed: 12,
  isGoodForOutdoors: true,
  description: 'Perfect conditions for an outdoor adventure!',
};

export const weatherService = {
  /**
   * Fetch current weather from Open-Meteo (free, no API key).
   */
  async getWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.searchParams.set('latitude', lat.toString());
      url.searchParams.set('longitude', lng.toString());
      url.searchParams.set('current', 'temperature_2m,wind_speed_10m,weather_code');
      url.searchParams.set('temperature_unit', 'celsius');
      url.searchParams.set('wind_speed_unit', 'kmh');
      url.searchParams.set('forecast_days', '1');

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 1800 }, // Cache for 30 minutes in Next.js
      });

      if (!response.ok) return MOCK_WEATHER;
      
      const data = await response.json();
      const current = data.current;
      const code = current.weather_code as number;
      const weatherInfo = WEATHER_CODES[code] ?? { condition: 'Unknown', isGoodForOutdoors: true };
      const temp = Math.round(current.temperature_2m);
      const wind = Math.round(current.wind_speed_10m);
      
      return {
        temperature: temp,
        condition: weatherInfo.condition,
        windSpeed: wind,
        isGoodForOutdoors: weatherInfo.isGoodForOutdoors && temp > 5 && wind < 50,
        description: generateWeatherDescription(weatherInfo.condition, temp, weatherInfo.isGoodForOutdoors),
      };
    } catch {
      return MOCK_WEATHER;
    }
  },

  getMockWeather(): WeatherData {
    return MOCK_WEATHER;
  },
};

function generateWeatherDescription(condition: string, temp: number, isGood: boolean): string {
  if (!isGood) return `${condition} — consider a different time for outdoor activities`;
  if (temp > 28) return `Warm at ${temp}°C — bring water!`;
  if (temp < 10) return `Cool at ${temp}°C — dress in layers`;
  return `${temp}°C, ${condition} — great conditions for an outdoor mission!`;
}
