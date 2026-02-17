import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Moon,
  Sunrise,
  Sunset,
  Menu,
  X,
  MapPin,
  Navigation,
  Umbrella
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Mock data for favorite cities
const favoriteCities = [
  { id: 1, name: 'Москва', temp: 24, condition: 'sunny', icon: 'sun' },
  { id: 2, name: 'Санкт-Петербург', temp: 19, condition: 'cloudy', icon: 'cloud' },
  { id: 3, name: 'Сочи', temp: 28, condition: 'sunny', icon: 'sun' },
  { id: 4, name: 'Казань', temp: 22, condition: 'rainy', icon: 'cloud-rain' },
  { id: 5, name: 'Новосибирск', temp: 15, condition: 'cloudy', icon: 'cloud' },
];

// Hourly temperature data for chart
const hourlyData = [
  { time: '12:00', temp: 22 },
  { time: '13:00', temp: 23 },
  { time: '14:00', temp: 24 },
  { time: '15:00', temp: 25 },
  { time: '16:00', temp: 24 },
  { time: '17:00', temp: 23 },
  { time: '18:00', temp: 21 },
  { time: '19:00', temp: 19 },
  { time: '20:00', temp: 17 },
];

// 7-day forecast data
const forecastData = [
  { day: 'Пн', temp: 24, icon: 'sun', condition: 'Ясно' },
  { day: 'Вт', temp: 26, icon: 'sun', condition: 'Ясно' },
  { day: 'Ср', temp: 23, icon: 'cloud', condition: 'Облачно' },
  { day: 'Чт', temp: 20, icon: 'cloud-rain', condition: 'Дождь' },
  { day: 'Пт', temp: 18, icon: 'cloud-rain', condition: 'Дождь' },
  { day: 'Сб', temp: 22, icon: 'cloud', condition: 'Облачно' },
  { day: 'Вс', temp: 25, icon: 'sun', condition: 'Ясно' },
];

// Bento grid data
const bentoData = [
  {
    id: 1,
    title: 'Влажность',
    value: '60%',
    icon: 'droplets',
    detail: 'Точка росы: 16°',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 2,
    title: 'Ветер',
    value: '15 км/ч',
    icon: 'wind',
    detail: 'Северо-запад',
    color: 'from-emerald-400 to-teal-400'
  },
  {
    id: 3,
    title: 'UV-индекс',
    value: '6',
    icon: 'sun',
    detail: 'Высокий',
    color: 'from-orange-400 to-amber-400'
  },
  {
    id: 4,
    title: 'Видимость',
    value: '10 км',
    icon: 'eye',
    detail: 'Отличная',
    color: 'from-violet-400 to-purple-400'
  },
  {
    id: 5,
    title: 'Восход',
    value: '05:42',
    icon: 'sunrise',
    detail: 'Закат: 20:18',
    color: 'from-pink-400 to-rose-400'
  },
  {
    id: 6,
    title: 'Фаза луны',
    value: 'Полнолуние',
    icon: 'moon',
    detail: 'Освещенность: 98%',
    color: 'from-indigo-400 to-blue-500'
  },
];

// Weather icon component
const WeatherIcon = ({ name, size = 24, className = '' }) => {
  const icons = {
    sun: <Sun size={size} className={className} />,
    cloud: <Cloud size={size} className={className} />,
    'cloud-rain': <CloudRain size={size} className={className} />,
    'cloud-snow': <CloudSnow size={size} className={className} />,
    moon: <Moon size={size} className={className} />,
    droplets: <Droplets size={size} className={className} />,
    wind: <Wind size={size} className={className} />,
    eye: <Eye size={size} className={className} />,
    thermometer: <Thermometer size={size} className={className} />,
    sunrise: <Sunrise size={size} className={className} />,
    sunset: <Sunset size={size} className={className} />,
    umbrella: <Umbrella size={size} className={className} />,
    navigation: <Navigation size={size} className={className} />,
  };

  return icons[name] || <Sun size={size} className={className} />;
};

// SafeIcon wrapper for the system

