import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Menu, X, ArrowRight, Sparkles, Zap, Shield, Mail, Phone, MapPin } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function AnimatedSection({ children, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
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

  const scrollToSection = (id) => {
    setIsMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="font-bold text-xl tracking-tight">Просто Сайт</div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">О нас</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Возможности</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Контакты</button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-sm font-medium text-gray-600 py-2">О нас</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-sm font-medium text-gray-600 py-2">Возможности</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-sm font-medium text-gray-600 py-2">Контакты</button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Просто<br />
              <span className="text-blue-600">отличный</span> сайт
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Минималистичный дизайн, чистый код и интуитивная навигация.
              Всё, что нужно для вашего присутствия в сети.
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Начать проект
              <SafeIcon name="ArrowRight" size={18} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* About */}
      {settings.show_about !== false && (
        <section id="about" className="py-20 md:py-32 px-4 md:px-6 bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                    Простота — это сложность, которую вы держите под контролем
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Мы создаём сайты, которые работают. Без лишних элементов,
                    без перегруза, без отвлекающих факторов. Только контент,
                    который важен для ваших посетителей.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Лёгкая расширяемость, чистый код и современные технологии
                    делают наши решения надёжными и долговечными.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl flex items-center justify-center">
                    <SafeIcon name="Sparkles" size={64} className="text-blue-600" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Возможности</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Всё необходимое для успешного веб-присутствия
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'Zap', title: 'Быстрая загрузка', desc: 'Оптимизированный код и ресурсы для мгновенной загрузки страниц' },
                { icon: 'Shield', title: 'Надёжность', desc: 'Современные технологии обеспечивают стабильную работу 24/7' },
                { icon: 'Sparkles', title: 'Чистый дизайн', desc: 'Минималистичный интерфейс без отвлекающих элементов' }
              ].map((feature, index) => (
                <AnimatedSection key={index}>
                  <div className="p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                      <SafeIcon name={feature.icon} size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-20 md:py-32 px-4 md:px-6 bg-gray-900 text-white">
          <div className="container mx-auto max-w-7xl">
            <AnimatedSection>
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Свяжитесь с нами</h2>
                <p className="text-gray-400">
                  Готовы начать? Заполните форму ниже, и мы свяжемся с вами
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Сообщение"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? 'Отправка...' : formStatus === 'success' ? 'Отправлено!' : 'Отправить сообщение'}
                  </button>

                  {formStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 text-center text-sm"
                    >
                      Спасибо! Мы получили ваше сообщение.
                    </motion.p>
                  )}

                  {formStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-center text-sm"
                    >
                      Ошибка отправки. Попробуйте позже.
                    </motion.p>
                  )}
                </form>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-gray-400">
                  <a href="mailto:hello@example.com" className="flex items-center gap-2 hover:text-white transition-colors">
                    <SafeIcon name="Mail" size={18} />
                    hello@example.com
                  </a>
                  <a href="tel:+79999999999" className="flex items-center gap-2 hover:text-white transition-colors">
                    <SafeIcon name="Phone" size={18} />
                    +7 (999) 999-99-99
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-gray-200">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © 2024 Просто Сайт. Все права защищены.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('about')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">О нас</button>
              <button onClick={() => scrollToSection('features')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Возможности</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Контакты</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App