import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Portfolio data
const portfolioItems = [
  {
    id: 1,
    title: "Интервью с CEO",
    category: "interview",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    duration: "12:34",
    description: "Корпоративное интервью для бренда"
  },
  {
    id: 2,
    title: "Reels для бренда",
    category: "reels",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    duration: "0:30",
    description: "Вирусный контент для Instagram"
  },
  {
    id: 3,
    title: "Музыкальный клип",
    category: "clip",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80",
    duration: "3:45",
    description: "Клип для артиста"
  },
  {
    id: 4,
    title: "Подкаст",
    category: "podcast",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    duration: "45:20",
    description: "Многокамерная съёмка подкаста"
  },
  {
    id: 5,
    title: "Shorts",
    category: "reels",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80",
    duration: "0:58",
    description: "YouTube Shorts для канала"
  },
  {
    id: 6,
    title: "Рекламный ролик",
    category: "clip",
    thumbnail: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=800&q=80",
    duration: "1:30",
    description: "Реклама продукта"
  }
]

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Александр М.",
    role: "CEO, TechStart",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    text: "Работаем с Yurchenko уже второй год. Качество видео на высоте — клиенты отмечают кинематографичность. Особенно ценим скорость и внимание к деталям.",
    rating: 5
  },
  {
    id: 2,
    name: "Мария К.",
    role: "Музыкант",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    text: "Клип превзошёл все ожидания! Профессиональный подход на каждом этапе — от идеи до финального цветокора. Результат — 2 миллиона просмотров.",
    rating: 5
  },
  {
    id: 3,
    name: "Дмитрий В.",
    role: "Ведущий подкаста",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    text: "Организовал много камерную съёмку подкаста. Звук идеальный, монтаж динамичный. Подписчики заметили разницу сразу — рост просмотров на 40%.",
    rating: 5
  },
  {
    id: 4,
    name: "Елена С.",
    role: "SMM-директор",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    text: "Reels и Shorts для бренда — огонь! Понимает алгоритмы, делает цепляющие кадры. Конверсия в подписки выросла в 3 раза. Рекомендую!",
    rating: 5
  }
]

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "Сколько стоит съёмка?",
    answer: "Стоимость зависит от сложности проекта. Базовый пакет Start — от 15 000 ₽, Pro — от 35 000 ₽, Business — от 70 000 ₽. Точную цену рассчитаю после брифа.",
    keywords: ["цена", "стоимость", "сколько", "рублей", "₽", "прайс", "тариф"]
  },
  {
    question: "Какие сроки монтажа?",
    answer: "Сроки зависят от хронометража и сложности. Start — 3-5 дней, Pro — 5-10 дней, Max — 10-20 дней. Срочные проекты — возможны, но с доплатой 30%.",
    keywords: ["срок", "когда", "дней", "время", "быстро", "срочно", "монтаж"]
  },
  {
    question: "Вы работаете удалённо?",
    answer: "Да! Я базируюсь в Праге, но работаю с клиентами по всему миру. Для съёмки прилетаю в любую точку Европы. Монтаж — полностью удалённо.",
    keywords: ["удалённо", "онлайн", "прага", "город", "приехать", "локация"]
  },
  {
    question: "Какие форматы вы отдаёте?",
    answer: "Отдаю все необходимые форматы: MP4 (H.264/HEVC) для соцсетей, ProRes/DNxHD для архива, адаптацию под 16:9, 9:16, 1:1. Субтитры SRT/VTT при необходимости.",
    keywords: ["формат", "mp4", "файл", "разрешение", "качество", "экспорт"]
  },
  {
    question: "Нужна предоплата?",
    answer: "Да, работаю по предоплате 50% для новых клиентов. Для постоянных — возможна оплата по факту. Остаток — после утверждения финальной версии.",
    keywords: ["оплата", "предоплата", "деньги", "50%", "аванс", "счёт"]
  }
]

