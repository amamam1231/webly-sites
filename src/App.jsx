import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Dog breeds data
const dogBreeds = [
  {
    id: 1,
    name: 'Золотистый ретривер',
    origin: 'Великобритания',
    temperament: 'Дружелюбный, умный, надёжный',
    lifespan: '10-12 лет',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&q=80',
    description: 'Одна из самых популярных пород благодаря своему дружелюбному характеру и высокому интеллекту.'
  },
  {
    id: 2,
    name: 'Немецкая овчарка',
    origin: 'Германия',
    temperament: 'Уверенный, храбрый, умный',
    lifespan: '9-13 лет',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80',
    description: 'Универсальная рабочая собака, известная своей преданностью и защитными качествами.'
  },
  {
    id: 3,
    name: 'Лабрадор ретривер',
    origin: 'Канада',
    temperament: 'Исходящий, доброжелательный, активный',
    lifespan: '10-12 лет',
    image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?w=600&q=80',
    description: 'Отличный семейный питомец, обожает воду и игры. Легко обучается и дружит со всеми.'
  },
  {
    id: 4,
    name: 'Французский бульдог',
    origin: 'Франция',
    temperament: 'Адаптируемый, игривый, умный',
    lifespan: '10-12 лет',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
    description: 'Компактная порода с большой личностью. Идеально подходит для городской жизни.'
  },
  {
    id: 5,
    name: 'Сибирский хаски',
    origin: 'Россия',
    temperament: 'Дружелюбный, энергичный, независимый',
    lifespan: '12-14 лет',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&q=80',
    description: 'Прекрасная ездовая собака с поразительной внешностью и яркими голубыми глазами.'
  },
  {
    id: 6,
    name: 'Бигль',
    origin: 'Великобритания',
    temperament: 'Весёлый, любопытный, дружелюбный',
    lifespan: '12-15 лет',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&q=80',
    description: 'Небольшая гончая с отличным нюхом и вечно молодым сердцем.'
  }
]

// Gallery images
const galleryImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
  'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=800&q=80'
]

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return { ref, isInView }
}

// Header Component
function Header() {
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
    { name: 'Породы', href: '#breeds' },
    { name: 'Галерея', href: '#gallery' },
    { name: 'О нас', href: '#about' }
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/50' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="flex items-center gap-2">
            <SafeIcon name="paw-print" size={32} className="text-amber-500" />
            <span className="text-xl md:text-2xl font-bold text-white">Мир Собак</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-b border-gray-800"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-300 hover:text-amber-400 transition-colors py-2 text-lg"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon name="star" size={20} className="text-amber-500" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Всё о собаках</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6">
              Лучшие <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">друзья</span> человека
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Откройте для себя удивительный мир пород собак, узнайте об их особенностях и найдите идеального компаньона для себя.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#breeds"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#breeds').scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
              >
                Исследовать породы
                <SafeIcon name="arrow-right" size={20} />
              </a>
              <a
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 border border-gray-700 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/5 transition-colors"
              >
                <SafeIcon name="camera" size={20} />
                Галерея
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"
                alt="Собака"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <SafeIcon name="heart" size={24} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">340+</p>
                  <p className="text-gray-400 text-sm">Пород собак</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <SafeIcon name="chevron-down" size={32} className="text-gray-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Dog Card Component
function DogCard({ breed, index }) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={breed.image}
          alt={breed.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
            {breed.origin}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{breed.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{breed.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <SafeIcon name="heart" size={16} />
            <span>{breed.temperament.split(',')[0]}</span>
          </div>
          <span className="text-amber-500 font-medium">{breed.lifespan}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Breeds Section
function BreedsSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="breeds" className="py-20 md:py-32 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-400 text-sm font-medium rounded-full mb-4 border border-amber-500/20">
            Популярные породы
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Найдите свою <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">породу</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Каждая порода уникальна. Узнайте больше о характере, особенностях ухода и истории происхождения разных пород собак.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dogBreeds.map((breed, index) => (
            <DogCard key={breed.id} breed={breed} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Gallery Section
function GallerySection() {
  const { ref, isInView } = useScrollAnimation()
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <section id="gallery" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-full mb-4 border border-purple-500/20">
            Фотогалерея
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Моменты <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">счастья</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Коллекция самых трогательных и радостных моментов из жизни наших четвероногих друзей.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Собака ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <SafeIcon name="camera" size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <SafeIcon name="x" size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Увеличенное изображение"
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// About Section
function AboutSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="about" className="py-20 md:py-32 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-20 blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80"
                alt="О нас"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-400 text-sm font-medium rounded-full mb-4 border border-amber-500/20">
              О проекте
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Мы любим собак <span className="text-amber-500">всей душой</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Мир Собак — это проект, созданный для всех, кто разделяет нашу любовь к четвероногим друзьям. Мы собираем информацию о породах, делимся советами по уходу и создаём сообщество единомышленников.
              </p>
              <p>
                Наша миссия — помочь каждому найти идеального питомца и научить заботиться о нём. Мы верим, что правильная информация спасает жизни и делает мир лучше для собак и их хозяев.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">5+</p>
                <p className="text-gray-500 text-sm mt-1">Лет опыта</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">10K+</p>
                <p className="text-gray-500 text-sm mt-1">Читателей</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">340+</p>
                <p className="text-gray-500 text-sm mt-1">Пород</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon name="paw-print" size={28} className="text-amber-500" />
              <span className="text-xl font-bold text-white">Мир Собак</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Ваш путеводитель в удивительный мир собак. Узнавайте, вдохновляйтесь и находите лучших друзей.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black transition-colors">
                <SafeIcon name="heart" size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-400 hover:text-amber-400 transition-colors">Главная</a></li>
              <li><a href="#breeds" className="text-gray-400 hover:text-amber-400 transition-colors">Породы</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-amber-400 transition-colors">Галерея</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-amber-400 transition-colors">О нас</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@dogworld.ru</li>
              <li>+7 (999) 123-45-67</li>
              <li>Москва, Россия</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Мир Собак. Все права защищены.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Сделано с <SafeIcon name="heart" size={16} className="text-red-500" /> для собак
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection />
        <BreedsSection />
        <GallerySection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}

export default App