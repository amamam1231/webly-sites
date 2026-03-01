import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SafeIcon } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Введите сообщение'
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
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setIsSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {settings.show_hero !== false && (
        <section className="relative pt-32 pb-20 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                <span className="text-gradient">Добро пожаловать</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Оставьте свои контакты и мы свяжемся с вами в ближайшее время
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 flex justify-center gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
                }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Оставить заявку
                <SafeIcon name="arrow-down" size={20} />
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {settings.show_form !== false && (
        <section id="contact" className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-3xl p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-4">
                  <SafeIcon name="mail" size={32} className="text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Свяжитесь с нами</h2>
                <p className="text-gray-400">Заполните форму ниже</p>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full mb-4">
                      <SafeIcon name="check" size={40} className="text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Спасибо!</h3>
                    <p className="text-gray-400">Мы получили ваше сообщение и скоро свяжемся с вами.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Ваше имя
                      </label>
                      <div className="relative">
                        <SafeIcon name="user" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Иван Иванов"
                          className={cn(
                            "w-full pl-12 pr-4 py-3 bg-black/50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                            errors.name
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/50"
                          )}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <SafeIcon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ivan@example.com"
                          className={cn(
                            "w-full pl-12 pr-4 py-3 bg-black/50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                            errors.email
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/50"
                          )}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Сообщение
                      </label>
                      <div className="relative">
                        <SafeIcon name="message-square" size={20} className="absolute left-4 top-4 text-gray-500" />
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Расскажите о вашем проекте..."
                          rows={4}
                          className={cn(
                            "w-full pl-12 pr-4 py-3 bg-black/50 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none",
                            errors.message
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/50"
                          )}
                        />
                      </div>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить
                          <SafeIcon name="send" size={20} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      )}

      {settings.show_footer !== false && (
        <footer className="border-t border-gray-800 py-8 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                2024 Landing Page. Все права защищены.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon name="twitter" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon name="linkedin" size={20} />
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