const SITE_CONTEXT = "Yurchenko prod. — видеопродакшн из Праги. Специализация: интервью, подкасты, клипы, Reels/Shorts. 5 лет опыта, full-cycle production. Услуги: съёмка и монтаж. Тарифы: Start/Pro/Business."

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я помогу ответить на вопросы о видеопродакшне. Что вас интересует?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const findFAQAnswer = (input) => {
    const lowerInput = input.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
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
    } else {
      // Fallback to API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(prev => [...prev, { type: 'bot', text: data.reply || 'Извините, не могу ответить на этот вопрос. Напишите мне в Telegram @yurchenkoprod для подробной консультации.' }])
        } else {
          throw new Error('API error')
        }
      } catch (error) {
        setMessages(prev => [...prev, { type: 'bot', text: 'Извините, сервис временно недоступен. Напишите мне в Telegram @yurchenkoprod — отвечу лично!' }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen ? "bg-zinc-800 rotate-90" : "bg-amber-600 hover:bg-amber-500"
        )}
      >
        {isOpen ? (
          <SafeIcon name="x" size={24} className="text-white" />
        ) : (
          <SafeIcon name="message-square" size={24} className="text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon name="bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Yurchenko Assistant</h3>
                <p className="text-xs text-amber-100">Обычно отвечает за минуту</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-zinc-950">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.type === 'user'
                      ? "bg-amber-600 text-white ml-auto rounded-br-md"
                      : "bg-zinc-800 text-zinc-200 rounded-bl-md border border-zinc-700"
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-1 p-3 bg-zinc-800 rounded-2xl rounded-bl-md border border-zinc-700 w-fit">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите вопрос..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-colors"
                >
                  <SafeIcon name="send" size={18} />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-center">
                Нажмите Enter для отправки
              </p>
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
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('all')
  const [scrolled, setScrolled] = useState(false)

  // Calculator state
  const [calcService, setCalcService] = useState('shooting')
  const [calcTier, setCalcTier] = useState('pro')
  const [calcDuration, setCalcDuration] = useState(5)
  const [calcUrgency, setCalcUrgency] = useState('normal')

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const filteredPortfolio = activePortfolioFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activePortfolioFilter)

  // Calculator pricing logic
  const calculatePrice = () => {
    const basePrices = {
      shooting: { start: 15000, pro: 35000, business: 70000 },
      editing: { start: 10000, pro: 25000, max: 50000 }
    }

    let base = basePrices[calcService][calcTier]

    // Duration multiplier
    const durationMultiplier = 1 + (calcDuration - 1) * 0.15
    base = base * durationMultiplier

    // Urgency
    if (calcUrgency === 'urgent') base *= 1.3
    if (calcUrgency === 'express') base *= 1.5

    return Math.round(base)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setFormStatus('success')

    setTimeout(() => {
      setFormStatus('idle')
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-black/90 backdrop-blur-md border-b border-zinc-800/50" : "bg-transparent"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <SafeIcon name="film" size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Yurchenko <span className="text-amber-500">prod.</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Портфолио', id: 'portfolio' },
                { label: 'Услуги', id: 'services' },
                { label: 'Тарифы', id: 'pricing' },
                { label: 'Контакты', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 btn-shine"
              >
                Обсудить проект
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
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
              className="md:hidden bg-black/95 backdrop-blur-md border-t border-zinc-800"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {[
                  { label: 'Портфолио', id: 'portfolio' },
                  { label: 'Услуги', id: 'services' },
                  { label: 'Тарифы', id: 'pricing' },
                  { label: 'Контакты', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-lg font-medium text-zinc-300 hover:text-white py-2 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsCalculatorOpen(true)
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-full font-medium mt-4"
                >
                  Обсудить проект
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80"
            alt="Cinematic background"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-5 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            {/* Badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-8">
              {['5 лет опыта', 'Full-cycle', 'YouTube / Reels / Shorts'].map((badge, i) => (
                <span key={i} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-zinc-300">
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-cinematic"
            >
              <span className="block text-white">Киношная</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                картинка.
              </span>
              <span className="block text-white">Точный монтаж.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
            >
              Интервью, подкасты, клипы, Reels/Shorts — снимаю и собираю видео,
              которое выглядит дороже бюджета. <span className="text-amber-500 font-medium">Prague → весь мир.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('portfolio')}
                className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-zinc-200 transition-all hover:scale-105 flex items-center gap-2 btn-shine"
              >
                <SafeIcon name="play" size={20} />
                Смотреть работы
              </button>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="group bg-transparent border-2 border-zinc-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:border-amber-500 hover:text-amber-500 transition-all hover:scale-105 flex items-center gap-2"
              >
                <SafeIcon name="zap" size={20} />
                Получить расчёт
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80"
                  alt="Yurchenko prod"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-6 -right-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center">
                    <SafeIcon name="award" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">5+</div>
                    <div className="text-sm text-zinc-400">лет опыта</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block"
              >
                Обо мне
              </motion.span>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
                Создаю видео, которое <span className="text-amber-500">запоминается</span>
              </h2>

              <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                Я — Yurchenko prod. 5 лет в продакшене: от съёмки до финального мастера.
                Люблю чистый свет, аккуратный звук и монтаж с ритмом.
                Делаю так, чтобы ролик смотрели и пересматривали.
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: 'camera', text: 'Визуал "как в кино"' },
                  { icon: 'mic', text: 'Чистый звук и атмосфера' },
                  { icon: 'scissors', text: 'Монтаж, который держит внимание' },
                  { icon: 'film', text: 'Выходные форматы под платформы' }
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-amber-500/30 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SafeIcon name={benefit.icon} size={20} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 bg-zinc-950 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
              Услуги
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Full-cycle production
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              От идеи до готового ролика — беру на себя весь процесс
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shooting Service */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <SafeIcon name="camera" size={32} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Съёмка</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Полный цикл производства: от брифа до сдачи материала.
                  Профессиональное оборудование для света и звука.
                </p>

                <div className="space-y-3">
                  {[
                    { step: '01', text: 'Бриф и концепт' },
                    { step: '02', text: 'Съёмка (свет/звук)' },
                    { step: '03', text: 'Сдача материала' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <span className="text-amber-500 font-bold text-sm">{item.step}</span>
                      <span className="text-zinc-300 text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Editing Service */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <SafeIcon name="scissors" size={32} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Монтаж</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Профессиональный монтаж с цветокоррекцией и звуковым дизайном.
                  Ритмичный, динамичный, цепляющий.
                </p>

                <div className="space-y-3">
                  {[
                    { step: '01', text: 'Структура и сценарий' },
                    { step: '02', text: 'Монтаж и цвет/звук' },
                    { step: '03', text: 'Титры и экспорт под площадки' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <span className="text-orange-500 font-bold text-sm">{item.step}</span>
                      <span className="text-zinc-300 text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 md:py-32 bg-black relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
              Портфолио
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Выбранные работы
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Каждый проект — это история, рассказанная через визуал и звук
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {[
              { id: 'all', label: 'Все работы' },
              { id: 'interview', label: 'Интервью' },
              { id: 'reels', label: 'Reels/Shorts' },
              { id: 'clip', label: 'Клипы' },
              { id: 'podcast', label: 'Подкасты' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActivePortfolioFilter(filter.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                  activePortfolioFilter === filter.id
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Portfolio Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden video-card cursor-pointer"
                  onClick={() => window.open('https://youtube.com', '_blank')}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <SafeIcon name="play" size={28} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
                      {item.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-amber-500 uppercase tracking-wider">
                        {item.category === 'interview' && 'Интервью'}
                        {item.category === 'reels' && 'Reels/Shorts'}
                        {item.category === 'clip' && 'Клип'}
                        {item.category === 'podcast' && 'Подкаст'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
            >
              <SafeIcon name="youtube" size={20} className="text-red-500" />
              Смотреть все работы на YouTube
              <SafeIcon name="external-link" size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-zinc-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
              Отзывы
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Что говорят клиенты
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Реальные отзывы от тех, с кем работал
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="testimonial-card rounded-2xl p-6 md:p-8 relative"
              >
                <SafeIcon name="quote" size={40} className="text-amber-600/20 absolute top-6 right-6" />

                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-400">{testimonial.role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <SafeIcon key={i} name="star" size={14} className="text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-black relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
              Тарифы
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Интерактивный выбор
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Настройте параметры под ваш проект и получите расчёт
            </p>
          </motion.div>

          {/* Interactive Pricing Builder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-10 backdrop-blur-sm"
          >
            {/* Service Type */}
            <div className="mb-8">
              <label className="text-sm font-medium text-zinc-400 mb-3 block">Тип услуги</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCalcService('shooting')}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    calcService === 'shooting'
                      ? "bg-amber-600/20 border-amber-500 text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  )}
                >
                  <SafeIcon name="camera" size={24} className={cn("mb-2", calcService === 'shooting' ? 'text-amber-500' : 'text-zinc-500')} />
                  <div className="font-semibold">Съёмка</div>
                </button>
                <button
                  onClick={() => setCalcService('editing')}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    calcService === 'editing'
                      ? "bg-orange-600/20 border-orange-500 text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  )}
                >
                  <SafeIcon name="scissors" size={24} className={cn("mb-2", calcService === 'editing' ? 'text-orange-500' : 'text-zinc-500')} />
                  <div className="font-semibold">Монтаж</div>
                </button>
              </div>
            </div>

            {/* Tier Selection */}
            <div className="mb-8">
              <label className="text-sm font-medium text-zinc-400 mb-3 block">Тариф</label>
              <div className="grid grid-cols-3 gap-3">
                {(calcService === 'shooting'
                  ? [
                      { id: 'start', name: 'Start', rec: false },
                      { id: 'pro', name: 'Pro', rec: true },
                      { id: 'business', name: 'Business', rec: false }
                    ]
                  : [
                      { id: 'start', name: 'Start', rec: false },
                      { id: 'pro', name: 'Pro', rec: true },
                      { id: 'max', name: 'Max', rec: false }
                    ]
                ).map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setCalcTier(tier.id)}
                    className={cn(
                      "relative p-4 rounded-xl border text-center transition-all",
                      calcTier === tier.id
                        ? "bg-zinc-800 border-amber-500 text-white"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    )}
                  >
                    {tier.rec && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        РЕКОМЕНД.
                      </span>
                    )}
                    <div className="font-semibold text-sm">{tier.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Urgency */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-3 block flex justify-between">
                  <span>Хронометраж</span>
                  <span className="text-amber-500">{calcDuration} мин</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>1 мин</span>
                  <span>30 мин</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Срочность</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Стандарт', mult: 1 },
                    { id: 'urgent', label: 'Срочно', mult: 1.3 },
                    { id: 'express', label: 'Экспресс', mult: 1.5 }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcUrgency(opt.id)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                        calcUrgency === opt.id
                          ? "bg-amber-600/20 border-amber-500 text-amber-500"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      {opt.label}
                      {opt.mult > 1 && <span className="block text-[10px] opacity-70">+{Math.round((opt.mult-1)*100)}%</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6 md:p-8 text-center"
            >
              <div className="text-zinc-400 text-sm mb-2">Примерная стоимость</div>
              <div className="text-4xl md:text-5xl font-black text-white mb-4">
                от {calculatePrice().toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                Точная цена после брифа. Включает все правки и финальные форматы.
              </p>
              <button
                onClick={() => {
                  setIsCalculatorOpen(false)
                  scrollToSection('contact')
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 btn-shine"
              >
                Обсудить проект
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-black relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
                Контакты
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Давайте создадим <span className="text-amber-500">кино</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Напишите, что нужно снять/смонтировать + сроки + референсы —
                отвечу и сделаю расчёт в течение часа.
              </p>

              <div className="space-y-6">
                <a
                  href="https://t.me/yurchenkoprod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SafeIcon name="send" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Telegram</div>
                    <div className="text-white font-medium">@yurchenkoprod</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Локация</div>
                    <div className="text-white font-medium">Prague → весь мир</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-8">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-all hover:scale-110"
                >
                  <SafeIcon name="youtube" size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-pink-500 hover:border-pink-500/50 transition-all hover:scale-110"
                >
                  <SafeIcon name="instagram" size={24} />
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Отправить запрос</h3>
              <p className="text-zinc-400 mb-8">Заполните форму — я свяжусь с вами в течение часа</p>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Ваше имя</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email или Telegram</label>
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="@username или email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Описание проекта</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                    placeholder="Что нужно снять/смонтировать? Сроки? Референсы?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2",
                    formStatus === 'success'
                      ? "bg-green-600 text-white"
                      : "bg-amber-600 hover:bg-amber-500 text-white hover:scale-[1.02]"
                  )}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <SafeIcon name="loader-2" size={20} />
                      Отправка...
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <SafeIcon name="check-circle" size={20} />
                      Отправлено!
                    </>
                  ) : (
                    <>
                      <SafeIcon name="send" size={20} />
                      Отправить запрос
                    </>
                  )}
                </button>

                <p className="text-xs text-zinc-500 text-center">
                  Или напишите напрямую в <a href="https://t.me/yurchenkoprod" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Telegram</a>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="film" size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                Yurchenko <span className="text-amber-500">prod.</span>
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              <button onClick={() => scrollToSection('portfolio')} className="hover:text-white transition-colors">Портфолио</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Услуги</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Тарифы</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Контакты</button>
            </div>

            <div className="flex gap-3">
              <a href="https://t.me/yurchenkoprod" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 transition-all">
                <SafeIcon name="send" size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-all">
                <SafeIcon name="youtube" size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-pink-500 hover:border-pink-500/50 transition-all">
                <SafeIcon name="instagram" size={18} />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900 text-center text-sm text-zinc-500">
            <p>© 2024 Yurchenko prod. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCalculatorOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Калькулятор стоимости</h3>
                <button
                  onClick={() => setIsCalculatorOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <SafeIcon name="x" size={24} />
                </button>
              </div>

              {/* Service Type */}
              <div className="mb-6">
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Услуга</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCalcService('shooting')}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all",
                      calcService === 'shooting'
                        ? "bg-amber-600/20 border-amber-500 text-white"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    )}
                  >
                    <SafeIcon name="camera" size={24} className="mx-auto mb-2" />
                    <div className="font-medium">Съёмка</div>
                  </button>
                  <button
                    onClick={() => setCalcService('editing')}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all",
                      calcService === 'editing'
                        ? "bg-orange-600/20 border-orange-500 text-white"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    )}
                  >
                    <SafeIcon name="scissors" size={24} className="mx-auto mb-2" />
                    <div className="font-medium">Монтаж</div>
                  </button>
                </div>
              </div>

              {/* Tier */}
              <div className="mb-6">
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Тариф</label>
                <div className="grid grid-cols-3 gap-2">
                  {(calcService === 'shooting'
                    ? [
                        { id: 'start', name: 'Start', rec: false },
                        { id: 'pro', name: 'Pro', rec: true },
                        { id: 'business', name: 'Business', rec: false }
                      ]
                    : [
                        { id: 'start', name: 'Start', rec: false },
                        { id: 'pro', name: 'Pro', rec: true },
                        { id: 'max', name: 'Max', rec: false }
                      ]
                  ).map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setCalcTier(tier.id)}
                      className={cn(
                        "relative py-3 px-2 rounded-xl border text-sm font-medium transition-all",
                        calcTier === tier.id
                          ? "bg-zinc-800 border-amber-500 text-white"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      )}
                    >
                      {tier.rec && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          ★
                        </span>
                      )}
                      {tier.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="text-sm font-medium text-zinc-400 mb-3 block flex justify-between">
                  <span>Хронометраж</span>
                  <span className="text-amber-500">{calcDuration} мин</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Urgency */}
              <div className="mb-8">
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Срочность</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Стандарт' },
                    { id: 'urgent', label: 'Срочно' },
                    { id: 'express', label: 'Экспресс' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCalcUrgency(opt.id)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-medium transition-all border",
                        calcUrgency === opt.id
                          ? "bg-amber-600/20 border-amber-500 text-amber-500"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="bg-zinc-950 rounded-2xl p-6 text-center border border-zinc-800">
                <div className="text-zinc-400 text-sm mb-2">Примерная стоимость</div>
                <div className="text-4xl font-black text-white mb-4">
                  {calculatePrice().toLocaleString('ru-RU')} ₽
                </div>
                <button
                  onClick={() => {
                    setIsCalculatorOpen(false)
                    scrollToSection('contact')
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
                >
                  Обсудить проект
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App