// === IMPORTS ===
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
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Navigation Component
const Navigation = () => {
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
    { name: 'Главная', href: '#hero' },
    { name: 'О тренере', href: '#trainer' },
    { name: 'Программы', href: '#programs' },
    { name: 'Расписание', href: '#schedule' },
    { name: 'Контакты', href: '#contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform glow-red">
              <SafeIcon name="flame" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              MUAY<span className="text-red-500">THAI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <a
              href="#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-sm font-bold text-white hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Записаться
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 mt-4 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-center font-bold text-white"
              >
                Записаться на тренировку
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Hero Section
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
            <SafeIcon name="trophy" size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-400">Многократный чемпион мира</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-tight">
            ТАЙСКИЙ <span className="text-gradient">БОКС</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto font-light">
            Профессиональные тренировки с многократным чемпионом мира.
            Персональные и групповые занятия для всех уровней подготовки.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all glow-red"
            >
              Начать тренироваться
            </motion.a>
            <motion.a
              href="#programs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-800 rounded-full text-lg font-bold text-white border border-slate-700 hover:border-red-500/50 hover:bg-slate-800/80 transition-all flex items-center gap-2"
            >
              <span>Узнать больше</span>
              <SafeIcon name="chevron-right" size={20} className="text-red-500" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-red-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Stats Section
const Stats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { number: '15+', label: 'Лет опыта', icon: 'target' },
    { number: '5000+', label: 'Тренировок', icon: 'dumbbell' },
    { number: '50+', label: 'Чемпионатов', icon: 'trophy' },
    { number: '1000+', label: 'Учеников', icon: 'users' }
  ]

  return (
    <section ref={ref} className="py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-slate-800 group-hover:bg-red-500/20 transition-colors border border-slate-700 group-hover:border-red-500/50">
                <SafeIcon name={stat.icon} size={32} className="text-red-500 group-hover:text-red-400" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Trainer Section
const Trainer = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const achievements = [
    '5-кратный чемпион мира по тайскому боксу',
    'Чемпион Азии 2018, 2019, 2021',
    'Обладатель пояса Lumpinee Stadium',
    'Профессиональный рекорд: 127 побед, 15 поражений'
  ]

  return (
    <section id="trainer" ref={ref} className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80"
                alt="Тренер по тайскому боксу"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-2">
                  <SafeIcon name="star" size={20} className="text-red-500 fill-red-500" />
                  <span className="text-white font-bold">5x World Champion</span>
                </div>
                <p className="text-slate-300">Александр "Тигр" Волков</p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-red-500 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-red-500/30 glow-red"
            >
              <span className="text-3xl font-black text-white">15</span>
              <span className="text-xs font-bold text-white/80">ЛЕТ</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <SafeIcon name="trophy" size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-400">Главный тренер</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              АЛЕКСАНДР <span className="text-gradient">"ТИГР"</span> ВОЛКОВ
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed">
              Профессиональный боец ММА и тайского бокса с 15-летним опытом.
              Обучал чемпионов в 12 странах мира. Специализируется на подготовке
              как профессиональных бойцов, так и новичков без опыта.
            </p>

            <div className="space-y-4 pt-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="check-circle" size={14} className="text-red-500" />
                  </div>
                  <span className="text-slate-300">{achievement}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full font-bold text-white hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                <SafeIcon name="calendar" size={20} />
                Записаться на тренировку
              </a>
              <a
                href="#programs"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-700 rounded-full font-bold text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <SafeIcon name="play" size={20} />
                Смотреть программы
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Programs Section
const Programs = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const programs = [
    {
      title: 'Персональные тренировки',
      description: 'Индивидуальная программа под ваши цели. Максимальная эффективность и скорость результата.',
      price: 'от 3 500 ₽',
      features: ['1 на 1 с тренером', 'Персональный план', 'Гибкий график', 'Разбор техники'],
      icon: 'target',
      popular: true
    },
    {
      title: 'Групповые занятия',
      description: 'Тренировки в мини-группах до 8 человек. Атмосфера поддержки и командного духа.',
      price: 'от 1 500 ₽',
      features: ['До 8 человек', 'Все уровни', 'Командная работа', 'Спарринги'],
      icon: 'users',
      popular: false
    },
    {
      title: 'Подготовка к боям',
      description: 'Профессиональная подготовка к соревнованиям. Кемпы, сгонка веса, тактика.',
      price: 'от 5 000 ₽',
      features: ['Fight camp', 'Сгонка веса', 'Тактика боя', 'Видеоанализ'],
      icon: 'trophy',
      popular: false
    }
  ]

  return (
    <section id="programs" ref={ref} className="py-24 sm:py-32 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <SafeIcon name="zap" size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-400">Программы тренировок</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            ВЫБЕРИ СВОЙ <span className="text-gradient">ПУТЬ</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            От персональных тренировок до профессиональной подготовки к боям.
            Программы для любого уровня подготовки.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative p-8 rounded-3xl border transition-all duration-300 group hover:-translate-y-2',
                program.popular
                  ? 'bg-slate-900 border-red-500/50 shadow-xl shadow-red-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-red-500/30'
              )}
            >
              {program.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full text-sm font-bold text-white shadow-lg">
                  Популярное
                </div>
              )}

              <div className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                program.popular ? 'bg-red-500/20' : 'bg-slate-800 group-hover:bg-red-500/20'
              )}>
                <SafeIcon
                  name={program.icon}
                  size={28}
                  className={cn(
                    'transition-colors',
                    program.popular ? 'text-red-500' : 'text-slate-400 group-hover:text-red-500'
                  )}
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{program.title}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">{program.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-black text-gradient">{program.price}</span>
                <span className="text-slate-500 text-sm ml-2">/ занятие</span>
              </div>

              <ul className="space-y-3 mb-8">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <SafeIcon name="check-circle" size={18} className="text-red-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  'w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
                  program.popular
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/30'
                    : 'bg-slate-800 text-white hover:bg-red-600 border border-slate-700 hover:border-red-500'
                )}
              >
                <span>Выбрать программу</span>
                <SafeIcon name="chevron-right" size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Schedule Section
