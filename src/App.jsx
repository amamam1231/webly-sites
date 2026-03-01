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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Heroes data
const heroes = [
  { id: 1, name: "Pudge", role: "Убийца", image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80", difficulty: "Средняя" },
  { id: 2, name: "Invoker", role: "Маг", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", difficulty: "Высокая" },
  { id: 3, name: "Anti-Mage", role: "Керри", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80", difficulty: "Средняя" },
  { id: 4, name: "Shadow Fiend", role: "Керри", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", difficulty: "Высокая" },
  { id: 5, name: "Crystal Maiden", role: "Поддержка", image: "https://images.unsplash.com/photo-1612287230217-8c7c6c170b90?w=400&q=80", difficulty: "Низкая" },
  { id: 6, name: "Juggernaut", role: "Керри", image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&q=80", difficulty: "Низкая" },
]

// Tournaments data
const tournaments = [
  { name: "The International 2024", prize: "$3,000,000+", date: "Сентябрь 2024", location: "Копенгаген", image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&q=80" },
  { name: "ESL One Birmingham", prize: "$1,000,000", date: "Апрель 2024", location: "Бирмингем", image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&q=80" },
  { name: "DreamLeague S23", prize: "$500,000", date: "Май 2024", location: "Онлайн", image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&q=80" },
]

// Gameplay features
const features = [
  { icon: "sword", title: "124 Героя", desc: "Уникальные способности и стили игры" },
  { icon: "shield", title: "Стратегия", desc: "Глубокая тактическая составляющая" },
  { icon: "target", title: "Командная работа", desc: "5 на 5 в эпических битвах" },
  { icon: "trophy", title: "Киберспорт", desc: "Миллионы на турнирных призовых" },
]

// Newbie guide sections
const guideSections = [
  { title: "Выбор героя", content: "Начните с простых героев: Wraith King, Sniper или Crystal Maiden. Они имеют понятные способности и прощают ошибки новичкам." },
  { title: "Основы фарма", content: "Последнее удары по крипам (last hit) дают золото. Практикуйтесь в лобби, чтобы научиться правильно добивать крипов." },
  { title: "Карта и варды", content: "Информация — ключ к победе. Ставьте Observer Wards для обзора и Sentry Wards для обнаружения невидимых врагов." },
  { title: "Предметы", content: "Изучите рекомендуемые предметы для вашего героя. Power Treads, Black King Bar и Blink Dagger — универсальные выборы." },
]

// Scroll reveal component
function ScrollReveal({ children, delay = 0 }) {
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
          transition: { duration: 0.6, delay, ease: "easeOut" }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [settings, setSettings] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHero, setActiveHero] = useState(0)
  const [openGuide, setOpenGuide] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    // Fetch settings from API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({
        show_heroes: true,
        show_tournaments: true,
        show_gameplay: true,
        show_newbie_guide: true
      }))
  }, [])

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSubmitStatus('success')
        e.target.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 3000)
    }
  }

  const nextHero = () => setActiveHero((prev) => (prev + 1) % heroes.length)
  const prevHero = () => setActiveHero((prev) => (prev - 1 + heroes.length) % heroes.length)

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      {/* Fog of War Background */}
      <div className="fog-container">
        <div className="fog-layer"></div>
        <div className="fog-layer"></div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center font-rajdhani font-bold text-xl">
                D2
              </div>
              <span className="font-rajdhani font-bold text-2xl tracking-wide">DOTA 2</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Герои', 'Турниры', 'Геймплей', 'Гайд', 'Скачать'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {item}
                </button>
              ))}
            </nav>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800/50"
            >
              <div className="px-4 py-4 space-y-3">
                {['Герои', 'Турниры', 'Геймплей', 'Гайд', 'Скачать'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left py-2 text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-slate-950 to-slate-950"></div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold tracking-wider uppercase">
                Бесплатная игра в Steam
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-rajdhani font-black text-6xl md:text-8xl lg:text-9xl leading-none mb-6"
            >
              <span className="text-white">БИТВА</span>
              <br />
              <span className="text-gradient">НАЧИНАЕТСЯ</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Ежедневно миллионы игроков по всему миру сражаются от лица своих героев в Dota 2 — самой популярной MOBA-игре всех времён.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://store.steampowered.com/app/570/Dota_2/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 font-rajdhani text-lg tracking-wide animate-glow"
              >
                <SafeIcon name="download" size={20} />
                Играть бесплатно
              </a>
              <button
                onClick={() => scrollToSection('герои')}
                className="btn-secondary inline-flex items-center justify-center gap-2 font-rajdhani text-lg tracking-wide"
              >
                Узнать больше
                <SafeIcon name="arrow-right" size={20} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </section>

      {/* Heroes Section */}
      {settings.show_heroes !== false && (
        <section id="герои" className="section-padding relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-rajdhani font-bold text-4xl md:text-6xl text-white mb-4">
                  ЛЕГЕНДАРНЫЕ <span className="text-red-500">ГЕРОИ</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Выберите своего чемпиона из более чем 124 уникальных героев с особыми способностями
                </p>
              </div>
            </ScrollReveal>

            {/* Hero Slider */}
            <ScrollReveal delay={0.2}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    className="flex"
                    animate={{ x: `-${activeHero * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {heroes.map((hero) => (
                      <div key={hero.id} className="w-full flex-shrink-0">
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 md:p-10">
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                            <img
                              src={hero.image}
                              alt={hero.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                                {hero.role}
                              </span>
                              <span className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm">
                                Сложность: {hero.difficulty}
                              </span>
                            </div>
                            <h3 className="font-rajdhani font-bold text-4xl md:text-5xl text-white mb-4">
                              {hero.name}
                            </h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                              Уникальный герой со своим набором способностей и игровым стилем.
                              Отлично подходит для {hero.role.toLowerCase()} роли в команде.
                            </p>
                            <button className="inline-flex items-center gap-2 text-red-400 font-semibold hover:text-red-300 transition-colors">
                              Подробнее <SafeIcon name="arrow-right" size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Slider Controls */}
                <button
                  onClick={prevHero}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <SafeIcon name="chevron-left" size={24} />
                </button>
                <button
                  onClick={nextHero}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <SafeIcon name="chevron-right" size={24} />
                </button>
              </div>
            </ScrollReveal>

            {/* Hero Grid */}
            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
                {heroes.map((hero, index) => (
                  <button
                    key={hero.id}
                    onClick={() => setActiveHero(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeHero === index ? 'border-red-500 shadow-lg shadow-red-500/30' : 'border-slate-700 hover:border-slate-500'}`}
                  >
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
                    <span className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white truncate">
                      {hero.name}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Tournaments Section */}
      {settings.show_tournaments !== false && (
        <section id="турниры" className="section-padding relative bg-slate-900/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-rajdhani font-bold text-4xl md:text-6xl text-white mb-4">
                  ТУРНИРЫ <span className="text-yellow-500">ESPORTS</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Следите за крупнейшими соревнованиями и их рекордными призовыми фондами
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {tournaments.map((tournament, index) => (
                <ScrollReveal key={tournament.name} delay={index * 0.1}>
                  <div className="card-glass group">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={tournament.image}
                        alt={tournament.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-sm font-semibold">
                          {tournament.prize}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-rajdhani font-bold text-xl text-white mb-2 group-hover:text-red-400 transition-colors">
                        {tournament.name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <SafeIcon name="gamepad2" size={14} />
                          {tournament.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <SafeIcon name="target" size={14} />
                          {tournament.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gameplay Section */}
      {settings.show_gameplay !== false && (
        <section id="геймплей" className="section-padding relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="font-rajdhani font-bold text-4xl md:text-6xl text-white mb-6">
                    ГЛУБОКАЯ <span className="text-blue-500">МЕХАНИКА</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Dota 2 предлагает бесконечное разнообразие стратегий и тактик. Каждая игра уникальна благодаря комбинации героев, предметов и решений игроков.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                          <p className="text-gray-500 text-sm">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-blue-900/20">
                    <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
                      alt="Dota 2 Gameplay"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-blue-900/20"></div>
                  </div>

                  {/* Floating stats */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-6 -right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <SafeIcon name="users" size={20} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">1M+</div>
                        <div className="text-xs text-gray-400">Игроков онлайн</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <SafeIcon name="sparkles" size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">10+</div>
                        <div className="text-xs text-gray-400">Лет обновлений</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Newbie Guide Section */}
      {settings.show_newbie_guide !== false && (
        <section id="гайд" className="section-padding relative bg-slate-900/30">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-rajdhani font-bold text-4xl md:text-6xl text-white mb-4">
                  ГАЙД ДЛЯ <span className="text-green-500">НОВИЧКОВ</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Всё, что нужно знать для начала пути в Dota 2
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {guideSections.map((section, index) => (
                <ScrollReveal key={section.title} delay={index * 0.1}>
                  <div className="card-glass">
                    <button
                      onClick={() => setOpenGuide(openGuide === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-green-400">{index + 1}</span>
                        </div>
                        <h3 className="font-bold text-lg text-white">{section.title}</h3>
                      </div>
                      <SafeIcon
                        name="chevron-down"
                        size={20}
                        className={`text-gray-400 transition-transform ${openGuide === index ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {openGuide === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <p className="text-gray-400 leading-relaxed pl-14">
                              {section.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Download CTA Section */}
      <section id="скачать" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950/10 to-slate-950"></div>

        <div className="container mx-auto max-w-4xl px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/50 mx-auto">
                  <SafeIcon name="flame" size={40} className="text-white" />
                </div>
              </motion.div>

              <h2 className="font-rajdhani font-bold text-4xl md:text-6xl text-white mb-6">
                ГОТОВЫ К <span className="text-red-500">БИТВЕ?</span>
              </h2>

              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Присоединяйтесь к миллионам игроков по всему миру. Dota 2 — бесплатная игра, доступная в Steam.
              </p>

              <a
                href="https://store.steampowered.com/app/570/Dota_2/"
                target="_blank"
                rel="noopener noreferrer"
                className="steam-btn inline-flex items-center gap-4 px-10 py-5 rounded-xl text-white font-semibold text-lg group"
              >
                <div className="w-10 h-10 bg-[#66c0f4]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs text-[#66c0f4] uppercase tracking-wider">Скачать через</div>
                  <div className="text-xl font-bold">Steam</div>
                </div>
              </a>

              {/* Lead Form */}
              <div className="mt-12 max-w-md mx-auto">
                <p className="text-gray-500 text-sm mb-4">Получите эксклюзивные советы и новости</p>
                <form onSubmit={handleLeadSubmit} className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Ваш email"
                    required
                    className="flex-1 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Подписаться'}
                  </button>
                </form>

                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-3 text-sm ${submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {submitStatus === 'success' ? '✓ Вы подписались на рассылку!' : '✗ Ошибка, попробуйте позже'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded flex items-center justify-center font-rajdhani font-bold text-sm">
                D2
              </div>
              <span className="font-rajdhani font-bold text-xl">DOTA 2</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">О игре</a>
              <a href="#" className="hover:text-white transition-colors">Новости</a>
              <a href="#" className="hover:text-white transition-colors">Поддержка</a>
            </div>

            <div className="text-sm text-gray-600">
              © 2024 Valve Corporation. Dota 2 является торговой маркой Valve.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


// WeblyBadge - брендинг для Basic тарифа
function WeblyBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://t.me/weblyaibot?start=ref_347995964"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="text-sm font-medium text-gray-700">Made with <span className="text-blue-600 font-semibold">Webly AI</span></span>
      </a>
        <WeblyBadge />
</div>
  );
}


export default App