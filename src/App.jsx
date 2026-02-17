import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Navigation,
  Heart,
  Shirt,
  Umbrella,
  Glasses,
  X,
  Menu,
  ChevronRight,
  Clock,
  Eye,
  Gauge
} from '
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Weather API configuration
const API_KEY = '
const API_BASE = '

// Mock weather data for demonstration
const mockCurrentWeather = {
  temp: 22,
  feels_like: 24,
  humidity: 65,
  wind_speed: 3.5,
  pressure: 1013,
  visibility: 10000,
  weather: { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
  dt: Date.now() / 1000,
  name: 'Moscow',
  country: 'RU',
  coord: { lat: 55.7558, lon: 37.6173 }
};

const mockForecast = Array.from({ length: 7 }, (_, i) => ({
  dt: (Date.now() / 1000) + (i + 1) * 86400,
  temp: { day: 20 + Math.random() * 10 - 5, min: 15 + Math.random() * 5, max: 25 + Math.random() * 5 },
  weather: [{ main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)], icon: '02d' }],
  humidity: 60 + Math.floor(Math.random() * 20),
  wind_speed: 2 + Math.random() * 4
}));

// Weather icon mapping
const getWeatherIcon = (condition, size = 24) => {
  const conditionLower = condition?.toLowerCase() || '
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return <SafeIcon name="sun" size={size} className="text-yellow-500" />;
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return <SafeIcon name="cloud-rain" size={size} className="text-blue-500" />;
  if (conditionLower.includes('snow')) return <SafeIcon name="cloud-snow" size={size} className="text-cyan-400" />;
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) return <SafeIcon name="cloud-lightning" size={size} className="text-purple-500" />;
  return <SafeIcon name="cloud" size={size} className="text-gray-400" />;
};

// Clothing recommendation logic
const getClothingRecommendation = (temp, weather) => {
  const recommendations = [];

  if (temp < 0) {
    recommendations.push({ icon: 'shirt', text: 'Warm winter coat', color: 'text-blue-400' });
    recommendations.push({ icon: 'cloud-snow', text: 'Thermal layers', color: 'text-cyan-400' });
  } else if (temp < 10) {
    recommendations.push({ icon: 'shirt', text: 'Jacket or sweater', color: 'text-indigo-400' });
    recommendations.push({ icon: 'glasses', text: 'Light scarf', color: 'text-purple-400' });
  } else if (temp < 20) {
    recommendations.push({ icon: 'shirt', text: 'Light jacket or hoodie', color: 'text-green-400' });
    recommendations.push({ icon: 'glasses', text: 'Comfortable jeans', color: 'text-blue-400' });
  } else if (temp < 30) {
    recommendations.push({ icon: 'shirt', text: 'T-shirt or light shirt', color: 'text-yellow-400' });
    recommendations.push({ icon: 'glasses', text: 'Sunglasses', color: 'text-orange-400' });
  } else {
    recommendations.push({ icon: 'shirt', text: 'Breathable fabrics', color: 'text-red-400' });
    recommendations.push({ icon: 'umbrella', text: 'Sun hat', color: 'text-yellow-500' });
  }

  if (weather?.toLowerCase().includes('rain')) {
    recommendations.push({ icon: 'umbrella', text: 'Umbrella or raincoat', color: 'text-blue-500' });
  }

  return recommendations;
};

