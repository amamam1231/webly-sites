import { SafeIcon } from './components/SafeIcon';
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

// Global Background with moving gradient spots
const GlobalBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 right-0 w-96 h-96 bg-[#253FF6]/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, -20, 0],
        y: [0, 30, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      className="absolute bottom-40 left-0 w-72 h-72 bg-[#E1FF01]/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, 40, 0],
        y: [0, 20, 0],
        scale: [1, 0.9, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#253FF6]/10 rounded-full blur-2xl"
    />
    <motion.div
      animate={{
        x: [0, -30, 0],
        y: [0, -40, 0],
        scale: [1, 1.15, 1]
      }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#E1FF01]/5 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, 50, 0],
        y: [0, 10, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-[#253FF6]/15 rounded-full blur-2xl"
    />
  </div>
)

// Section wrapper with scroll animation
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

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

// Marquee Component
const Marquee = () => {
  const text = "WEBLY AI /// БЕЗ КОДА /// ЧИСТАЯ МАГИЯ /// ДИЗАЙН БЫСТРЕЕ /// БУДУЩЕЕ УЖЕ ЗДЕСЬ /// "

  return (
    <div className="bg-[#253FF6] py-3 overflow-hidden relative z-10">
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-white font-display font-bold text-sm md:text-base tracking-widest mx-4 uppercase"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

// Bento Grid Card
const BentoCard = ({ title, description, icon, color = 'lime' }) => {
  const bgColor = color === 'blue' ? 'bg-[#253FF6]' : 'bg-[#1a1a1a]'
  const borderColor = color === 'lime' ? 'border-[#E1FF01]/30' : 'border-[#253FF6]/30'

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden rounded-3xl border ${borderColor} ${bgColor} p-6 md:p-8 group cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-[#E1FF01]/10 h-full`}
    >
      {/* Geometric decoration */}
      <div className={`absolute ${color === 'lime' ? 'bg-[#E1FF01]/10' : 'bg-white/10'} quarter-circle w-32 h-32 -top-10 -right-10 transition-transform group-hover:scale-150 duration-500`} />

      {/* Additional geometric shape */}
      <div className={`absolute ${color === 'lime' ? 'bg-[#253FF6]/20' : 'bg-[#E1FF01]/10'} w-20 h-20 rounded-full -bottom-10 -left-10 blur-xl group-hover:scale-150 transition-transform duration-700`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${color === 'lime' ? 'bg-[#E1FF01]' : 'bg-white'} flex items-center justify-center mb-4`}>
          <SafeIcon
            name={icon}
            size={24}
            className={color === 'lime' ? 'text-black' : 'text-[#253FF6]'}
          />
        </div>
        <h3 className={`font-display font-bold text-white text-xl mb-2`}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// How it Works - Split Screen Component
const HowItWorks = () => {
  const [step, setStep] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSubmit = () => {
    if (!prompt.trim()) return
    setIsAnimating(true)
    setStep(2)
    setTimeout(() => {
      setStep(3)
      setIsAnimating(false)
    }, 2500)
  }

  const resetDemo = () => {
    setStep(1)
    setPrompt('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 min-h-[500px] lg:min-h-[600px]">
      {/* Left Side - Input */}
      <div className="bg-[#1a1a1a] rounded-3xl lg:rounded-r-none p-6 md:p-10 flex flex-col justify-center border border-gray-800 lg:border-r-0 relative z-10">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#E1FF01]/10 border border-[#E1FF01]/30 rounded-full px-3 py-1 mb-4">
            <SafeIcon name="sparkles" size={14} className="text-[#E1FF01]" />
            <span className="text-[#E1FF01] text-xs font-semibold uppercase tracking-wider">Шаг 1</span>
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
            Опишите вашу идею
          </h3>
          <p className="text-gray-400">
            Расскажите, какой сайт вы хотите создать. Чем детальнее описание, тем лучше результат.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Например: Современный лендинг для кофейни с неоновым стилем, темным фоном и яркими акцентами..."
              className="w-full bg-[#0F1212] border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-[#E1FF01] transition-colors resize-none h-32"
              disabled={step > 1}
            />
            <div className="absolute bottom-3 right-3 text-gray-600 text-xs">
              {prompt.length} симв.
            </div>
          </div>

          {step === 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="w-full bg-[#E1FF01] hover:bg-[#d4f200] disabled:bg-gray-700 disabled:text-gray-500 text-black py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <SafeIcon name="wand2" size={20} />
              Сгенерировать сайт
            </button>
          ) : (
            <button
              onClick={resetDemo}
              className="w-full border border-gray-700 hover:border-[#E1FF01] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <SafeIcon name="refreshCw" size={20} />
              Попробовать снова
            </button>
          )}
        </div>

        {/* Quick prompts */}
        {step === 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {['Лендинг для кофейни', 'Портфолио фотографа', 'Магазин одежды'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 text-xs hover:border-[#E1FF01] hover:text-[#E1FF01] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Side - Preview */}
      <div className="bg-[#0a0a0a] rounded-3xl lg:rounded-l-none p-6 md:p-10 flex flex-col justify-center border border-gray-800 relative overflow-hidden z-10">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #E1FF01 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center relative z-10"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center">
                <SafeIcon name="layout" size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-500 font-display text-lg">
                Здесь появится ваш сайт
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center relative z-10"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#253FF6]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-[#E1FF01] border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SafeIcon name="code" size={24} className="text-[#E1FF01]" />
                </div>
              </div>
              <p className="text-white font-display text-xl mb-2">
                Генерируем код...
              </p>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#E1FF01] rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <div className="mt-6 space-y-2 max-w-xs mx-auto">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#E1FF01] to-[#253FF6]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>Analyzing prompt...</span>
                  <span>85%</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                {/* Browser chrome */}
                <div className="bg-[#0F1212] px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-500 text-center">
                      webly.ai/preview/generated-site
                    </div>
                  </div>
                </div>

                {/* Preview content */}
                <div className="p-6 space-y-4">
                  <div className="h-32 bg-gradient-to-br from-[#253FF6] to-[#E1FF01] rounded-xl flex items-center justify-center">
                    <span className="font-display font-bold text-black text-2xl">Hero Section</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-gray-800 rounded-lg" />
                    <div className="h-20 bg-gray-800 rounded-lg" />
                  </div>
                  <div className="h-12 bg-[#E1FF01] rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">CTA Button</span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-[#E1FF01]"
              >
                <SafeIcon name="checkCircle" size={20} />
                <span className="font-semibold">Готово! Сайт создан за 3 секунды</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Instructions Section Component
const InstructionsSection = () => {
  const steps = [
    {
      number: "01",
      title: "Опишите идею",
      description: "Расскажите нашему ИИ, какой сайт вам нужен. Чем детальнее описание, тем лучше результат.",
      icon: "messageSquare"
    },
    {
      number: "02",
      title: "AI генерирует",
      description: "Нейросеть создаёт уникальный дизайн, подбирает цвета, шрифты и компоновку за секунды.",
      icon: "wand2"
    },
    {
      number: "03",
      title: "Настройте детали",
      description: "Отредактируйте текст, замените изображения, настройте стили в визуальном редакторе.",
      icon: "sliders"
    },
    {
      number: "04",
      title: "Опубликуйте",
      description: "Один клик — и ваш сайт в интернете. Подключите свой домен или используйте наш бесплатный.",
      icon: "globe"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative bg-[#1a1a1a] rounded-3xl p-6 border border-gray-800 hover:border-[#E1FF01]/30 transition-colors group"
        >
          {/* Step number */}
          <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#E1FF01] rounded-2xl flex items-center justify-center font-display font-bold text-black text-lg shadow-lg shadow-[#E1FF01]/20">
            {step.number}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#253FF6]/20 flex items-center justify-center mb-4 mt-4 group-hover:bg-[#253FF6]/30 transition-colors">
            <SafeIcon name={step.icon} size={24} className="text-[#E1FF01]" />
          </div>

          {/* Content */}
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Pricing Card
const PricingCard = ({ plan, price, features, isPopular = false, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`relative rounded-3xl p-6 md:p-8 ${isPopular ? 'bg-[#253FF6] ring-4 ring-[#253FF6]/30' : 'bg-[#1a1a1a] border border-gray-800'} flex flex-col z-10`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E1FF01] text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-[#E1FF01]/20">
          Популярный
        </div>
      )}

      <div className="mb-6">
        <h3 className={`font-display font-bold text-2xl ${isPopular ? 'text-white' : 'text-white'} mb-2`}>
          {plan}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl md:text-5xl font-display font-bold ${isPopular ? 'text-white' : 'text-white'}`}>
            {price}
          </span>
          <span className="text-gray-400 text-sm">/мес</span>
        </div>
      </div>

      <p className={`mb-6 text-sm ${isPopular ? 'text-white/80' : 'text-gray-400'}`}>
        Все, что нужно для взлета
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? 'bg-[#E1FF01]' : 'bg-[#E1FF01]/20'}`}>
              <SafeIcon name="check" size={12} className={isPopular ? 'text-black' : 'text-[#E1FF01]'} />
            </div>
            <span className={`text-sm ${isPopular ? 'text-white' : 'text-gray-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105 ${isPopular ? 'bg-[#E1FF01] text-black hover:bg-[#d4f200]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}>
        Начать бесплатно
      </button>
    </motion.div>
  )
}

// Testimonial Card
const TestimonialCard = ({ quote, author, role, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-gray-700 transition-colors z-10"
    >
      <p className="text-gray-400 mb-6 leading-relaxed relative z-10 text-sm">
        "{quote}"
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E1FF01] to-[#253FF6] flex items-center justify-center text-black font-bold text-sm">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{author}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </motion.div>
  )
}

// FAQ Item
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-display font-bold text-base md:text-lg text-white group-hover:text-[#E1FF01] transition-colors pr-4">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-[#E1FF01] border-[#E1FF01]' : 'border-gray-700 group-hover:border-[#E1FF01]'}`}>
          <SafeIcon
            name="chevronDown"
            size={16}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : 'text-white'}`}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-400 text-sm md:text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main App Component
function App() {
  const [openFAQ, setOpenFAQ] = useState(0)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Smart navigation - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavHidden(true)
      } else {
        setIsNavHidden(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Smooth scroll implementation - lighter version
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.target.closest('a')?.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  // Updated FAQ data - only 5 questions
  const faqData = [
    {
      question: "Как это работает?",
      answer: "Webly AI использует передовые модели машинного обучения для генерации уникальных дизайнов на основе вашего описания. Просто расскажите, что вам нужно, и наш ИИ создаст полноценный сайт за считанные секунды."
    },
    {
      question: "Нужны ли навыки кодинга?",
      answer: "Абсолютно нет! Webly AI создан для того, чтобы любой мог создать профессиональный сайт без единой строчки кода. Наш визуальный редактор позволяет настраивать всё мышкой."
    },
    {
      question: "Можно ли экспортировать код?",
      answer: "Да! Вы можете экспортировать чистый HTML/CSS/React код вашего проекта в любой момент. Это ваш сайт, и вы полностью им владеете."
    },
    {
      question: "Какие шаблоны доступны?",
      answer: "Мы предлагаем более 100 уникальных шаблонов для различных ниш: от лендингов и портфолио до интернет-магазинов и корпоративных сайтов. Каждый шаблон можно полностью кастомизировать."
    },
    {
      question: "Есть ли пробный период?",
      answer: "Да! Тариф 'Старт' полностью бесплатен и включает 3 проекта. Это отличная возможность протестировать все возможности платформы перед переходом на платный тариф."
    }
  ]

  const testimonials = [
    {
      quote: "Создала сайт для своей студии за 10 минут. Клиенты теперь думают, что у меня целая команда дизайнеров!",
      author: "Анна К.",
      role: "Владелица дизайн-студии"
    },
    {
      quote: "Пробовал множество конструкторов, но Webly AI — это что-то другое. Качество дизайна на уровне топовых агентств.",
      author: "Михаил Р.",
      role: "Маркетолог"
    },
    {
      quote: "Экономия времени и денег колоссальная. То, что раньше занимало неделю, теперь делается за час.",
      author: "Дмитрий С.",
      role: "Основатель стартапа"
    }
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1212] overflow-x-hidden relative">
      {/* Global animated background */}
      <GlobalBackground />

      {/* Navigation - hides on scroll down, shows on scroll up */}
      <header className={`fixed top-0 w-full bg-[#0F1212]/90 backdrop-blur-md z-50 border-b border-gray-800/50 transition-transform duration-300 ${isNavHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770857255-8525.svg?"
              alt="Webly AI Logo"
              className="w-10 h-10"
            />
            <span className="font-display font-bold text-white text-xl tracking-tight">Webly AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Как это работает</button>
            <button onClick={() => scrollToSection('instructions')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Инструкция</button>
            <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Возможности</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Тарифы</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">FAQ</button>
          </div>

          <a
            href="https://t.me/construct_ai_bot?start=ref_347995964"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E1FF01] hover:bg-[#d4f200] text-black px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 text-sm"
          >
            Начать
          </a>
        </nav>
      </header>

      {/* Hero Section - without logo and local background spots */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-4 md:px-6 overflow-hidden z-10">
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight leading-[0.9]"
          >
            ГЕНЕРИРУЙТЕ
            <br />
            <span className="text-[#E1FF01]">МАГИЮ ВЕБА</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Создавайте потрясающие сайты за секунды с помощью искусственного интеллекта. Без кода. Без ограничений. Только чистая магия дизайна.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://t.me/construct_ai_bot?start=ref_347995964"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E1FF01] hover:bg-[#d4f200] text-black px-8 py-4 rounded-2xl text-base font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 min-h-[56px]"
            >
              Начать создание
              <SafeIcon name="arrowRight" size={20} />
            </a>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2 min-h-[56px] backdrop-blur-sm hover:bg-white/5"
            >
              <SafeIcon name="play" size={20} />
              Смотреть демо
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#E1FF01] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#253FF6]/20 border border-[#253FF6]/30 rounded-full px-4 py-2 mb-6">
              <SafeIcon name="zap" size={16} className="text-[#E1FF01]" />
              <span className="text-[#E1FF01] text-sm font-semibold uppercase tracking-wider">Простой процесс</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              КАК ЭТО РАБОТАЕТ
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Три простых шага от идеи до готового сайта. Попробуйте прямо сейчас.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <HowItWorks />
          </AnimatedSection>
        </div>
      </section>

      {/* Instructions Section - NEW */}
      <section id="instructions" className="py-20 md:py-32 px-4 md:px-6 relative z-10 bg-[#0a0a0a]/50">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#E1FF01]/10 border border-[#E1FF01]/30 rounded-full px-4 py-2 mb-6">
              <SafeIcon name="bookOpen" size={16} className="text-[#E1FF01]" />
              <span className="text-[#E1FF01] text-sm font-semibold uppercase tracking-wider">Инструкция</span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              КАК НАЧАТЬ
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Четыре простых шага для создания вашего первого сайта с помощью ИИ
            </p>
          </AnimatedSection>

          <InstructionsSection />
        </div>
      </section>

      {/* Bento Grid Section */}
      <section id="features" className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              ЧТО МОЖНО СОЗДАТЬ
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              От лендингов до сложных веб-приложений — ваши возможности безграничны
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            <BentoCard
              title="Лендинги нового поколения"
              description="Высококонверсионные страницы с уникальным дизайном, созданные за минуты"
              icon="zap"
              color="lime"
            />
            <BentoCard
              title="Портфолио с характером"
              description="Выделитесь из толпы с персонализированным сайтом-портфолио"
              icon="palette"
              color="blue"
            />
            <BentoCard
              title="Магазины, которые продают"
              description="Полнофункциональные e-commerce решения с интеграцией платежей"
              icon="store"
              color="blue"
            />
            <BentoCard
              title="Изучить документацию"
              description="Подробные гайды и API reference для разработчиков"
              icon="bookOpen"
              color="lime"
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              ТАРИФЫ ДЛЯ ВЗЛЁТА
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Выберите подходящий план и начните создавать уже сегодня
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <PricingCard
              plan="Старт"
              price="1150 ₽"
              features={[
                "3 проекта",
                "Базовые шаблоны",
                "Экспорт HTML/CSS",
                "Поддержка сообщества"
              ]}
              delay={0}
            />
            <PricingCard
              plan="Про"
              price="2200 ₽"
              features={[
                "Неограниченные проекты",
                "Премиум шаблоны",
                "Экспорт React/Next.js",
                "Приоритетная поддержка",
                "Пользовательский домен"
              ]}
              isPopular={true}
              delay={0.1}
            />
            <PricingCard
              plan="Команда"
              price="4500 ₽"
              features={[
                "Всё из Про",
                "5 мест команде",
                "API доступ",
                "White-label",
                "Персональный менеджер"
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              ЧТО ГОВОРЯТ КЛИЕНТЫ
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Реальные истории успеха от наших пользователей
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-4 tracking-tight">
              ОТВЕТЫ НА ВОПРОСЫ
            </h2>
            <p className="text-gray-400 text-lg">
              Всё, что вы хотели знать о Webly AI
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-gray-800">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section - unified background */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
              ГОТОВЫ СОЗДАТЬ
              <br />
              <span className="text-[#E1FF01]">СВОЙ САЙТ?</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Присоединяйтесь к революции веб-дизайна. Начните бесплатно прямо сейчас через Telegram.
            </p>

            <a
              href="https://t.me/construct_ai_bot?start=ref_347995964"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#E1FF01] hover:bg-[#d4f200] text-black px-10 py-5 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-[#E1FF01]/20"
            >
              <SafeIcon name="send" size={24} />
              Начать в Telegram
            </a>

            <p className="mt-6 text-gray-500 text-sm">
              Бесплатная регистрация • Не требует карты • Мгновенный доступ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer - lime background immediately, no animation */}
      <footer className="min-h-screen bg-[#E1FF01] relative flex flex-col justify-center items-center px-4 md:px-6 overflow-hidden telegram-safe-bottom z-10">
        {/* Content */}
        <div className="container mx-auto flex flex-col items-center justify-center text-center relative z-10">
          {/* Large text - Webly AI in black */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="font-display font-bold text-[15vw] md:text-[12vw] text-black leading-none tracking-tighter">
              Webly AI
            </h2>
          </motion.div>

          {/* Made with Webly AI and year */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-black/60 text-sm md:text-base font-medium tracking-wide">
              made with Webly AI • 2026
            </p>
          </motion.div>

          {/* Social links - black icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-8"
          >
            <a href="#" className="text-black hover:scale-110 transition-transform">
              <SafeIcon name="twitter" size={28} />
            </a>
            <a href="#" className="text-black hover:scale-110 transition-transform">
              <SafeIcon name="instagram" size={28} />
            </a>
            <a href="#" className="text-black hover:scale-110 transition-transform">
              <SafeIcon name="github" size={28} />
            </a>
            <a href="#" className="text-black hover:scale-110 transition-transform">
              <SafeIcon name="linkedin" size={28} />
            </a>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-black/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-black/10 rounded-full" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-black/10 rounded-full" />
      </footer>
    </div>
  )
}

export default App