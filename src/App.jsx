import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import * as LucideIcons from 'lucide-react'
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Menu items data
const menuItems = [
  {
    id: 1,
    name: "Бефстроганов",
    description: "Нежная говядина в сливочном соусе с грибами, подается с картофельным пюре",
    price: "650 ₽",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80"
  },
  {
    id: 2,
    name: "Цезарь с курицей",
    description: "Классический салат с хрустящим айсбергом, куриной грудкой, пармезаном и соусом цезарь",
    price: "480 ₽",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80"
  },
  {
    id: 3,
    name: "Паста Карбонара",
    description: "Спагетти в нежном соусе из яиц, пармезана и гуанчиале с черным перцем",
    price: "520 ₽",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80"
  },
  {
    id: 4,
    name: "Чизкейк Нью-Йорк",
    description: "Классический американский чизкейк с ягодным соусом и мятой",
    price: "380 ₽",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80"
  },
  {
    id: 5,
    name: "Утиная грудка",
    description: "Запеченная утиная грудка с карамелизированным яблоком и брусничным соусом",
    price: "720 ₽",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80"
  },
  {
    id: 6,
    name: "Тирамису",
    description: "Итальянский десерт из маскарпоне, кофе и какао",
    price: "420 ₽",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80"
  }
]

// Default settings
const defaultSettings = {
  hero_title: "Кафе Уют",
  hero_subtitle: "Домашняя кухня с душой",
  hero_description: "Проведите время в атмосфере тепла и комфорта. Вкусная еда, приготовленная с любовью, и уютный интерьер ждут вас.",
  contact_phone: "+7 (999) 123-45-67",
  contact_address: "г. Москва, ул. Лесная, д. 15",
  contact_email: "info@cafe-uyut.ru",
  booking_button_text: "Забронировать стол",
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.0!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIxLjAiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sru!2sru!4v1234567890",
  show_hero: true,
  show_menu: true,
  show_contacts: true,
  telegram_chat_id: ""
}

function App() {
  const [settings, setSettings] = useState(defaultSettings)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
      })
      .catch(err => {
        console.log('Using default settings')
      })
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          type: 'table_booking',
          telegram_chat_id: settings.telegram_chat_id
        })
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setIsBookingModalOpen(false)
          setSubmitSuccess(false)
          setBookingForm({ name: "", phone: "", date: "", time: "", guests: "2" })
        }, 2000)
      }
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <SafeIcon name="utensils" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-stone-900">{settings.hero_title || 'Кафе'}</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('hero')} className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                Главная
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                Меню
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                Контакты
              </button>
            </nav>

            <div className="hidden md:block">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
              >
                {settings.booking_button_text || 'Забронировать'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <SafeIcon name={isMobileMenuOpen ? "x" : "menu"} size={24} className="text-stone-900" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-200"
            >
              <div className="px-4 py-4 space-y-3">
                <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-2 text-stone-600 font-medium">
                  Главная
                </button>
                <button onClick={() => scrollToSection('menu')} className="block w-full text-left py-2 text-stone-600 font-medium">
                  Меню
                </button>
                <button onClick={() => scrollToSection('contacts')} className="block w-full text-left py-2 text-stone-600 font-medium">
                  Контакты
                </button>
                <button
                  onClick={() => {
                    setIsBookingModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-orange-600 text-white py-3 rounded-full font-medium mt-2"
                >
                  {settings.booking_button_text || 'Забронировать стол'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      {settings.show_hero !== false && (
        <section id="hero" className="pt-24 md:pt-32 pb-16 md:pb-24">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight mb-4">
                  {settings.hero_title || 'Кафе Уют'}
                </h1>
                <p className="text-xl md:text-2xl text-orange-600 font-semibold mb-4">
                  {settings.hero_subtitle || 'Домашняя кухня с душой'}
                </p>
                <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-lg">
                  {settings.hero_description || 'Проведите время в атмосфере тепла и комфорта. Вкусная еда, приготовленная с любовью.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/25"
                  >
                    {settings.booking_button_text || 'Забронировать стол'}
                  </button>
                  <button
                    onClick={() => scrollToSection('menu')}
                    className="bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-200 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:border-orange-600 hover:text-orange-600"
                  >
                    Смотреть меню
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                    alt="Интерьер кафе"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <SafeIcon name="star" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">4.9</p>
                      <p className="text-sm text-stone-500">Рейтинг на Google</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      {settings.show_menu !== false && (
        <section id="menu" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 mb-4">
                Наше меню
              </h2>
              <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                Блюда, приготовленные из свежих ингредиентов по традиционным рецептам с современным акцентом
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-stone-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-stone-900">{item.name}</h3>
                      <span className="text-orange-600 font-bold text-lg">{item.price}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacts Section */}
      {settings.show_contacts !== false && (
        <section id="contacts" className="py-16 md:py-24 bg-stone-100">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 mb-4">
                Контакты
              </h2>
              <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                Мы всегда рады видеть вас. Приходите или свяжитесь с нами удобным способом
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="map-pin" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Адрес</h3>
                      <p className="text-stone-600">{settings.contact_address || 'г. Москва, ул. Лесная, д. 15'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="phone" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Телефон</h3>
                      <a href={`tel:${settings.contact_phone}`} className="text-stone-600 hover:text-orange-600 transition-colors">
                        {settings.contact_phone || '+7 (999) 123-45-67'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="mail" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Email</h3>
                      <a href={`mailto:${settings.contact_email}`} className="text-stone-600 hover:text-orange-600 transition-colors">
                        {settings.contact_email || 'info@cafe-uyut.ru'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="clock" size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Часы работы</h3>
                      <p className="text-stone-600">Пн-Вс: 10:00 - 23:00</p>
                      <p className="text-stone-500 text-sm mt-1">Без выходных</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg bg-stone-200"
              >
                <iframe
                  src={settings.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.0!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIxLjAiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sru!2sru!4v1234567890"}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Карта расположения"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 md:py-16 pb-20 md:pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <SafeIcon name="utensils" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">{settings.hero_title || 'Кафе Уют'}</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Домашняя кухня, уютная атмосфера и заботливый сервис для всей семьи
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Навигация</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="text-stone-400 hover:text-white transition-colors">
                    Главная
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('menu')} className="text-stone-400 hover:text-white transition-colors">
                    Меню
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contacts')} className="text-stone-400 hover:text-white transition-colors">
                    Контакты
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Контакты</h4>
              <ul className="space-y-2 text-stone-400">
                <li>{settings.contact_phone || '+7 (999) 123-45-67'}</li>
                <li>{settings.contact_address || 'г. Москва, ул. Лесная, д. 15'}</li>
                <li>{settings.contact_email || 'info@cafe-uyut.ru'}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">
              © 2024 {settings.hero_title || 'Кафе Уют'}. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsBookingModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-900">Забронировать стол</h3>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <SafeIcon name="x" size={20} className="text-stone-500" />
                </button>
              </div>

              <div className="p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafeIcon name="check" size={32} className="text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-stone-900 mb-2">Заявка отправлена!</h4>
                    <p className="text-stone-600">Мы свяжемся с вами для подтверждения бронирования</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Ваше имя</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                        placeholder="Иван Иванов"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Телефон</label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Дата</label>
                        <input
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Время</label>
                        <input
                          type="time"
                          required
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Количество гостей</label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        'Отправить заявку'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App