import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return { ref, isInView }
}

// Form handler hook
function useFormHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const submitForm = async (formData) => {
    setIsSubmitting(true)
    setIsError(false)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, isSuccess, isError, submitForm, setIsSuccess }
}

// Chat Widget Component
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я помогу ответить на вопросы о тренировках. Что вас интересует?' }
  ])
  const [inputValue, setInputValue] = useState('')

  const FAQ_DATA = [
    {
      question: "Сколько стоит тренировка",
      answer: "У нас есть два пакета: Базовый (15,000₽/мес) и Премиум (25,000₽/мес). Подробности в разделе 'Пакеты поддержки'.",
      keywords: ["цена", "стоимость", "сколько", "дорого", "дешево", "рублей", "₽"]
    },
    {
      question: "Что такое FTP",
      answer: "FTP (Functional Threshold Power) — это ваша функциональная мощность на пороге. Это ключевой показатель в велоспорте, который мы эффективно увеличиваем через целенаправленные тренировки.",
      keywords: ["ftp", "мощность", "порог", "ватты", "показатель"]
    },
    {
      question: "Как долго тренироваться",
      answer: "Рекомендуется минимум 3 месяца для заметного прогресса. Но первые улучшения вы заметите уже через 2-3 недели регулярных тренировок.",
      keywords: ["долго", "время", "когда", "результат", "прогресс", "недель", "месяцев"]
    },
    {
      question: "Подходит ли для новичков",
      answer: "Да! Программы адаптируются под любой уровень подготовки — от начинающих любителей до опытных гонщиков.",
      keywords: ["новичок", "начинающий", "любитель", "опыт", "уровень", "сложно"]
    }
  ]

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim().toLowerCase()
    setMessages(prev => [...prev, { type: 'user', text: inputValue }])
    setInputValue('')

    // Check FAQ
    const match = FAQ_DATA.find(faq =>
      faq.keywords.some(keyword => userMessage.includes(keyword))
    )

    setTimeout(() => {
      if (match) {
        setMessages(prev => [...prev, { type: 'bot', text: match.answer }])
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Спасибо за вопрос! Для детальной консультации оставьте заявку в форме ниже, и я свяжусь с вами лично.'
        }])
      }
    }, 500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafeIcon name="messageSquare" size={20} className="text-white" />
                <span className="font-semibold text-white">Помощник</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <SafeIcon name="x" size={20} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex",
                  msg.type === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                    msg.type === 'user'
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите вопрос..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSend}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors"
              >
                <SafeIcon name="send" size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-shadow"
      >
        {isOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="messageSquare" size={24} />}
      </motion.button>
    </div>
  )
}

