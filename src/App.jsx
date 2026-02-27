import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const defaultSettings = {
  show_about: true,
  show_menu: true,
  show_contacts: true,
  hero_title: "Cafe Lounge",
  hero_subtitle: "Уютное место для встреч с друзьями, деловых обедов и романтических ужинов",
  about_title: "О нас",
  about_text: "Мы создали пространство, где каждый гость чувствует себя как дома. Наше кафе сочетает в себе современный дизайн и домашнюю атмосферу. Мы используем только свежие продукты от локальных поставщиков и готовим с любовью.",
  menu_title: "Наше меню",
  contact_phone: "+7 (999) 123-45-67",
  contact_address: "г. Москва, ул. Большая Дмитровка, 15",
  contact_email: "info@cafelounge.ru"
}

const menuItems = [
  { id: 1, name: "Капучино", price: "280 ₽", desc: "Классический итальянский кофе с нежной молочной пенкой", category: "coffee" },
  { id: 2, name: "Латте", price: "320 ₽", desc: "Мягкий кофе с обильным количеством молока", category: "coffee" },
  { id: 3, name: "Чизкейк Нью-Йорк", price: "450 ₽", desc: "Классический американский десерт с ягодным соусом", category: "dessert" },
  { id: 4, name: "Круассан с миндалем", price: "380 ₽", desc: "Свежая выпечка с миндальной начинкой", category: "dessert" },
  { id: 5, name: "Салат Цезарь", price: "650 ₽", desc: "С курицей, пармезаном и фирменной заправкой", category: "food" },
  { id: 6, name: "Паста Карбонара", price: "720 ₽", desc: "Спагетти с беконом, яйцом и сыром пармезан", category: "food" }
]

function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings))
  }, [])

  useEffect(() => {
    if (!settings.show_contacts || !mapContainer.current) return

    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [37.6156, 55.7522],
      zoom: 15,
      attributionControl: false
    })

    map.current.on('load', () => {
      new maplibregl.Marker({ color: '#f97316' })
        .setLngLat([37.6156, 55.7522])
        .addTo(map.current)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [settings.show_contacts])

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
        setFormData({ name: '', phone: '', message: '' })
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
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <SafeIcon name="coffee" size={28} className="text-orange-500" />
              <span className="text-xl font-bold">{settings.hero_title || 'Cafe Lounge'}</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {settings.show_about !== false && (
                <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  О нас
                </button>
              )}
              {settings.show_menu !== false && (
                <button onClick={() => scrollToSection('menu')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Меню
                </button>
              )}
              {settings.show_contacts !== false && (
                <button onClick={() => scrollToSection('contacts')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Контакты
                </button>
              )}
            </nav>

            <button
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {settings.show_about !== false && (
                <button onClick={() => scrollToSection('about')} className="text-left text-slate-300 hover:text-white py-2">
                  О нас
                </button>
              )}
              {settings.show_menu !== false && (
                <button onClick={() => scrollToSection('menu')} className="text-left text-slate-300 hover:text-white py-2">
                  Меню
                </button>
              )}
              {settings.show_contacts !== false && (
                <button onClick={() => scrollToSection('contacts')} className="text-left text-slate-300 hover:text-white py-2">
                  Контакты
                </button>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
              {settings.hero_title || 'Cafe Lounge'}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              {settings.hero_subtitle || 'Уютное место для встреч с друзьями, деловых обедов и романтических ужинов'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('menu')}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                Посмотреть меню
              </button>
              <button
                onClick={() => scrollToSection('contacts')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 border border-slate-700"
              >
                Забронировать стол
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80"
                alt="Cafe interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      {settings.show_about !== false && (
        <section id="about" className="py-20 md:py-32 bg-slate-950">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
                      alt="Cafe atmosphere"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  {settings.about_title || 'О нас'}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  {settings.about_text || 'Мы создали пространство, где каждый гость чувствует себя как дома. Наше кафе сочетает в себе современный дизайн и домашнюю атмосферу. Мы используем только свежие продукты от локальных поставщиков и готовим с любовью.'}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">5+</div>
                    <div className="text-sm text-slate-500">Лет работы</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">50+</div>
                    <div className="text-sm text-slate-500">Позиций меню</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">10к+</div>
                    <div className="text-sm text-slate-500">Гостей</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      {settings.show_menu !== false && (
        <section id="menu" className="py-20 md:py-32 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                {settings.menu_title || 'Наше меню'}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Откройте для себя разнообразие вкусов — от ароматного кофе до изысканных десертов
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                    <span className="text-xl font-bold text-orange-500">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <SafeIcon name="star" size={16} className="text-orange-500 fill-orange-500" />
                    <span className="text-sm text-slate-400">Популярный выбор</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacts Section */}
      {settings.show_contacts !== false && (
        <section id="contacts" className="py-20 md:py-32 bg-slate-950">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Контакты</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Приходите в гости или свяжитесь с нами для бронирования стола
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info & Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <SafeIcon name="phone" size={24} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p className="text-slate-400 text-sm">{settings.contact_phone || '+7 (999) 123-45-67'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <SafeIcon name="clock" size={24} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Режим работы</h3>
                      <p className="text-slate-400 text-sm">Ежедневно 9:00 — 23:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <SafeIcon name="map-pin" size={24} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-slate-400 text-sm">{settings.contact_address || 'г. Москва, ул. Большая Дмитровка, 15'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <SafeIcon name="mail" size={24} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-slate-400 text-sm">{settings.contact_email || 'info@cafelounge.ru'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-xl font-semibold mb-6">Забронировать стол</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Телефон"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Комментарий (необязательно)"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {formStatus === 'submitting' ? (
                        <span>Отправка...</span>
                      ) : (
                        <>
                          <span>Отправить заявку</span>
                          <SafeIcon name="send" size={18} />
                        </>
                      )}
                    </button>

                    {formStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center text-sm"
                      >
                        Спасибо! Мы свяжемся с вами в ближайшее время.
                      </motion.div>
                    )}

                    {formStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm"
                      >
                        Произошла ошибка. Пожалуйста, позвоните нам напрямую.
                      </motion.div>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-[500px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
              >
                <div ref={mapContainer} className="w-full h-full" />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <SafeIcon name="coffee" size={24} className="text-orange-500" />
              <span className="text-lg font-bold">{settings.hero_title || 'Cafe Lounge'}</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <SafeIcon name="instagram" size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <SafeIcon name="facebook" size={20} />
              </a>
            </div>

            <p className="text-slate-500 text-sm">
              © 2024 {settings.hero_title || 'Cafe Lounge'}. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App