// Main App Component
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(mockCurrentWeather);
  const [forecast, setForecast] = useState(mockForecast);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('C'); // C or F
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);

  // Convert temperature
  const convertTemp = (temp) => {
    if (unit === 'F') return Math.round((temp * 9/5) + 32);
    return Math.round(temp);
  };

  // Search for city
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentWeather({
        ...mockCurrentWeather,
        name: searchQuery,
        temp: 15 + Math.random() * 15,
        weather: {
          main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'scattered clouds',
          icon: '
        }
      });
      setLoading(false);
      setSearchQuery('');
    }, 1000);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const exists = favorites.find(f => f.name === currentWeather.name);
    if (exists) {
      setFavorites(favorites.filter(f => f.name !== currentWeather.name));
    } else {
      setFavorites([...favorites, { name: currentWeather.name, temp: currentWeather.temp }]);
    }
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const isDark = true; // Dark theme by default

    const styleUrl = isDark
      ? '
      : '

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [currentWeather.coord.lon, currentWeather.coord.lat],
      zoom: 10,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      keyboard: false
    });

    map.current.scrollZoom.disable();

    // Add marker
    const el = document.createElement('div');
    el.style.cssText = `
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    `;

    new maplibregl.Marker({ element: el })
      .setLngLat([currentWeather.coord.lon, currentWeather.coord.lat])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (map.current) {
      map.current.setCenter([currentWeather.coord.lon, currentWeather.coord.lat]);

      // Update marker
      const markers = document.getElementsByClassName('maplibregl-marker');
      while(markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      const el = document.createElement('div');
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      new maplibregl.Marker({ element: el })
        .setLngLat([currentWeather.coord.lon, currentWeather.coord.lat])
        .addTo(map.current);
    }
  }, [currentWeather.coord]);

  // Get week days for calendar
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i));

  // Clothing recommendations
  const clothingRecs = getClothingRecommendation(currentWeather.temp, currentWeather.weather.main);

  // Chart data
  const chartData = forecast.map((day, index) => ({
    day: format(new Date(day.dt * 1000), 'EEE'),
    temp: convertTemp(day.temp.day),
    min: convertTemp(day.temp.min),
    max: convertTemp(day.temp.max)
  }));

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-xl z-50 border-b border-slate-800/50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <SafeIcon name="cloud" size={24} className="text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">WeatherCast</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('current')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Current</button>
              <button onClick={() => scrollToSection('map')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Map</button>
              <button onClick={() => scrollToSection('forecast')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Forecast</button>
              <button onClick={() => scrollToSection('calendar')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Calendar</button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <SafeIcon name="thermometer" size={16} />
                °{unit}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 bg-slate-800 rounded-lg"
              >
                <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pt-4 border-t border-slate-800"
              >
                <div className="flex flex-col gap-3">
                  <button onClick={() => scrollToSection('current')} className="text-left text-slate-400 hover:text-white py-2 transition-colors">Current Weather</button>
                  <button onClick={() => scrollToSection('map')} className="text-left text-slate-400 hover:text-white py-2 transition-colors">Weather Map</button>
                  <button onClick={() => scrollToSection('forecast')} className="text-left text-slate-400 hover:text-white py-2 transition-colors">7-Day Forecast</button>
                  <button onClick={() => scrollToSection('calendar')} className="text-left text-slate-400 hover:text-white py-2 transition-colors">Calendar</button>
                  <button onClick={() => scrollToSection('clothing')} className="text-left text-slate-400 hover:text-white py-2 transition-colors">Clothing Tips</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Search Section */}
      <section className="pt-28 pb-8 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full px-6 py-4 pl-14 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
            />
            <SafeIcon name="search" size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-xl font-medium transition-all"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {/* Current Weather Section */}
      <section id="current" className="py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-10 border border-slate-700/50 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <SafeIcon name="map-pin" size={20} className="text-blue-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{currentWeather.name}, {currentWeather.country}</h2>
                  </div>
                  <p className="text-slate-400 flex items-center gap-2">
                    <SafeIcon name="clock" size={16} />
                    {format(new Date(currentWeather.dt * 1000), 'EEEE, MMMM d, HH:mm')}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${favorites.find(f => f.name === currentWeather.name) ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <SafeIcon name="heart" size={20} className={favorites.find(f => f.name === currentWeather.name) ? 'fill-current' : ''} />
                  {favorites.find(f => f.name === currentWeather.name) ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Main temperature */}
                <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-start gap-2">
                      <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        {convertTemp(currentWeather.temp)}°
                      </span>
                      <span className="text-2xl text-slate-400 mt-2">{unit}</span>
                    </div>
                    <p className="text-slate-400 mt-2 capitalize text-lg">{currentWeather.weather.description}</p>
                  </div>
                  <div className="animate-float">
                    {getWeatherIcon(currentWeather.weather.main, 80)}
                  </div>
                </div>

                {/* Feels like */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <SafeIcon name="thermometer" size={20} className="text-orange-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Feels Like</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{convertTemp(currentWeather.feels_like)}°{unit}</p>
                </div>

                {/* Humidity */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <SafeIcon name="droplets" size={20} className="text-blue-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Humidity</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{currentWeather.humidity}%</p>
                </div>

                {/* Wind */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <SafeIcon name="wind" size={20} className="text-green-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Wind Speed</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{currentWeather.wind_speed} <span className="text-lg text-slate-400">m/s</span></p>
                </div>

                {/* Pressure */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <SafeIcon name="gauge" size={20} className="text-purple-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Pressure</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{currentWeather.pressure} <span className="text-lg text-slate-400">hPa</span></p>
                </div>

                {/* Visibility */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <SafeIcon name="eye" size={20} className="text-yellow-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Visibility</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{(currentWeather.visibility / 1000).toFixed(1)} <span className="text-lg text-slate-400">km</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Weather Map</h2>
                <p className="text-slate-400">Real-time weather conditions across the region</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                <SafeIcon name="navigation" size={16} className="text-blue-500" />
                <span className="text-sm text-slate-300">Live Updates</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <div ref={mapContainer} className="w-full h-[400px] md:h-[500px]" />

              {/* Map overlay controls */}
              <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-400">Current Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-slate-400">Sunny</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-slate-400">Cloudy</span>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  Coordinates: {currentWeather.coord.lat.toFixed(4)}, {currentWeather.coord.lon.toFixed(4)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Weekly Forecast Section */}
      <section id="forecast" className="py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">7-Day Forecast</h2>
                <p className="text-slate-400">Extended weather outlook with detailed trends</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setUnit('C')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => setUnit('F')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Temperature Chart */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Temperature Trend</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit={`°${unit}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fill="url(#tempGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.map((day, index) => (
                <motion.div
                  key={day.dt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-blue-500/50 transition-all group"
                >
                  <p className="text-slate-400 text-sm mb-2">{format(new Date(day.dt * 1000), 'EEE')}</p>
                  <div className="flex justify-center my-3 group-hover:scale-110 transition-transform">
                    {getWeatherIcon(day.weather[0].main, 40)}
                  </div>
                  <div className="text-center">
                    <span className="text-white font-bold text-lg">{convertTemp(day.temp.max)}°</span>
                    <span className="text-slate-500 ml-2">{convertTemp(day.temp.min)}°</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                      <SafeIcon name="droplets" size={12} />
                      {day.humidity}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calendar Integration Section */}
      <section id="calendar" className="py-12 px-4 md:px-6 bg-slate-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Weather Calendar</h2>
              <p className="text-slate-400">Select a date to view historical or forecasted weather data</p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-slate-500 text-sm font-medium py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((date, index) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());
                  const dayForecast = forecast[index] || forecast[0];

                  return (
                    <motion.button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 rounded-xl transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'} ${isToday && !isSelected ? 'ring-2 ring-blue-500/50' : ''}`}
                    >
                      <span className="text-lg font-semibold">{format(date, 'd')}</span>
                      <div className="mt-2 flex justify-center">
                        {getWeatherIcon(dayForecast.weather[0].main, 20)}
                      </div>
                      <span className="text-xs mt-1 block">{convertTemp(dayForecast.temp.day)}°</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected date info */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <p className="text-slate-400">
                      {isSameDay(selectedDate, new Date()) ? 'Today\'s weather forecast' : 'Selected date forecast'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-3xl font-bold text-white">
                        {convertTemp(forecast[0]?.temp.day || 20)}°{unit}
                      </span>
                    </div>
                    {getWeatherIcon(forecast[0]?.weather[0].main, 48)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clothing Recommendations Section */}
      <section id="clothing" className="py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">What to Wear</h2>
              <p className="text-slate-400">Smart clothing recommendations based on current weather conditions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommendations */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <SafeIcon name="shirt" size={24} className="text-blue-500" />
                  Today's Outfit
                </h3>
                <div className="space-y-4">
                  {clothingRecs.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      <div className={`p-3 rounded-lg bg-slate-700 ${rec.color}`}>
                        <SafeIcon name={rec.icon} size={24} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{rec.text}</p>
                        <p className="text-slate-500 text-sm">Recommended for {currentWeather.weather.main} conditions</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weather summary for clothing */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <SafeIcon name="gauge" size={24} className="text-green-500" />
                  Conditions Summary
                </h3>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <SafeIcon name="thermometer" size={20} className="text-orange-500" />
                      <span className="text-slate-300">Temperature</span>
                    </div>
                    <span className="text-white font-bold text-lg">{convertTemp(currentWeather.temp)}°{unit}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <SafeIcon name="wind" size={20} className="text-blue-400" />
                      <span className="text-slate-300">Wind</span>
                    </div>
                    <span className="text-white font-bold text-lg">{currentWeather.wind_speed} m/s</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <SafeIcon name="droplets" size={20} className="text-cyan-400" />
                      <span className="text-slate-300">Humidity</span>
                    </div>
                    <span className="text-white font-bold text-lg">{currentWeather.humidity}%</span>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <p className="text-blue-400 text-sm font-medium mb-1">Weather Tip</p>
                    <p className="text-slate-300 text-sm">
                      {currentWeather.temp < 10
                        ? '
                        : currentWeather.temp > 25
                        ? '
                        : 'Pleasant weather today. Perfect for outdoor activities.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-8 px-4 md:px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <SafeIcon name="heart" size={20} className="text-red-500 fill-current" />
              Saved Locations
            </h3>
            <div className="flex flex-wrap gap-3">
              {favorites.map((fav, index) => (
                <motion.button
                  key={fav.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setCurrentWeather({...mockCurrentWeather, name: fav.name, temp: fav.temp})}
                  className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <SafeIcon name="map-pin" size={16} className="text-blue-500" />
                  <span className="text-white font-medium">{fav.name}</span>
                  <span className="text-slate-400">{convertTemp(fav.temp)}°</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 bg-slate-950 border-t border-slate-900 telegram-safe-bottom">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <SafeIcon name="cloud" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">WeatherCast</span>
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span>Data: OpenWeatherMap</span>
              <span>Maps: MapLibre</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
            © 2024 WeatherCast. All rights reserved. Minimalist weather intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;