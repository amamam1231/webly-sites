import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ArrowRight, Zap, Shield, Sparkles, Mail, Send } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, source: 'landing_page' })
      })
      setIsSuccess(true)
      setFormData({ email: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Block 1: Hero */}
      {settings.show_hero !== false && (
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

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
              <SafeIcon name="Sparkles" size={16} />
              <span>Новое поколение решений</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Создайте<br />будущее
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Минималистичный подход к максимальным результатам.
              Простота, скорость и эффективность в каждой детали.
            </p>

            <motion.a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-600/25"
            >
              Начать сейчас
              <SafeIcon name="ArrowRight" size={20} />
            </motion.a>
          </motion.div>
        </section>
      )}

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
                Почему мы?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых преимущества, которые делают нас лучшим выбором
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: 'Zap',
                  title: 'Молниеносная скорость',
                  description: 'Оптимизированная производительность для мгновенной загрузки и отклика'
                },
                {
                  icon: 'Shield',
                  title: 'Надёжная защита',
                  description: 'Ваши данные под надёжной защитой современных технологий безопасности'
                },
                {
                  icon: 'Sparkles',
                  title: 'Идеальный дизайн',
                  description: 'Продуманный до мелочей интерфейс, который работает на ваш результат'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <SafeIcon name={feature.icon} size={28} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Block 3: Footer/CTA */}
      {settings.show_footer !== false && (
        <footer id="cta" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
                Готовы начать?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Подпишитесь на обновления и будьте первыми, кто получит доступ к новым возможностям
              </p>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400"
                >
                  <SafeIcon name="Send" size={20} />
                  <span className="font-medium">Спасибо! Мы скоро с вами свяжемся</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <SafeIcon name="Mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="Ваш email"
                      value={formData.email}
                      onChange={(e) => setFormData({ email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Подписаться
                        <SafeIcon name="ArrowRight" size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
                <p>© 2024 Все права защищены</p>
                <div className="flex items-center gap-6">
                  <a href={settings.privacy_link || '#'} className="hover:text-white transition-colors">Политика конфиденциальности</a>
                  <a href={settings.terms_link || '#'} className="hover:text-white transition-colors">Условия использования</a>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App