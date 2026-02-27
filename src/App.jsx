import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import * as LucideIcons from 'lucide-react'
// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// FAQ Data for AI Chat
const FAQ_DATA = [
  {
    question: "Как открыть счет?",
    answer: "Открыть счет в NexoBank можно за 5 минут через мобильное приложение. Вам понадобится паспорт и СНИЛС.",
    keywords: ["открыть", "счет", "регистрация", "начать", "создать"]
  },
  {
    question: "Какие комиссии?",
    answer: "Базовый тариф без абонентской платы. Переводы между пользователями NexoBank бесплатно. Комиссия за снятие наличных от 0%.",
    keywords: ["комиссия", "плата", "сколько стоит", "тариф", "цена"]
  },
  {
    question: "Безопасно ли хранить деньги?",
    answer: "Да, NexoBank использует 256-битное шифрование, биометрическую аутентификацию и защищенные сервера. Ваши средства застрахованы на сумму до 1.4 млн руб.",
    keywords: ["безопасность", "защита", "страховка", "надежно", "риск"]
  },
  {
    question: "Есть ли кэшбэк?",
    answer: "Да! Кэшбэк до 5% в зависимости от тарифа. Кэшбэк начисляется за покупки в категориях: продукты, транспорт, развлечения, онлайн-покупки.",
    keywords: ["кэшбэк", "кешбек", "возврат", "бонусы", "карта"]
  },
  {
    question: "Как пополнить счет?",
    answer: "Пополнить можно через СБП бесплатно, с карты другого банка, наличными в терминалах или через партнеров.",
    keywords: ["пополнить", "зачислить", "внести", "перевести", "платеж"]
  }
]

const SITE_CONTEXT = "NexoBank - современный необанк для управления финансами. Предлагаем мгновенные переводы, кэшбэк до 5%, виртуальные и пластиковые карты, криптовалютные операции, аналитику расходов. Базовый тариф бесплатный. Работаем с физическими и юридическими лицами."

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я помощник NexoBank. Чем могу помочь?' }
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
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: SITE_CONTEXT
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.response || 'Извините, не могу ответить на этот вопрос.' }])
      } else {
        throw new Error('API Error')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Извините, сервис временно недоступен. Попробуйте позже или свяжитесь с поддержкой.'
      }])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-colors"
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-strong rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon name="bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">NexoBot</h3>
                <p className="text-xs text-white/70">Онлайн помощник</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white/10 text-gray-200 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <SafeIcon name="send" size={18} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Section Components
const Header = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SafeIcon name="wallet" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">{settings.siteName || 'NexoBank'}</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {settings.show_features !== false && (
              <button onClick={() => scrollTo('features')} className="text-sm text-gray-400 hover:text-white transition-colors">
                Возможности
              </button>
            )}
            {settings.show_pricing !== false && (
              <button onClick={() => scrollTo('pricing')} className="text-sm text-gray-400 hover:text-white transition-colors">
                Тарифы
              </button>
            )}
            {settings.show_security !== false && (
              <button onClick={() => scrollTo('security')} className="text-sm text-gray-400 hover:text-white transition-colors">
                Безопасность
              </button>
            )}
            {settings.show_testimonials !== false && (
              <button onClick={() => scrollTo('testimonials')} className="text-sm text-gray-400 hover:text-white transition-colors">
                Отзывы
              </button>
            )}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">
              Войти
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105">
              Открыть счет
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

