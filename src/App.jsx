import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({
        show_features: true,
        show_contact_form: true,
        cta_link: '#features',
        telegram_link: 'https://t.me/username',
        email_link: 'hello@example.com'
      }))
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 3000)
    }
  }

  const features = [
    {
      icon: 'zap',
      title: 'Молниеносная скорость',
      description: 'Оптимизированный код и современные технологии обеспечивают мгновенную загрузку страницы.'
    },
    {
      icon: 'shield',
      title: 'Надёжная защита',
      description: 'Все данные надёжно защищены современными протоколами шифрования и безопасности.'
    },
    {
      icon: 'rocket',
      title: 'Масштабируемость',
      description: 'Легко масштабируемая архитектура позволяет расти вместе с вашим бизнесом.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <SafeIcon name="check" size={16} />
              Новое поколение решений
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          >
            Создавайте
            <br />
            будущее
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Простой, быстрый и эффективный инструмент для реализации ваших идей.
            Без лишних сложностей — только результат.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={settings.cta_link || '#features'}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector(settings.cta_link || '#features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
            >
              Начать сейчас
              <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={settings.telegram_link || 'https://t.me/username'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-300 hover:border-slate-600"
            >
              Написать нам
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" ref={featuresRef} className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
                Почему выбирают нас
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых преимущества, которые делают нас лучшим выбором
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6 lg:gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer / Contact Section */}
      <footer className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left side - Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Свяжитесь с нами
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Готовы начать? Оставьте заявку и мы свяжемся с вами в ближайшее время.
              </p>

              <div className="space-y-4">
                <a
                  href={`mailto:${settings.email_link || 'hello@example.com'}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <SafeIcon name="mail" size={20} />
                  </div>
                  <span>{settings.email_link || 'hello@example.com'}</span>
                </a>

                <a
                  href={settings.telegram_link || 'https://t.me/username'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <SafeIcon name="send" size={20} />
                  </div>
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Right side - Form */}
            {settings.show_contact_form !== false && (
              <motion.form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Сообщение
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        Отправить заявку
                        <SafeIcon name="arrow-right" size={20} />
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">
                      Произошла ошибка. Попробуйте позже.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Все права защищены
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white shadow-lg transition-all duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          pointerEvents: showScrollTop ? 'auto' : 'none'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <SafeIcon name="arrow-up" size={20} />
      </motion.button>
    </div>
  )
}

export default App