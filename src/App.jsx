import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({
    show_header: true,
    show_hero: true,
    show_footer: true,
    cta_link: "#contact"
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (response.ok) {
        alert('Спасибо! Мы получили ваше сообщение.')
        e.target.reset()
      }
    } catch (error) {
      console.error('Failed to submit lead:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {settings.show_header !== false && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              >
                LOGO
              </motion.div>

              <motion.nav
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-8"
              >
                <a href="#home" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Главная</a>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">О нас</a>
                <a href="#contact" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Контакты</a>
              </motion.nav>

              <button
                className="md:hidden text-slate-300 hover:text-white p-2"
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu')
                  mobileMenu?.classList.toggle('hidden')
                }}
              >
                <SafeIcon name="menu" size={24} />
              </button>
            </div>
          </div>

          <div id="mobile-menu" className="hidden md:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block text-slate-300 hover:text-white py-2">Главная</a>
              <a href="#about" className="block text-slate-300 hover:text-white py-2">О нас</a>
              <a href="#contact" className="block text-slate-300 hover:text-white py-2">Контакты</a>
            </div>
          </div>
        </header>
      )}

      <main className="pt-16 md:pt-20">
        {settings.show_hero !== false && (
          <section id="home" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 py-20 md:py-32">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                    Новое поколение решений
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
                >
                  Создаем будущее{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    прямо сейчас
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                  Минималистичный дизайн, максимальная эффективность.
                  Мы создаем решения, которые работают на ваш результат.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <a
                    href={settings.cta_link || '#contact'}
                    onClick={(e) => {
                      if (settings.cta_link?.startsWith('#')) {
                        e.preventDefault()
                        document.querySelector(settings.cta_link)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 text-center"
                  >
                    Начать проект
                  </a>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700 hover:border-slate-600 text-center"
                  >
                    Узнать больше
                  </a>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {settings.show_hero !== false && (
          <section id="about" className="py-20 md:py-32 bg-slate-950">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-3 gap-8 md:gap-12"
              >
                <div className="group p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                    <SafeIcon name="zap" size={24} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Быстрая скорость</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Оптимизированный код и современные технологии обеспечивают мгновенную загрузку страниц.
                  </p>
                </div>

                <div className="group p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                    <SafeIcon name="smartphone" size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Адаптивность</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Идеальное отображение на любом устройстве: от мобильных телефонов до широкоформатных мониторов.
                  </p>
                </div>

                <div className="group p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                    <SafeIcon name="palette" size={24} className="text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Минимализм</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Чистый дизайн без лишних элементов. Только важное для достижения ваших целей.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {settings.show_footer !== false && (
        <footer id="contact" className="py-16 md:py-20 bg-slate-950 border-t border-slate-800/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                  Свяжитесь с нами
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Готовы начать новый проект или есть вопросы?
                  Напишите нам и мы ответим в течение 24 часов.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="mail" size={20} className="text-indigo-400" />
                    </div>
                    <span>hello@example.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="phone" size={20} className="text-indigo-400" />
                    </div>
                    <span>+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="map-pin" size={20} className="text-indigo-400" />
                    </div>
                    <span>Москва, Россия</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Ваше имя</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="ivan@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Сообщение</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    Отправить сообщение
                  </button>
                </form>
              </motion.div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © 2024 Все права защищены
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                  <SafeIcon name="twitter" size={20} />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                  <SafeIcon name="github" size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App