import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  Menu, X, Trophy, Users, Target, Flame,
  ChevronRight, Star, MapPin, Phone, Mail,
  MessageSquare, Send, Bot, CheckCircle, AlertCircle,
  Instagram, Youtube, Dumbbell, Shield, Zap
} from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: 'Сколько стоит тренировка?',
    answer: 'Персональная тренировка — от 3 500₽, групповое занятие — от 1 200₽. Первое пробное занятие бесплатно!',
    keywords: ['цена', 'стоимость', 'сколько', 'платно', 'деньги', 'рублей', 'бесплатно']
  },
  {
    question: 'Какое расписание групповых занятий?',
    answer: 'Групповые тренировки проходят: Пн/Ср/Пт в 19:00 и Вт/Чт/Сб в 10:00. Воскресенье — выходной.',
    keywords: ['расписание', 'время', 'когда', 'график', 'часы', 'занятия']
  },
  {
    question: 'Нужен ли опыт для начала?',
    answer: 'Нет! У нас есть группы для всех уровней — от новичков до профессионалов. Тренер подберет программу индивидуально.',
    keywords: ['опыт', 'начать', 'новичок', 'первый раз', 'с чего', 'без опыта']
  },
  {
    question: 'Что взять на тренировку?',
    answer: 'Спортивная одежда, кроссовки, полотенце и бутылка воды. Перчатки и бинты выдаем бесплатно на первое занятие.',
    keywords: ['взять', 'что нужно', 'форма', 'экипировка', 'одежда', 'перчатки']
  },
  {
    question: 'Где находится зал?',
    answer: 'Мы находимся по адресу: Москва, ул. Спортивная, 15. 5 минут от метро. Есть бесплатная парковка.',
    keywords: ['где', 'адрес', 'место', 'локация', 'метро', 'как добраться', 'зал']
  }
]

const SITE_CONTEXT = 'Champion Muay Thai — профессиональный клуб тайского бокса в Москве. Тренер — многократный чемпион мира по муай-тай. Предлагаем персональные и групповые тренировки для всех уровней подготовки.'

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я помогу ответить на вопросы о наших тренировках. Что вас интересует?' }
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

    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsLoading(false)
      }, 500)
    } else {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(prev => [...prev, { type: 'bot', text: data.reply }])
        } else {
          throw new Error('API Error')
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Извините, я не смог обработать запрос. Позвоните нам: +7 (999) 123-45-67 или напишите на WhatsApp.'
        }])
      }
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
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400',
          'flex items-center justify-center shadow-lg shadow-amber-500/30 glow-amber',
          isOpen ? 'hidden' : 'flex'
        )}
      >
        <SafeIcon name="message-square" size={24} className="text-slate-950" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
                  <SafeIcon name="bot" size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">Champion AI</h3>
                  <p className="text-xs text-slate-800">Онлайн помощник</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-950/20 rounded-lg transition-colors"
              >
                <SafeIcon name="x" size={20} className="text-slate-950" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-950">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[85%] p-3 rounded-2xl text-sm',
                    msg.type === 'user'
                      ? 'bg-amber-500 text-slate-950 ml-auto rounded-br-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-md'
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-1 p-3">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
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
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-amber-500 rounded-xl text-slate-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

