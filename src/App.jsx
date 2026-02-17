import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Thermometer,
  Eye,
  Gauge,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Navigation,
  Calendar,
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from '

// Weather Animation Components
const RainAnimation = () => {
  const drops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${0.5 + Math.random() * 0.5}s`
  }));

  return (
    <div className="rain-container">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration
          }}
        />
      ))}
    </div>
  );
};

const SunAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 right-10">
      <div className="sun-rays" />
      <div className="sun-core" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-32 h-12 bg-white/10 rounded-full"
        style={{
          top: `${20 + i * 15}%`,
          left: `${-10 + i * 5}%`,
          animationDelay: `${i * 0.5}s`
        }}
      />
    ))}
  </div>
);

const CloudAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/20 rounded-full"
        style={{
          width: `${100 + i * 40}px`,
          height: `${40 + i * 15}px`,
          top: `${10 + i * 12}%`,
          left: `${-20 + i * 15}%`
        }}
        animate={{
          x: ['0%', '120%'],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: 'linear',
          delay: i * 2
        }}
      />
    ))}
  </div>
);

// Weather Data Hook
const useWeatherData = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (lat, lon, cityName = null) => {
    setLoading(true);
    setError(null);

    try {
      // Current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`
      );

      if (!weatherRes.ok) throw new Error('Failed to fetch weather');
      const weatherData = await weatherRes.json();

      // Get city name if not provided
      let locationName = cityName;
      if (!locationName) {
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          const geoData = await geoRes.json();
          locationName = geoData.city || geoData.locality || '
        } catch {
          locationName = '
        }
      }

      setWeather({
        ...weatherData.current,
        location: locationName,
        coordinates: { lat, lon }
      });

      // Process forecast
      const dailyForecast = weatherData.daily.time.map((time, index) => ({
        date: new Date(time),
        maxTemp: weatherData.daily.temperature_2m_max[index],
        minTemp: weatherData.daily.temperature_2m_min[index],
        weatherCode: weatherData.daily.weather_code[index],
        uvIndex: weatherData.daily.uv_index_max[index],
        precipitation: weatherData.daily.precipitation_sum[index]
      }));

      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, forecast, loading, error, fetchWeather };
};

// Search Component with Autocomplete
const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const searchLocations = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
      );
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error('Search error: '
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchLocations]);

  const handleSelect = (result) => {
    onLocationSelect(result.latitude, result.longitude, result.name);
    setQuery(result.name);
    setShowSuggestions(false);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect(position.coords.latitude, position.coords.longitude);
          setQuery('Current Location');
          setShowSuggestions(false);
        },
        (err) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full px-6 py-4 pl-14 pr-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
        />
        <SafeIcon
          name="search"
          size={24}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      <button
        onClick={handleCurrentLocation}
        className="absolute right-14 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors"
        title="Use current location"
      >
        <SafeIcon name="navigation" size={20} className="text-white/70" />
      </button>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {suggestions.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
              >
                <SafeIcon name="map-pin" size={18} className="text-blue-500" />
                <div>
                  <div className="font-semibold text-gray-800">{result.name}</div>
                  <div className="text-sm text-gray-500">
                    {result.admin1 || ''} {result.country ? `, ${result.country}` : ''}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 text-center text-gray-500 z-50"
        >
          No locations found
        </motion.div>
      )}
    </div>
  );
};

// Weather Icon Component
const WeatherIcon = ({ code, size = 48 }) => {
  // WMO Weather interpretation codes
  const getIcon = () => {
    if (code === 0) return <SafeIcon name="sun" size={size} className="text-yellow-400" />;
    if (code >= 1 && code <= 3) return <SafeIcon name="cloud" size={size} className="text-gray-300" />;
    if (code >= 45 && code <= 48) return <SafeIcon name="cloud" size={size} className="text-gray-400" />;
    if (code >= 51 && code <= 67) return <SafeIcon name="cloud-rain" size={size} className="text-blue-400" />;
    if (code >= 71 && code <= 77) return <SafeIcon name="cloud-snow" size={size} className="text-white" />;
    if (code >= 80 && code <= 82) return <SafeIcon name="cloud-rain" size={size} className="text-blue-500" />;
    if (code >= 85 && code <= 86) return <SafeIcon name="cloud-snow" size={size} className="text-white" />;
    if (code >= 95) return <SafeIcon name="cloud-rain" size={size} className="text-purple-400" />;
    return <SafeIcon name="sun" size={size} className="text-yellow-400" />;
  };

  return getIcon();
};

