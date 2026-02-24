import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "Как записаться на стрижку?",
    answer: "Вы можете записаться через форму на сайте, позвонить по телефону +7 (999) 123-45-67 или написать нам в Telegram.",
    keywords: ["записаться", "запись", "как записаться", "стрижка", "бронь"]
  },
  {
    question: "Какие цены на услуги?",
    answer: "Мужская стрижка — 1500₽, Стрижка бороды — 800₽, Королевское бритьё — 1200₽, Комплекс — 2500₽. Полный прайс в разделе 'Услуги'.",
    keywords: ["цена", "стоимость", "прайс", "сколько стоит", "ценник"]
  },
  {
    question: "Где находится барбершоп?",
    answer: "Мы находимся по адресу: г. Москва, ул. Барберская, д. 42. Работаем ежедневно с 10:00 до 22:00.",
    keywords: ["адрес", "где", "находиться", "локация", "карта"]
  },
  {
    question: "Нужно ли записываться заранее?",
    answer: "Да, рекомендуем записываться заранее, особенно на вечерние часы и выходные. Но иногда есть возможность принять и без записи — лучше уточнить по телефону.",
    keywords: ["заранее", "предварительно", "запись", "очередь"]
  }
]

const SITE_CONTEXT = "Sergio Musel — премиум барбершоп в Москве. Мастер Sergio специализируется на классических и современных мужских стрижках, бритье опасной бритвой, уходе за бородой. Атмосфера: винтаж, джаз, виски. Цены: стрижка 1500₽, борода 800₽, бритьё 1200₽. Адрес: ул. Барберская 42. Тел: +7 (999) 123-45-67."

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Здравствуйте! Я помощник Sergio Musel. Чем могу помочь?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (text) => {
    const lowerText = text.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerText.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsLoading(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsLoading(false)
      }, 500)
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.reply || 'Извините, я не понял вопрос. Позвоните нам: +7 (999) 123-45-67' }])
      } else {
        throw new Error('API Error')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'К сожалению, я не могу ответить на этот вопрос. Позвоните нам: +7 (999) 123-45-67 или выберите вопрос из FAQ:\n• Как записаться?\n• Какие цены?\n• Где находитесь?'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-600 hover:bg-amber-500 rounded-full shadow-lg shadow-amber-600/30 flex items-center justify-center transition-colors"
      >
        {isOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="message-square" size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-amber-600 px-4 py-3 flex items-center gap-2">
              <SafeIcon name="bot" size={20} className="text-white" />
              <span className="font-semibold text-white">Sergio Assistant</span>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-950">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-gray-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 px-3 py-2 rounded-lg flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
              >
                <SafeIcon name="send" size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [formState, setFormState] = useState({ name: '', phone: '', service: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const mapContainer = useRef(null)
  const map = useRef(null)

  // Services data
  const services = [
    { name: 'Мужская стрижка', price: '1500₽', time: '45 мин' },
    { name: 'Стрижка бороды', price: '800₽', time: '30 мин' },
    { name: 'Королевское бритьё', price: '1200₽', time: '40 мин' },
    { name: 'Комплекс (стрижка + борода)', price: '2500₽', time: '75 мин' },
    { name: 'Укладка волос', price: '400₽', time: '15 мин' },
    { name: 'Окантовка', price: '600₽', time: '20 мин' },
  ]

  // Gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1599351431202-0e671340044d?w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
  ]

  // Reviews data
  const reviews = [
    { name: 'Александр', text: 'Лучший барбер в городе! Sergio знает своё дело. Атмосфера потрясающая.', rating: 5 },
    { name: 'Дмитрий', text: 'Хожу только сюда уже год. Всегда идеальный результат и приятное общение.', rating: 5 },
    { name: 'Михаил', text: 'Наконец-то нашёл своего мастера. Борода теперь в идеальном состоянии.', rating: 5 },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [37.6173, 55.7558],
        zoom: 13,
        attributionControl: false
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

      new maplibregl.Marker({ color: '#d97706' })
        .setLngLat([37.6173, 55.7558])
        .setPopup(new maplibregl.Popup().setHTML('<p style="color:black;font-weight:bold;">Sergio Musel</p><p style="color:black;">ул. Барберская, 42</p>'))
        .addTo(map.current)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')
      formData.append('name', formState.name)
      formData.append('phone', formState.phone)
      formData.append('service', formState.service)
      formData.append('subject', 'Новая запись в Sergio Musel')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormState({ name: '', phone: '', service: '' })
        // Also save to D1 via API
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formState.name, phone: formState.phone, service: formState.service })
        })
      } else {
        throw new Error('Submit failed')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 vintage-texture">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <SafeIcon name="scissors" size={28} className="text-amber-500" />
              <span className="font-serif text-xl md:text-2xl font-bold text-white">Sergio Musel</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Главная', 'Услуги', 'Галерея', 'О мастере', 'Отзывы', 'Контакты'].map((item, idx) => {
                const ids = ['hero', 'services', 'gallery', 'about', 'reviews', 'contacts']
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(ids[idx])}
                    className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-medium"
                  >
                    {item}
                  </button>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+79991234567" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                <SafeIcon name="phone" size={18} />
                <span className="font-semibold">+7 (999) 123-45-67</span>
              </a>
            </div>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-b border-slate-800"
            >
              <div className="px-4 py-4 space-y-3">
                {['Главная', 'Услуги', 'Галерея', 'О мастере', 'Отзывы', 'Контакты'].map((item, idx) => {
                  const ids = ['hero', 'services', 'gallery', 'about', 'reviews', 'contacts']
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(ids[idx])}
                      className="block w-full text-left text-gray-300 hover:text-amber-500 py-2 transition-colors"
                    >
                      {item}
                    </button>
                  )
                })}
                <a href="tel:+79991234567" className="flex items-center gap-2 text-amber-500 pt-4 border-t border-slate-800">
                  <SafeIcon name="phone" size={18} />
                  <span className="font-semibold">+7 (999) 123-45-67</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=1920&q=80"
            alt="Barbershop interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm md:text-base">Premium Barbershop</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              Sergio <span className="text-amber-500">Musel</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Классические стрижки и бритьё опасной бритвой в атмосфере винтажного джаза и лучшего виски
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection('contacts')}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-600/30 flex items-center gap-2"
              >
                <SafeIcon name="calendar" size={20} />
                Записаться онлайн
              </button>
              <a
                href="tel:+79991234567"
                className="px-8 py-4 border border-slate-600 hover:border-amber-500 text-white font-semibold rounded-lg transition-all hover:bg-slate-800 flex items-center gap-2"
              >
                <SafeIcon name="phone" size={20} />
                Позвонить
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <SafeIcon name="chevron-down" size={32} className="text-gray-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Услуги и цены</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Полный спектр барберинг-услуг от мастера Sergio</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-900/50 border border-slate-800 hover:border-amber-600/50 rounded-xl p-6 transition-all hover:bg-slate-900"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">{service.name}</h3>
                  <span className="text-2xl font-bold text-amber-500">{service.price}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <SafeIcon name="clock" size={16} />
                  <span>{service.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Галерея работ</h2>
            <p className="text-gray-400">Примеры наших стрижек и бритья</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Work ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80"
                  alt="Sergio Musel"
                  className="rounded-2xl shadow-2xl shadow-amber-600/10"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-600 rounded-2xl -z-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">О мастере</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Sergio Musel</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Более 10 лет я посвятил искусству барберинга. Начинал в Италии, обучался у лучших мастеров Лондона и Нью-Йорка.
                </p>
                <p>
                  Моя философия проста: каждая стрижка должна подчеркивать индивидуальность мужчины. Я не делаю «шаблонные» прически — каждый клиент уходит с уникальным образом.
                </p>
                <p>
                  В моём кресле вы получите не просто стрижку, а полноценный релакс: виски, джаз, беседа по душам и идеальный результат.
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors">
                  <SafeIcon name="instagram" size={20} />
                  <span>@sergio_musel</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 md:py-32 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Отзывы клиентов</h2>
            <p className="text-gray-400">Что говорят о нас</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <SafeIcon key={i} name="star" size={16} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{review.text}"</p>
                <p className="text-white font-semibold">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-20 md:py-32 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">Контакты</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8">Запишитесь на стрижку</h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="map-pin" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Адрес</h3>
                    <p className="text-gray-400">г. Москва, ул. Барберская, д. 42</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Телефон</h3>
                    <a href="tel:+79991234567" className="text-gray-400 hover:text-amber-500 transition-colors">+7 (999) 123-45-67</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="clock" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Режим работы</h3>
                    <p className="text-gray-400">Ежедневно: 10:00 — 22:00</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div ref={mapContainer} className="w-full h-64 rounded-xl overflow-hidden border border-slate-800" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8"
            >
              <h3 className="font-serif text-2xl font-bold text-white mb-6">Онлайн-запись</h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Иван"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Телефон</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Услуга</label>
                  <select
                    value={formState.service}
                    onChange={(e) => setFormState({...formState, service: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="">Выберите услугу</option>
                    <option value="haircut">Мужская стрижка</option>
                    <option value="beard">Стрижка бороды</option>
                    <option value="shave">Королевское бритьё</option>
                    <option value="complex">Комплекс</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <SafeIcon name="send" size={20} />
                      Записаться
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400 text-center"
                    >
                      Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-center"
                    >
                      Ошибка отправки. Попробуйте позже или позвоните нам.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <p className="text-gray-400 text-sm mb-3">Или напишите нам в Telegram</p>
                <a
                  href="https://t.me/sergio_musel_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                >
                  <SafeIcon name="send" size={18} />
                  Telegram Bot
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-slate-800 py-12 pb-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <SafeIcon name="scissors" size={24} className="text-amber-500" />
              <span className="font-serif text-xl font-bold text-white">Sergio Musel</span>
            </div>

            <div className="flex gap-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="instagram" size={24} />
              </a>
              <a href="https://t.me/sergio_musel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="send" size={24} />
              </a>
              <a href="tel:+79991234567" className="text-gray-400 hover:text-amber-500 transition-colors">
                <SafeIcon name="phone" size={24} />
              </a>
            </div>

            <p className="text-gray-500 text-sm">© 2024 Sergio Musel. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App