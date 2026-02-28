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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({
        show_hero: true,
        show_features: true,
        cta_link: '#contact',
        contact_email: 'hello@example.com'
      }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {settings.show_hero !== false && (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950" />

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
            >
              <SafeIcon name="sparkles" size={16} />
              <span className="text-sm font-medium">Новое поколение решений</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-slate-400 bg-clip-text text-transparent">
              Создаем<br />будущее
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Инновационные решения для вашего бизнеса. Просто, быстро, эффективно.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={settings.cta_link || '#contact'}
                onClick={(e) => {
                  if (settings.cta_link?.startsWith('#')) {
                    e.preventDefault()
                    document.querySelector(settings.cta_link)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                Начать сейчас
                <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full font-semibold text-slate-300 transition-all duration-300"
              >
                Узнать больше
              </button>
            </div>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </div>
        </section>
      )}

      {settings.show_features !== false && (
        <section id="features" className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Почему выбирают нас
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Мы объединяем передовые технологии и простоту использования
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'zap',
                  title: 'Быстрота',
                  desc: 'Мгновенный запуск и высокая производительность системы'
                },
                {
                  icon: 'shield',
                  title: 'Надежность',
                  desc: 'Защита данных и стабильная работа 24/7 без сбоев'
                },
                {
                  icon: 'sparkles',
                  title: 'Инновации',
                  desc: 'Современные решения для роста вашего бизнеса'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <SafeIcon name={item.icon} size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-slate-900 border border-slate-800"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать?</h3>
                <p className="text-slate-400 mb-8">
                  Оставьте заявку и мы свяжемся с вами в ближайшее время
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-white placeholder:text-slate-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-white placeholder:text-slate-500"
                    />
                  </div>
                  <textarea
                    placeholder="Сообщение"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-white placeholder:text-slate-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Отправка...
                      </span>
                    ) : formStatus === 'success' ? (
                      <span>Отправлено!</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <SafeIcon name="mail" size={20} />
                        Отправить заявку
                      </span>
                    )}
                  </button>

                  {formStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-green-400 text-sm"
                    >
                      Спасибо! Мы получили вашу заявку.
                    </motion.p>
                  )}
                  {formStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-red-400 text-sm"
                    >
                      Произошла ошибка. Попробуйте позже.
                    </motion.p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <footer className="py-8 px-4 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>2024 Лендинг. Все права защищены.</p>
          <p>{settings.contact_email || 'hello@example.com'}</p>
        </div>
      </footer>
    </div>
  )
}

export default App