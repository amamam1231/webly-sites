import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'

function App() {
  const [settings, setSettings] = useState({
    show_hero_section: true,
    show_features_section: true,
    show_footer_section: true,
    primary_cta_link: '#contact',
    secondary_cta_link: '#features'
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => console.log('Using default settings'))
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      icon: Zap,
      title: "Быстрая работа",
      description: "Оптимизированная производительность для максимальной скорости загрузки"
    },
    {
      icon: Shield,
      title: "Надежность",
      description: "Стабильная работа и защита данных на высшем уровне"
    },
    {
      icon: Sparkles,
      title: "Качество",
      description: "Премиальные материалы и внимание к каждой детали"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Block 1: Hero Section */}
      {settings.show_hero_section !== false && (
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">Доступно сейчас</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight">
              <span className="text-gradient">Создайте</span>
              <br />
              <span className="text-slate-100">будущее</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Минималистичный подход к максимальным результатам.
              Чистый дизайн, продуманная функциональность, безупречное исполнение.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href={settings.primary_cta_link || '#contact'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-600/25"
              >
                Начать сейчас
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                href={settings.secondary_cta_link || '#features'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-semibold rounded-full border border-slate-700/50 backdrop-blur-sm transition-all"
              >
                Узнать больше
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Block 2: Features Section */}
      {settings.show_features_section !== false && (
        <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16 sm:mb-20"
              {...fadeInUp}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых преимущества, которые делают нас лучшим выбором
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <SafeIcon name={feature.icon.name.toLowerCase()} className="w-6 h-6 text-blue-400" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Block 3: Footer/CTA Section */}
      {settings.show_footer_section !== false && (
        <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Готовы начать?
            </h2>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
              Присоединяйтесь к тысячам довольных клиентов.
              Начните свой путь к успеху прямо сейчас.
            </p>

            <motion.button
              onClick={() => window.location.href = settings.primary_cta_link || '#'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-full shadow-xl shadow-blue-600/25 transition-all"
            >
              Связаться с нами
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <div className="mt-16 pt-8 border-t border-slate-800">
              <p className="text-slate-500 text-sm">
                © 2024 Все права защищены. Минималистичный лендинг.
              </p>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}

export default App