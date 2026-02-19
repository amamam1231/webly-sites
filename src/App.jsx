import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import maplibregl from 'maplibre-gl'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Data
const teamMembers = [
  {
    name: 'Алексей',
    role: 'Основатель / Барбер',
    experience: '12 лет опыта',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80'
  },
  {
    name: 'Михаил',
    role: 'Старший барбер',
    experience: '8 лет опыта',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80'
  },
  {
    name: 'Дмитрий',
    role: 'Барбер / Стilist',
    experience: '6 лет опыта',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  }
]

const services = [
  { name: 'Мужская стрижка', price: '800 Kč', duration: '45 мин' },
  { name: 'Стрижка бороды', price: '500 Kč', duration: '30 мин' },
  { name: 'Комплекс (стрижка + борода)', price: '1 200 Kč', duration: '60 мин' },
  { name: 'Королевское бритьё', price: '700 Kč', duration: '40 мин' },
  { name: 'Укладка волос', price: '300 Kč', duration: '15 мин' },
  { name: 'Окрашивание', price: 'от 1 000 Kč', duration: '60 мин' },
]

const blogPosts = [
  {
    title: 'Как правильно ухаживать за бородой зимой',
    excerpt: 'Зимний уход требует особого внимания. Узнайте, как сохранить бороду мягкой и здоровой в холодное время года.',
    date: '15 января 2024',
    readTime: '5 мин',
    image: 'https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?w=600&q=80'
  },
  {
    title: 'Топ-5 стрижек 2024 года',
    excerpt: 'Обзор самых актуальных мужских стрижек этого года. От классики до современных трендов.',
    date: '10 января 2024',
    readTime: '4 мин',
    image: 'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?w=600&q=80'
  },
  {
    title: 'Выбор правильного шампуня',
    excerpt: 'Как подобрать средство для ухода за волосами в зависимости от типа кожи головы и волос.',
    date: '5 января 2024',
    readTime: '6 мин',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80'
  }
]

