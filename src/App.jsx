import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

// Section wrapper with scroll animation
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [settings, setSettings] = useState({
    hero_title: "Банк будущего\nуже здесь",
    hero_subtitle: "Открой счёт за 5 минут. Мгновенные переводы по СБП, кэшбэк до 10% и курсы валют без наценки.",
    show_features: true,
    show_transfers: true,
    show_currency: true,
    show_credits: true,
    show_payments: true,
    contact_phone: "+7 (800) 555-35-35",
    contact_email: "support@neobank.ru",
    sbp_enabled: true,
    mirpay_enabled: true,
    applepay_enabled: true
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => console.log('Using default settings'))
  }, [])

  // Handle lead form submission
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
        setFormData({ name: "", phone: "", email: "" })
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
      setMobileMenuOpen(false)
    }
  }

  // Currency rates data
  const currencyRates = [
    { currency: "USD", buy: "89.50", sell: "91.20", change: "+0.5" },
    { currency: "EUR", buy: "97.80", sell: "99.50", change: "-0.3" },
    { currency: "CNY", buy: "12.40", sell: "12.65", change: "+0.1" }
  ]

  // Credit products
  const creditProducts = [
    { title: "Кредитная карта", rate: "от 9,9%", limit: "до 1 000 000 ₽", term: "бессрочно", icon: "credit-card", color: "from-cyan-500 to-blue-600" },
    { title: "Потребительский", rate: "от 7,5%", limit: "до 5 000 000 ₽", term: "до 7 лет", icon: "banknote", color: "from-purple-500 to-pink-600" },
    { title: "Рефинансирование", rate: "от 6,9%", limit: "до 3 000 000 ₽", term: "до 5 лет", icon: "arrow-right-left", color: "from-emerald-500 to-cyan-600" }
  ]

  // Features data
  const features = [
    { icon: "zap", title: "5 минут", desc: "На открытие счёта онлайн без визита в офис" },
    { icon: "shield-check", title: "100% безопасность", desc: "Защита данных по стандарту PCI DSS" },
    { icon: "clock", title: "24/7", desc: "Поддержка клиентов круглосуточно" },
    { icon: "percent", title: "До 10% кэшбэка", desc: "На категории трат каждый месяц" }
  ]

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <SafeIcon name="gem" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">NeoBank</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Возможности', 'Переводы', 'Курсы', 'Кредиты'].map((item, idx) => {
                const ids = ['features', 'transfers', 'currency', 'credits']
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(ids[idx])}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm text-gray-300 hover:text-white transition-colors">
                Войти
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Открыть счёт
              </button>
            </div>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {['Возможности', 'Переводы', 'Курсы', 'Кредиты'].map((item, idx) => {
                const ids = ['features', 'transfers', 'currency', 'credits']
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(ids[idx])}
                    className="block w-full text-left py-2 text-gray-300 hover:text-white"
                  >
                    {item}
                  </button>
                )
              })}
              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium">
                Открыть счёт
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-gray-300">Лицензия ЦБ РФ № 1234</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                {settings.hero_title.split('\n').map((line, i) => (
                  <span key={i}>
                    {i === 0 ? line : <span className="text-gradient">{line}</span>}
                    {i < settings.hero_title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                {settings.hero_subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 glow-cyan">
                  Открыть счёт бесплатно
                </button>
                <button className="px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <SafeIcon name="smartphone" size={20} />
                  Скачать приложение
                </button>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">2M+</div>
                  <div className="text-sm text-gray-400">Клиентов</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-bold text-white">4.9</div>
                  <div className="text-sm text-gray-400">Рейтинг в App Store</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-bold text-white">#1</div>
                  <div className="text-sm text-gray-400">По скорости переводов</div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative glass rounded-3xl p-6 md:p-8 glow-purple">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-yellow-400 to-yellow-600" />
                      <div>
                        <div className="text-sm font-medium text-white">NeoBank</div>
                        <div className="text-xs text-gray-400">Debit •••• 4242</div>
                      </div>
                    </div>
                    <SafeIcon name="wifi" size={24} className="text-gray-400 rotate-90" />
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Баланс</div>
                    <div className="text-4xl font-bold text-white flex items-baseline gap-1">
                      128 450 <span className="text-2xl text-gray-400">₽</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {['Пополнить', 'Перевести', 'Оплатить'].map((action) => (
                      <button key={action} className="py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-white">
                        {action}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-3">Последние операции</div>
                    {[
                      { name: 'СБЕРМАРКЕТ', amount: '-2 450 ₽', time: 'Сегодня, 14:30' },
                      { name: 'Перевод от Ивана', amount: '+5 000 ₽', time: 'Вчера, 18:20' }
                    ].map((op, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div>
                          <div className="text-sm text-white">{op.name}</div>
                          <div className="text-xs text-gray-500">{op.time}</div>
                        </div>
                        <div className={cn("text-sm font-medium", op.amount.startsWith('+') ? "text-emerald-400" : "text-white")}>
                          {op.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Почему выбирают нас</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Современный банк для современной жизни. Все операции в одном приложении.</p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="glass rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                    <SafeIcon name={feature.icon} size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Payment Systems */}
      {settings.show_payments !== false && (
        <section className="py-20 md:py-32 border-y border-white/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Подключённые системы</h2>
              <p className="text-gray-400">Мгновенные переводы и оплата везде</p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {settings.sbp_enabled !== false && (
                <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <SafeIcon name="zap" size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">СБП</h3>
                  <p className="text-sm text-gray-400">Система быстрых платежей. Переводы по номеру телефона 24/7.</p>
                </motion.div>
              )}

              {settings.mirpay_enabled !== false && (
                <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">MIR</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Mir Pay</h3>
                  <p className="text-sm text-gray-400">Оплата телефоном вместо карты. Работает даже без интернета.</p>
                </motion.div>
              )}

              {settings.applepay_enabled !== false && (
                <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-700 to-black flex items-center justify-center border border-white/20">
                    <SafeIcon name="apple" size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Apple Pay</h3>
                  <p className="text-sm text-gray-400">Безопасная оплата с iPhone и Apple Watch в один клик.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Transfers Section */}
      {settings.show_transfers !== false && (
        <section id="transfers" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Мгновенные переводы</h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Отправляйте деньги друзьям и близким мгновенно. Без комиссии внутри банка и по СБП — до 100 000 ₽ в месяц.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: 'arrow-right-left', title: 'По номеру телефона', desc: 'Через СБП в любой банк России' },
                    { icon: 'credit-card', title: 'Между картами', desc: 'По номеру карты Visa, Mastercard, МИР' },
                    { icon: 'wallet', title: 'На свой счёт', desc: 'Пополнение с карты другого банка' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl glass">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <SafeIcon name={item.icon} size={20} className="text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20" />
                  <div className="relative glass rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Новый перевод</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Без комиссии</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Получатель</label>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            А
                          </div>
                          <div className="flex-1">
                            <div className="text-white">Алексей К.</div>
                            <div className="text-xs text-gray-500">+7 (999) 123-45-67</div>
                          </div>
                          <SafeIcon name="chevron-right" size={20} className="text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Сумма</label>
                        <div className="relative">
                          <input
                            type="text"
                            value="5 000"
                            readOnly
                            className="w-full p-4 rounded-xl bg-white/5 text-white text-2xl font-bold border border-white/10 focus:border-cyan-500 outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₽</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Сообщение</label>
                        <input
                          type="text"
                          placeholder="За ужин 🍕"
                          className="w-full p-3 rounded-xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500 outline-none"
                        />
                      </div>

                      <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <SafeIcon name="send" size={20} />
                        Отправить
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Currency Section */}
      {settings.show_currency !== false && (
        <section id="currency" className="py-20 md:py-32 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Курсы валют</h2>
              <p className="text-gray-400">Выгодные курсы обмена без скрытых комиссий</p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {currencyRates.map((rate, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="glass rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-yellow-400">{rate.currency}</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{rate.currency}/RUB</div>
                        <div className={cn("text-xs", rate.change.startsWith('+') ? "text-emerald-400" : "text-red-400")}>
                          {rate.change}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Покупка</span>
                      <span className="text-white font-medium">{rate.buy} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Продажа</span>
                      <span className="text-white font-medium">{rate.sell} ₽</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 rounded-lg border border-cyan-500/50 text-cyan-400 text-sm hover:bg-cyan-500/10 transition-colors">
                    Обменять
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Credits Section */}
      {settings.show_credits !== false && (
        <section id="credits" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Кредитные продукты</h2>
              <p className="text-gray-400">Выгодные условия для ваших целей</p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {creditProducts.map((product, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="glass rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 group relative overflow-hidden"
                >
                  <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", product.color)} />

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4">
                    <SafeIcon name={product.icon} size={24} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{product.title}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ставка</span>
                      <span className="text-white font-semibold">{product.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Сумма</span>
                      <span className="text-white font-semibold">{product.limit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Срок</span>
                      <span className="text-white font-semibold">{product.term}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                    Подробнее
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection>
            <div className="relative glass rounded-3xl p-8 md:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Готовы начать?</h2>
                <p className="text-lg text-gray-400 mb-8">Откройте счёт за 5 минут и получите карту бесплатно. Никаких скрытых комиссий.</p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <SafeIcon name="loader-2" size={20} className="animate-spin" />
                    ) : (
                      'Открыть счёт'
                    )}
                  </button>
                </form>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 text-emerald-400"
                  >
                    <SafeIcon name="check-circle" size={20} />
                    <span>Заявка отправлена! Мы свяжемся с вами.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-400"
                  >
                    Ошибка отправки. Попробуйте позже.
                  </motion.div>
                )}

                <p className="mt-4 text-xs text-gray-500">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <SafeIcon name="gem" size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white">NeoBank</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Банк нового поколения для тех, кто ценит время и технологии.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-gray-400">TG</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-gray-400">VK</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Дебетовые карты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Кредитные карты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Кредиты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Вклады</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Клиентам</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Мобильное приложение</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Безопасность</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <SafeIcon name="phone" size={16} className="text-cyan-400" />
                  {settings.contact_phone}
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon name="mail" size={16} className="text-cyan-400" />
                  {settings.contact_email}
                </li>
                <li className="flex items-start gap-2">
                  <SafeIcon name="map-pin" size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  Москва, Пресненская наб., 12
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2024 NeoBank. Лицензия ЦБ РФ № 1234. Не является публичной офертой.</p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
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