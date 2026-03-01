import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const icons = {}

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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#hero', label: 'Главная' },
    { href: '#services', label: 'Услуги' },
    { href: '#projects', label: 'Проекты' },
    { href: '#team', label: 'Команда' },
    { href: '#contact', label: 'Контакты' },
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50" : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <SafeIcon name="hexagon" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Nex<span className="text-gradient">Web3</span></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Начать проект
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-base font-medium text-slate-400 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// Hero Component
const Hero = () => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4))
        setWalletConnected(true)
      } catch (error) {
        console.error('Wallet connection failed:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-slate-400">Открыты для новых проектов</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="text-white">Маркетинг</span>
            <br />
            <span className="text-gradient">для Web3</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Профессиональное продвижение криптопроектов, NFT-коллекций и DeFi-протоколов.
            Превращаем идеи в успешные бизнесы.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              Обсудить проект
            </button>

            {walletConnected ? (
              <div className="flex items-center gap-2 px-6 py-4 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <SafeIcon name="wallet" size={20} className="text-green-500" />
                <span className="font-mono text-sm">{walletAddress}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-semibold hover:bg-slate-800 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <SafeIcon name="wallet" size={20} />
                Подключить кошелёк
              </button>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            <div className="flex items-center gap-2 text-slate-500">
              <SafeIcon name="ethereum" size={24} />
              <span className="font-semibold">Ethereum</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <SafeIcon name="bitcoin" size={24} />
              <span className="font-semibold">Bitcoin</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <SafeIcon name="layers" size={24} />
              <span className="font-semibold">Layer 2</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <SafeIcon name="chevron-down" size={24} className="text-slate-600" />
      </motion.div>
    </section>
  )
}

// Services Component
const Services = () => {
  const ref = useInView({ threshold: 0.1, triggerOnce: true })
  const [inViewRef, setInViewRef] = useState(false)

  useEffect(() => {
    if (ref) setInViewRef(true)
  }, [ref])

  const services = [
    {
      icon: "trending-up",
      title: "Growth Marketing",
      description: "Стратегический рост сообщества через таргетированную рекламу и вирусный маркетинг"
    },
    {
      icon: "users",
      title: "Community Building",
      description: "Создание и развитие лояльного комьюнити вокруг вашего Web3 проекта"
    },
    {
      icon: "mic",
      title: "Influencer Marketing",
      description: "Сотрудничество с ключевыми инфлюенсерами крипто-пространства"
    },
    {
      icon: "pen-tool",
      title: "Content Strategy",
      description: "Разработка контент-стратегии для максимального охвата целевой аудитории"
    },
    {
      icon: "shield-check",
      title: "Brand Protection",
      description: "Защита репутации бренда и управление кризисными ситуациями"
    },
    {
      icon: "bar-chart-3",
      title: "Analytics & ROI",
      description: "Детальная аналитика кампаний и оптимизация маркетинговых расходов"
    }
  ]

  return (
    <section id="services" className="py-20 md:py-32 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={setInViewRef}
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
            Наши <span className="text-gradient">услуги</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto">
            Комплексные маркетинговые решения для Web3 проектов любого масштаба
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group p-6 md:p-8 rounded-2xl glass hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <SafeIcon name={service.icon} size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Projects Component
const Projects = () => {
  const ref = useInView({ threshold: 0.1, triggerOnce: true })
  const [inViewRef, setInViewRef] = useState(false)

  useEffect(() => {
    if (ref) setInViewRef(true)
  }, [ref])

  const projects = [
    {
      title: "DeFi Protocol Alpha",
      category: "DeFi",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
      stats: "+340% TVL"
    },
    {
      title: "NFT Collection Meta",
      category: "NFT",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
      stats: "10K+ HOLDERS"
    },
    {
      title: "GameFi Platform",
      category: "GameFi",
      image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80",
      stats: "+50K USERS"
    }
  ]

  return (
    <section id="projects" className="py-20 md:py-32 relative bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={setInViewRef}
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
            Кейсы <span className="text-gradient">клиентов</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto">
            Результаты наших успешных кампаний
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-blue-400 text-sm font-semibold">{project.category}</span>
                <h3 className="text-xl font-bold text-white mt-1">{project.title}</h3>
                <p className="text-slate-300 mt-2 font-mono">{project.stats}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Team Component
const Team = () => {
  const ref = useInView({ threshold: 0.1, triggerOnce: true })
  const [inViewRef, setInViewRef] = useState(false)

  useEffect(() => {
    if (ref) setInViewRef(true)
  }, [ref])

  const team = [
    {
      name: "Алексей Волков",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
    },
    {
      name: "Мария Соколова",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
    },
    {
      name: "Дмитрий Козлов",
      role: "Web3 Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
    },
    {
      name: "Анна Морозова",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
    }
  ]

  return (
    <section id="team" className="py-20 md:py-32 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={setInViewRef}
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black mb-4">
            Наша <span className="text-gradient">команда</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-400 max-w-2xl mx-auto">
            Эксперты с опытом в крипто-индустрии более 5 лет
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inViewRef ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-slate-400 text-sm">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    const data = new FormData()
    data.append('access_key', ACCESS_KEY)
    data.append('name', formData.name)
    data.append('email', formData.email)
    data.append('message', formData.message)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
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
    <section id="contact" className="py-20 md:py-32 relative bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/10 to-slate-950" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Начнём <span className="text-gradient">сотрудничество</span>
            </h2>
            <p className="text-slate-400">
              Расскажите о вашем проекте и мы свяжемся с вами в течение 24 часов
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-6 md:p-10 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Имя</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Сообщение</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Расскажите о вашем проекте..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <SafeIcon name="loader-2" size={20} className="animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <SafeIcon name="send" size={20} />
                  Отправить сообщение
                </>
              )}
            </button>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center"
                >
                  <SafeIcon name="check-circle" size={20} className="inline mr-2" />
                  Сообщение успешно отправлено!
                </motion.div>
              )}
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
                >
                  <SafeIcon name="alert-circle" size={20} className="inline mr-2" />
                  Произошла ошибка. Попробуйте позже.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-800/50 bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <SafeIcon name="hexagon" size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Nex<span className="text-gradient">Web3</span></span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <SafeIcon name="twitter" size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <SafeIcon name="github" size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <SafeIcon name="linkedin" size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <SafeIcon name="telegram" size={20} />
            </a>
          </div>

          <p className="text-sm text-slate-500">
            © 2024 NexWeb3. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Team />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

export default App