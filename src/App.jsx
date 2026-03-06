import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({})
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const canvasRef = useRef(null)
  const { scrollYProgress } = useScroll()

  // Fetch settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  // Timer countdown
  useEffect(() => {
    const targetDate = new Date(settings.event_date || '2024-12-31T00:00:00')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [settings.event_date])

  // Interactive canvas drawing on scroll
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const unsubscribe = scrollYProgress.subscribe((value) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const segments = 15
      const progress = value * segments

      for (let i = 0; i < Math.floor(progress); i++) {
        ctx.beginPath()
        ctx.strokeStyle = i % 2 === 0 ? '#c026d3' : '#22d3ee'
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        const startY = (i / segments) * canvas.height * 0.8 + canvas.height * 0.1
        const endY = ((i + 1) / segments) * canvas.height * 0.8 + canvas.height * 0.1
        const centerX = canvas.width / 2
        const offset = Math.sin(i * 0.8) * 150

        ctx.moveTo(centerX + offset, startY)
        ctx.quadraticCurveTo(
          centerX - offset * 1.5,
          (startY + endY) / 2,
          centerX + offset * 0.5,
          endY
        )
        ctx.stroke()

        // Draw geometric nodes
        ctx.beginPath()
        ctx.fillStyle = i % 2 === 0 ? '#22d3ee' : '#c026d3'
        ctx.arc(centerX + offset * 0.5, endY, 6, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
    }
  }, [scrollYProgress])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(() => {
      alert('Заявка отправлена!')
      e.target.reset()
    })
    .catch(() => alert('Ошибка отправки'))
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white overflow-x-hidden relative">
      {/* Fixed Canvas for scroll drawing effect */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-fuchsia-600/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-fuchsia-500 font-pacifico">
            ArtFlow
          </h1>
          <nav className="hidden md:flex gap-8">
            {[
              { label: 'О мастер-классе', id: 'about' },
              { label: 'Программа', id: 'program' },
              { label: 'Запись', id: 'register' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-cyan-400 hover:text-fuchsia-500 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden text-cyan-400">
            <SafeIcon name="menu" size={28} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {settings.show_hero !== false && (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center overflow-hidden z-10">
          {/* Geometric decorations */}
          <div className="absolute top-32 left-8 w-24 h-24 border-2 border-cyan-400/40 rotate-45 animate-float hidden md:block" />
          <div className="absolute bottom-32 right-8 w-32 h-32 border-2 border-fuchsia-500/40 rounded-full animate-pulse hidden md:block" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rotate-12 animate-float-reverse hidden md:block" />

          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 font-pacifico leading-tight">
                Рисуй без границ
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-playfair leading-relaxed"
            >
              Мастер-класс по современной живописи с яркими эмоциями,
              геометрическими узорами и полной свободой творчества
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => scrollToSection('register')}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-fuchsia-600/50 transition-all transform hover:scale-105 active:scale-95"
              >
                Записаться сейчас
              </button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <SafeIcon name="chevron-down" size={32} className="text-cyan-400" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Video Preview Section */}
      {settings.show_video !== false && (
        <section id="about" className="py-20 md:py-32 bg-neutral-800/50 relative z-10">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-cyan-400 font-pacifico"
            >
              Погрузись в атмосферу творчества
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto aspect-video bg-black rounded-3xl overflow-hidden border-2 border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/20 relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 to-cyan-900/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-fuchsia-600 rounded-full flex items-center justify-center shadow-lg shadow-fuchsia-600/50"
                >
                  <SafeIcon name="play" size={32} className="text-white ml-1" />
                </motion.div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-lg md:text-xl font-playfair">
                  Превью мастер-класса: "Абстракция и цвет"
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Смотри, что тебя ждет на занятии
                </p>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Timer Section */}
      {settings.show_timer !== false && (
        <section className="py-20 md:py-24 bg-gradient-to-r from-fuchsia-950/50 to-cyan-950/50 relative z-10 border-y border-fuchsia-500/20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white font-playfair"
            >
              До начала мастер-класса осталось:
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { value: timeLeft.days, label: 'Дней' },
                { value: timeLeft.hours, label: 'Часов' },
                { value: timeLeft.minutes, label: 'Минут' },
                { value: timeLeft.seconds, label: 'Секунд' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, rotate: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 3 : -3 }}
                  className="w-20 h-20 md:w-32 md:h-32 bg-neutral-800 rounded-2xl md:rounded-3xl border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-400/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent" />
                  <span className="text-2xl md:text-4xl font-black text-fuchsia-500 relative z-10">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs md:text-sm text-gray-400 relative z-10">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Program Section - Geometric Cards */}
      {settings.show_program !== false && (
        <section id="program" className="py-20 md:py-32 bg-neutral-900 relative z-10">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 md:mb-20 text-fuchsia-500 font-pacifico"
            >
              Программа дня
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: 'Теория цвета',
                  desc: 'Изучаем контрасты и гармонии. Создаем свою палитру из фуксии и бирюзы.',
                  icon: 'palette',
                  color: 'fuchsia',
                  rotate: -2
                },
                {
                  title: 'Практика',
                  desc: 'Свободное рисование на холсте. Геометрические узоры и абстракция.',
                  icon: 'brush',
                  color: 'cyan',
                  rotate: 2
                },
                {
                  title: 'Финальный штрих',
                  desc: 'Презентация работ. Обсуждение и советы по развитию навыков.',
                  icon: 'sparkles',
                  color: 'yellow',
                  rotate: -1
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, rotate: item.rotate }}
                  className={cn(
                    "p-6 md:p-8 rounded-3xl bg-neutral-800 border-2 relative overflow-hidden group cursor-pointer",
                    item.color === 'fuchsia' && 'border-fuchsia-500/50 shadow-lg shadow-fuchsia-500/10',
                    item.color === 'cyan' && 'border-cyan-400/50 shadow-lg shadow-cyan-400/10',
                    item.color === 'yellow' && 'border-yellow-400/50 shadow-lg shadow-yellow-400/10'
                  )}
                >
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150",
                    item.color === 'fuchsia' && 'bg-fuchsia-500/10',
                    item.color === 'cyan' && 'bg-cyan-400/10',
                    item.color === 'yellow' && 'bg-yellow-400/10'
                  )} />

                  <div className="relative z-10">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                      item.color === 'fuchsia' && 'bg-fuchsia-600 text-white',
                      item.color === 'cyan' && 'bg-cyan-500 text-black',
                      item.color === 'yellow' && 'bg-yellow-400 text-black'
                    )}>
                      <SafeIcon name={item.icon} size={28} />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white font-playfair">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>

                    <div className="mt-6 flex items-center text-sm font-medium">
                      <span className={cn(
                        item.color === 'fuchsia' && 'text-fuchsia-500',
                        item.color === 'cyan' && 'text-cyan-400',
                        item.color === 'yellow' && 'text-yellow-400'
                      )}>
                        Подробнее
                      </span>
                      <SafeIcon name="arrow-right" size={16} className="ml-2" />
                    </div>
                  </div>

                  {/* Geometric corner accent */}
                  <div className={cn(
                    "absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 opacity-30",
                    item.color === 'fuchsia' && 'border-fuchsia-500',
                    item.color === 'cyan' && 'border-cyan-400',
                    item.color === 'yellow' && 'border-yellow-400'
                  )} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration Form */}
      {settings.show_form !== false && (
        <section id="register" className="py-20 md:py-32 bg-neutral-800/30 relative z-10 pb-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-400 font-pacifico"
            >
              Записаться на мастер-класс
            </motion.h2>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-neutral-900 p-6 md:p-10 rounded-3xl border-2 border-fuchsia-500/30 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Имя</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-gray-700 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-white transition-all"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Телефон</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-white transition-all"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-gray-700 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 text-white transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Комментарий</label>
                <textarea
                  name="comment"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-gray-700 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 text-white transition-all resize-none"
                  placeholder="Опыт рисования, пожелания..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 hover:from-fuchsia-700 hover:via-purple-700 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-fuchsia-600/30"
              >
                Отправить заявку
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </motion.form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-fuchsia-500/20 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 font-pacifico text-xl">ArtFlow Masterclass</p>

          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-cyan-400 hover:bg-fuchsia-600 hover:text-white transition-all transform hover:scale-110">
              <SafeIcon name="instagram" size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-cyan-400 hover:bg-fuchsia-600 hover:text-white transition-all transform hover:scale-110">
              <SafeIcon name="twitter" size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-cyan-400 hover:bg-fuchsia-600 hover:text-white transition-all transform hover:scale-110">
              <SafeIcon name="youtube" size={20} />
            </a>
          </div>

          <p className="text-gray-600 text-sm">© 2024 ArtFlow. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}

export default App