const Hero = ({ settings }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
            >
              <SafeIcon name="sparkles" size={16} className="text-blue-400" />
              <span className="text-sm text-blue-400">Новое: Криптокошелек 2.0</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-white">Банк</span>
              <br />
              <span className="text-gradient">будущего</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {settings.hero_subtitle || 'Мгновенные переводы, кэшбэк до 5%, виртуальные карты и криптовалюта — всё в одном приложении'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2">
                <SafeIcon name="download" size={20} />
                {settings.hero_cta_text || 'Скачать приложение'}
              </button>
              <button className="glass hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                <SafeIcon name="play-circle" size={20} />
                Смотреть демо
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">2M+</div>
                <div className="text-sm text-gray-500">Клиентов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">0₽</div>
                <div className="text-sm text-gray-500">Обслуживание</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-gray-500">Рейтинг</div>
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {/* Phone Frame */}
              <div className="relative mx-auto w-72 md:w-80 bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl shadow-blue-600/20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-20" />

                {/* Screen Content */}
                <div className="bg-slate-950 pt-12 pb-6 px-4 min-h-[600px]">
                  {/* App Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-white font-semibold">NexoBank</div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <SafeIcon name="user" size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-5 mb-6">
                    <div className="text-white/70 text-sm mb-1">Общий баланс</div>
                    <div className="text-white text-3xl font-bold mb-4">₽ 142,500</div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">+12.5% за месяц</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: 'arrow-up-right', label: 'Перевод' },
                      { icon: 'credit-card', label: 'Карты' },
                      { icon: 'piggy-bank', label: 'Накопления' },
                      { icon: 'more-horizontal', label: 'Ещё' }
                    ].map((action, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                          <SafeIcon name={action.icon} size={20} className="text-blue-400" />
                        </div>
                        <span className="text-xs text-gray-400">{action.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transactions */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400 mb-3">Последние операции</div>
                    {[
                      { icon: 'shopping-bag', title: 'Пятёрочка', amount: '-₽1,250', color: 'text-red-400' },
                      { icon: 'arrow-down-left', title: 'Перевод от Алексея', amount: '+₽5,000', color: 'text-green-400' },
                      { icon: 'coffee', title: 'Starbucks', amount: '-₽380', color: 'text-red-400' }
                    ].map((tx, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                            <SafeIcon name={tx.icon} size={18} className="text-gray-400" />
                          </div>
                          <span className="text-white text-sm">{tx.title}</span>
                        </div>
                        <span className={`text-sm font-medium ${tx.color}`}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-8 -right-4 glass p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <SafeIcon name="check" size={20} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Перевод выполнен</div>
                    <div className="text-gray-500 text-xs">+₽15,000</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-8 glass p-4 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <SafeIcon name="percent" size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Кэшбэк начислен</div>
                    <div className="text-gray-500 text-xs">5% от покупки</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Features = ({ settings, features }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (settings.show_features === false) return null

  const defaultFeatures = [
    {
      title: "Мгновенные переводы",
      description: "Отправляйте деньги по СБП 24/7 без комиссии. До 5 счетов одновременно.",
      icon: "zap"
    },
    {
      title: "Кэшбэк до 5%",
      description: "Возвращаем деньги за покупки в любимых категориях. Без ограничений.",
      icon: "percent"
    },
    {
      title: "Виртуальные карты",
      description: "Создавайте бесконтактные карты для безопасных онлайн-покупок.",
      icon: "credit-card"
    },
    {
      title: "Криптовалюта",
      description: "Покупайте, продавайте и храните BTC, ETH и другие криптовалюты.",
      icon: "bitcoin"
    },
    {
      title: "Аналитика расходов",
      description: "Умная статистика трат с автоматической категоризацией.",
      icon: "pie-chart"
    },
    {
      title: "Накопления",
      description: "Открывайте цели накоплений с процентом до 8% годовых.",
      icon: "target"
    }
  ]

  const displayFeatures = features?.length > 0 ? features : defaultFeatures

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Всё для ваших <span className="text-gradient">финансов</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Современный банк без отделений. Управляйте деньгами из любой точки мира
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-8 rounded-3xl group hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <SafeIcon name={feature.icon} size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Security = ({ settings }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (settings.show_security === false) return null

  const securityFeatures = [
    { icon: "shield-check", title: "256-bit шифрование", desc: "Банковский уровень защиты данных" },
    { icon: "fingerprint", title: "Биометрия", desc: "Face ID и Touch ID для входа" },
    { icon: "lock", title: "3D Secure", desc: "Дополнительная защита платежей" },
    { icon: "eye-off", title: "Приватность", desc: "Не продаем данные третьим лицам" }
  ]

  return (
    <section id="security" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <SafeIcon name="shield" size={16} className="text-green-400" />
              <span className="text-sm text-green-400">Безопасность на первом месте</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ваши деньги<br />под <span className="text-green-400">защитой</span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Мы используем передовые технологии безопасности. Ваши средства застрахованы
              на сумму до 1.4 млн рублей в соответствии с законодательством РФ.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {securityFeatures.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name={item.icon} size={20} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass rounded-3xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <SafeIcon name="check-circle" size={24} className="text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Верификация пройдена</div>
                      <div className="text-sm text-gray-500">Уровень: Максимальный</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <SafeIcon name="smartphone" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Привязанное устройство</div>
                      <div className="text-sm text-gray-500">iPhone 15 Pro • Москва</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>

                <div className="p-4 bg-slate-900/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Уровень защиты</span>
                    <span className="text-green-400 font-semibold">98%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Pricing = ({ settings, pricingTiers }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (settings.show_pricing === false) return null

  const defaultTiers = [
    {
      name: "Старт",
      price: "0",
      period: "в месяц",
      description: "Для знакомства с банком",
      features: ["Бесплатное обслуживание", "СБП переводы", "1 виртуальная карта", "Кэшбэк 1%"],
      popular: false
    },
    {
      name: "Комфорт",
      price: "199",
      period: "в месяц",
      description: "Оптимальный выбор",
      features: ["Всё из Старта", "3 карты + Apple Pay", "Кэшбэк 3%", "Переводы за рубеж", "Приоритетная поддержка"],
      popular: true
    },
    {
      name: "Премиум",
      price: "599",
      period: "в месяц",
      description: "Максимум возможностей",
      features: ["Всё из Комфорта", "Безлимитные переводы", "Кэшбэк 5%", "Криптокошелек", "Персональный менеджер", "Страхование путешествий"],
      popular: false
    }
  ]

  const displayTiers = pricingTiers?.length > 0 ? pricingTiers : defaultTiers

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Прозрачные <span className="text-gradient">тарифы</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Выбирайте подходящий план. Отмена в любое время.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-3xl ${
                tier.popular
                  ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50'
                  : 'glass'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  Популярный
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">₽{tier.price}</span>
                  <span className="text-gray-500">/{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {(() => {
                  const featuresList = tier.features || (tier.features && tier.features.split(',')) || []
                  return featuresList.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tier.popular ? 'bg-blue-500/20' : 'bg-green-500/20'
                      }`}>
                        <SafeIcon name="check" size={12} className={tier.popular ? 'text-blue-400' : 'text-green-400'} />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))
                })()}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                    : 'glass hover:bg-white/10 text-white'
                }`}
              >
                Выбрать тариф
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Testimonials = ({ settings, testimonials }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (settings.show_testimonials === false) return null

  const defaultTestimonials = [
    {
      name: "Алексей К.",
      role: "Предприниматель",
      content: "Пользуюсь NexoBank уже год. Мгновенные переводы и отличный кэшбэк. Наконец-то банк, который понимает современный бизнес.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Мария С.",
      role: "Дизайнер",
      content: "Обожаю приложение! Интерфейс интуитивный, а виртуальные карты спасают при покупках в интернете. Кэшбэк реально приходит.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      name: "Дмитрий В.",
      role: "Разработчик",
      content: "Криптовалютный кошелек — это то, что меня продало. Удобно держать всё в одном месте: и фиат, и крипту.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
  ]

  const displayTestimonials = testimonials?.length > 0 ? testimonials : defaultTestimonials

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Их уже <span className="text-gradient">2 миллиона</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Присоединяйтесь к довольным клиентам NexoBank
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <SafeIcon key={star} name="star" size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = ({ settings, faqItems }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openIndex, setOpenIndex] = useState(null)

  if (settings.show_faq === false) return null

  const defaultFAQ = [
    {
      question: "Как быстро открывается счет?",
      answer: "Счет открывается за 5 минут через мобильное приложение. Вам понадобится только паспорт и СНИЛС. Без визита в офис."
    },
    {
      question: "Можно ли снять наличные?",
      answer: "Да, вы можете снимать наличные в любом банкомате мира. В базовом тарифе комиссия от 0%, в зависимости от условий банка-владельца банкомата."
    },
    {
      question: "Как работает кэшбэк?",
      answer: "Кэшбэк начисляется автоматически за покупки по категориям. Деньги поступают на счет в конце месяца. Можно вывести или потратить без ограничений."
    },
    {
      question: "Есть ли подписка?",
      answer: "Базовый тариф бесплатный навсегда. Платные тарифы отменяются в любой момент без штрафов. Деньги возвращаются пропорционально."
    }
  ]

  const displayFAQ = faqItems?.length > 0 ? faqItems : defaultFAQ

  return (
    <section className="py-24 relative">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Частые <span className="text-gradient">вопросы</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {displayFAQ.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-medium pr-4">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  className="flex-shrink-0"
                >
                  <SafeIcon name="chevron-down" size={20} className="text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTA = ({ settings }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-3xl" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="container mx-auto max-w-4xl px-4 md:px-6 relative z-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Готовы к <span className="text-gradient">будущему</span>?
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Присоединяйтесь к 2 миллионам пользователей, которые уже изменили
          отношение к банкингу
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3">
            <SafeIcon name="download" size={24} />
            Скачать в App Store
          </button>
          <button className="glass hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3">
            <SafeIcon name="play" size={24} />
            Google Play
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <SafeIcon name="check-circle" size={20} className="text-green-400" />
            <span>Бесплатно</span>
          </div>
          <div className="flex items-center gap-2">
            <SafeIcon name="check-circle" size={20} className="text-green-400" />
            <span>5 минут на регистрацию</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

const Footer = ({ settings }) => {
  return (
    <footer className="border-t border-white/10 pt-16 pb-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="wallet" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">{settings.siteName || 'NexoBank'}</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Современный необанк для тех, кто ценит время и удобство.
              Лицензия ЦБ РФ № 1234 от 01.01.2020
            </p>
            <div className="flex gap-4">
              {['twitter', 'instagram', 'youtube', 'github'].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <SafeIcon name={social} size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Продукты</h4>
            <ul className="space-y-3">
              {['Карты', 'Накопления', 'Кредиты', 'Криптовалюта', 'Бизнес'].map((item) => (
                <li key={item}>
                  <button className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-3">
              {['Помощь', 'Контакты', 'Безопасность', 'Условия', 'Конфиденциальность'].map((item) => (
                <li key={item}>
                  <button className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 {settings.siteName || 'NexoBank'}. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm flex items-center gap-2">
              <SafeIcon name="mail" size={14} />
              {settings.contact_email || 'support@nexobank.ru'}
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-2">
              <SafeIcon name="phone" size={14} />
              {settings.phone_number || '8 (800) 123-45-67'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [settings, setSettings] = useState({})
  const [collections, setCollections] = useState({
    features: [],
    pricing_tiers: [],
    testimonials: [],
    faq_items: []
  })

  useEffect(() => {
    // Fetch settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
      })
      .catch(() => {
        // Use defaults if API fails
        setSettings({
          siteName: 'NexoBank',
          hero_title: 'Банк будущего',
          hero_subtitle: 'Мгновенные переводы, кэшбэк до 5%, виртуальные карты и криптовалюта — всё в одном приложении',
          hero_cta_text: 'Скачать приложение',
          contact_email: 'support@nexobank.ru',
          phone_number: '8 (800) 123-45-67',
          show_features: true,
          show_pricing: true,
          show_testimonials: true,
          show_faq: true,
          show_security: true
        })
      })

    // Fetch collections
    const collectionsToFetch = ['features', 'pricing_tiers', 'testimonials', 'faq_items']

    collectionsToFetch.forEach(name => {
      fetch(`/api/collections?name=${name}`)
        .then(res => res.json())
        .then(data => {
          setCollections(prev => ({
            ...prev,
            [name]: data.items || []
          }))
        })
        .catch(() => {
          // Keep defaults on error
        })
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Header settings={settings} />
      <Hero settings={settings} />
      <Features settings={settings} features={collections.features} />
      <Security settings={settings} />
      <Pricing settings={settings} pricingTiers={collections.pricing_tiers} />
      <Testimonials settings={settings} testimonials={collections.testimonials} />
      <FAQ settings={settings} faqItems={collections.faq_items} />
      <CTA settings={settings} />
      <Footer settings={settings} />
      <ChatWidget />
    </div>
  )
}

export default App