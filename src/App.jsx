import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const FAQ_DATA = [
  {
    question: 'Как открыть счет?',
    answer: 'Открыть счет можно за 5 минут через приложение. Нужен только паспорт и телефон.',
    keywords: ['счет', 'открыть', 'регистрация', 'начать']
  },
  {
    question: 'Какие комиссии?',
    answer: 'Переводы между своими счетами бесплатны. Комиссия на внешние переводы — 0%.',
    keywords: ['комиссия', 'плата', 'сколько стоит', 'цена']
  },
  {
    question: 'Поддержка криптовалют?',
    answer: 'Да! Вы можете хранить и обменивать BTC, ETH, USDT прямо в приложении.',
    keywords: ['крипта', 'криптовалюта', 'биткоин', 'btc', 'eth']
  },
  {
    question: 'Как пополнить счет?',
    answer: 'Пополнение через СБП, карты других банков или наличные в терминалах партнеров.',
    keywords: ['пополнить', 'внести', 'перевод', 'сбп']
  }
]

const SITE_CONTEXT = 'NeoBank - современный цифровой банк с поддержкой криптовалют, мгновенными переводами и высоким уровнем безопасности.'

function App() {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ type: 'bot', text: 'Привет! Я помощник NeoBank. Чем могу помочь?' }])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setChatInput('')
    setIsChatLoading(true)

    const lowerInput = userMessage.toLowerCase()
    const faqMatch = FAQ_DATA.find(faq =>
      faq.keywords.some(k => lowerInput.includes(k))
    )

    if (faqMatch) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: faqMatch.answer }])
        setIsChatLoading(false)
      }, 600)
    } else {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
        })
        const data = await res.json()
        setChatMessages(prev => [...prev, { type: 'bot', text: data.response || 'Извините, не могу ответить на этот вопрос.' }])
      } catch (err) {
        setChatMessages(prev => [...prev, { type: 'bot', text: 'Попробуйте спросить: "Как открыть счет?" или "Какие комиссии?"' }])
      }
      setIsChatLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      setSubmitStatus('error')
    }
    setIsSubmitting(false)
  }

  const features = [
    {
      icon: 'zap',
      title: 'Мгновенные переводы',
      desc: 'Отправляйте деньги мгновенно, 24/7, без выходных'
    },
    {
      icon: 'shield-check',
      title: 'Безопасность',
      desc: '3D Secure, биометрия и шифрование военного уровня'
    },
    {
      icon: 'credit-card',
      title: 'Виртуальные карты',
      desc: 'Создавайте виртуальные карты для онлайн-покупок'
    },
    {
      icon: 'pie-chart',
      title: 'Аналитика',
      desc: 'Отслеживайте расходы с умными графиками и категориями'
    },
    {
      icon: 'globe',
      title: 'Мультивалютность',
      desc: 'Счета в рублях, долларах, евро и криптовалютах'
    },
    {
      icon: 'smartphone',
      title: 'Мобильное приложение',
      desc: 'Управляйте финансами с телефона, где бы вы ни были'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <SafeIcon name="wallet" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">NeoBank</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-white transition-colors">Функции</button>
              <button onClick={() => scrollToSection('crypto')} className="text-slate-300 hover:text-white transition-colors">Крипта</button>
              <button onClick={() => scrollToSection('security')} className="text-slate-300 hover:text-white transition-colors">Безопасность</button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-300 hover:text-white transition-colors">Контакты</button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href={settings.cta_link || '#contact'} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-all hover:scale-105">
                Открыть счет
              </a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-900 border-b border-slate-800">
              <div className="px-4 py-4 space-y-3">
                <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-slate-300">Функции</button>
                <button onClick={() => scrollToSection('crypto')} className="block w-full text-left py-2 text-slate-300">Крипта</button>
                <button onClick={() => scrollToSection('security')} className="block w-full text-left py-2 text-slate-300">Безопасность</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-slate-300">Контакты</button>
                <a href={settings.cta_link || '#contact'} className="block w-full py-3 bg-blue-600 rounded-lg text-center font-medium mt-4">Открыть счет</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Новое поколение банкинга
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Банк, который <span className="gradient-text">всегда онлайн</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Открывайте счета за минуты, совершайте мгновенные переводы и управляйте криптовалютами в одном приложении
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={settings.app_store_link || '#contact'} className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:scale-105 transition-transform">
                <SafeIcon name="smartphone" size={24} />
                <div className="text-left">
                  <div className="text-xs opacity-70">Скачать в</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </a>
              <a href={settings.google_play_link || '#contact'} className="flex items-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl font-semibold hover:bg-slate-700 hover:scale-105 transition-all">
                <SafeIcon name="play" size={24} />
                <div className="text-left">
                  <div className="text-xs opacity-70">Доступно в</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 md:mt-24 relative"
          >
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-600/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    АИ
                  </div>
                  <div>
                    <div className="font-semibold">Алексей Иванов</div>
                    <div className="text-sm text-slate-400">**** 4582</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold">₽ 1,245,000</div>
                  <div className="text-sm text-emerald-400 flex items-center gap-1 justify-end">
                    <SafeIcon name="trending-up" size={16} />
                    +12.5% за месяц
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Пополнить', 'Перевести', 'Оплатить', 'История'].map((action, i) => (
                  <button key={i} className="p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition-colors text-center">
                    <SafeIcon name={['plus-circle', 'send', 'credit-card', 'clock'][i]} size={24} className="mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-medium">{action}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <SafeIcon name="shopping-bag" size={20} className="text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium">Супермаркет Пятёрочка</div>
                      <div className="text-sm text-slate-400">Сегодня, 14:30</div>
                    </div>
                  </div>
                  <div className="font-semibold text-red-400">- ₽ 2,450</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <SafeIcon name="arrow-down-left" size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium">Перевод от Сергея</div>
                      <div className="text-sm text-slate-400">Сегодня, 12:15</div>
                    </div>
                  </div>
                  <div className="font-semibold text-emerald-400">+ ₽ 15,000</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      {settings.show_features !== false && (
        <section id="features" ref={featuresRef} className="py-20 md:py-32 bg-slate-950">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Все функции в одном <span className="gradient-text">приложении</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Управляйте финансами проще, чем когда-либо</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-600/50 transition-all hover:scale-105"
                >
                  <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                    <SafeIcon name={feature.icon} size={28} className="text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Crypto Section */}
      {settings.show_crypto !== false && (
        <section id="crypto" className="py-20 md:py-32 bg-slate-900/50 border-y border-slate-800">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
                  <SafeIcon name="bitcoin" size={16} />
                  Криптовалюты
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Традиционный банкинг <span className="gradient-text">встречает крипту</span></h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Покупайте, продавайте и храните Bitcoin, Ethereum, USDT и другие криптовалюты прямо в банковском приложении. Мгновенные обмены по выгодному курсу.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Холодное хранение активов', 'Стейкинг с доходностью до 15% годовых', 'Мгновенные обмены без комиссии', 'Налоговые отчеты автоматически'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <SafeIcon name="check-circle" size={20} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={settings.cta_link || '#contact'} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-semibold hover:scale-105 transition-transform">
                  Начать инвестировать
                  <SafeIcon name="arrow-right" size={20} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  {[
                    { name: 'Bitcoin', symbol: 'BTC', price: '₽ 5,432,100', change: '+5.2%', color: 'text-orange-400' },
                    { name: 'Ethereum', symbol: 'ETH', price: '₽ 285,400', change: '+3.8%', color: 'text-blue-400' },
                    { name: 'Tether', symbol: 'USDT', price: '₽ 92.50', change: '-0.1%', color: 'text-emerald-400' },
                    { name: 'Solana', symbol: 'SOL', price: '₽ 14,200', change: '+12.4%', color: 'text-purple-400' }
                  ].map((coin, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {coin.symbol[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{coin.name}</div>
                          <div className="text-sm text-slate-400">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{coin.price}</div>
                        <div className={cn("text-sm", coin.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>{coin.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Analytics Section */}
      {settings.show_analytics !== false && (
        <section id="analytics" className="py-20 md:py-32 bg-slate-950">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Аналитика расходов</h3>
                    <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm">
                      <option>Этот месяц</option>
                      <option>Прошлый месяц</option>
                    </select>
                  </div>
                  <div className="h-48 flex items-end gap-2 mb-6">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Еда', value: '₽ 45,200', color: 'bg-blue-500' },
                      { label: 'Транспорт', value: '₽ 12,800', color: 'bg-cyan-500' },
                      { label: 'Развлечения', value: '₽ 28,400', color: 'bg-purple-500' }
                    ].map((cat, i) => (
                      <div key={i} className="text-center p-3 bg-slate-800/50 rounded-xl">
                        <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", cat.color)} />
                        <div className="text-sm text-slate-400">{cat.label}</div>
                        <div className="font-semibold">{cat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Понимайте свои <span className="gradient-text">расходы</span></h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Умная аналитика автоматически категоризирует траты и помогает экономить. Установите бюджеты и получайте уведомления при приближении к лимиту.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Автоматическая категоризация', desc: 'ИИ распределяет траты по категориям без вашего участия' },
                    { title: 'Прогноз баланса', desc: 'Предсказание остатка на конец месяца на основе истории' },
                    { title: 'Рекомендации по экономии', desc: 'Персональные советы для оптимизации расходов' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <SafeIcon name="check" size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Security */}
      <section id="security" className="py-20 md:py-32 bg-slate-900/30 border-y border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-12">Безопасность <span className="gradient-text">превыше всего</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'shield', title: '3D Secure 2.0', desc: 'Двухфакторная аутентификация для всех операций' },
                { icon: 'fingerprint', title: 'Биометрия', desc: 'Вход по Face ID и Touch ID. Никаких паролей.' },
                { icon: 'lock', title: 'Шифрование', desc: 'Военный уровень шифрования AES-256' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-600/30 transition-colors">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <SafeIcon name={item.icon} size={32} className="text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-8 md:p-16 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-600/30 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Готовы к будущему <span className="gradient-text">банкинга?</span></h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Откройте счет за 5 минут и получите виртуальную карту мгновенно</p>
              <a href={settings.cta_link || '#contact'} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-blue-600/25">
                Открыть счет бесплатно
                <SafeIcon name="arrow-right" size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 md:py-32 bg-slate-900/50 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Свяжитесь с нами</h2>
              <p className="text-slate-400">Оставьте заявку и мы ответим в течение часа</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Ваше имя</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="ivan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                  placeholder="+7 (999) 999-99-99"
                />
              </div>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center"
                  >
                    <SafeIcon name="check-circle" size={20} className="inline mr-2" />
                    Заявка отправлена! Мы свяжемся с вами скоро.
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                  >
                    <SafeIcon name="alert-circle" size={20} className="inline mr-2" />
                    Произошла ошибка. Попробуйте позже.
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <SafeIcon name="loader-2" size={20} className="animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <SafeIcon name="wallet" size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold">NeoBank</span>
              </div>
              <p className="text-slate-400 text-sm">Цифровой банк нового поколения с поддержкой криптовалют</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Карты</button></li>
                <li><button onClick={() => scrollToSection('crypto')} className="hover:text-white transition-colors">Криптовалюты</button></li>
                <li><button onClick={() => scrollToSection('analytics')} className="hover:text-white transition-colors">Инвестиции</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">О нас</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Контакты</button></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Вакансии</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Помощь</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Безопасность</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Конфиденциальность</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2024 NeoBank. Все права защищены.</p>
            <p>Лицензия ЦБ РФ № 1234 от 01.01.2024</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SafeIcon name="bot" size={20} />
                  <span className="font-semibold">Помощник</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                  <SafeIcon name="x" size={18} />
                </button>
              </div>
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.type === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn("max-w-[80%] p-3 rounded-2xl text-sm", msg.type === 'user' ? 'bg-blue-600 rounded-br-md' : 'bg-slate-800 rounded-bl-md')}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl rounded-bl-md p-3 flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                />
                <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <SafeIcon name="send" size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center"
        >
          <SafeIcon name={isChatOpen ? 'x' : 'message-circle'} size={24} />
        </motion.button>
      </div>
    </div>
  )
}

export default App