// Main App Component
function App() {
  const [settings, setSettings] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSubmitting, isSuccess, isError, submitForm, setIsSuccess } = useFormHandler()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    age: '',
    goal: ''
  })

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await submitForm(formData)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const HeroSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div ref={ref} className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
              <SafeIcon name="bike" size={18} className="text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Персональный тренер по велоспорту</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
              <span className="text-white">Выйди на</span>
              <br />
              <span className="text-gradient">новый уровень</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl leading-relaxed">
              Увеличь свою <span className="text-cyan-400 font-semibold">FTP</span>, развивай
              <span className="text-cyan-400 font-semibold"> выносливость</span> и достигай
              спортивных целей с индивидуальной программой тренировок
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('form')}
                className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 px-8 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Начать тренироваться
                  <SafeIcon name="arrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => scrollToSection('about')}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-white font-semibold py-4 px-8 rounded-full hover:bg-slate-800 transition-all hover:border-cyan-500/50"
              >
                Узнать больше
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-slate-800">
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">150+</div>
                <div className="text-slate-500 text-sm">Атлетов</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-cyan-400">+30%</div>
                <div className="text-slate-500 text-sm">Рост FTP</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">5+</div>
                <div className="text-slate-500 text-sm">Лет опыта</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  const AboutSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
      <section id="about" className="py-24 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-4">
                <SafeIcon name="user" size={20} />
                <span>О тренере</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-6">
                Профессиональный подход к <span className="text-gradient">каждому</span> атлету
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Меня зовут Алексей, и я — сертифицированный тренер по велоспорту с опытом работы
                  более 5 лет. За это время я помог более 150 велосипедистам достичь их целей —
                  от первых гранфондо до побед в категориях.
                </p>
                <p>
                  Моя специализация — развитие функциональной мощности (FTP) и выносливости.
                  Я использую научный подход к тренировкам, основанный на данных и регулярном
                  тестировании прогресса.
                </p>
                <p>
                  Работаю с любителями всех уровней: от тех, кто только начал катать, до опытных
                  гонщиков, стремящихся попасть на подиум.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 mt-8">
                <div className="glass rounded-xl p-4">
                  <SafeIcon name="trophy" size={24} className="text-cyan-400 mb-2" />
                  <div className="text-white font-bold">Участник Ironman</div>
                  <div className="text-slate-500 text-sm">Личный опыт</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <SafeIcon name="target" size={24} className="text-cyan-400 mb-2" />
                  <div className="text-white font-bold">Научный подход</div>
                  <div className="text-slate-500 text-sm">Данные и аналитика</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80"
                  alt="Cyclist training"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <SafeIcon name="zap" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">+45%</div>
                    <div className="text-slate-400 text-sm">Средний рост FTP<br/>за 6 месяцев</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  const BenefitsSection = () => {
    const { ref, isInView } = useScrollAnimation()

    const benefits = [
      {
        icon: "zap",
        title: "Повышение FTP",
        description: "Увеличь свою функциональную мощность на 20-45% за один сезон через целенаправленные интервальные тренировки"
      },
      {
        icon: "heart",
        title: "Выносливость",
        description: "Строй долгосрочную базу для гранфондо, марафонов и многодневных гонок. Больше не устанешь на длинных дистанциях"
      },
      {
        icon: "target",
        title: "Персональный план",
        description: "Индивидуальная программа под твои цели, расписание и уровень подготовки. Адаптация под реальную жизнь"
      },
      {
        icon: "calendar",
        title: "Гибкий график",
        description: "Тренируйся когда удобно. План подстраивается под твою занятость — работа, семья, путешествия"
      }
    ]

    return (
      <section id="benefits" className="py-24 bg-slate-900/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-4">
              <SafeIcon name="star" size={20} />
              <span>Преимущества</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-4">
              Что ты <span className="text-gradient">получишь</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto">
              Комплексный подход к развитию твоих велосипедных способностей
            </motion.p>
          </motion.div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <SafeIcon name={benefit.icon} size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  const PackagesSection = () => {
    const { ref, isInView } = useScrollAnimation()

    const packages = [
      {
        name: "Базовый",
        price: "15 000",
        period: "/мес",
        description: "Идеально для начала пути и самостоятельных атлетов",
        features: [
          "Индивидуальный план тренировок",
          "Еженедельная корректировка",
          "Анализ мощности/пульса",
          "Поддержка в мессенджере",
          "Еженедельный отчет"
        ],
        popular: false,
        cta: "Выбрать Базовый"
      },
      {
        name: "Премиум",
        price: "25 000",
        period: "/мес",
        description: "Максимальный результат с личным сопровождением",
        features: [
          "Всё из Базового +",
          "2 видео-звонка в неделю",
          "Разбор техники езды",
          "План питания",
          "Стратегия гонок",
          "Приоритетная поддержка 24/7"
        ],
        popular: true,
        cta: "Выбрать Премиум"
      }
    ]

    return (
      <section id="packages" className="py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-4">
              <SafeIcon name="star" size={20} />
              <span>Пакеты поддержки</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-4">
              Выбери свой <span className="text-gradient">план</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto">
              Гибкие варианты для любого уровня и целей
            </motion.p>
          </motion.div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {packages.map((pkg, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={cn(
                  "relative rounded-3xl p-8 transition-all hover:scale-105",
                  pkg.popular
                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/20"
                    : "glass border-slate-700 hover:border-cyan-500/50"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
                    Популярный выбор
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={cn(
                    "text-2xl font-bold mb-2",
                    pkg.popular ? "text-white" : "text-white"
                  )}>{pkg.name}</h3>
                  <p className={cn(
                    "text-sm",
                    pkg.popular ? "text-white/80" : "text-slate-400"
                  )}>{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <span className={cn(
                    "text-5xl font-black",
                    pkg.popular ? "text-white" : "text-white"
                  )}>{pkg.price}</span>
                  <span className={cn(
                    "text-lg",
                    pkg.popular ? "text-white/80" : "text-slate-400"
                  )}>{pkg.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        pkg.popular ? "bg-white/20" : "bg-cyan-500/20"
                      )}>
                        <SafeIcon name="check" size={12} className={pkg.popular ? "text-white" : "text-cyan-400"} />
                      </div>
                      <span className={pkg.popular ? "text-white/90" : "text-slate-300"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollToSection('form')}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all",
                    pkg.popular
                      ? "bg-white text-cyan-600 hover:bg-slate-100"
                      : "bg-cyan-600 text-white hover:bg-cyan-500"
                  )}
                >
                  {pkg.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  const ReviewsSection = () => {
    const { ref, isInView } = useScrollAnimation()

    const reviews = [
      {
        name: "Дмитрий К.",
        role: "Любитель, 2 года в спорте",
        text: "За 4 месяца работы FTP вырос с 180 до 245 ватт. Теперь спокойно закрываю гранфондо без отсечки. План реально работает!",
        rating: 5
      },
      {
        name: "Анна М.",
        role: "Триатлет",
        text: "Наконец-то нашла тренера, который понимает, что я совмещаю работу, семью и спорт. Гибкий план, понятные тренировки, отличный результат.",
        rating: 5
      },
      {
        name: "Сергей В.",
        role: "МТБ гонщик",
        text: "Готовился к марафону с тренером 6 месяцев. Результат — личный рекорд и попадание в ТОП-10 категории. Рекомендую!",
        rating: 5
      }
    ]

    return (
      <section id="reviews" className="py-24 bg-slate-900/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-4">
              <SafeIcon name="messageSquare" size={20} />
              <span>Отзывы</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-4">
              Истории <span className="text-gradient">успеха</span>
            </motion.h2>
          </motion.div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="glass rounded-2xl p-6 relative"
              >
                <SafeIcon name="quote" size={32} className="text-cyan-500/20 absolute top-4 right-4" />

                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <SafeIcon key={i} name="star" size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">"{review.text}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{review.name}</div>
                    <div className="text-slate-500 text-sm">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  const FormSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
      <section id="form" className="py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <motion.div variants={fadeInUp} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-4">
                  <SafeIcon name="send" size={20} />
                  <span>Начни свой путь</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Оставь заявку на <span className="text-gradient">бесплатную</span> консультацию
                </h2>

                <p className="text-slate-400">
                  Расскажи о себе, и я подготовлю персональное предложение под твои цели
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SafeIcon name="check" size={40} className="text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h3>
                    <p className="text-slate-400 mb-6">Я свяжусь с тобой в течение 24 часов</p>
                    <button
                      onClick={() => {
                        setIsSuccess(false)
                        setFormData({ name: '', phone: '', email: '', experience: '', age: '', goal: '' })
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Отправить еще одну заявку
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Имя *</label>
                        <div className="relative">
                          <SafeIcon name="user" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Ваше имя"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Телефон *</label>
                        <div className="relative">
                          <SafeIcon name="phone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="+7 (999) 999-99-99"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                        <div className="relative">
                          <SafeIcon name="mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Возраст</label>
                        <div className="relative">
                          <SafeIcon name="calendar" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="25"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Стаж в велоспорте</label>
                      <div className="relative">
                        <SafeIcon name="clock" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                        >
                          <option value="">Выберите стаж</option>
                          <option value="less-1">Менее 1 года</option>
                          <option value="1-2">1-2 года</option>
                          <option value="2-5">2-5 лет</option>
                          <option value="5-plus">Более 5 лет</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Ваша цель *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.goal}
                        onChange={(e) => setFormData({...formData, goal: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        placeholder="Расскажите о вашей цели: подготовка к гонке, повышение FTP, первый марафон..."
                      />
                    </div>

                    {isError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                        Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <SafeIcon name="arrowRight" size={20} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="bike" size={24} className="text-white" />
              </div>
              <span className="hidden sm:block">Cycling<span className="text-cyan-400">Pro</span></span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-white transition-colors">О тренере</button>
              <button onClick={() => scrollToSection('benefits')} className="text-slate-400 hover:text-white transition-colors">Преимущества</button>
              <button onClick={() => scrollToSection('packages')} className="text-slate-400 hover:text-white transition-colors">Пакеты</button>
              <button onClick={() => scrollToSection('reviews')} className="text-slate-400 hover:text-white transition-colors">Отзывы</button>
            </nav>

            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection('form')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full transition-all"
              >
                Связаться
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <nav className="flex flex-col p-4 gap-4">
                <button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-white transition-colors text-left py-2">О тренере</button>
                <button onClick={() => scrollToSection('benefits')} className="text-slate-400 hover:text-white transition-colors text-left py-2">Преимущества</button>
                <button onClick={() => scrollToSection('packages')} className="text-slate-400 hover:text-white transition-colors text-left py-2">Пакеты</button>
                <button onClick={() => scrollToSection('reviews')} className="text-slate-400 hover:text-white transition-colors text-left py-2">Отзывы</button>
                <button
                  onClick={() => scrollToSection('form')}
                  className="bg-cyan-600 text-white font-semibold py-3 px-6 rounded-xl mt-2"
                >
                  Оставить заявку
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main>
        {settings.show_hero !== false && <HeroSection />}
        {settings.show_about !== false && <AboutSection />}
        {settings.show_benefits !== false && <BenefitsSection />}
        {settings.show_packages !== false && <PackagesSection />}
        {settings.show_reviews !== false && <ReviewsSection />}
        {settings.show_form !== false && <FormSection />}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="bike" size={24} className="text-white" />
                </div>
                <span>Cycling<span className="text-cyan-400">Pro</span></span>
              </div>
              <p className="text-slate-400 text-sm">
                Персональные тренировки для велосипедистов, стремящихся к новым вершинам.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Навигация</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-cyan-400 text-left text-sm transition-colors">О тренере</button>
                <button onClick={() => scrollToSection('benefits')} className="text-slate-400 hover:text-cyan-400 text-left text-sm transition-colors">Преимущества</button>
                <button onClick={() => scrollToSection('packages')} className="text-slate-400 hover:text-cyan-400 text-left text-sm transition-colors">Пакеты</button>
                <button onClick={() => scrollToSection('reviews')} className="text-slate-400 hover:text-cyan-400 text-left text-sm transition-colors">Отзывы</button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <SafeIcon name="mail" size={16} className="text-cyan-400" />
                  <span>coach@cyclingpro.ru</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <SafeIcon name="phone" size={16} className="text-cyan-400" />
                  <span>+7 (999) 123-45-67</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2024 CyclingPro. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App