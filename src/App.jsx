import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({ show_features: true, show_contact: true }))
  }, [])

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
    } catch (error) {
      setSubmitStatus('error')
    }

    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus(null), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="zap" size={20} className="text-white" />
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#hero" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Главная</a>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Особенности</a>
              <a href="#contact" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Контакты</a>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <nav className="flex flex-col p-4 gap-4">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Главная</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Особенности</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Контакты</a>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Простота
              </span>
              <br />
              <span className="text-white">в деталях</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Минималистичный подход к созданию цифровых продуктов.
              Чистый дизайн, интуитивная навигация и безупречный пользовательский опыт.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                Начать проект
                <SafeIcon name="arrowRight" size={20} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold transition-all border border-slate-700"
              >
                Узнать больше
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Почему мы?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых принципа, которыми мы руководствуемся в работе
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'zap', title: 'Скорость', desc: 'Быстрая разработка и оптимизированная загрузка сайта без компромиссов в качестве.' },
                { icon: 'shield', title: 'Надежность', desc: 'Современные технологии и лучшие практики безопасности для стабильной работы.' },
                { icon: 'sparkles', title: 'Эстетика', desc: 'Продуманный дизайн, который подчеркивает уникальность вашего бренда.' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
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

      {/* Contact/Footer Section */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-20 md:py-32 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Давайте работать вместе</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Готовы начать новый проект? Свяжитесь с нами любым удобным способом
                  или заполните форму справа.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mail" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Email</div>
                      <div className="font-medium">hello@example.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="phone" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Телефон</div>
                      <div className="font-medium">+7 (999) 123-45-67</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mapPin" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Адрес</div>
                      <div className="font-medium">Москва, Россия</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Сообщение</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500 resize-none"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                      isSubmitting
                        ? "bg-slate-700 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-600/25"
                    )}
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        Отправить сообщение
                        <SafeIcon name="send" size={20} />
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">Произошла ошибка. Попробуйте позже.</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <SafeIcon name="zap" size={14} className="text-white" />
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App