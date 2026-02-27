import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import * as LucideIcons from 'lucide-react'
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({
    show_hero: true,
    show_menu: true,
    show_contacts: true,
    hero_title: "Кафе Уют",
    hero_subtitle: "Вкусная еда, теплая атмосфера, незабываемые моменты",
    cafe_name: "Кафе Уют",
    contact_phone: "+7 (999) 123-45-67",
    contact_address: "г. Москва, ул. Пушкина, д. 10",
    contact_email: "info@cafe-uyut.ru",
    working_hours: "Ежедневно с 9:00 до 23:00"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const heroRef = useRef(null)
  const menuRef = useRef(null)
  const contactsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const menuInView = useInView(menuRef, { once: true, margin: "-100px" })
  const contactsInView = useInView(contactsRef, { once: true, margin: "-100px" })

  const scrollToSection = (e, ref) => {
    e.preventDefault()
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'cafe-website',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', phone: '', message: '' })
        setTimeout(() => setFormStatus('idle'), 3000)
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  const menuItems = [
    { name: "Капучино", price: "180 ₽", desc: "Классический итальянский кофе", icon: "coffee" },
    { name: "Круассан", price: "120 ₽", desc: "Сливочный французский круассан", icon: "cookie" },
    { name: "Чизкейк", price: "250 ₽", desc: "Нью-Йоркский чизкейк", icon: "cake" },
    { name: "Латте", price: "200 ₽", desc: "Нежный кофе с молоком", icon: "coffee" },
    { name: "Салат Цезарь", price: "350 ₽", desc: "С курицей и пармезаном", icon: "salad" },
    { name: "Бургер", price: "420 ₽", desc: "Сочный бургер с говядиной", icon: "beef" }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <SafeIcon name="utensils" size={28} className="text-amber-500" />
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                {settings.cafe_name || "Кафе Уют"}
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={(e) => scrollToSection(e, heroRef)} className="text-sm font-medium text-gray-300 hover:text-amber-500 transition-colors">
                Главная
              </button>
              <button onClick={(e) => scrollToSection(e, menuRef)} className="text-sm font-medium text-gray-300 hover:text-amber-500 transition-colors">
                Меню
              </button>
              <button onClick={(e) => scrollToSection(e, contactsRef)} className="text-sm font-medium text-gray-300 hover:text-amber-500 transition-colors">
                Контакты
              </button>
            </nav>

            <button
              onClick={(e) => scrollToSection(e, contactsRef)}
              className="md:hidden p-2 text-gray-300 hover:text-amber-500"
            >
              <SafeIcon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      {settings.show_hero !== false && (
        <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {settings.hero_title || "Кафе Уют"}
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                {settings.hero_subtitle || "Вкусная еда, теплая атмосфера, незабываемые моменты"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={(e) => scrollToSection(e, menuRef)}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-amber-500/25"
                >
                  Смотреть меню
                </button>
                <button
                  onClick={(e) => scrollToSection(e, contactsRef)}
                  className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:border-amber-500 text-white font-semibold rounded-full transition-all"
                >
                  Забронировать стол
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-amber-500/50 transition-all">
                <SafeIcon name="clock" size={32} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Часы работы</h3>
                <p className="text-gray-400 text-sm">{settings.working_hours || "Ежедневно 9:00-23:00"}</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-amber-500/50 transition-all">
                <SafeIcon name="map-pin" size={32} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Адрес</h3>
                <p className="text-gray-400 text-sm">{settings.contact_address || "г. Москва, ул. Пушкина, д. 10"}</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-amber-500/50 transition-all">
                <SafeIcon name="phone" size={32} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Телефон</h3>
                <p className="text-gray-400 text-sm">{settings.contact_phone || "+7 (999) 123-45-67"}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {settings.show_menu !== false && (
        <section ref={menuRef} className="py-20 md:py-32 px-4 bg-slate-950">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={menuInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                Наше меню
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Попробуйте наши фирменные блюда и напитки, приготовленные с любовью
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={menuInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <SafeIcon name={item.icon} size={24} className="text-amber-500" />
                    </div>
                    <span className="text-2xl font-bold text-amber-500">{item.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.show_contacts !== false && (
        <section ref={contactsRef} className="py-20 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-gray-900/50 to-slate-950" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={contactsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                Свяжитесь с нами
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Забронируйте столик или задайте вопрос — мы всегда рады помочь
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={contactsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p className="text-gray-400">{settings.contact_address}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <p className="text-gray-400">{settings.contact_phone}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mail" size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">{settings.contact_email}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <SafeIcon name="clock" size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Режим работы</h3>
                    <p className="text-gray-400">{settings.working_hours}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={contactsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8"
              >
                <h3 className="text-2xl font-bold mb-6">Отправить сообщение</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-white"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-white"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Сообщение</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-white resize-none"
                      placeholder="Хочу забронировать столик на 2 человек..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-slate-950 font-bold rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
                        Отправка...
                      </>
                    ) : formStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        <SafeIcon name="send" size={20} />
                        Отправить
                      </>
                    )}
                  </button>
                  {formStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">Ошибка отправки. Попробуйте позже.</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-gray-800 py-8 px-4 bg-slate-950 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SafeIcon name="utensils" size={24} className="text-amber-500" />
              <span className="text-lg font-bold">{settings.cafe_name || "Кафе Уют"}</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Все права защищены
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="instagram" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="facebook" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="twitter" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App