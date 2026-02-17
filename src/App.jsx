import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Loader2,
  AlertCircle,
  Calendar,
  ArrowRight
} from 'lucide-react'

// Weather icon mapping
const getWeatherIcon = (condition) => {
  const code = condition?.toLowerCase() || ''
  if (code.includes('sun') || code.includes('clear')) return <Sun className="w-8 h-8 text-yellow-400" />
  if (code.includes('rain') || code.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />
  if (code.includes('snow') || code.includes('sleet')) return <CloudSnow className="w-8 h-8 text-cyan-300" />
  if (code.includes('thunder') || code.includes('lightning')) return <CloudLightning className="w-8 h-8 text-purple-400" />
  return <Cloud className="w-8 h-8 text-gray-300" />
}

// Mock weather data for demo (replace with real API)
const mockWeatherData = {
  current: {
    temp: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 24,
    city: 'Moscow'
  },
  forecast: [
    { day: 'Monday', temp: 22, condition: 'Sunny', humidity: 60, windSpeed: 10 },
    { day: 'Tuesday', temp: 19, condition: 'Cloudy', humidity: 70, windSpeed: 15 },
    { day: 'Wednesday', temp: 16, condition: 'Rainy', humidity: 85, windSpeed: 18 },
    { day: 'Thursday', temp: 18, condition: 'Cloudy', humidity: 75, windSpeed: 12 },
    { day: 'Friday', temp: 21, condition: 'Sunny', humidity: 55, windSpeed: 8 },
    { day: 'Saturday', temp: 24, condition: 'Sunny', humidity: 50, windSpeed: 10 },
    { day: 'Sunday', temp: 20, condition: 'Partly Cloudy', humidity: 65, windSpeed: 14 }
  ]
}

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')

  // Fetch weather data
  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return

    setLoading(true)
    setError(null)

    try {
      // For demo purposes, using mock data
      // In production, replace with actual OpenWeatherMap API call:
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=\${searchCity}&appid=\${apiKey}&units=metric`)

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

      setWeatherData({
        ...mockWeatherData,
        current: { ...mockWeatherData.current, city: searchCity }
      })
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchWeather(city)
  }

  // Load default city on mount
  useEffect(() => {
    fetchWeather('Moscow')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl z-50 border-b border-white/10">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              WeatherPro
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => document.getElementById('api-setup').scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>API Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              7-Day <span className="gradient-text">Weather</span> Forecast
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get accurate weather predictions for any city worldwide.
              Plan your week with confidence using real-time meteorological data.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed min-h-[56px]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Current Weather Card */}
          {weatherData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-panel p-6 md:p-10 mb-12 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{weatherData.current.city}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <span className="text-6xl md:text-8xl font-black">
                      {weatherData.current.temp}°
                    </span>
                    <div className="flex flex-col items-center">
                      {getWeatherIcon(weatherData.current.condition)}
                      <span className="text-lg text-gray-300 mt-1">{weatherData.current.condition}</span>
                    </div>
                  </div>
                  <p className="text-gray-400">
                    Feels like <span className="text-white font-semibold">{weatherData.current.feelsLike}°</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
                  <div className="text-center p-4 bg-white/5 rounded-2xl">
                    <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                    <p className="text-sm text-gray-400">Humidity</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-2xl">
                    <Wind className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.current.windSpeed}</p>
                    <p className="text-sm text-gray-400">km/h</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-2xl">
                    <Thermometer className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{weatherData.current.temp}°</p>
                    <p className="text-sm text-gray-400">Current</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7-Day Forecast */}
          {weatherData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl md:text-3xl font-bold">7-Day Forecast</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="weather-card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-blue-300">{day.day}</span>
                      {getWeatherIcon(day.condition)}
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold">{day.temp}°</span>
                      <span className="text-gray-400">C</span>
                    </div>

                    <p className="text-gray-300 mb-4">{day.condition}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Droplets className="w-4 h-4" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Wind className="w-4 h-4" />
                        <span>{day.windSpeed} km/h</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* API Setup Section */}
      <section id="api-setup" className="py-20 px-4 md:px-6 bg-slate-950/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">API Configuration</h2>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              To use real weather data, you need an API key from OpenWeatherMap.
              Follow these steps to set up your API access:
            </p>

            <ol className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">1</span>
                <span>Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenWeatherMap API</a> and sign up for a free account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">2</span>
                <span>Generate your free API key from the dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold">3</span>
                <span>Enter your API key below to enable live weather data</span>
              </li>
            </ol>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenWeatherMap API key..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={() => alert('API key saved! (Demo mode - implement actual storage)')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Save Key
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm text-yellow-300">
                <strong>Note:</strong> Free tier allows 1000 calls/day. For production use,
                implement proper error handling and caching to respect API limits.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">WeatherPro</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Accurate, reliable, and beautifully presented weather information at your fingertips
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sun className="w-8 h-8 text-yellow-400" />,
                title: 'Real-Time Updates',
                description: 'Get the latest weather conditions updated every hour for maximum accuracy'
              },
              {
                icon: <Calendar className="w-8 h-8 text-blue-400" />,
                title: '7-Day Forecast',
                description: 'Plan ahead with detailed week-long weather predictions for any location'
              },
              {
                icon: <MapPin className="w-8 h-8 text-red-400" />,
                title: 'Global Coverage',
                description: 'Access weather data for over 200,000 cities worldwide'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 text-center hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WeatherPro</span>
            </div>

            <div className="flex items-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © 2024 WeatherPro. All rights reserved. Powered by OpenWeatherMap API.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App