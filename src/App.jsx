import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const features = [
  {
    icon: 'clock',
    title: 'Быстрый ответ',
    description: 'Мы свяжемся с вами в течение 15 минут в рабочее время'
  },
  {
    icon: 'shield',
    title: 'Гарантия качества',
    description: '100% гарантия результата или вернём деньги'
  },
  {
    icon: 'star',
    title: 'Опыт 10+ лет',
    description: 'Более 1000 успешных проектов за нашу историю'
  }
]

const testimonials = [
  {
    name: 'Александр М.',
    text: 'Отличный сервис! Перезвонили через 10 минут, всё объяснили понятно.'
  },
  {
    name: 'Елена К.',
    text: 'Очень довольна результатом. Рекомендую всем друзьям!'
  }
]

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно быть не менее 2 символов'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '' })
      } else {
        throw new Error('Submit failed')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight">ConsultPro</span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Контакты
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="contact" className="pt-32 pb-20 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                  Получите бесплатную
                  <span className="text-blue-500"> консультацию</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Заполните форму ниже, и наш эксперт свяжется с вами, чтобы обсудить ваш проект и ответить на все вопросы.
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <SafeIcon name="check-circle" size={16} className="text-blue-500" />
                    <span>Бесплатно</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SafeIcon name="check-circle" size={16} className="text-blue-500" />
                    <span>Без обязательств</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SafeIcon name="check-circle" size={16} className="text-blue-500" />
                    <span>Конфиденциально</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6">Оставить заявку</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Ваше имя
                      </label>
                      <div className="relative">
                        <SafeIcon
                          name="user"
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={cn(
                            "w-full bg-slate-950 border rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.name ? "border-red-500" : "border-slate-700"
                          )}
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <SafeIcon
                          name="mail"
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={cn(
                            "w-full bg-slate-950 border rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.email ? "border-red-500" : "border-slate-700"
                          )}
                          placeholder="ivan@example.com"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Отправить заявку
                          <SafeIcon name="arrow-right" size={18} />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg p-4 flex items-start gap-3"
                        >
                          <SafeIcon name="check-circle" size={20} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Заявка отправлена!</p>
                            <p className="text-sm text-green-400/80">Мы свяжемся с вами в ближайшее время.</p>
                          </div>
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4 text-center"
                        >
                          <p>Ошибка отправки. Попробуйте ещё раз.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-xs text-slate-500 text-center">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {settings.show_features !== false && (
          <section className="py-20 px-4 md:px-6 bg-slate-950/50">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                      <SafeIcon name={feature.icon} size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {settings.show_testimonials !== false && (
          <section className="py-20 px-4 md:px-6">
            <div className="container mx-auto max-w-7xl">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12"
              >
                Что говорят клиенты
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {testimonials.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/30 border border-slate-800 rounded-xl p-6"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon key={i} name="star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">"{item.text}"</p>
                    <p className="text-sm font-medium text-slate-500">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 ConsultPro. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App