function App() {
  const [isCelsius, setIsCelsius] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const convertTemp = (temp) => {
    if (isCelsius) return temp;
    return Math.round((temp * 9/5) + 32);
  };

  const tempUnit = isCelsius ? '°C' : '°F';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-night-sky text-white overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass px-4 md:px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <SafeIcon name={sidebarOpen ? 'x' : 'menu'} size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <SafeIcon name="cloud" size={32} className="text-blue-400" />
            <span className="text-xl font-bold hidden sm:block">WeatherGlass</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            </div>
          </div>

          {/* Temperature toggle */}
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 hover:bg-white/20 transition-all"
          >
            <span className={`text-sm font-medium ${isCelsius ? 'text-white' : 'text-white/50'}`}>°C</span>
            <div className="w-10 h-5 bg-white/20 rounded-full relative">
              <motion.div
                animate={{ x: isCelsius ? 2 : 22 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full"
              />
            </div>
            <span className={`text-sm font-medium ${!isCelsius ? 'text-white' : 'text-white/50'}`}>°F</span>
          </button>
        </div>
      </motion.header>

      <div className="flex pt-20 min-h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`fixed lg:static inset-y-0 left-0 z-40 w-72 glass border-r border-white/10 pt-24 lg:pt-4 px-4 overflow-y-auto ${sidebarOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="mb-6">
                <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4 px-2">Избранные города</h3>
                <div className="space-y-2">
                  {favoriteCities.map((city, index) => (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedCity(city.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCity === city.name ? 'bg-white/20 border border-white/30' : 'hover:bg-white/10 border border-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <SafeIcon name={city.icon} size={20} className="text-yellow-400" />
                        <span className="font-medium">{city.name}</span>
                      </div>
                      <span className="text-lg font-semibold">{convertTemp(city.temp)}{tempUnit}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 glass-card rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-blue-400" />
                  <span className="text-sm text-white/70">Текущее местоположение</span>
                </div>
                <p className="font-semibold">{selectedCity}</p>
                <p className="text-sm text-white/60">Определено по GPS</p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Current Weather Section */}
            <motion.section variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
              {/* Main weather card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h1 className="text-5xl md:text-7xl font-bold mb-2">{convertTemp(24)}{tempUnit}</h1>
                      <p className="text-xl text-white/80 flex items-center gap-2">
                        <SafeIcon name="sun" size={24} className="text-yellow-400" />
                        Ясно
                      </p>
                      <p className="text-white/60 mt-1">{selectedCity}, сегодня</p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <SafeIcon name="sun" size={80} className="text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>Ощущается как {convertTemp(26)}{tempUnit}</span>
                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                    <span>Макс: {convertTemp(28)}{tempUnit}</span>
                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                    <span>Мин: {convertTemp(18)}{tempUnit}</span>
                  </div>
                </div>
              </div>

              {/* Hourly chart */}
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SafeIcon name="thermometer" size={20} />
                  Температура по часам
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
                      <XAxis
                        dataKey="time"
                        stroke="rgba(255,255,255,0.4)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.4)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${convertTemp(value)}°`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`${convertTemp(value)}${tempUnit}`, 'Температура']}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#fbbf24"
                        strokeWidth={3}
                        dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#f59e0b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.section>

            {/* Bento Grid */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <SafeIcon name="navigation" size={24} className="text-blue-400" />
                Детали погоды
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {bentoData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-card rounded-2xl p-4 aspect-square flex flex-col justify-between group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <SafeIcon name={item.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">{item.title}</p>
                      <p className="text-xl font-bold mb-1">{item.value}</p>
                      <p className="text-white/50 text-xs">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 7-Day Forecast */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <SafeIcon name="calendar" size={24} className="text-blue-400" />
                Прогноз на 7 дней
              </h2>
              <div className="glass-card rounded-3xl p-6">
                <div className="space-y-3">
                  {forecastData.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      className="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 w-24">
                        <span className="font-semibold text-lg">{day.day}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <SafeIcon
                          name={day.icon}
                          size={28}
                          className={day.icon === 'sun' ? 'text-yellow-400' : day.icon === 'cloud-rain' ? 'text-blue-400' : 'text-gray-400'}
                        />
                        <span className="text-white/70 hidden sm:block">{day.condition}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">{convertTemp(day.temp)}{tempUnit}</span>
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.temp / 35) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full rounded-full ${day.temp > 25 ? 'bg-gradient-to-r from-orange-400 to-red-400' : day.temp > 20 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;