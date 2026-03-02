import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Palette,
  Smartphone,
  Globe,
  Zap,
  Users,
  Star,
  CheckCircle2,
  Send,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

// 3D Floating Elements
const FloatingGeometry = ({ position, geometry, color, speed = 1 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {geometry === 'torus' && <torusGeometry args={[0.7, 0.2, 16, 100]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.6, 32, 32]} />}
      {geometry === 'octahedron' && <octahedronGeometry args={[0.7]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
    </mesh>
  )
}

const Scene3D = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <FloatingGeometry position={[-4, 2, -5]} geometry="torus" color="#475569" speed={0.8} />
      <FloatingGeometry position={[4, -2, -3]} geometry="box" color="#334155" speed={1.2} />
      <FloatingGeometry position={[-3, -3, -6]} geometry="octahedron" color="#64748b" speed={0.6} />
      <FloatingGeometry position={[3, 3, -4]} geometry="sphere" color="#94a3b8" speed={1} />
      <FloatingGeometry position={[0, 4, -7]} geometry="box" color="#1e293b" speed={0.4} />
    </>
  )
}

// Validation Schema
const OrderSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Слишком короткое имя').required('Обязательное поле'),
  email: Yup.string().email('Некорректный email').required('Обязательное поле'),
  phone: Yup.string().min(10, 'Некорректный телефон'),
  service: Yup.string().required('Выберите услугу'),
  budget: Yup.string(),
  message: Yup.string().min(10, 'Опишите проект подробнее').required('Обязательное поле')
})

