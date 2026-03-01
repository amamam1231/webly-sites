import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Send, CheckCircle, AlertCircle, Mail, User } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({ show_hero: true, show_form: true }))
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Введите имя'
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append('access_key', ACCESS_KEY)
      formDataObj.append('name', formData.name)
      formDataObj.append('email', formData.email)
      formDataObj.append('subject', 'Новая заявка с лендинга')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataObj
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '' })

        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email })
        })
      }
    } catch (error) {
      console.error('Error:', error)
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-20 pb-12 px-4 md:px-6"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Получите доступ к эксклюзивному контенту
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Оставьте свои контакты и получите бесплатный гайд по развитию бизнеса прямо сейчас
            </motion.p>
          </div>
        </motion.section>
      )}

      {settings.show_form !== false && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="py-12 px-4 md:px-6 pb-24"
        >
          <div className="container mx-auto max-w-md">
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Спасибо!</h3>
                  <p className="text-gray-400">Мы отправили материалы на ваш email</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ваше имя
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Иван Иванов"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300",
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
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email адрес
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300",
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
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Получить доступ
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default App