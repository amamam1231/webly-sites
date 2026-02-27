import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const icons = {}

// Utility function
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Scroll reveal component
function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Credit Calculator Component
function CreditCalculator() {
  const [amount, setAmount] = useState(500000)
  const [months, setMonths] = useState(12)
  const [rate, setRate] = useState(15)

  const monthlyRate = rate / 100 / 12
  const monthlyPayment = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  )
  const totalPayment = monthlyPayment * months
  const overpayment = totalPayment - amount

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="glass rounded-3xl p-8 md:p-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Сумма кредита
            </label>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="50000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(amount)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Срок (месяцев)
            </label>
            <input
              type="range"
              min="3"
              max="60"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="mt-2 text-2xl font-bold text-white">
              {months} мес.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Ставка (% годовых)
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="mt-2 text-2xl font-bold text-white">
              {rate}%
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Ежемесячный платеж</div>
            <div className="text-4xl md:text-5xl font-black text-gradient">
              {formatCurrency(monthlyPayment)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Общая сумма</div>
              <div className="text-lg font-semibold text-slate-200">
                {formatCurrency(totalPayment)}
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Переплата</div>
              <div className="text-lg font-semibold text-emerald-400">
                {formatCurrency(overpayment)}
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            Оформить кредит
          </button>
        </div>
      </div>
    </div>
  )
}

// Lead Form Component
function LeadForm({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          telegram_chat_id: settings.telegram_chat_id
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', phone: '', email: '', company: '' })
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ваше имя"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Название компании"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-center"
          >
            Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
          </motion.div>
        )}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center"
          >
            Произошла ошибка. Пожалуйста, попробуйте позже.
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            Открыть счет
            <SafeIcon name="arrow-right" size={20} />
          </>
        )}
      </button>
    </form>
  )
}

