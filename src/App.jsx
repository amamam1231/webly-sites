import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Utility for Tailwind class merging
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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
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
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Main App Component
function App() {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // Fetch settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [14.4378, 50.0755],
        zoom: 13,
        attributionControl: false,
        dragRotate: false
      })

      mapRef.current.scrollZoom.disable()

      // Add marker
      new maplibregl.Marker({ color: '#0ea5e9' })
        .setLngLat([14.4378, 50.0755])
        .addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Testimonials data
  const testimonials = [
    {
      name: "Анна К.",
      text: "Отличная клиника! Врачи профессионалы, оборудование современное. Лечила кариес без боли и страха. Рекомендую всем!",
      rating: 5
    },
    {
      name: "Михаил Р.",
      text: "Делал имплантацию в этой клинике. Результат превзошел ожидания! Цены адекватные, персонал внимательный. Спасибо доктору Новаку!",
      rating: 5
    },
    {
      name: "Елена С.",
      text: "Вожу детей на профилактику уже 3 года. Педиатрический стоматолог находит подход к каждому ребенку. Чистка зубов проходит комфортно.",
      rating: 5
    }
  ]

  // Services data
  const services = [
    {
      icon: "shield-check",
      title: settings.service_1_title || "Терапевтическая стоматология",
      description: settings.service_1_desc || "Лечение кариеса, пульпита, периодонтита. Современные пломбировочные материалы и безболезненное лечение."
    },
    {
      icon: "sparkles",
      title: settings.service_2_title || "Профессиональная чистка",
      description: settings.service_2_desc || "Ультразвуковая чистка, Air Flow, полировка. Профилактика заболеваний десен и сохранение здоровья зубов."
    },
    {
      icon: "users",
      title: settings.service_3_title || "Имплантация зубов",
      description: settings.service_3_desc || "Установка имплантатов премиум-класса. Хирургическое вмешательство с гарантией результата."
    },
    {
      icon: "shield-check",
      title: settings.service_4_title || "Ортодонтия",
      description: settings.service_4_desc || "Исправление прикуса брекетами и элайнерами. Индивидуальное планирование лечения для детей и взрослых."
    },
    {
      icon: "sparkles",
      title: settings.service_5_title || "Протезирование",
      description: settings.service_5_desc || "Коронки, мосты, съемные протезы. Восстановление эстетики и функциональности зубного ряда."
    },
    {
      icon: "users",
      title: settings.service_6_title || "Детская стоматология",
      description: settings.service_6_desc || "Лечение детей в игровой форме. Профилактика, герметизация фиссур, обучение гигиене."
    }
  ]

  // Scroll to section handler
  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Booking form handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: 'booking',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
        setIsBookingOpen(false)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      // Fallback to Web3Forms
      const web3FormData = new FormData()
      web3FormData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')
      web3FormData.append('name', data.name)
      web3FormData.append('email', data.email)
      web3FormData.append('phone', data.phone)
      web3FormData.append('service', data.service)
      web3FormData.append('message', `Запись на прием: ${data.service}. Дата: ${data.date}. Время: ${data.time}`)

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3FormData
        })
        if (res.ok) {
          alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
          setIsBookingOpen(false)
        }
      } catch (e) {
        alert('Ошибка отправки. Пожалуйста, позвоните нам напрямую.')
      }
    }
  }

  // Contact form handler
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: 'contact',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Сообщение отправлено! Мы ответим вам в ближайшее время.')
        e.target.reset()
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      alert('Ошибка отправки. Пожалуйста, позвоните нам напрямую.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Header */}
      <header
        className={cn( "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => scrollToSection(e, 'hero')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <SafeIcon name="tooth" size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-100">
                  {settings.clinic_name || "Dental Care"}
                </span>
                <span className="text-xs text-slate-400">Praha</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { id: 'services', label: 'Услуги' },
                { id: 'about', label: 'О клинике' },
                { id: 'testimonials', label: 'Отзывы' },
                { id: 'contact', label: 'Контакты' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn-primary text-sm py-3 px-6"
              >
                Записаться онлайн
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <SafeIcon name={isMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50"
            >
              <div className="px-4 py-6 space-y-4">
                {[
                  { id: 'services', label: 'Услуги' },
                  { id: 'about', label: 'О клинике' },
                  { id: 'testimonials', label: 'Отзывы' },
                  { id: 'contact', label: 'Контакты' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="block text-lg font-medium text-slate-300 hover:text-cyan-400 transition-colors py-2"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsBookingOpen(true)
                  }}
                  className="btn-primary w-full mt-4"
                >
                  Записаться онлайн
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <SafeIcon name="shield-check" size={16} />
                <span>15+ лет опыта в Праге</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6"
              >
                <span className="text-slate-100">{settings.hero_title || "Современная"}</span>
                <br />
                <span className="gradient-text">{settings.hero_subtitle || "стоматология в Праге"}</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Профессиональное лечение зубов для всей семьи. Современное оборудование,
                опытные врачи, комфортная атмосфера. Говорим на русском, чешском и английском.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="btn-primary"
                >
                  <SafeIcon name="calendar" size={18} className="mr-2 inline-block" />
                  Записаться онлайн
                </button>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="btn-secondary"
                >
                  <SafeIcon name="phone" size={18} className="mr-2 inline-block" />
                  Позвонить
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <SafeIcon name="shield-check" size={20} className="text-cyan-500" />
                  <span className="text-sm">Гарантия качества</span>
                </div>
                <div className="flex items-center gap-2">
                  <SafeIcon name="users" size={20} className="text-cyan-500" />
                  <span className="text-sm">5000+ пациентов</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-20 blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
                  alt="Стоматологическая клиника"
                  className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                />

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <SafeIcon name="shield-check" size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">Сертифицировано</p>
                      <p className="text-sm text-slate-400">ISO 9001:2015</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding relative">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              Наши услуги
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
              Комплексная <span className="gradient-text">стоматологическая</span> помощь
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Мы предлагаем полный спектр услуг по лечению и профилактике заболеваний полости рта для взрослых и детей.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card p-8 h-full group hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                    <SafeIcon name={service.icon} size={28} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <AnimatedSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl opacity-50 blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80"
                    alt="Стоматологическое оборудование"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80"
                    alt="Врач-стоматолог"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover mt-8"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400&q=80"
                    alt="Клиника интерьер"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover -mt-8"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&q=80"
                    alt="Современная стоматология"
                    className="rounded-2xl shadow-xl w-full h-48 object-cover"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection delay={0.2}>
              <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                О клинике
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-6 leading-tight">
                Заботимся о вашей <span className="gradient-text">улыбке</span> с 2009 года
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed mb-8">
                <p>
                  Наша клиника расположена в центре Праги и предлагает полный спектр стоматологических услуг
                  для взрослых и детей. Мы используем только современное оборудование и сертифицированные материалы.
                </p>
                <p>
                  Наши врачи — выпускники ведущих европейских университетов с многолетним опытом работы.
                  Мы говорим на русском, чешском и английском языках, что делает лечение комфортным
                  для иностранных пациентов.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">15+</div>
                  <div className="text-sm text-slate-500">Лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">5000+</div>
                  <div className="text-sm text-slate-500">Пациентов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">98%</div>
                  <div className="text-sm text-slate-500">Рекомендаций</div>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn-primary"
              >
                Бесплатная консультация
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding relative">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              Отзывы пациентов
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
              Что говорят <span className="gradient-text">наши пациенты</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Более 5000 довольных пациентов доверяют нам заботу о своих улыбках
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative max-w-4xl mx-auto">
              {/* Testimonial Card */}
              <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <SafeIcon key={i} name="star" size={20} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-8"> "{testimonials[activeTestimonial].text}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonials[activeTestimonial].name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">
                          {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-sm text-slate-500">Пациент клиники</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                >
                  <SafeIcon name="chevron-left" size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={cn( "w-2 h-2 rounded-full transition-all",
                        activeTestimonial === index
                          ? "w-8 bg-cyan-500"
                          : "bg-slate-600 hover:bg-slate-500"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                >
                  <SafeIcon name="chevron-right" size={20} />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding relative">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              Контакты
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
              Свяжитесь <span className="gradient-text">с нами</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Запишитесь на консультацию или прием по телефону, email или через форму онлайн-записи
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info & Map */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                {/* Contact Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                      <SafeIcon name="phone" size={24} className="text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-1">Телефон</h3>
                    <p className="text-slate-400 text-sm mb-2">{settings.contact_phone || "+420 123 456 789"}</p>
                    <p className="text-xs text-cyan-400">Звоните прямо сейчас</p>
                  </div>

                  <div className="glass-card p-6">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                      <SafeIcon name="clock" size={24} className="text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-1">Часы работы</h3>
                    <p className="text-slate-400 text-sm">{settings.working_hours_weekdays || "Пн-Пт: 8:00 - 20:00"}</p>
                    <p className="text-slate-400 text-sm">{settings.working_hours_saturday || "Сб: 9:00 - 15:00"}</p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="map-pin" size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-1">Адрес</h3>
                      <p className="text-slate-400">{settings.contact_address || "Václavské náměstí 1, Praha 1, 110 00"}</p>
                      <p className="text-sm text-slate-500 mt-1">Центр Праги, 5 мин от метра Můstek</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="glass-card overflow-hidden">
                  <div ref={mapContainerRef} className="w-full h-64 bg-slate-900" />
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Отправить сообщение</h3>
                <p className="text-slate-400 mb-6">Заполните форму ниже, и мы свяжемся с вами в ближайшее время</p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Ваше имя</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="+420 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Сообщение</label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      placeholder="Опишите вашу проблему или вопрос..."
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    <SafeIcon name="send" size={18} className="mr-2 inline-block" />
                    Отправить сообщение
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700" />
        <div className="absolute inset-0  opacity-50" />

        <div className="container-main px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Готовы к здоровой улыбке?
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Запишитесь на бесплатную консультацию прямо сейчас.
                Наши специалисты ответят на все ваши вопросы и подберут оптимальное решение.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Записаться онлайн
                </button>
                <a
                  href={`tel:${settings.contact_phone || '+420123456789'}`}
                  className="bg-blue-800/50 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-800/70 transition-all duration-300 border border-blue-400/30 backdrop-blur-sm"
                >
                  <SafeIcon name="phone" size={18} className="mr-2 inline-block" />
                  {settings.contact_phone || "+420 123 456 789"}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <SafeIcon name="tooth" size={20} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-100">
                    {settings.clinic_name || "Dental Care"}
                  </span>
                  <span className="block text-xs text-slate-500">Praha</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Современная стоматологическая клиника в центре Праги.
                Профессиональное лечение, современное оборудование,
                заботливые врачи.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Услуги</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-cyan-400 transition-colors">Лечение кариеса</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-cyan-400 transition-colors">Имплантация</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-cyan-400 transition-colors">Ортодонтия</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-cyan-400 transition-colors">Профессиональная чистка</a></li>
              </ul>
            </div>

            {/* Working Hours */}
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Часы работы</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex justify-between">
                  <span>Понедельник - Пятница</span>
                  <span className="text-slate-200">{settings.working_hours_weekdays || "8:00 - 20:00"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Суббота</span>
                  <span className="text-slate-200">{settings.working_hours_saturday || "9:00 - 15:00"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Воскресенье</span>
                  <span className="text-slate-200">{settings.working_hours_sunday || "Выходной"}</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Контакты</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <SafeIcon name="map-pin" size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400 text-sm">
                    {settings.contact_address || "Václavské náměstí 1, Praha 1, 110 00"}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <SafeIcon name="phone" size={20} className="text-cyan-400 flex-shrink-0" />
                  <a
                    href={`tel:${settings.contact_phone || '+420123456789'}`}
                    className="text-slate-400 text-sm hover:text-cyan-400 transition-colors"
                  >
                    {settings.contact_phone || "+420 123 456 789"}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <SafeIcon name="mail" size={20} className="text-cyan-400 flex-shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email || 'info@dentalprague.cz'}`}
                    className="text-slate-400 text-sm hover:text-cyan-400 transition-colors"
                  >
                    {settings.contact_email || "info@dentalprague.cz"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 {settings.clinic_name || "Dental Care Prague"}. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsBookingOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Запись на прием</h3>
                  <p className="text-slate-400 text-sm mt-1">Заполните форму, мы перезвоним для подтверждения</p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <SafeIcon name="x" size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ваше имя *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="+420 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Услуга *</label>
                  <select
                    name="service"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    <option value="">Выберите услугу</option>
                    <option value="therapy">Терапевтическая стоматология</option>
                    <option value="cleaning">Профессиональная чистка</option>
                    <option value="implantation">Имплантация</option>
                    <option value="orthodontics">Ортодонтия</option>
                    <option value="prosthetics">Протезирование</option>
                    <option value="pediatric">Детская стоматология</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Дата</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Время</label>
                    <select
                      name="time"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="">Выберите время</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full">
                  <SafeIcon name="calendar" size={18} className="mr-2 inline-block" />
                  Записаться на прием
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App