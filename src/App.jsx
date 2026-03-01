import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const heroes = [
  { name: "Anti-Mage", role: "Carry", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
  { name: "Invoker", role: "Mid", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80" },
  { name: "Pudge", role: "Support", image: "https://images.unsplash.com/photo-1560253023-3ec5d502958f?w=400&q=80" },
  { name: "Crystal Maiden", role: "Support", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80" },
  { name: "Shadow Fiend", role: "Mid", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80" }
];

const features = [
  { icon: "sword", title: "5v5 Битвы", desc: "Командные сражения на уникальной карте" },
  { icon: "users", title: "100+ Героев", desc: "Уникальные способности и стили игры" },
  { icon: "crown", title: "Киберспорт", desc: "Миллионные призовые фонды" },
  { icon: "zap", title: "Стратегия", desc: "Глубокая механика и тактика" }
];

function App() {
  const [settings, setSettings] = useState({});
  const [currentHero, setCurrentHero] = useState(0);
  const [formState, setFormState] = useState({ email: '', submitted: false, loading: false });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}));
  }, []);

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroes.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + heroes.length) % heroes.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, loading: true }));
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formState.email, type: 'tournament_registration' })
      });
      setFormState({ email: '', submitted: true, loading: false });
    } catch {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-red-600">DOTA 2</div>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => scrollToSection('heroes')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Герои</button>
            <button onClick={() => scrollToSection('gameplay')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Геймплей</button>
            <button onClick={() => scrollToSection('tournaments')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Турниры</button>
          </nav>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-all">
            Играть
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            DOTA 2
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Битва Древних начинается. Собери команду и сразись за титул чемпиона.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/50">
              Играть бесплатно
            </button>
            <button className="bg-transparent border-2 border-gray-600 hover:border-white text-white px-8 py-4 rounded-lg text-lg font-bold transition-all">
              Смотреть трейлер
            </button>
          </motion.div>
        </div>
      </section>

      {/* Heroes Section */}
      {settings.show_heroes !== false && (
        <section id="heroes" className="py-20 bg-black/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">Легендарные герои</h2>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHero}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row items-center p-8 gap-8"
                  >
                    <img
                      src={heroes[currentHero].image}
                      alt={heroes[currentHero].name}
                      className="w-64 h-64 object-cover rounded-xl shadow-2xl"
                    />
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-2">{heroes[currentHero].name}</h3>
                      <span className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {heroes[currentHero].role}
                      </span>
                      <p className="text-gray-400 mb-6">Уникальный герой с особыми способностями, изменяющими ход битвы.</p>
                      <button className="text-red-500 hover:text-red-400 font-medium flex items-center gap-2 mx-auto md:mx-0">
                        Узнать больше <SafeIcon name="arrow-right" size={16} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button onClick={prevHero} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <SafeIcon name="chevron-left" size={24} />
              </button>
              <button onClick={nextHero} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors">
                <SafeIcon name="chevron-right" size={24} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Gameplay Section */}
      {settings.show_gameplay !== false && (
        <section id="gameplay" className="py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">Особенности игры</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-red-600/50 transition-all hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                    <SafeIcon name={feature.icon} className="text-red-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tournaments Section */}
      {settings.show_tournaments !== false && (
        <section id="tournaments" className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-gray-900/80 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
              <SafeIcon name="trophy" size={48} className="text-yellow-500 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">The International</h2>
              <p className="text-xl text-gray-300 mb-8">Крупнейший турнир по Dota 2 с призовым фондом более $40 млн</p>

              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-black/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">$40M+</div>
                  <div className="text-sm text-gray-400">Призовой фонд</div>
                </div>
                <div className="bg-black/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">18</div>
                  <div className="text-sm text-gray-400">Команд участников</div>
                </div>
                <div className="bg-black/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">Global</div>
                  <div className="text-sm text-gray-400">Мировое событие</div>
                </div>
              </div>

              {!formState.submitted ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Введите email для уведомлений"
                      className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                      required
                    />
                    <button
                      type="submit"
                      disabled={formState.loading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                      {formState.loading ? '...' : 'Подписаться'}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-medium">
                  Спасибо! Вы подписаны на обновления турниров.
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Download Section */}
      <section className="py-20 pb-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Начни играть сегодня</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Dota 2 бесплатна для игры. Загрузи через Steam и присоединяйся к миллионам игроков по всему миру.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://store.steampowered.com/app/570/Dota_2/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
              <SafeIcon name="download" size={20} />
              Скачать в Steam
            </a>
            <a href="https://www.dota2.com/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all inline-flex items-center justify-center gap-2">
              Официальный сайт
              <SafeIcon name="external-link" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black text-red-600">DOTA 2</div>
          <div className="text-gray-500 text-sm">© 2024 Valve Corporation. Все права защищены.</div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><SafeIcon name="twitter" size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><SafeIcon name="youtube" size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><SafeIcon name="twitch" size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;