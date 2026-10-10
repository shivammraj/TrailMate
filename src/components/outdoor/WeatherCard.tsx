'use client';

import React, { useState, useEffect } from 'react';
import { fetchTrailWeather, WeatherData } from '@/lib/weather';
import { Search, Wind, Droplets, Sun, Activity, ShieldCheck, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

const POPULAR_INDIAN_DESTINATIONS = [
  { name: 'Manali', label: '🏔 Manali' },
  { name: 'Dharamshala', label: '🌲 Triund (Dharamshala)' },
  { name: 'Uttarkashi', label: '🌸 Valley of Flowers' },
  { name: 'Chikmagalur', label: '🌿 Kudremukh' },
  { name: 'Munnar', label: '🍃 Munnar' },
  { name: 'Mahabaleshwar', label: '🌄 Western Ghats' },
  { name: 'Leh', label: '🏔 Leh Ladakh' }
];

export default function WeatherCard() {
  const [cityInput, setCityInput] = useState('Manali');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const loadWeather = async (query: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTrailWeather(query);
      setWeather(data);
    } catch (err) {
      setError('Could not retrieve weather for this location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather('Manali');
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (cityInput.trim()) {
        loadWeather(cityInput);
      } else {
        setError('Please enter an Indian city or trail location');
      }
    }
  };

  const handleSearchSubmit = () => {
    if (cityInput.trim()) {
      loadWeather(cityInput);
    } else {
      setError('Please enter an Indian city or trail location');
    }
  };

  const getSafetyBadgeClass = (rating: WeatherData['safetyRating']) => {
    switch (rating) {
      case 'Excellent': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Good': return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Caution': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Hazardous': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-stone-500/20 text-stone-300 border-stone-500/40';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 space-y-5 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">Real-Time Indian Trail Weather</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              LIVE API
            </span>
          </div>
          <h2 className="text-2xl font-outfit font-bold text-stone-100 mt-1 flex items-center gap-2">
            Indian Trail Weather & Safety Index
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <input
              id="cityInput"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search Indian city or trail (e.g. Manali, Munnar)..."
              className="w-full bg-stone-900/80 border border-white/15 focus:border-emerald-500/60 rounded-xl px-3.5 py-2 pl-9 text-sm text-stone-100 placeholder-stone-400 outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={handleSearchSubmit}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Check'}
          </button>
        </div>
      </div>

      {/* Quick Location Pills - Popular Indian Hiking Destinations */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-stone-400 font-medium text-xs whitespace-nowrap">Popular Indian Trails:</span>
        {POPULAR_INDIAN_DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            onClick={() => {
              setCityInput(dest.name);
              loadWeather(dest.name);
            }}
            className={`px-3 py-1 rounded-lg transition-all border text-xs whitespace-nowrap ${
              weather?.city.toLowerCase().includes(dest.name.toLowerCase())
                ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50 font-medium'
                : 'bg-stone-900/50 text-stone-300 border-white/10 hover:bg-stone-800 hover:border-white/20'
            }`}
          >
            {dest.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div id="error" className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Weather Card Display */}
      {weather && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Main Temperature & Condition Box */}
            <div className="md:col-span-7 glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border border-white/10 bg-gradient-to-br from-stone-900/90 to-stone-950/90">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span id="city" className="text-lg font-outfit font-semibold text-white">
                      {weather.city}, {weather.country}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">{weather.region} • Updated {weather.lastUpdated}</div>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setUnit('C')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                      unit === 'C' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit('F')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                      unit === 'F' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <img
                    id="icon"
                    src={weather.conditionIcon}
                    alt={weather.condition}
                    className="w-16 h-16 drop-shadow-md object-contain"
                  />
                  <div>
                    <div id="temp" className="text-3xl md:text-4xl font-outfit font-extrabold text-white tracking-tight">
                      {unit === 'C' ? `${weather.temp_c}°C` : `${weather.temp_f}°F`}
                    </div>
                    <div id="condition" className="text-sm font-medium text-stone-300">
                      {weather.condition}
                    </div>
                  </div>
                </div>

                {/* Safety Score Dial */}
                <div className="text-right flex flex-col items-end">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-mono">Trail Safety Score</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-emerald-400">{weather.safetyScore}</span>
                    <span className="text-xs text-stone-400">/100</span>
                  </div>
                  <span className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSafetyBadgeClass(weather.safetyRating)}`}>
                    <ShieldCheck className="w-3 h-3" />
                    {weather.safetyRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Humidity</span>
                </div>
                <div id="humidity" className="text-xl font-bold font-mono text-stone-100 mt-1">
                  {weather.humidity}%
                </div>
                <div className="text-[10px] text-stone-400">Dew point relative</div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Wind Speed</span>
                </div>
                <div id="wind" className="text-xl font-bold font-mono text-stone-100 mt-1">
                  {weather.wind_kph} <span className="text-xs font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-stone-400">Heading {weather.wind_dir}</div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>UV Index</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {weather.uv} <span className="text-xs font-normal text-stone-400">/ 12</span>
                </div>
                <div className="text-[10px] text-amber-400/80">{weather.uv >= 6 ? 'High Exposure' : 'Moderate'}</div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Air Quality</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  AQI {weather.aqi}
                </div>
                <div className="text-[10px] text-emerald-400">{weather.aqiStatus}</div>
              </div>
            </div>
          </div>

          {/* Recommendations Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-stone-900/80 border border-emerald-800/40 space-y-1.5">
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <span>🇮🇳 Indian Hiker Safety Advisory</span>
            </div>
            <div className="space-y-1">
              {weather.recommendations.map((rec, i) => (
                <p key={i} className="text-xs text-stone-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
