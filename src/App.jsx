import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Home,
  Wrench,
  Paintbrush,
  HardHat,
  Star,
  Quote
} from 'lucide-react'

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

// Hook for scroll animations
function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return { ref, isInView }
}

// Navigation
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
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <SafeIcon name="home" size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-bold tracking-tight transition-colors",
                isScrolled ? "text-gray-900" : "text-white"
              )}>
                TELHA CLARKE
              </span>
              <span className={cn(
                "text-xs tracking-wider transition-colors",
                isScrolled ? "text-orange-600" : "text-orange-400"
              )}>
                ROOFING SPECIALISTS
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-600 relative group",
                  isScrolled ? "text-gray-700" : "text-white/90"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:0412345678"
              className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-colors",
                isScrolled ? "text-gray-900" : "text-white"
              )}
            >
              <SafeIcon name="phone" size={18} className="text-orange-600" />
              0412 345 678
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-600/30"
            >
              Get a Quote
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
          >
            <SafeIcon
              name={isMobileMenuOpen ? 'x' : 'menu'}
              size={28}
              className={isScrolled ? "text-gray-900" : "text-white"}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg text-center mt-2"
              >
                Get a Free Quote
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Hero Section
const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 mb-8">
            <SafeIcon name="award" size={16} className="text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Sydney's Premium Roofing Experts</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight mb-6"
          >
            Quality Roofing<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Built to Last
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Premium metal roofing, roof restoration, and repairs across Sydney.
            Over 20 years of experience delivering exceptional craftsmanship and lasting protection for your home.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' })
              }}
              className="group bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-600/40 flex items-center justify-center gap-2"
            >
              Get Free Quote
              <SafeIcon name="arrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center"
            >
              View Our Work
            </a>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '5000+', label: 'Projects Completed' },
              { value: '100%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-orange-500 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}

// Services Section
const Services = () => {
  const { ref, isInView } = useScrollAnimation()

  const services = [
    {
      icon: 'home',
      title: 'Metal Roofing',
      description: 'Premium Colorbond and metal roofing solutions. Durable, energy-efficient, and available in a wide range of colors to match your home.',
      features: ['Colorbond Roofing', 'Metal Tile Roofing', 'Custom Flashings', 'Guttering Systems']
    },
    {
      icon: 'wrench',
      title: 'Roof Restoration',
      description: 'Complete roof restoration services to bring your old roof back to life. Cleaning, repairs, repainting, and protective coatings.',
      features: ['High Pressure Cleaning', 'Re-bedding & Pointing', 'Roof Painting', 'Protective Coatings']
    },
    {
      icon: 'paintbrush',
      title: 'Roof Repairs',
      description: 'Fast and reliable roof repairs for leaks, storm damage, and general wear. We fix all types of roofing issues with lasting solutions.',
      features: ['Leak Detection', 'Tile Replacement', 'Valley Repairs', 'Storm Damage Fix']
    },
    {
      icon: 'hardHat',
      title: 'New Roof Installation',
      description: 'Expert installation of new roofs for renovations and new builds. Quality materials and skilled craftsmanship guaranteed.',
      features: ['New Builds', 'Renovations', 'Extensions', 'Shed Roofing']
    }
  ]

  return (
    <section id="services" className="py-24 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
            What We Do
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Our Services
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed">
            From minor repairs to complete roof replacements, we deliver exceptional roofing solutions
            tailored to your specific needs and budget.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                <SafeIcon name={service.icon} size={28} className="text-orange-600 group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <SafeIcon name="checkCircle2" size={18} className="text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Projects Section
const Projects = () => {
  const { ref, isInView } = useScrollAnimation()

  const projects = [
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      title: 'Modern Colorbond Roof',
      location: 'Bondi, Sydney',
      category: 'Metal Roofing'
    },
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      title: 'Heritage Roof Restoration',
      location: 'Paddington, Sydney',
      category: 'Restoration'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      title: 'Terracotta Tile Repair',
      location: 'Mosman, Sydney',
      category: 'Repairs'
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      title: 'Commercial Metal Roofing',
      location: 'North Sydney',
      category: 'Commercial'
    },
    {
      image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
      title: 'Complete Roof Replacement',
      location: 'Manly, Sydney',
      category: 'Replacement'
    },
    {
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      title: 'Slate Roof Restoration',
      location: 'Vaucluse, Sydney',
      category: 'Restoration'
    }
  ]

  return (
    <section id="projects" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
            Portfolio
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Recent Projects
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed">
            Browse through our completed roofing projects across Sydney.
            Each project showcases our commitment to quality and attention to detail.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                <p className="text-gray-300 text-sm flex items-center gap-1">
                  <SafeIcon name="mapPin" size={14} />
                  {project.location}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group">
            View All Projects
            <SafeIcon name="arrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// About Section
const About = () => {
  const { ref, isInView } = useScrollAnimation()

  const features = [
    { icon: 'shield', title: 'Licensed & Insured', desc: 'Fully licensed with comprehensive insurance coverage' },
    { icon: 'award', title: 'Quality Guaranteed', desc: '10-year workmanship warranty on all projects' },
    { icon: 'clock', title: 'On-Time Completion', desc: 'We respect your time and stick to deadlines' }
  ]

  return (
    <section id="about" className="py-24 bg-gray-900 text-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-4 block">
              About Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Sydney's Trusted Roofing Experts Since 2004
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg leading-relaxed mb-6">
              Telha Clarke Roofing has been protecting Sydney homes for over two decades.
              Our team of skilled professionals brings unmatched expertise to every project,
              whether it's a minor repair or a complete roof installation.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-gray-400 leading-relaxed mb-8">
              We pride ourselves on using only the highest quality materials from trusted suppliers,
              ensuring your roof stands the test of time. Our commitment to excellence has earned us
              a reputation as one of Sydney's most reliable roofing companies.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-3 mx-auto sm:mx-0">
                    <SafeIcon name={feature.icon} size={24} className="text-orange-500" />
                  </div>
                  <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleIn}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Roofing team at work"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-2xl shadow-2xl"
            >
              <div className="text-4xl font-black mb-1">20+</div>
              <div className="text-sm font-medium text-orange-100">Years of<br />Excellence</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const Testimonials = () => {
  const { ref, isInView } = useScrollAnimation()

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Homeowner',
      location: 'Bondi Beach',
      content: 'Telha Clarke did an amazing job on our roof replacement. Professional team, excellent communication, and the finished result exceeded our expectations. Highly recommend!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Property Developer',
      location: 'North Sydney',
      content: 'We have used Telha Clarke for multiple commercial projects. Their attention to detail and ability to meet tight deadlines makes them our go-to roofing contractor.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Homeowner',
      location: 'Paddington',
      content: 'After a storm damaged our roof, they came out quickly and fixed everything perfectly. Great service from start to finish. Will definitely use them again.',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-24 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
            Testimonials
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            What Our Clients Say
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
            >
              <SafeIcon name="quote" size={40} className="text-orange-200 absolute top-6 right-6" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <SafeIcon key={i} name="star" size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Contact Section
const Contact = () => {
  const { ref, isInView } = useScrollAnimation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

    const data = new FormData()
    data.append('access_key', ACCESS_KEY)
    data.append('name', formData.name)
    data.append('email', formData.email)
    data.append('phone', formData.phone)
    data.append('service', formData.service)
    data.append('message', formData.message)
    data.append('subject', `New Roofing Quote Request from ${formData.name}`)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
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
    <section id="contact" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
              Contact Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Get Your Free Quote Today
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-8">
              Ready to start your roofing project? Contact us for a free, no-obligation quote.
              Our team is ready to help protect your home with quality roofing solutions.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="phone" size={24} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                  <a href="tel:0412345678" className="text-gray-600 hover:text-orange-600 transition-colors">0412 345 678</a>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri: 7am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="mail" size={24} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                  <a href="mailto:info@telhaclarke.com.au" className="text-gray-600 hover:text-orange-600 transition-colors">info@telhaclarke.com.au</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="mapPin" size={24} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Service Area</h4>
                  <p className="text-gray-600">All Sydney Metropolitan Area<br />NSW, Australia</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleIn}
            className="bg-gray-50 rounded-2xl p-8 lg:p-10"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SafeIcon name="checkCircle2" size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h3>
                  <p className="text-gray-600 mb-6">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-orange-600 font-semibold hover:text-orange-700"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                        placeholder="0412 345 678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Required</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-white"
                    >
                      <option value="">Select a service</option>
                      <option value="metal-roofing">Metal Roofing</option>
                      <option value="roof-restoration">Roof Restoration</option>
                      <option value="roof-repairs">Roof Repairs</option>
                      <option value="new-roof">New Roof Installation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {isError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                      Something went wrong. Please try again or call us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Get Free Quote
                        <SafeIcon name="arrowRight" size={20} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="home" size={24} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">TELHA CLARKE</span>
                <span className="text-xs text-orange-500 block tracking-wider">ROOFING SPECIALISTS</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium roofing services in Sydney. Quality craftsmanship, reliable service, and lasting protection for your home.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.695 3.708 13.543 3.708 12.246s.49-2.449 1.418-3.323c.875-.875 2.026-1.365 3.323-1.365s2.449.49 3.323 1.365c.875.874 1.365 2.026 1.365 3.323s-.49 2.449-1.365 3.323c-.875.807-2.026 1.419-3.323 1.419zm7.498 0c-1.297 0-2.448-.49-3.323-1.297-.928-.875-1.418-2.026-1.418-3.323s.49-2.449 1.418-3.323c.875-.875 2.026-1.365 3.323-1.365s2.449.49 3.323 1.365c.875.874 1.365 2.026 1.365 3.323s-.49 2.449-1.365 3.323c-.875.807-2.026 1.419-3.323 1.419z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Projects', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector(`#${link.toLowerCase()}`).scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2"
                  >
                    <SafeIcon name="chevronRight" size={14} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {['Metal Roofing', 'Roof Restoration', 'Roof Repairs', 'Guttering', 'Roof Inspections'].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <SafeIcon name="chevronRight" size={14} />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <SafeIcon name="phone" size={18} className="text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">0412 345 678</p>
                  <p className="text-xs text-gray-500">Mon-Fri: 7am - 6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <SafeIcon name="mail" size={18} className="text-orange-500 mt-0.5" />
                <p className="text-sm">info@telhaclarke.com.au</p>
              </li>
              <li className="flex items-start gap-3">
                <SafeIcon name="mapPin" size={18} className="text-orange-500 mt-0.5" />
                <p className="text-sm">Sydney, NSW, Australia</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Telha Clarke Roofing. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm"
          >
            Back to top
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
              <SafeIcon name="arrowRight" size={14} className="rotate-[-90deg]" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <Projects />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default App