import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsLoading(false)
      })
      .catch(() => {
        setSettings({
          show_hero: true,
          show_features: true,
          show_cta: true,
          cta_button_link: '#contact'
        })
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Block 1: Hero */}
      {settings.show_hero !== false && (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8"
            >
              <SafeIcon name="sparkles" size={16} />
              <span>Просто. Быстро. Эффективно.</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Создайте что-то<br />удивительное
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Минималистичный подход к созданию продуктов.
              Без лишнего. Только то, что действительно важно.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-white transition-colors shadow-lg shadow-blue-600/25"
            >
              Узнать больше
              <SafeIcon name="arrow-right" size={20} />
            </motion.button>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </div>
        </section>
      )}

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Почему мы?</h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Три ключевых принципа, которые делают нас особенными
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'zap',
                  title: 'Скорость',
                  desc: 'Мгновенная загрузка и отзывчивый интерфейс без задержек'
                },
                {
                  icon: 'shield',
                  title: 'Надёжность',
                  desc: 'Стабильная работа и защита данных на высшем уровне'
                },
                {
                  icon: 'sparkles',
                  title: 'Качество',
                  desc: 'Внимание к деталям и безупречное исполнение'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Block 3: CTA */}
      {settings.show_cta !== false && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-slate-950 to-slate-950" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-tight">
                Готовы начать?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                Присоединяйтесь к тысячам довольных пользователей.
                Начните прямо сейчас — это бесплатно.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href={settings.cta_button_link || '#contact'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-white transition-all shadow-lg shadow-blue-600/50 w-full sm:w-auto justify-center"
                >
                  Начать бесплатно
                  <SafeIcon name="arrow-right" size={20} />
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-semibold text-white transition-all w-full sm:w-auto justify-center"
                >
                  Узнать больше
                </motion.a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <SafeIcon name="check" size={16} className="text-green-500" />
                  Без карты
                </span>
                <span className="flex items-center gap-2">
                  <SafeIcon name="check" size={16} className="text-green-500" />
                  Мгновенный доступ
                </span>
                <span className="flex items-center gap-2">
                  <SafeIcon name="check" size={16} className="text-green-500" />
                  24/7 поддержка
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2024 Все права защищены</p>
      </footer>
    </div>
  )
}

export default App