// Contact Form Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const submitForm = async (formData) => {
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    try {
      const data = new FormData(formData)
      data.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })

      if (response.ok) {
        setIsSuccess(true)
        formData.reset()
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, isSuccess, isError, submitForm }
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isSubmitting, isSuccess, isError, submitForm } = useFormHandler()

  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const testimonialsRef = useRef(null)
  const contactRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const aboutInView = useInView(aboutRef, { once: true, margin: '-100px' })
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' })
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-100px' })
  const contactInView = useInView(contactRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { name: 'Главная', id: 'hero' },
    { name: 'О тренере', id: 'about' },
    { name: 'Тренировки', id: 'services' },
    { name: 'Отзывы', id: 'testimonials' },
    { name: 'Контакты', id: 'contact' },
  ]

  const features = [
    {
      icon: 'trophy',
      title: 'Чемпионский опыт',
      desc: 'Тренер — многократный чемпион мира по муай-тай с 15-летним опытом'
    },
    {
      icon: 'users',
      title: 'Все уровни',
      desc: 'От новичков до профи — индивидуальный подход к каждому ученику'
    },
    {
      icon: 'target',
      title: 'Результат',
      desc: '90% учеников достигают поставленных целей за первые 3 месяца'
    },
    {
      icon: 'shield',
      title: 'Безопасность',
      desc: 'Контролируемая среда тренировок, страховка, медицинское сопровождение'
    }
  ]

  const services = [
    {
      title: 'Персональные тренировки',
      price: 'от 3 500₽',
      period: 'за занятие',
      features: [
        'Индивидуальная программа',
        'Гибкий график',
        'Работа на лапах и снарядах',
        'Видеоанализ техники',
        'Первое занятие бесплатно'
      ],
      popular: true,
      image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80'
    },
    {
      title: 'Групповые занятия',
      price: 'от 1 200₽',
      period: 'за занятие',
      features: [
        'До 12 человек в группе',
        '3 раза в неделю',
        'Все уровни подготовки',
        'Спарринги по желанию',
        'Абонементы со скидкой'
      ],
      popular: false,
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80'
    }
  ]

  const testimonials = [
    {
      name: 'Александр Петров',
      role: 'Бизнесмен, 2 года тренировок',
      text: 'Занимаюсь 2 года, сбросил 15 кг и научился защищать себя. Тренер настоящий профессионал, объясняет технику до мельчайших деталей.',
      rating: 5
    },
    {
      name: 'Мария Соколова',
      role: 'Фитнес-тренер, 8 месяцев',
      text: 'Пришла за новыми навыками для работы. Осталась навсегда! Энергетика зала, подход тренера — всё на высшем уровне.',
      rating: 5
    },
    {
      name: 'Дмитрий Волков',
      role: 'Студент, 1 год',
      text: 'Начал с нуля, сейчас участвую в любительских боях. Спасибо за веру в меня и терпение! Рекомендую всем друзьям.',
      rating: 5
    }
  ]

  const handleFormSubmit = (e) => {
    e.preventDefault()
    submitForm(e.target)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero') }} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="flame" size={24} className="text-slate-950" />
              </div>
              <span className="font-black text-xl tracking-tight">
                CHAMPION<span className="text-red-500">MUAY</span>THAI
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-slate-950 font-bold text-sm rounded-full transition-all hover:scale-105"
              >
                Записаться
              </button>
            </nav>

            <button
              className="md:hidden p-2 text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
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
              className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block w-full text-left py-3 text-slate-300 hover:text-amber-400 font-medium border-b border-slate-800 last:border-0"
                  >
                    {link.name}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-lg"
                >
                  Записаться на тренировку
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920&q=80"
            alt="Professional Muay Thai Fighter"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
              <SafeIcon name="trophy" size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-500">Многократный чемпион мира</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              СТАНЬ <span className="text-gradient">ЧЕМПИОНОМ</span>
              <br />
              <span className="text-slate-400">СВОЕЙ ЖИЗНИ</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
              Профессиональные курсы тайского бокса в Москве. Персональные и групповые тренировки с многократным чемпионом мира.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-slate-950 font-bold text-lg rounded-full hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Начать тренироваться
                <SafeIcon name="chevron-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white font-semibold text-lg rounded-full hover:bg-slate-800 transition-all hover:border-amber-500/50"
              >
                Узнать цены
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-black text-amber-400">15+</div>
                <div className="text-sm text-slate-500">лет опыта</div>
              </div>
              <div className="w-px h-12 bg-slate-800" />
              <div>
                <div className="text-3xl font-black text-amber-400">500+</div>
                <div className="text-sm text-slate-500">учеников</div>
              </div>
              <div className="w-px h-12 bg-slate-800" />
              <div>
                <div className="text-3xl font-black text-amber-400">50+</div>
                <div className="text-sm text-slate-500">титулов</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-amber-500/30 transition-all hover:bg-slate-900"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <SafeIcon name={feature.icon} size={24} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About/Trainer Section */}
      <section id="about" ref={aboutRef} className="py-20 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={aboutInView ? 'visible' : 'hidden'}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80"
                  alt="Champion Trainer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <SafeIcon name="trophy" size={20} className="text-amber-400" />
                    <span className="text-amber-400 font-bold">Многократный чемпион</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Александр "Тигр" Козлов</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={aboutInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
                <span className="text-sm font-semibold text-amber-400">О тренере</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                ТРЕНИРУЙСЯ С <span className="text-gradient">ЛУЧШИМ</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed mb-6">
                Александр — профессиональный боец муай-тай с 15-летним стажем. Многократный чемпион мира и Европы, обладатель пояса Lumpinee Stadium.
              </motion.p>

              <motion.p variants={fadeInUp} className="text-slate-400 leading-relaxed mb-8">
                Его методика обучения сочетает классические тайские техники с современными подходами к физической подготовке. Каждый ученик получает индивидуальный план развития, независимо от уровня подготовки.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400 mb-1">200+</div>
                  <div className="text-sm text-slate-500">профессиональных боёв</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-amber-400 mb-1">15</div>
                  <div className="text-sm text-slate-500">лет тренерской работы</div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                {['WBC Champion', 'Lumpinee Stadium', 'Max Muay Thai', 'Thai Fight'].map((badge) => (
                  <span key={badge} className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-full border border-slate-700">
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-20 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={servicesInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <span className="text-sm font-semibold text-amber-400">Программы тренировок</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              ВЫБЕРИ СВОЙ <span className="text-gradient">ПУТЬ</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg max-w-2xl mx-auto">
              От персональных занятий до групповых тренировок — найди формат, который подходит именно тебе
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={servicesInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className={cn(
                  'relative rounded-2xl overflow-hidden border transition-all duration-300',
                  service.popular
                    ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                )}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
                    ПОПУЛЯРНОЕ
                  </div>
                )}

                <div className="h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-amber-400">{service.price}</span>
                    <span className="text-slate-500">{service.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-slate-300">
                        <SafeIcon name="check-circle" size={18} className="text-amber-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => scrollToSection('contact')}
                    className={cn(
                      'w-full py-3 rounded-xl font-bold transition-all',
                      service.popular
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    )}
                  >
                    Записаться
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-20 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <span className="text-sm font-semibold text-amber-400">Отзывы учеников</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight">
              ИСТОРИИ <span className="text-gradient">УСПЕХА</span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} name="star" size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-slate-950 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={contactInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
                <span className="text-sm font-semibold text-amber-400">Контакты</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                НАЧНИ СЕЙЧАС
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-slate-400 text-lg mb-8">
                Оставь заявку на бесплатное пробное занятие. Мы свяжемся с тобой в течение 15 минут.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Адрес</div>
                    <div className="font-semibold text-white">Москва, ул. Спортивная, 15</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Телефон</div>
                    <div className="font-semibold text-white">+7 (999) 123-45-67</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mail" size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="font-semibold text-white">info@championmuaythai.ru</div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                  <SafeIcon name="youtube" size={20} />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={contactInView ? 'visible' : 'hidden'}
            >
              <form onSubmit={handleFormSubmit} className="p-8 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Ваше имя</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Тип тренировки</label>
                    <select
                      name="training_type"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    >
                      <option value="personal">Персональная</option>
                      <option value="group">Групповая</option>
                      <option value="not_sure">Не знаю</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Сообщение</label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                      placeholder="Расскажите о своих целях..."
                    />
                  </div>

                  <AnimatePresence>
                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400"
                      >
                        <SafeIcon name="check-circle" size={20} />
                        <span>Заявка отправлена! Мы скоро свяжемся с вами.</span>
                      </motion.div>
                    )}
                    {isError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400"
                      >
                        <SafeIcon name="alert-circle" size={20} />
                        <span>Произошла ошибка. Попробуйте позже.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"
                      />
                    ) : (
                      'Отправить заявку'
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <SafeIcon name="flame" size={18} className="text-slate-950" />
              </div>
              <span className="font-black text-lg tracking-tight">
                CHAMPION<span className="text-amber-400">MUAY</span>THAI
              </span>
            </div>

            <div className="text-slate-500 text-sm text-center md:text-right">
              <p>© 2024 Champion Muay Thai. Все права защищены.</p>
              <p className="mt-1">Многократный чемпион мира по тайскому боксу</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App