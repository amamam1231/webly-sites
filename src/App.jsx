import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

function App() {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.log('Settings fetch failed, using defaults')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

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
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950 to-slate-950" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <SafeIcon name="zap" size={16} />
                Новое поколение решений
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent"
            >
              Создаем<br />будущее
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Минималистичный подход к максимальным результатам.
              Три простых шага к вашему успеху.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={settings.cta_link || '#features'}
                onClick={(e) => {
                  if (!settings.cta_link || settings.cta_link.startsWith('#')) {
                    e.preventDefault()
                    const target = document.getElementById('features')
                    if (target) target.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                Начать сейчас
                <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-300 hover:border-slate-600"
              >
                Связаться
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </motion.div>
        </section>
      )}

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16 sm:mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Почему мы?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых преимущества, которые делают нас лучшим выбором
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[
                {
                  icon: 'zap',
                  title: 'Скорость',
                  desc: 'Мгновенный запуск и быстрые результаты без лишних ожиданий'
                },
                {
                  icon: 'shield',
                  title: 'Надежность',
                  desc: 'Проверенные решения с гарантией стабильной работы 24/7'
                },
                {
                  icon: 'rocket',
                  title: 'Рост',
                  desc: 'Масштабируемая архитектура для развития вашего бизнеса'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:bg-slate-900"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <SafeIcon name={feature.icon} size={28} className="text-blue-400" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>

                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Block 3: Contact */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  Готовы начать?
                </h2>

                <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                  Оставьте заявку и мы свяжемся с вами в течение 24 часов
                </p>

                <form
                  className="max-w-md mx-auto space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    try {
                      await fetch('/api/leads', {
                        method: 'POST',
                        body: JSON.stringify({
                          email: formData.get('email'),
                          message: formData.get('message')
                        }),
                        headers: { 'Content-Type': 'application/json' }
                      })
                      alert('Спасибо! Мы получили вашу заявку.')
                      e.target.reset()
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                >
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Ваш email"
                      required
                      className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      name="message"
                      placeholder="Ваше сообщение"
                      rows="3"
                      className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-600/25"
                  >
                    <SafeIcon name="mail" size={20} />
                    Отправить заявку
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <SafeIcon name="check" size={16} className="text-green-500" />
                  <span>Или напишите нам на {settings.contact_email || 'hello@example.com'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <footer className="relative z-10 mt-20 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
            <p>© 2024 Minimal Landing. Все права защищены.</p>
          </footer>
        </section>
      )}
    </div>
  )
}

export default App