const App = () => {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true)
    try {
      await axios.post('/api/leads', values)
      setSubmitStatus('success')
      resetForm()
    } catch (error) {
      setSubmitStatus('error')
    }
    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus(null), 5000)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const portfolioItems = [
    {
      id: 1,
      title: "FinTech Dashboard",
      category: "Веб-приложение",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["React", "Node.js", "PostgreSQL"]
    },
    {
      id: 2,
      title: "E-commerce Platform",
      category: "Интернет-магазин",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      tags: ["Next.js", "Stripe", "MongoDB"]
    },
    {
      id: 3,
      title: "AI Analytics Tool",
      category: "SaaS продукт",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["Python", "TensorFlow", "React"]
    },
    {
      id: 4,
      title: "Corporate Website",
      category: "Корпоративный сайт",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["Vue.js", "Strapi", "AWS"]
    }
  ]

  const teamMembers = [
    {
      name: "Александр Петров",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
    },
    {
      name: "Мария Иванова",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
    },
    {
      name: "Дмитрий Сидоров",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
    },
    {
      name: "Анна Козлова",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
    }
  ]

  const reviews = [
    {
      text: "Команда превзошла все ожидания. Сложный проект был реализован в срок и с отличным качеством кода.",
      author: "Иван Семенов",
      company: "TechStart",
      rating: 5
    },
    {
      text: "Профессиональный подход к разработке и отличная коммуникация на всех этапах проекта.",
      author: "Елена Волкова",
      company: "Digital Agency",
      rating: 5
    },
    {
      text: "Результат превзошел ожидания. Современный дизайн и идеальная производительность.",
      author: "Михаил Романов",
      company: "Finance Corp",
      rating: 5
    }
  ]

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50"
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection('hero')}
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <SafeIcon name="code2" size={24} className="text-slate-950" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-100">WEBDEV</span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {['portfolio', 'team', 'reviews', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors uppercase tracking-wider"
                >
                  {item === 'portfolio' && 'Портфолио'}
                  {item === 'team' && 'Команда'}
                  {item === 'reviews' && 'Отзывы'}
                  {item === 'contact' && 'Контакты'}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2 bg-slate-100 text-slate-950 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Начать проект
              </button>
            </nav>

            <button
              className="md:hidden p-2 text-slate-100"
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
              className="md:hidden glass border-t border-slate-800/50"
            >
              <div className="px-4 py-6 space-y-4">
                {['portfolio', 'team', 'reviews', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left text-lg font-medium text-slate-300 hover:text-slate-100 transition-colors py-2"
                  >
                    {item === 'portfolio' && 'Портфолио'}
                    {item === 'team' && 'Команда'}
                    {item === 'reviews' && 'Отзывы'}
                    {item === 'contact' && 'Контакты'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      {settings.show_hero !== false && (
        <motion.section
          id="hero"
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        >
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-2 rounded-full border border-slate-700 text-slate-400 text-sm font-medium mb-6">
                  Премиум веб-разработка
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none"
              >
                <span className="gradient-text">Создаем</span>
                <br />
                <span className="text-slate-100">цифровое</span>
                <br />
                <span className="text-slate-500">будущее</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                Разрабатываем сложные веб-приложения, корпоративные системы и
                цифровые продукты с использованием передовых технологий
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="group px-8 py-4 bg-slate-100 text-slate-950 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all hover:scale-105"
                >
                  Смотреть работы
                  <SafeIcon name="arrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 border border-slate-700 text-slate-100 rounded-full font-semibold hover:bg-slate-800/50 transition-all"
                >
                  Обсудить проект
                </button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: "50+", label: "Проектов" },
                { value: "5+", label: "Лет опыта" },
                { value: "30+", label: "Клиентов" },
                { value: "100%", label: "Успех" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-slate-100 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.section>
      )}

      {/* Portfolio Section */}
      {settings.show_portfolio !== false && (
        <section id="portfolio" className="section-wrapper py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 md:mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                Избранные <span className="text-slate-500">проекты</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl">
                Каждый проект — это уникальное решение, созданное с учетом
                специфики бизнеса и потребностей пользователей
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2 block">
                          {item.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-100 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-100/10 backdrop-blur flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                        <SafeIcon name="arrowUpRight" size={20} className="text-slate-100 group-hover:text-slate-950 transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {settings.show_team !== false && (
        <section id="team" className="section-wrapper py-32 relative bg-slate-900/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 md:mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                Наша <span className="text-slate-500">команда</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Профессионалы с многолетним опытом в разработке и дизайне
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group text-center"
                >
                  <div className="relative mb-4 overflow-hidden rounded-2xl aspect-[3/4]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{member.name}</h3>
                  <p className="text-slate-500 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {settings.show_reviews !== false && (
        <section id="reviews" className="section-wrapper py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 md:mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                Отзывы <span className="text-slate-500">клиентов</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <SafeIcon key={i} name="star" size={16} className="text-slate-100 fill-slate-100" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-400">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{review.author}</div>
                      <div className="text-sm text-slate-500">{review.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      {settings.show_form !== false && (
        <section id="contact" className="section-wrapper py-32 relative bg-slate-900/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                  Давайте создадим <span className="text-slate-500">что-то</span> удивительное
                </h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                  Расскажите о вашем проекте, и мы свяжемся с вами для обсуждения деталей
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="mail" size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Email</div>
                      <div className="text-slate-100">hello@webdev.agency</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="phone" size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Телефон</div>
                      <div className="text-slate-100">+7 (999) 123-45-67</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <SafeIcon name="mapPin" size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Адрес</div>
                      <div className="text-slate-100">Москва, ул. Разработчиков, 42</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50"
              >
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    budget: '',
                    message: ''
                  }}
                  validationSchema={OrderSchema}
                  onSubmit={handleFormSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Имя *</label>
                          <Field
                            name="name"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-slate-500 transition-colors"
                            placeholder="Ваше имя"
                          />
                          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Email *</label>
                          <Field
                            name="email"
                            type="email"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-slate-500 transition-colors"
                            placeholder="email@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-400" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Телефон</label>
                          <Field
                            name="phone"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-slate-500 transition-colors"
                            placeholder="+7 (999) 000-00-00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Услуга *</label>
                          <Field
                            as="select"
                            name="service"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-slate-500 transition-colors"
                          >
                            <option value="">Выберите услугу</option>
                            <option value="website">Разработка сайта</option>
                            <option value="webapp">Веб-приложение</option>
                            <option value="ecommerce">Интернет-магазин</option>
                            <option value="design">Дизайн и брендинг</option>
                            <option value="other">Другое</option>
                          </Field>
                          <ErrorMessage name="service" component="div" className="mt-1 text-sm text-red-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Бюджет</label>
                        <Field
                          as="select"
                          name="budget"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-slate-500 transition-colors"
                        >
                          <option value="">Выберите бюджет</option>
                          <option value="small">До 300 000 ₽</option>
                          <option value="medium">300 000 - 800 000 ₽</option>
                          <option value="large">800 000 - 1 500 000 ₽</option>
                          <option value="enterprise">Более 1 500 000 ₽</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">О проекте *</label>
                        <Field
                          as="textarea"
                          name="message"
                          rows="4"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-slate-500 transition-colors resize-none"
                          placeholder="Опишите ваш проект..."
                        />
                        <ErrorMessage name="message" component="div" className="mt-1 text-sm text-red-400" />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-slate-100 text-slate-950 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span>Отправка...</span>
                        ) : (
                          <>
                            Отправить заявку
                            <SafeIcon name="send" size={18} />
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {submitStatus === 'success' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center"
                          >
                            Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.
                          </motion.div>
                        )}
                        {submitStatus === 'error' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center"
                          >
                            Произошла ошибка. Пожалуйста, попробуйте позже.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="section-wrapper py-12 border-t border-slate-800/50 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <SafeIcon name="code2" size={18} className="text-slate-950" />
              </div>
              <span className="text-lg font-bold text-slate-100">WEBDEV</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-100 transition-colors">
                <SafeIcon name="github" size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-100 transition-colors">
                <SafeIcon name="twitter" size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-100 transition-colors">
                <SafeIcon name="linkedin" size={20} />
              </a>
            </div>

            <div className="text-slate-500 text-sm">
              © 2024 WebDev Agency. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App