const getWeatherDescription = (code) => {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: '
  };
  return codes[code] || '
};

// Interactive Map Component
const WeatherMap = ({ coordinates, weather }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!coordinates || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [coordinates.lon, coordinates.lat],
      zoom: 10,
      attributionControl: false,
      interactive: true,
      dragRotate: false,
      touchZoomRotate: false
    });

    map.current.scrollZoom.disable();

    // Add marker
    const el = document.createElement('div');
    el.className = '
    el.style.cssText = `
      width: 30px;
      height: 30px;
      background: #3b82f6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    `;
    el.innerHTML = weather ? `${Math.round(weather.temperature_2m)}°` : '

    new maplibregl.Marker({ element: el })
      .setLngLat([coordinates.lon, coordinates.lat])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, weather]);

  useEffect(() => {
    if (map.current && coordinates) {
      map.current.setCenter([coordinates.lon, coordinates.lat]);

      // Update marker
      const markers = document.querySelectorAll('.custom-marker');
      markers.forEach(marker => {
        marker.innerHTML = weather ? `${Math.round(weather.temperature_2m)}°` : '
      });
    }
  }, [coordinates, weather]);

  return (
    <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative">
      <style>{`
        .maplibregl-ctrl-attrib { display: none !important; }
        .maplibregl-ctrl-logo { display: none !important; }
      `}</style>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 glass px-4 py-2 rounded-xl">
        <div className="text-sm font-semibold text-white">Live Weather Map</div>
        <div className="text-xs text-white/70">Click and drag to explore</div>
      </div>
    </div>
  );
};

