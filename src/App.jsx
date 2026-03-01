import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Utility for Tailwind classes
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({
    show_hero: true,
    show_features: true,
    show_cta: true
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})
  }, [])

  const handleFormSubmit = async (e) => {
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
        setFormData({ name: '', email: '' })
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl tracking-tight"
            >
              Brand
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['hero', 'features', 'cta'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-sm text-gray-400 hover:text-white transition-colors capitalize"
                >
                  {section === 'hero' ? 'Главная' : section === 'features' ? 'Услуги' : 'Контакты'}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 border-t border-gray-900/30"
          >
            <div className="px-4 py-4 space-y-3">
              {['hero', 'features', 'cta'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left py-2 text-gray-400 hover:text-white capitalize"
                >
                  {section === 'hero' ? 'Главная' : section === 'features' ? 'Услуги' : 'Контакты'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Block 1: Hero */}
      {settings.show_hero !== false && (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
                Новое поколение решений
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
                Создаем <br/>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  будущее
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Минималистичный подход к максимальным результатам. Мы превращаем сложные идеи в простые решения.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('cta')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-blue-600/30"
              >
                Начать проект
                <SafeIcon name="arrowRight" size={20} />
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Три ключевых преимущества, которые делают нас лучшими в своем деле
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: 'zap',
                  title: 'Скорость',
                  desc: 'Мгновенная реакция и быстрая реализация проектов любой сложности'
                },
                {
                  icon: 'shield',
                  title: 'Надежность',
                  desc: 'Гарантия качества и поддержка на каждом этапе работы'
                },
                {
                  icon: 'sparkles',
                  title: 'Качество',
                  desc: 'Внимание к деталям и стремление к совершенству'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <SafeIcon name={feature.icon} size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Block 3: CTA */}
      {settings.show_cta !== false && (
        <section id="cta" className="py-24 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Готовы начать?
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Оставьте свои контакты и мы свяжемся с вами в течение 24 часов
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-800 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formStatus === 'submitting'}
                    type="submit"
                    className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mx-auto"
                  >
                    {formStatus === 'submitting' ? (
                      'Отправка...'
                    ) : formStatus === 'success' ? (
                      'Отправлено!'
                    ) : (
                      <>
                        Отправить заявку
                        <SafeIcon name="mail" size={20} />
                      </>
                    )}
                  </motion.button>

                  {formStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 text-sm"
                    >
                      Спасибо! Мы получили вашу заявку.
                    </motion.p>
                  )}
                  {formStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm"
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

      {/* Footer */}
      <footer className="py-8 border-t border-gray-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2024 Brand. Все права защищены.</p>
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