// Components
const SectionTitle = ({ children, subtitle }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="mb-12 md:mb-16"
    >
      {subtitle && (
        <span className="text-emerald-500 text-sm font-semibold tracking-wider uppercase mb-3 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
        {children}
      </h2>
    </motion.div>
  )
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#about', label: 'О нас' },
    { href: '#team', label: 'Команда' },
    { href: '#pricing', label: 'Прайс' },
    { href: '#blog', label: 'Блог' },
    { href: '#location', label: 'Контакты' },
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-gray-800" : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <SafeIcon name="scissors" size={20} className="text-black" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight">БАЗА</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-emerald-500 after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full border border-gray-700 hover:border-emerald-500 hover:text-emerald-500 transition-all"
            >
              <SafeIcon name="instagram" size={18} />
            </a>
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://cal.com', '_blank')
              }}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-emerald-500 transition-colors"
            >
              <SafeIcon name="calendar" size={16} />
              Записаться
            </a>
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-gray-800 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-lg font-medium text-gray-300 hover:text-white py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://cal.com', '_blank')
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-black font-semibold rounded-full mt-4"
              >
                <SafeIcon name="calendar" size={16} />
                Записаться онлайн
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 text-sm text-gray-300">
              <SafeIcon name="map-pin" size={14} className="text-emerald-500" />
              Прага, Чехия
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6"
          >
            Take your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              place!
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Премиальный барбершоп для тех, кто ценит стиль и качество.
            Классические техники в современном исполнении.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://cal.com', '_blank')
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-emerald-500 transition-all hover:scale-105"
            >
              <SafeIcon name="calendar" size={20} />
              Записаться онлайн
              <SafeIcon name="arrow-right" size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#pricing').scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-2 px-8 py-4 border border-gray-700 rounded-full font-medium hover:border-white transition-colors"
            >
              <SafeIcon name="scissors" size={18} />
              Услуги и цены
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <SectionTitle subtitle="О нас">База — это больше, чем просто стрижка</SectionTitle>
            <motion.div variants={fadeInUp} className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                Мы создали пространство, где классические барберские традиции встречаются
                с современными трендами. Наша мастерская — это место для тех, кто ценит
                внимание к деталям и персональный подход.
              </p>
              <p>
                Каждый клиент для нас — уникальная история. Мы не просто стрижем волосы,
                мы создаем образ, который подчеркивает ваш характер и стиль жизни.
                Деловой, креативный или спортивный — мы найдем идеальное решение для вас.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">12+</div>
                  <div className="text-sm text-gray-500">лет опыта</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">5000+</div>
                  <div className="text-sm text-gray-500">клиентов</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">3</div>
                  <div className="text-sm text-gray-500">мастера</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"
                alt="Barbershop interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <SafeIcon name="sparkles" size={20} className="text-emerald-500" />
                </div>
                <span className="font-semibold text-white">Премиум качество</span>
              </div>
              <p className="text-sm text-gray-400">Только профессиональная косметика и инструменты премиум-класса</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Team = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="team" className="py-20 md:py-32 bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle subtitle="Наша команда">Мастера своего дела</SectionTitle>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-500 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-400">{member.experience}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Pricing = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pricing" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle subtitle="Прайс-лист">Услуги и цены</SectionTitle>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              variants={fadeInUp}
              className="group flex items-center justify-between py-6 border-b border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-emerald-500 transition-colors mb-1">
                  {service.name}
                </h3>
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <SafeIcon name="clock" size={12} />
                  {service.duration}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-black text-white">{service.price}</span>
              </div>
            </motion.div>
          ))}

          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-gray-500 mb-6 text-sm">
              * Цены могут варьироваться в зависимости от сложности работы и длины волос
            </p>
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://cal.com', '_blank')
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all hover:scale-105"
            >
              <SafeIcon name="calendar" size={20} />
              Записаться сейчас
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const Blog = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="blog" className="py-20 md:py-32 bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <SectionTitle subtitle="Блог">Советы по уходу</SectionTitle>
          <a href="#" className="hidden md:flex items-center gap-2 text-emerald-500 font-medium hover:text-emerald-400 transition-colors mb-16">
            Все статьи
            <SafeIcon name="arrow-right" size={16} />
          </a>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              variants={fadeInUp}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-gray-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="flex items-center gap-1">
                  <SafeIcon name="book-open" size={12} />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-2 text-emerald-500 font-medium">
            Все статьи
            <SafeIcon name="arrow-right" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

const Location = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [14.4378, 50.0755],
      zoom: 13,
      attributionControl: false,
      dragRotate: false,
    })

    map.current.scrollZoom.disable()

    new maplibregl.Marker({ color: '#10b981' })
      .setLngLat([14.4378, 50.0755])
      .addTo(map.current)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return (
    <section id="location" className="py-20 md:py-32 bg-black pb-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle subtitle="Контакты">Где нас найти</SectionTitle>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 md:gap-12"
        >
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="map-pin" size={24} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Адрес</h3>
                  <p className="text-gray-400">Прага 1, ул. Вацлавская 15<br />110 00, Чехия</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="clock" size={24} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Часы работы</h3>
                  <p className="text-gray-400">
                    Пн-Пт: 9:00 — 20:00<br />
                    Сб: 10:00 — 18:00<br />
                    Вс: выходной
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="phone" size={24} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Телефон</h3>
                  <a href="tel:+420123456789" className="text-gray-400 hover:text-emerald-500 transition-colors">
                    +420 123 456 789
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                <SafeIcon name="instagram" size={20} />
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://cal.com', '_blank')
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 rounded-xl font-medium hover:bg-emerald-500 transition-all"
              >
                <SafeIcon name="calendar" size={20} />
                Записаться
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="h-[400px] md:h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-800"
          >
            <div ref={mapContainer} className="w-full h-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <SafeIcon name="scissors" size={16} className="text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">БАЗА</span>
          </div>

          <p className="text-gray-500 text-sm text-center">
            © 2024 База Barbershop. Все права защищены.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <SafeIcon name="instagram" size={20} />
            </a>
            <a href="tel:+420123456789" className="text-gray-400 hover:text-white transition-colors">
              <SafeIcon name="phone" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Team />
        <Pricing />
        <Blog />
        <Location />
      </main>
      <Footer />
    </div>
  )
}

export default App