const Schedule = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const schedule = [
    {
      day: 'Понедельник',
      classes: [
        { time: '07:00 - 08:30', name: 'Утренняя зарядка', level: 'Все уровни' },
        { time: '18:00 - 19:30', name: 'Техника + Силовая', level: 'Средний/Продвинутый' },
        { time: '20:00 - 21:30', name: 'Спарринги', level: 'Продвинутый' }
      ]
    },
    {
      day: 'Вторник',
      classes: [
        { time: '07:00 - 08:30', name: 'Кардио + Техника', level: 'Все уровни' },
        { time: '18:00 - 19:30', name: 'Групповая тренировка', level: 'Начальный/Средний' },
        { time: '20:00 - 21:30', name: 'Клинч + Колени', level: 'Средний/Продвинутый' }
      ]
    },
    {
      day: 'Среда',
      classes: [
        { time: '07:00 - 08:30', name: 'Йога для бойцов', level: 'Все уровни' },
        { time: '18:00 - 19:30', name: 'Техника + Силовая', level: 'Средний/Продвинутый' },
        { time: '20:00 - 21:30', name: 'Спарринги', level: 'Продвинутый' }
      ]
    },
    {
      day: 'Четверг',
      classes: [
        { time: '07:00 - 08:30', name: 'Беговая тренировка', level: 'Все уровни' },
        { time: '18:00 - 19:30', name: 'Групповая тренировка', level: 'Начальный/Средний' },
        { time: '20:00 - 21:30', name: 'Лоу-кик + Комбинации', level: 'Средний/Продвинутый' }
      ]
    },
    {
      day: 'Пятница',
      classes: [
        { time: '07:00 - 08:30', name: 'Растяжка + Мобильность', level: 'Все уровни' },
        { time: '18:00 - 19:30', name: 'Техника + Силовая', level: 'Средний/Продвинутый' },
        { time: '20:00 - 21:30', name: 'Спарринги', level: 'Продвинутый' }
      ]
    },
    {
      day: 'Суббота',
      classes: [
        { time: '10:00 - 12:00', name: 'Открытая тренировка', level: 'Все уровни' },
        { time: '14:00 - 16:00', name: 'Семинар / Мастер-класс', level: 'Все уровни' }
      ]
    }
  ]

  const [activeDay, setActiveDay] = useState(0)

  return (
    <section id="schedule" ref={ref} className="py-24 sm:py-32 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <SafeIcon name="calendar" size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-400">Расписание занятий</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            КОГДА <span className="text-gradient">ТРЕНИРОВАТЬСЯ</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Гибкое расписание для занятий в удобное время. Утренние, дневные и вечерние группы.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {schedule.map((day, index) => (
              <motion.button
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveDay(index)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl font-medium transition-all',
                  activeDay === index
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                {day.day}
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <SafeIcon name="calendar" size={24} className="text-red-500" />
                {schedule[activeDay].day}
              </h3>

              <div className="space-y-4">
                {schedule[activeDay].classes.map((classItem, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <SafeIcon name="clock" size={20} className="text-red-500" />
                      </div>
                      <span className="font-bold text-white">{classItem.time}</span>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg">{classItem.name}</h4>
                      <span className="text-sm text-red-400">{classItem.level}</span>
                    </div>

                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl font-medium transition-all text-sm">
                      Записаться
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const form = useFormHandler()

  const handleSubmit = (e) => {
    e.preventDefault()
    form.submitForm(e.target)
  }

  return (
    <section id="contact" ref={ref} className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <SafeIcon name="message-square" size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-400">Свяжитесь с нами</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              НАЧНИ СВОЙ <span className="text-gradient">ПУТЬ</span> СЕГОДНЯ
            </h2>

            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Запишись на бесплатное пробное занятие. Оцени уровень подготовки,
              познакомься с тренером и получи персональный план развития.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <SafeIcon name="map-pin" size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-white font-bold">Адрес</p>
                  <p className="text-slate-400">Москва, ул. Спортивная, 25</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <SafeIcon name="phone" size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-white font-bold">Телефон</p>
                  <p className="text-slate-400">+7 (999) 123-45-67</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <SafeIcon name="mail" size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-white font-bold">Email</p>
                  <p className="text-slate-400">info@muaythai-pro.ru</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Записаться на тренировку</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Ваше имя</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Программа</label>
                  <select
                    name="program"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  >
                    <option value="personal">Персональная тренировка</option>
                    <option value="group">Групповое занятие</option>
                    <option value="fight">Подготовка к боям</option>
                    <option value="trial">Пробное занятие</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Сообщение (опционально)</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                    placeholder="Расскажите о своих целях..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={form.isSubmitting}
                  className={cn(
                    'w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2',
                    form.isSubmitting
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/30'
                  )}
                >
                  {form.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : form.isSuccess ? (
                    <>
                      <SafeIcon name="check-circle" size={20} />
                      <span>Заявка отправлена!</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon name="send" size={20} />
                      <span>Отправить заявку</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Здравствуйте! Я помогу записаться на тренировку или ответить на вопросы о тайском боксе.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsLoading(true)

    if (userMessage.toLowerCase().includes('цена') || userMessage.toLowerCase().includes('стоимость') || userMessage.toLowerCase().includes('сколько')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Стоимость занятий:\n• Персональная тренировка: от 3 500 ₽\n• Групповое занятие: от 1 500 ₽\n• Подготовка к боям: от 5 000 ₽\n\nПервое пробное занятие — бесплатно!'
        }])
        setIsLoading(false)
      }, 1000)
    } else if (userMessage.toLowerCase().includes('адрес') || userMessage.toLowerCase().includes('где') || userMessage.toLowerCase().includes('находитесь')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Мы находимся по адресу: Москва, ул. Спортивная, 25 (м. Спортивная).\n\nРежим работы:\nПн-Пт: 07:00 - 22:00\nСб: 10:00 - 18:00\nВс: выходной'
        }])
        setIsLoading(false)
      }, 1000)
    } else if (userMessage.toLowerCase().includes('записаться') || userMessage.toLowerCase().includes('запись') || userMessage.toLowerCase().includes('хочу')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Отлично! Чтобы записаться на тренировку, оставьте ваше имя и телефон в форме ниже на сайте или позвоните нам: +7 (999) 123-45-67.\n\nПервое занятие бесплатно!'
        }])
        setIsLoading(false)
      }, 1000)
    } else {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-proj-demo-key-replace-with-real'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant for a Muay Thai gym. Answer in Russian. Be concise and friendly. If asked about pricing: personal training 3500 rub, group 1500 rub, fight prep 5000 rub. Address: Moscow, Sportivnaya st 25. Phone: +7 (999) 123-45-67.'
              },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 150
          })
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
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-red-500',
          'flex items-center justify-center shadow-lg shadow-red-500/30 glow-red',
          isOpen ? 'hidden' : 'flex'
        )}
      >
        <SafeIcon name="message-square" size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center">
                  <SafeIcon name="bot" size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Champion AI</h3>
                  <p className="text-xs text-white/80">Онлайн помощник</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-950/20 rounded-lg transition-colors"
              >
                <SafeIcon name="x" size={20} className="text-white" />
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
                      ? 'bg-red-600 text-white ml-auto rounded-br-md'
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
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-red-600 rounded-xl text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        throw new Error('Submit failed')
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
const App = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <Hero />
      <Stats />
      <Trainer />
      <Programs />
      <Schedule />
      <Contact />

      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center">
                  <SafeIcon name="flame" size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  MUAY<span className="text-red-500">THAI</span>
                </span>
              </div>
              <p className="text-slate-400 mb-4 max-w-sm">
                Профессиональные тренировки по тайскому боксу с многократным чемпионом мира.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                  <SafeIcon name="youtube" size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                  <SafeIcon name="message-circle" size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Программы</h4>
              <ul className="space-y-2">
                <li><a href="#programs" className="text-slate-400 hover:text-red-400 transition-colors">Персональные</a></li>
                <li><a href="#programs" className="text-slate-400 hover:text-red-400 transition-colors">Групповые</a></li>
                <li><a href="#programs" className="text-slate-400 hover:text-red-400 transition-colors">Подготовка к боям</a></li>
                <li><a href="#programs" className="text-slate-400 hover:text-red-400 transition-colors">Онлайн обучение</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Контакты</h4>
              <ul className="space-y-2">
                <li className="text-slate-400">Москва, ул. Спортивная, 25</li>
                <li className="text-slate-400">+7 (999) 123-45-67</li>
                <li className="text-slate-400">info@muaythai-pro.ru</li>
                <li className="text-slate-400">Пн-Сб: 07:00 - 22:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Muay Thai Pro. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-red-400 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-slate-500 hover:text-red-400 transition-colors">Договор оферты</a>
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