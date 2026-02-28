import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ArrowDown, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({
    show_features: true,
    show_footer: true,
    cta_link: "#features",
    contact_email: "hello@example.com"
  })

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_page' })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setEmail('')
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
      icon: "CheckCircle",
      title: "Быстрая загрузка",
      description: "Оптимизированный код для мгновенной загрузки страницы"
    },
    {
      icon: "CheckCircle",
      title: "Адаптивный дизайн",
      description: "Идеально выглядит на любых устройствах — от телефона до десктопа"
    },
    {
      icon: "CheckCircle",
      title: "Простота использования",
      description: "Интуитивно понятный интерфейс без лишних сложностей"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      {/* Block 1: Header/Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Создаем будущее
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Простое и эффективное решение для вашего бизнеса.
            Минимализм, скорость и результат.
          </p>
          <a
            href={settings.cta_link || "#features"}
            onClick={(e) => {
              e.preventDefault()
              document.querySelector(settings.cta_link || "#features")?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            Узнать больше
            <SafeIcon name="ArrowDown" size={20} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши преимущества</h2>
              <p className="text-gray-400 text-lg">Почему выбирают именно нас</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Lead Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 max-w-md mx-auto"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  required
                  className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? 'Отправка...' : 'Подписаться'}
                </button>
              </form>
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-center mt-3 text-sm"
                >
                  Спасибо! Мы свяжемся с вами.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center mt-3 text-sm"
                >
                  Ошибка отправки. Попробуйте позже.
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Block 3: Footer */}
      {settings.show_footer !== false && (
        <footer className="border-t border-white/10 py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4">О нас</h3>
                <p className="text-gray-400 leading-relaxed">
                  Мы создаем простые и эффективные решения для современного бизнеса.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Контакты</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-400">
                    <SafeIcon name="Mail" size={18} />
                    <a href={`mailto:${settings.contact_email || 'hello@example.com'}`} className="hover:text-blue-400 transition-colors">
                      {settings.contact_email || 'hello@example.com'}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <SafeIcon name="Phone" size={18} />
                    <span>+7 (999) 123-45-67</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <SafeIcon name="MapPin" size={18} />
                    <span>Москва, Россия</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Соцсети</h3>
                <div className="flex gap-4">
                  {['Telegram', 'VK', 'WhatsApp'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    >
                      <span className="text-xs font-bold">{social[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2024 Все права защищены
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white transition-colors">Условия использования</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App