// Main App Component
function App() {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const features = [
    {
      icon: "zap",
      title: "Мгновенные переводы",
      description: "Отправляйте платежи в любую точку России за секунды. Поддержка СБП и всехmajor банков."
    },
    {
      icon: "shield-check",
      title: "Безопасность 24/7",
      description: "Многоуровневая защита счетов, биометрия, подтверждение операций через приложение."
    },
    {
      icon: "smartphone",
      title: "Мобильное управление",
      description: "Полный контроль над финансами со смартфона. Открытие счета за 5 минут."
    },
    {
      icon: "credit-card",
      title: "Бизнес-карты",
      description: "Виртуальные и пластиковые карты для сотрудников с лимитами и контролем расходов."
    },
    {
      icon: "file-text",
      title: "Бухгалтерия",
      description: "Автоматическое формирование отчетов, экспорт в 1С, интеграция с налоговой."
    },
    {
      icon: "headphones",
      title: "Поддержка 24/7",
      description: "Персональный менеджер для каждого клиента. Решение вопросов в чате за минуты."
    }
  ]

  const tariffs = [
    {
      name: "Старт",
      price: settings.tariff_basic_price || "0 ₽",
      period: "/месяц",
      description: "Для ИП и микробизнеса",
      features: [
        "Открытие счета бесплатно",
        "До 5 переводов в месяц",
        "1 бизнес-карта",
        "Мобильное приложение",
        "Email поддержка"
      ],
      popular: false
    },
    {
      name: "Бизнес",
      price: settings.tariff_pro_price || "990 ₽",
      period: "/месяц",
      description: "Для растущего бизнеса",
      features: [
        "Безлимитные переводы",
        "До 10 бизнес-карт",
        "Кредитный калькулятор",
        "API интеграция",
        "Приоритетная поддержка",
        "Экспорт в 1С"
      ],
      popular: true
    },
    {
      name: "Корпорация",
      price: settings.tariff_enterprise_price || "4 990 ₽",
      period: "/месяц",
      description: "Для крупного бизнеса",
      features: [
        "Все возможности Бизнеса",
        "Безлимитные карты",
        "Персональный менеджер",
        "White label решение",
        "SLA 99.9%",
        "Обучение сотрудников"
      ],
      popular: false
    }
  ]

  const testimonials = [
    {
      name: "Александр Петров",
      role: "CEO, ТехноСтарт",
      content: "Открыли счет за 10 минут без посещения банка. Переводы мгновенные, комиссии минимальные. Отличное решение для стартапа.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Елена Смирнова",
      role: "Директор, СтройПром",
      content: "Пользуемся год. Особенно нравится система контроля расходов по картам сотрудников и автоматическая бухгалтерия.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Михаил Козлов",
      role: "Основатель, ФудТрак",
      content: "Кредитный калькулятор помог спланировать расширение бизнеса. Получили одобрение за 2 часа. Рекомендую!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <SafeIcon name="landmark" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                {settings.siteName || "FinTech Pro"}
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm text-slate-400 hover:text-white transition-colors">
                Возможности
              </button>
              <button onClick={() => scrollToSection('calculator')} className="text-sm text-slate-400 hover:text-white transition-colors">
                Калькулятор
              </button>
              <button onClick={() => scrollToSection('tariffs')} className="text-sm text-slate-400 hover:text-white transition-colors">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm text-slate-400 hover:text-white transition-colors">
                Отзывы
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
              >
                Открыть счет
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <SafeIcon name={isMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-slate-800/50 space-y-4"
              >
                <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-400 hover:text-white py-2">
                  Возможности
                </button>
                <button onClick={() => scrollToSection('calculator')} className="block w-full text-left text-slate-400 hover:text-white py-2">
                  Калькулятор
                </button>
                <button onClick={() => scrollToSection('tariffs')} className="block w-full text-left text-slate-400 hover:text-white py-2">
                  Тарифы
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left text-slate-400 hover:text-white py-2">
                  Отзывы
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full px-5 py-3 bg-blue-600 text-white font-medium rounded-lg"
                >
                  Открыть счет
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
                <SafeIcon name="sparkles" size={16} />
                Новая эра бизнес-банкинга
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6"
            >
              {settings.hero_title || "Банк, который работает на ваш бизнес"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {settings.hero_subtitle || "Откройте счет за 5 минут, управляйте финансами со смартфона, получайте кредиты без залога. Создан для малого и среднего бизнеса России."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {settings.hero_cta || "Открыть счет бесплатно"}
                <SafeIcon name="arrow-right" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('calculator')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700 hover:border-slate-600"
              >
                Рассчитать кредит
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <SafeIcon name="check-circle" size={16} className="text-emerald-500" />
                Лицензия ЦБ РФ
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="check-circle" size={16} className="text-emerald-500" />
                СБП 24/7
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="check-circle" size={16} className="text-emerald-500" />
                256-bit SSL
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Все необходимое для бизнеса
              </h2>
              <p className="text-slate-400 text-lg">
                Современные финансовые инструменты, которые экономят время и деньги вашей компании
              </p>
            </ScrollReveal>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-900"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Credit Calculator Section */}
      {settings.show_calculator !== false && (
        <section id="calculator" className="py-20 md:py-32 bg-slate-900/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Кредитный калькулятор
              </h2>
              <p className="text-slate-400 text-lg">
                Рассчитайте ежемесячный платеж и подайте заявку онлайн без визита в банк
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <CreditCalculator />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Tariffs Section */}
      {settings.show_tariffs !== false && (
        <section id="tariffs" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Тарифы и услуги
              </h2>
              <p className="text-slate-400 text-lg">
                Выберите оптимальный тариф для вашего бизнеса. Без скрытых комиссий.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {tariffs.map((tariff, index) => (
                <ScrollReveal key={index}>
                  <div className={`relative p-8 rounded-2xl border h-full flex flex-col ${
                    tariff.popular
                      ? 'bg-blue-600/10 border-blue-500/50'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}>
                    {tariff.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                        Популярный
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {tariff.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        {tariff.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">
                          {tariff.price}
                        </span>
                        <span className="text-slate-500">
                          {tariff.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {tariff.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3 text-slate-300 text-sm">
                          <SafeIcon name="check" size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => scrollToSection('contact')}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        tariff.popular
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      Выбрать тариф
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {settings.show_testimonials !== false && (
        <section id="testimonials" className="py-20 md:py-32 bg-slate-900/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Отзывы клиентов
              </h2>
              <p className="text-slate-400 text-lg">
                Уже более 50 000 компаний выбрали наш банк для своего бизнеса
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal key={index}>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <SafeIcon key={star} name="star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Откройте счет сегодня
              </h2>
              <p className="text-slate-400 text-lg">
                Заполните форму, и наш менеджер свяжется с вами в течение 15 минут
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="glass rounded-3xl p-8 md:p-12">
                <LeadForm settings={settings} />

                <div className="mt-8 pt-8 border-t border-slate-800 grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="phone" size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Телефон</div>
                      <div className="text-white font-medium">
                        {settings.contact_phone || "8 (800) 555-35-35"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mail" size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="text-white font-medium">
                        {settings.contact_email || "hello@fintechpro.ru"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <SafeIcon name="landmark" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  {settings.siteName || "FinTech Pro"}
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm mb-4">
                Современный необанк для малого и среднего бизнеса России. Лицензия ЦБ РФ № 1234 от 01.01.2024.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <SafeIcon name="send" size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <SafeIcon name="message-circle" size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Продукты</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Расчетный счет</button></li>
                <li><button onClick={() => scrollToSection('calculator')} className="hover:text-white transition-colors">Кредиты</button></li>
                <li><button onClick={() => scrollToSection('tariffs')} className="hover:text-white transition-colors">Тарифы</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Бизнес-карты</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Пресс-центр</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>© 2024 {settings.siteName || "FinTech Pro"}. Все права защищены.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Оферта</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom padding for Telegram */}
      <div className="pb-20 md:pb-0" />
    </div>
  )
}

export default App