// Temperature Chart Component
const TemperatureChart = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const maxTemp = Math.max(...forecast.map(d => d.maxTemp));
  const minTemp = Math.min(...forecast.map(d => d.minTemp));
  const range = maxTemp - minTemp || 1;

  const getY = (temp) => {
    return 100 - ((temp - minTemp) / range) * 80 - 10;
  };

  const pathData = forecast.map((day, index) => {
    const x = (index / (forecast.length - 1)) * 100;
    const y = getY(day.maxTemp);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' '

  const minPathData = forecast.map((day, index) => {
    const x = (index / (forecast.length - 1)) * 100;
    const y = getY(day.minTemp);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' '

  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <SafeIcon name="thermometer" size={24} />
        7-Day Temperature Trend
      </h3>

      <div className="relative h-64 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          ))}

          {/* Min temp area */}
          <path
            d={`${minPathData} L 100 100 L 0 100 Z`}
            fill="rgba(59,130,246,0.2)"
          />

          {/* Max temp line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Min temp line */}
          <motion.path
            d={minPathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />

          {/* Data points */}
          {forecast.map((day, index) => {
            const x = (index / (forecast.length - 1)) * 100;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={getY(day.maxTemp)}
                  r="2"
                  fill="#fbbf24"
                />
                <circle
                  cx={x}
                  cy={getY(day.minTemp)}
                  r="2"
                  fill="#3b82f6"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-white/60">
          {forecast.map((day, index) => (
            <div key={index} className="text-center flex-1">
              <div>{day.date.toLocaleDateString('en', { weekday: 'short' })}</div>
              <div className="text-white/40">{day.date.getDate()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-white/80">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-white/80">Low</span>
        </div>
      </div>
    </div>
  );
};

// Forecast Grid Component
const ForecastGrid = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {forecast.map((day, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-2xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer group"
        >
          <div className="text-sm text-white/70 mb-2">
            {day.date.toLocaleDateString('en', { weekday: 'short' })}
          </div>
          <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
            <WeatherIcon code={day.weatherCode} size={40} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(day.maxTemp)}°
          </div>
          <div className="text-sm text-white/60">
            {Math.round(day.minTemp)}°
          </div>
          {day.precipitation > 0 && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-300">
              <SafeIcon name="droplets" size={12} />
              {day.precipitation}mm
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Weather Details Component
const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const details = [
    { icon: 'droplets', label: 'Humidity', value: `${weather.relative_humidity_2m}%`, color: 'text-blue-400' },
    { icon: 'wind', label: 'Wind Speed', value: `${weather.wind_speed_10m} km/h`, color: 'text-cyan-400' },
    { icon: 'gauge', label: 'Pressure', value: `${weather.surface_pressure} hPa`, color: 'text-purple-400' },
    { icon: 'sun', label: 'UV Index', value: weather.uv_index_max || 'N/A', color: 'text-yellow-400' },
    { icon: 'eye', label: 'Visibility', value: '10+ km', color: 'text-green-400' },
    { icon: 'cloud-rain', label: 'Precipitation', value: `${weather.precipitation} mm`, color: 'text-indigo-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {details.map((detail, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-2xl p-5 hover:bg-white/20 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <SafeIcon name={detail.icon} size={24} className={detail.color} />
            <span className="text-white/60 text-sm">{detail.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{detail.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Share Component
const ShareButtons = ({ weather }) => {
  const [showShare, setShowShare] = useState(false);

  const shareData = {
    title: 'Weather Forecast',
    text: `Current weather in ${weather?.location}: ${Math.round(weather?.temperature_2m)}°C, ${getWeatherDescription(weather?.weather_code)}`,
    url: window.location.href
  };

  const handleShare = async (platform) => {
    const text = encodeURIComponent(shareData.text);
    const url = encodeURIComponent(shareData.url);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }

    setShowShare(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all"
      >
        <SafeIcon name="share2" size={20} className="text-white" />
        <span className="text-white font-medium">Share</span>
      </button>

      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 glass-dark rounded-xl p-2 min-w-[160px] z-50"
          >
            {navigator.share && (
              <button
                onClick={() => handleShare('native')}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
              >
                <SafeIcon name="share2" size={16} />
                Native Share
              </button>
            )}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SafeIcon name="twitter" size={16} />
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SafeIcon name="facebook" size={16} />
              Facebook
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SafeIcon name="linkedin" size={16} />
              LinkedIn
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main App Component
function App() {
  const { weather, forecast, loading, error, fetchWeather } = useWeatherData();
  const [bgClass, setBgClass] = useState('weather-bg-sunny');
  const [menuOpen, setMenuOpen] = useState(false);

  // Initial load - get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to London if geolocation fails
          fetchWeather(51.5074, -0.1278, 'London');
        }
      );
    } else {
      fetchWeather(51.5074, -0.1278, 'London');
    }
  }, [fetchWeather]);

  // Update background based on weather
  useEffect(() => {
    if (!weather) return;

    const code = weather.weather_code;
    const isDay = weather.is_day;

    if (!isDay) {
      setBgClass('weather-bg-night');
    } else if (code === 0 || code === 1) {
      setBgClass('weather-bg-sunny');
    } else if (code >= 51 && code <= 67) {
      setBgClass('weather-bg-rainy');
    } else if (code >= 80) {
      setBgClass('weather-bg-rainy');
    } else {
      setBgClass('weather-bg-cloudy');
    }
  }, [weather]);

  const handleLocationSelect = (lat, lon, name) => {
    fetchWeather(lat, lon, name);
  };

  const getBackgroundAnimation = () => {
    if (bgClass === 'weather-bg-rainy') return <RainAnimation />;
    if (bgClass === 'weather-bg-sunny') return <SunAnimation />;
    if (bgClass === 'weather-bg-cloudy') return <CloudAnimation />;
    return null;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${bgClass} relative overflow-x-hidden`}>
      {/* Background Animation */}
      {getBackgroundAnimation()}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
          <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SafeIcon name="cloud" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">WeatherPro</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#current" className="text-white/80 hover:text-white transition-colors">Current</a>
              <a href="#forecast" className="text-white/80 hover:text-white transition-colors">Forecast</a>
              <a href="#map" className="text-white/80 hover:text-white transition-colors">Map</a>
              <a href="#details" className="text-white/80 hover:text-white transition-colors">Details</a>
            </div>

            <div className="flex items-center gap-3">
              <ShareButtons weather={weather} />
              <button
                className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <SafeIcon name={menuOpen ? 'x' : 'menu'} size={24} className="text-white" />
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10"
              >
                <div className="px-4 py-4 space-y-2">
                  <a href="#current" onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-white">Current</a>
                  <a href="#forecast" onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-white">Forecast</a>
                  <a href="#map" onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-white">Map</a>
                  <a href="#details" onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-white">Details</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl space-y-8">

            {/* Search Section */}
            <section className="py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  Weather Forecast
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                  Real-time weather data with interactive maps and detailed forecasts
                </p>
              </motion.div>

              <SearchBar onLocationSelect={handleLocationSelect} />
            </section>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="glass rounded-2xl p-6 text-center text-red-300">
                <SafeIcon name="x" size={48} className="mx-auto mb-4" />
                <p>{error}</p>
                <button
                  onClick={() => fetchWeather(51.5074, -0.1278, 'London')}
                  className="mt-4 px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Try London
                </button>
              </div>
            )}

            {/* Current Weather */}
            {weather && !loading && (
              <section id="current" className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-3xl p-8 md:p-12"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{weather.location}</h2>
                      <div className="flex items-center gap-2 text-white/70">
                        <SafeIcon name="clock" size={16} />
                        <span>{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-6xl md:text-8xl font-black text-white">
                        {Math.round(weather.temperature_2m)}°
                      </div>
                      <div className="text-xl text-white/80 capitalize">
                        {getWeatherDescription(weather.weather_code)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <WeatherIcon code={weather.weather_code} size={80} />
                    <div>
                      <div className="text-white/60">Feels like</div>
                      <div className="text-3xl font-bold text-white">{Math.round(weather.apparent_temperature)}°</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <SafeIcon name="wind" size={20} className="text-cyan-400" />
                      <div>
                        <div className="text-sm text-white/60">Wind</div>
                        <div className="text-white font-semibold">{weather.wind_speed_10m} km/h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <SafeIcon name="droplets" size={20} className="text-blue-400" />
                      <div>
                        <div className="text-sm text-white/60">Humidity</div>
                        <div className="text-white font-semibold">{weather.relative_humidity_2m}%</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <WeatherMap coordinates={weather.coordinates} weather={weather} />
                </motion.div>
              </section>
            )}

            {/* 7-Day Forecast */}
            {forecast.length > 0 && !loading && (
              <section id="forecast" className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
                >
                  <SafeIcon name="calendar" size={28} />
                  7-Day Forecast
                </motion.h2>
                <ForecastGrid forecast={forecast} />
              </section>
            )}

            {/* Temperature Chart */}
            {forecast.length > 0 && !loading && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TemperatureChart forecast={forecast} />
              </motion.section>
            )}

            {/* Weather Details */}
            {weather && !loading && (
              <section id="details" className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
                >
                  <SafeIcon name="gauge" size={28} />
                  Weather Details
                </motion.h2>
                <WeatherDetails weather={weather} />
              </section>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 px-4 md:px-6 telegram-safe-bottom">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <SafeIcon name="cloud" size={24} className="text-white/60" />
                <span className="text-white/60">WeatherPro</span>
              </div>
              <div className="text-white/40 text-sm text-center md:text-right">
                <p>Data provided by Open-Meteo API</p>
                <p>Built with React + MapLibre + Framer Motion</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;