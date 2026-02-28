import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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

function App() {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })

  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.log('Using default settings')
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const features = [
    {
      icon: 'credit-card',
      title: 'Виртуальные карты',
      description: 'Мгновенное создание виртуальных карт для безопасных онлайн-покупок'
    },
    {
      icon: 'zap',
      title: 'Мгновенные переводы',
      description: 'Переводы между счетами за секунды, 24/7 без выходных'
    },
    {
      icon: 'globe',
      title: 'Мультивалютность',
      description: 'Храните средства в 30+ валютах по выгодным курсам обмена'
    },
    {
      icon: 'trending-up',
      title: 'Накопления',
      description: 'Доходность до 8% годовых на остаток по счету'
    },
    {
      icon: 'shield',
      title: '3D Secure 2.0',
      description: 'Продвинутая защита всех транзакций от мошенничества'
    },
    {
      icon: 'smartphone',
      title: 'Управление в приложении',
      description: 'Полный контроль над счетами с вашего смартфона'
    }
  ]

  const stats = [
    { value: '500K+', label: 'Активных пользователей' },
    { value: '2M+', label: 'Транзакций в месяц' },
    { value: '4.9', label: 'Рейтинг в App Store' },
    { value: '0%', label: 'Комиссия за обслуживание' }
  ]

  const testimonials = [
    {
      name: 'Александр М.',
      role: 'Предприниматель',
      text: 'Наконец-то банк, который понимает современный бизнес. Интеграция с API заняла 15 минут.'
    },
    {
      name: 'Елена К.',
      role: 'Фрилансер',
      text: 'Получаю платежи из-за рубежа без потерь на конвертации. Очень удобно!'
    },
    {
      name: 'Дмитрий В.',
      role: 'Инвестор',
      text: 'Высокая доходность на остаток и удобное мобильное приложение. Рекомендую!'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="zap" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">NexoBank</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Возможности
              </button>
              <button onClick={() => scrollToSection('security')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Безопасность
              </button>
              <button onClick={() => scrollToSection('stats')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                О нас
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Контакты
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href={settings.cta_secondary_link || '#features'} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Войти
              </a>
              <a href={settings.cta_primary_link || '#contact'} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition-all hover:scale-105 text-sm">
                Открыть счет
              </a>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass border-t border-slate-800/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-slate-300 hover:text-white">Возможности</button>
              <button onClick={() => scrollToSection('security')} className="block w-full text-left py-2 text-slate-300 hover:text-white">Безопасность</button>
              <button onClick={() => scrollToSection('stats')} className="block w-full text-left py-2 text-slate-300 hover:text-white">О нас</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-slate-300 hover:text-white">Контакты</button>
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <a href={settings.cta_secondary_link || '#features'} className="block w-full py-2 text-center text-slate-300">Войти</a>
                <a href={settings.cta_primary_link || '#contact'} className="block w-full py-2 text-center bg-cyan-500 text-slate-950 font-semibold rounded-lg">Открыть счет</a>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Новое: Криптовалютные переводы</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
              <span className="gradient-text">Банк</span> будущего<br />
              <span className="text-slate-400">уже сегодня</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Откройте счет за 5 минут без посещения отделения. Мгновенные переводы, мультивалютность и доходность до 8% годовых.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href={settings.cta_primary_link || '#contact'}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 glow-cyan flex items-center justify-center gap-2"
              >
                Открыть счет бесплатно
                <SafeIcon name="arrow-right" size={20} />
              </a>
              <a
                href={settings.cta_secondary_link || '#features'}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Узнать больше
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <SafeIcon name="check" size={16} className="text-cyan-400" />
                <span>Без комиссий за обслуживание</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-2">
                <SafeIcon name="check" size={16} className="text-cyan-400" />
                <span>Открытие за 5 минут</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-2">
                <SafeIcon name="check" size={16} className="text-cyan-400" />
                <span>Лицензия ЦБ РФ</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" ref={featuresRef} className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate={isFeaturesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
                Все возможности <span className="gradient-text">в одном приложении</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
                Управляйте финансами легко и безопасно из любой точки мира
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={isFeaturesInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="glass-card p-8 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                    <SafeIcon name={feature.icon} size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {settings.show_stats !== false && (
        <section id="stats" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-600/5" />
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Security Section */}
      {settings.show_security !== false && (
        <section id="security" className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
                  <SafeIcon name="lock" size={16} className="text-cyan-400" />
                  <span className="text-sm text-slate-300">Банковская безопасность</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ваши деньги <span className="gradient-text">под защитой</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Используем передовые технологии шифрования и многофакторную аутентификацию.
                  Ваши средства застрахованы на сумму до 1.4 млн рублей.
                </p>

                <div className="space-y-4">
                  {[
                    '256-битное SSL-шифрование',
                    'Биометрическая аутентификация',
                    'Мгновенные уведомления о транзакциях',
                    'Возможность блокировки карты в один клик'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <SafeIcon name="check" size={14} className="text-cyan-400" />
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-3xl" />
                <div className="relative glass-card rounded-3xl p-8 glow-blue">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                        <SafeIcon name="shield" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Защита активирована</div>
                        <div className="text-sm text-slate-400">Все системы работают</div>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                      <span className="text-slate-400">Статус счета</span>
                      <span className="text-emerald-400 font-medium">Активен</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                      <span className="text-slate-400">Последний вход</span>
                      <span className="text-slate-300">Сегодня, 14:32</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                      <span className="text-slate-400">2FA авторизация</span>
                      <span className="text-emerald-400 font-medium">Включена</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-400">Устройство</span>
                      <span className="text-slate-300">iPhone 15 Pro</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {settings.show_testimonials !== false && (
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Что говорят <span className="gradient-text">наши клиенты</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 rounded-2xl"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon key={i} name="zap" size={16} className="text-cyan-400 fill-cyan-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto border-cyan-500/20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Готовы к <span className="gradient-text">финансовой свободе</span>?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к 500 000+ пользователей, которые уже выбрали NexoBank.
              Открытие счета занимает менее 5 минут.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href={settings.app_store_link || '#'}
                className="flex items-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 w-full sm:w-auto justify-center"
              >
                <SafeIcon name="apple" size={24} />
                <div className="text-left">
                  <div className="text-xs text-slate-400">Загрузите в</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </a>
              <a
                href={settings.google_play_link || '#'}
                className="flex items-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 w-full sm:w-auto justify-center"
              >
                <SafeIcon name="play" size={24} />
                <div className="text-left">
                  <div className="text-xs text-slate-400">Доступно в</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>

            <a
              href={settings.cta_primary_link || '#contact'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 glow-cyan"
            >
              Открыть счет сейчас
              <SafeIcon name="arrow-right" size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Свяжитесь <span className="gradient-text">с нами</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Оставьте заявку, и наш менеджер свяжется с вами в течение 15 минут
                для консультации по открытию счета.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <SafeIcon name="mail" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="font-semibold">support@nexobank.ru</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <SafeIcon name="smartphone" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Телефон</div>
                    <div className="font-semibold">8 (800) 555-35-35</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Ваше имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors text-white"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors text-white"
                    placeholder="ivan@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors text-white"
                    placeholder="+7 (999) 999-99-99"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <SafeIcon name="send" size={20} />
                      Отправить заявку
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-center"
                  >
                    Заявка успешно отправлена! Мы свяжемся с вами скоро.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center"
                  >
                    Произошла ошибка. Пожалуйста, попробуйте позже.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="zap" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold">NexoBank</span>
              </a>
              <p className="text-slate-400 mb-4 max-w-sm">
                Современный необанк для тех, кто ценит скорость, безопасность и свободу.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <SafeIcon name="smartphone" size={20} className="text-slate-400" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <SafeIcon name="mail" size={20} className="text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Дебетовые карты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Виртуальные карты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Накопительные счета</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Бизнес счета</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Безопасность</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>© 2024 NexoBank. Все права защищены.</div>
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